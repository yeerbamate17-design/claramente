"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";
import toast from "react-hot-toast";

const statusOptions: OrderStatus[] = [
  "pendiente",
  "comprobante_enviado",
  "pagado",
  "enviado",
  "entregado",
  "cancelado",
];

export default function OrderActions({ order }: { order: Order }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [showProof, setShowProof] = useState(false);
  const [proofUrl, setProofUrl] = useState<string | null>(null);

  async function handleStatusChange(newStatus: string) {
    setUpdating(true);
    const supabase = createClient();

    // If changing to "pagado", call stock deduction
    if (newStatus === "pagado") {
      const { error: rpcError } = await supabase.rpc(
        "deduct_stock_for_order",
        { p_order_id: order.id }
      );
      if (rpcError) {
        toast.error("Error al descontar stock: " + rpcError.message);
        setUpdating(false);
        return;
      }
    }

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", order.id);

    if (error) {
      toast.error("Error al actualizar estado");
    } else {
      toast.success("Estado actualizado");
      router.refresh();
    }
    setUpdating(false);
  }

  async function viewProof() {
    if (!order.payment_proof_url) {
      toast.error("No hay comprobante");
      return;
    }

    const supabase = createClient();
    const { data } = await supabase.storage
      .from("payment-proofs")
      .createSignedUrl(order.payment_proof_url, 120);

    if (data?.signedUrl) {
      setProofUrl(data.signedUrl);
      setShowProof(true);
    } else {
      toast.error("No se pudo obtener el comprobante");
    }
  }

  const whatsappMsg = `Hola ${order.customer_name}! Tu pedido ClaraMente está actualizado.`;

  return (
    <div className="flex items-center gap-2">
      <select
        value={order.status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={updating}
        className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-brand-blue outline-none"
      >
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {order.payment_proof_url && (
        <button
          onClick={viewProof}
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
          title="Ver comprobante"
        >
          <Eye className="h-4 w-4" />
        </button>
      )}

      <a
        href={buildWhatsAppUrl(whatsappMsg)}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
        title="WhatsApp al cliente"
      >
        <MessageCircle className="h-4 w-4" />
      </a>

      {/* Proof modal */}
      {showProof && proofUrl && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowProof(false)}
        >
          <div
            className="bg-white rounded-xl p-4 max-w-lg max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold mb-3">Comprobante de pago</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={proofUrl}
              alt="Comprobante de pago"
              className="max-w-full rounded-lg"
            />
            <button
              onClick={() => setShowProof(false)}
              className="mt-4 w-full bg-gray-100 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
