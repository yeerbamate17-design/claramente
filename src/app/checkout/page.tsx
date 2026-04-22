"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency, calculateShipping } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalUnits = useCartStore((s) => s.totalUnits());
  const subtotal = useCartStore((s) => s.subtotal());

  const [form, setForm] = useState({
    customer_name: "",
    customer_whatsapp: "",
    delivery_type: "retiro" as "retiro" | "envio",
    delivery_address: "",
    postal_code: "",
  });
  const [postalValid, setPostalValid] = useState<boolean | null>(null);
  const [postalChecking, setPostalChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const shipping = calculateShipping(totalUnits, form.delivery_type, form.postal_code);
  const total = subtotal + shipping;

  async function checkPostalCode(code: string) {
    if (!code || code.length < 4) {
      setPostalValid(null);
      return;
    }
    setPostalChecking(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("delivery_zones")
      .select("id")
      .eq("postal_code", code)
      .eq("is_enabled", true)
      .single();
    setPostalValid(!!data);
    setPostalChecking(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }

    if (form.delivery_type === "envio" && postalValid === false) {
      toast.error("Tu código postal no tiene cobertura");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            product_id: i.product.id,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error al crear el pedido");
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/orden/${data.order_id}`);
    } catch {
      toast.error("Error de conexión");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-gray-900 mb-4">
          Tu carrito está vacío
        </h1>
        <Link
          href="/tienda"
          className="inline-flex items-center justify-center bg-brand-blue text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-blue-dark transition-colors"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="font-heading text-3xl font-bold text-gray-900 mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <h2 className="font-heading font-bold text-lg">Tus datos</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={form.customer_name}
                  onChange={(e) =>
                    setForm({ ...form, customer_name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+549..."
                  value={form.customer_whatsapp}
                  onChange={(e) =>
                    setForm({ ...form, customer_whatsapp: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <h2 className="font-heading font-bold text-lg">Entrega</h2>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery_type"
                    value="retiro"
                    checked={form.delivery_type === "retiro"}
                    onChange={() =>
                      setForm({
                        ...form,
                        delivery_type: "retiro",
                        delivery_address: "",
                        postal_code: "",
                      })
                    }
                    className="accent-brand-blue"
                  />
                  <span className="font-medium">Retiro en local</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery_type"
                    value="envio"
                    checked={form.delivery_type === "envio"}
                    onChange={() =>
                      setForm({ ...form, delivery_type: "envio" })
                    }
                    className="accent-brand-blue"
                  />
                  <span className="font-medium">Envío a domicilio</span>
                </label>
              </div>

              {form.delivery_type === "envio" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.delivery_address}
                      onChange={(e) =>
                        setForm({ ...form, delivery_address: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.postal_code}
                      onChange={(e) => {
                        setForm({ ...form, postal_code: e.target.value });
                        setPostalValid(null);
                      }}
                      onBlur={(e) => checkPostalCode(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                    />
                    {postalChecking && (
                      <p className="text-sm text-gray-500 mt-1">
                        Verificando cobertura...
                      </p>
                    )}
                    {postalValid === true && (
                      <p className="text-sm text-green-600 mt-1">
                        ¡Tu zona tiene cobertura!
                      </p>
                    )}
                    {postalValid === false && (
                      <p className="text-sm text-red-500 mt-1">
                        Zona fuera de cobertura por cadena de frío. Consultanos
                        por WhatsApp.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Cart items */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <h2 className="font-heading font-bold text-lg">Tu pedido</h2>

              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.product.price)} c/u
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-bold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="font-bold text-sm w-20 text-right">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24 space-y-4">
              <h2 className="font-heading font-bold text-lg">Resumen</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({totalUnits} unidades)
                  </span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Gratis</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
                {totalUnits > FREE_SHIPPING_THRESHOLD && (
                  <p className="text-green-600 text-xs font-medium">
                    ¡Envío gratis por más de {FREE_SHIPPING_THRESHOLD} unidades!
                  </p>
                )}
              </div>

              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-brand-blue">{formatCurrency(total)}</span>
              </div>

              <button
                type="submit"
                disabled={
                  submitting ||
                  (form.delivery_type === "envio" && postalValid !== true)
                }
                className="w-full bg-brand-blue text-white font-bold py-3.5 rounded-xl hover:bg-brand-blue-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Confirmar pedido"
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Stock sujeto a confirmación de pago
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
