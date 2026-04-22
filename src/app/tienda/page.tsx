import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import CategoryTabs from "@/components/CategoryTabs";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Comprá clara de huevo pasteurizada. Individual, packs y mayorista.",
};

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const cat = searchParams.cat || "individual";
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("category", cat)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-8">
        Nuestra Tienda
      </h1>

      <CategoryTabs activeCategory={cat} />

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : cat === "mayorista" ? (
        <div className="text-center py-20">
          <p className="text-xl font-semibold text-gray-800 mb-2">¿Querés comprar al por mayor?</p>
          <p className="text-gray-500 mb-6">Consultanos directamente para precios y condiciones mayoristas.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-600 transition-colors"
            >
              Contactar por WhatsApp
            </a>
            <a
              href="https://instagram.com/claramente.arg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-pink-600 transition-colors"
            >
              Contactar por Instagram
            </a>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No hay productos disponibles en esta categoría.</p>
        </div>
      )}
    </div>
  );
}
