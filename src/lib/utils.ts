import {
  WHATSAPP_NUMBER,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
  BOTTLE_ML,
  BOTTLE_PROTEIN_G,
  BOTTLE_EGG_WHITES_EQUIVALENT,
  PACK_UNITS,
} from "./constants";
import type { ProductCategory } from "./types";

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

export function calculateShipping(totalUnits: number, deliveryType: string, postalCode?: string): number {
  if (deliveryType === "retiro") return 0;
  if (postalCode === "6600") return 0;
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

export function getContentInfo(category: ProductCategory): {
  volumeLabel: string;
  equivalenceLabel: string;
  proteinLabel: string;
} {
  const units = category === "pack" ? PACK_UNITS : 1;
  const totalMl = BOTTLE_ML * units;
  const totalProtein = BOTTLE_PROTEIN_G * units;

  return {
    volumeLabel:
      units === 1
        ? `Botella de ${BOTTLE_ML} ml`
        : `Pack x${units} botellas de ${BOTTLE_ML} ml (${totalMl / 1000} L en total)`,
    equivalenceLabel: `Contenido: ${totalMl} ml (~${
      units === 1
        ? `${BOTTLE_EGG_WHITES_EQUIVALENT} claras de huevo aprox.`
        : `${BOTTLE_EGG_WHITES_EQUIVALENT} claras de huevo aprox. por botella`
    })`,
    proteinLabel:
      units === 1
        ? `Aporte: ${totalProtein}g de proteína total por botella`
        : `Aporte: ${totalProtein}g de proteína total en el pack (${BOTTLE_PROTEIN_G}g por botella)`,
  };
}

export function getPackSavings(
  individualPrice: number,
  packPrice: number,
  packUnits: number = PACK_UNITS
): { savings: number; unitPrice: number } | null {
  if (!individualPrice || !packPrice) return null;
  const savings = individualPrice * packUnits - packPrice;
  if (savings <= 0) return null;
  return {
    savings,
    unitPrice: Math.round(packPrice / packUnits),
  };
}
