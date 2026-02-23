import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const orderId = formData.get("order_id") as string;

    if (!file || !orderId) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato no permitido. Usá JPG, PNG o WebP." },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande (máx 5MB)" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Verify order exists and is pending
    const { data: order } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .single();

    if (!order) {
      return NextResponse.json(
        { error: "Pedido no encontrado" },
        { status: 404 }
      );
    }

    if (!["pendiente", "comprobante_enviado"].includes(order.status)) {
      return NextResponse.json(
        { error: "Este pedido ya no acepta comprobantes" },
        { status: 400 }
      );
    }

    // Upload to private bucket
    const ext = file.name.split(".").pop();
    const filePath = `${orderId}/comprobante.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Error al subir el archivo" },
        { status: 500 }
      );
    }

    // Update order
    await supabase
      .from("orders")
      .update({
        payment_proof_url: filePath,
        status: "comprobante_enviado",
      })
      .eq("id", orderId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
