import Link from "next/link";
import { Droplets, Timer, Award } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .limit(4)
    .order("created_at", { ascending: false });

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
              Clara de Huevo
              <br />
              <span className="text-brand-yellow">Pasteurizada</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-blue-100">
              Nutrición inteligente. Lista para vos. Proteína pura en botella de vidrio,
              lista para usar.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/tienda"
                className="inline-flex items-center justify-center bg-brand-yellow text-gray-900 font-bold py-3.5 px-8 rounded-xl hover:bg-brand-yellow-dark transition-colors text-lg"
              >
                Ver productos
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center bg-white/10 text-white font-semibold py-3.5 px-8 rounded-xl hover:bg-white/20 transition-colors text-lg border border-white/20"
              >
                Preguntas frecuentes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué ClaraMente?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Droplets,
                title: "Proteína pura",
                desc: "Clara de huevo pasteurizada, lista para consumir. Sin cáscara, sin desperdicio.",
              },
              {
                icon: Timer,
                title: "Lista al instante",
                desc: "Abrí y usá. Ideal para batidos, tortillas, recetas fitness y más.",
              },
              {
                icon: Award,
                title: "Calidad garantizada",
                desc: "Producto pasteurizado con cadena de frío. Seguro y de máxima calidad.",
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="text-center p-8 rounded-2xl bg-gray-50"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-blue/10 rounded-xl mb-4">
                  <benefit.icon className="h-7 w-7 text-brand-blue" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-3xl font-bold text-center text-gray-900 mb-12">
              Productos destacados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/tienda"
                className="inline-flex items-center justify-center bg-brand-blue text-white font-semibold py-3 px-8 rounded-xl hover:bg-brand-blue-dark transition-colors"
              >
                Ver todo el catálogo
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Listo para mejorar tu nutrición?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Envío gratis en pedidos de más de 12 unidades.
          </p>
          <Link
            href="/tienda"
            className="inline-flex items-center justify-center bg-brand-blue text-white font-bold py-4 px-10 rounded-xl hover:bg-brand-blue-dark transition-colors text-lg"
          >
            Comprar ahora
          </Link>
        </div>
      </section>
    </>
  );
}
