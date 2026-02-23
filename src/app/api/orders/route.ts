import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateShipping } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_whatsapp,
      delivery_type,
      delivery_address,
      postal_code,
      items,
    } = body;

    if (
      !customer_name ||
      !customer_whatsapp ||
      !delivery_type ||
      !items?.length
    ) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Validate postal code for delivery
    if (delivery_type === "envio") {
      if (!postal_code || !delivery_address) {
        return NextResponse.json(
          { error: "Se requiere dirección y código postal para envío" },
          { status: 400 }
        );
      }

      const { data: zone } = await supabase
        .from("delivery_zones")
        .select("id")
        .eq("postal_code", postal_code)
        .eq("is_enabled", true)
        .single();

      if (!zone) {
        return NextResponse.json(
          { error: "No realizamos envíos a ese código postal" },
          { status: 400 }
        );
      }
    }

    // 2. Fetch products and validate stock
    const productIds = items.map((i: { product_id: string }) => i.product_id);
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds)
      .eq("is_active", true);

    if (!products || products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Uno o más productos no están disponibles" },
        { status: 400 }
      );
    }

    for (const item of items) {
      const product = products.find(
        (p: { id: string }) => p.id === item.product_id
      );
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Stock insuficiente para ${product?.name || "un producto"}`,
          },
          { status: 400 }
        );
      }
    }

    // 3. Calculate totals
    const orderItems = items.map(
      (item: { product_id: string; quantity: number }) => {
        const product = products.find(
          (p: { id: string }) => p.id === item.product_id
        )!;
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: product.price,
          line_total: product.price * item.quantity,
        };
      }
    );

    const subtotal = orderItems.reduce(
      (sum: number, i: { line_total: number }) => sum + i.line_total,
      0
    );
    const totalUnits = items.reduce(
      (sum: number, i: { quantity: number }) => sum + i.quantity,
      0
    );
    const shipping_cost = calculateShipping(totalUnits, delivery_type);
    const total_amount = subtotal + shipping_cost;

    // 4. Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_whatsapp,
        delivery_type,
        delivery_address: delivery_type === "envio" ? delivery_address : null,
        postal_code: delivery_type === "envio" ? postal_code : null,
        subtotal,
        shipping_cost,
        total_amount,
        status: "pendiente",
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Order insert error:", orderError);
      return NextResponse.json(
        { error: "Error al crear el pedido" },
        { status: 500 }
      );
    }

    // 5. Insert order items
    const itemsWithOrderId = orderItems.map(
      (i: {
        product_id: string;
        quantity: number;
        unit_price: number;
        line_total: number;
      }) => ({
        ...i,
        order_id: order.id,
      })
    );

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsWithOrderId);

    if (itemsError) {
      console.error("Order items insert error:", itemsError);
      // Clean up orphan order
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Error al crear los items del pedido" },
        { status: 500 }
      );
    }

    return NextResponse.json({ order_id: order.id }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
