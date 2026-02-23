import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";

export default function WhatsAppFAB() {
  return (
    <a
      href={buildWhatsAppUrl(
        "Hola ClaraMente! Vengo de la web y tengo una consulta sobre..."
      )}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:scale-105 transition-all"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
