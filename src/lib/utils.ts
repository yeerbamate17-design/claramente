import { WHATSAPP_NUMBER, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "./constants";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function calculateShipping(totalUnits: number, deliveryType: string): number {
  if (deliveryType === "retiro") return 0;
  return totalUnits > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pendiente: "Pendiente de pago",
    comprobante_enviado: "Comprobante enviado",
    pagado: "Pagado",
    enviado: "En camino",
    entregado: "Entregado",
    cancelado: "Cancelado",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pendiente: "bg-yellow-100 text-yellow-800",
    comprobante_enviado: "bg-blue-100 text-blue-800",
    pagado: "bg-green-100 text-green-800",
    enviado: "bg-purple-100 text-purple-800",
    entregado: "bg-gray-100 text-gray-800",
    cancelado: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function truncateId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}
