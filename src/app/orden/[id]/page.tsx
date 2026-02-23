import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatCurrency, truncateId, buildWhatsAppUrl } from "@/lib/utils";
import { CBU, ALIAS, TITULAR, BANCO } from "@/lib/constants";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import UploadProofForm from "./UploadProofForm";
import { MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tu Pedido",
};

interface Props {
  params: { id: string };
}

export default async function OrdenPage({ params }: Props) {
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*, products(name))")
    .eq("id", params.id)
    .single();

  if (!order) notFound();

  const whatsappMessage = `Hola ClaraMente! Mi pedido es ${truncateId(order.id)}. Adjunté el comprobante de pago.`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">
          ¡Pedido generado!
        </h1>
        <p className="text-gray-600 mt-2">
          Pedido #{truncateId(order.id)}
        </p>
        <div className="mt-2">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Bank details */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <h2 className="font-heading font-bold text-lg text-blue-900 mb-4">
          Datos para transferencia
        </h2>
        <div className="space-y-3 text-sm">
          {CBU && (
            <div className="flex justify-between items-center">
              <span className="text-blue-700 font-medium">CBU</span>
              <span className="font-mono font-bold text-blue-900">{CBU}</span>
            </div>
          )}
          {ALIAS && (
            <div className="flex justify-between items-center">
              <span className="text-blue-700 font-medium">Alias</span>
              <span className="font-bold text-blue-900">{ALIAS}</span>
            </div>
          )}
          {TITULAR && (
            <div className="flex justify-between items-center">
              <span className="text-blue-700 font-medium">Titular</span>
              <span className="font-bold text-blue-900">{TITULAR}</span>
            </div>
          )}
          {BANCO && (
            <div className="flex justify-between items-center">
              <span className="text-blue-700 font-medium">Banco</span>
              <span className="font-bold text-blue-900">{BANCO}</span>
            </div>
          )}
          <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
            <span className="text-blue-700 font-medium">Monto a transferir</span>
            <span className="font-bold text-xl text-blue-900">
              {formatCurrency(order.total_amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Order details */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-heading font-bold text-lg mb-4">Detalle del pedido</h2>
        <div className="space-y-2">
          {order.order_items?.map(
            (item: {
              id: string;
              quantity: number;
              unit_price: number;
              line_total: number;
              products: { name: string };
            }) => (
              <div
                key={item.id}
                className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0"
              >
                <span>
                  {item.products?.name} x{item.quantity}
                </span>
                <span className="font-medium">
                  {formatCurrency(item.line_total)}
                </span>
              </div>
            )
          )}
          <div className="flex justify-between text-sm pt-2">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Envío</span>
            <span>
              {order.shipping_cost === 0 ? (
                <span className="text-green-600">Gratis</span>
              ) : (
                formatCurrency(order.shipping_cost)
              )}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span className="text-brand-blue">
              {formatCurrency(order.total_amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Upload proof */}
      {(order.status === "pendiente" ||
        order.status === "comprobante_enviado") && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-heading font-bold text-lg mb-4">
            Subir comprobante de pago
          </h2>
          {order.payment_proof_url && (
            <p className="text-sm text-green-600 mb-4">
              Ya subiste un comprobante. Podés reemplazarlo si es necesario.
            </p>
          )}
          <UploadProofForm orderId={order.id} />
        </div>
      )}

      {/* WhatsApp button */}
      <div className="text-center">
        <a
          href={buildWhatsAppUrl(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-600 transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
