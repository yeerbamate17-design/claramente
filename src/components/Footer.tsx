import Image from "next/image";
import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Marca / Identidad */}
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/logo-clara-mente.png"
                alt="ClaraMente"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="font-heading font-bold text-lg text-white">
                ClaraMente
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-3">
              Nutrición inteligente lista para vos.
            </p>
          </div>

          {/* Navegación rápida */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-wide mb-4">
              Navegación
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tienda" className="hover:text-white transition-colors">
                  Catálogo / Productos
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/#beneficios" className="hover:text-white transition-colors">
                  Beneficios
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto & Redes */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-wide mb-4">
              Contacto &amp; Redes
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://instagram.com/claramente.arg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  @claramente.arg
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppUrl(
                    "Hola ClaraMente! Vengo de la web y tengo una consulta sobre..."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Legal y Fiscal */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-wide mb-4">
              Legal y Fiscal
            </h3>
            {/* Espacio reservado para el widget Data Fiscal AFIP/ARCA (Formulario 960/D) */}
            <div id="afip-data-fiscal-widget" className="min-h-[90px]" />
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} ClaraMente. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
