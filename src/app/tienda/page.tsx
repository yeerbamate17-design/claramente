import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import CategoryTabs from "@/components/CategoryTabs";
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
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No hay productos disponibles en esta categoría.</p>
        </div>
      )}
    </div>
  );
}
