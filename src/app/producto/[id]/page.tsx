import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import AddToCartButton from "./AddToCartButton";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("id", params.id)
    .single();

  if (!product) return { title: "Producto no encontrado" };

  return {
    title: product.name,
    description: product.description || `Comprá ${product.name} en ClaraMente`,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
    },
  };
}

export default async function ProductoPage({ params }: Props) {
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const typedProduct = product as Product;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
          {typedProduct.image_url ? (
            <Image
              src={typedProduct.image_url}
              alt={typedProduct.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sin imagen
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-brand-blue uppercase tracking-wide">
            {typedProduct.category}
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            {typedProduct.name}
          </h1>

          <p className="text-brand-blue font-bold text-3xl mt-4">
            {formatCurrency(typedProduct.price)}
          </p>

          {typedProduct.description && (
            <p className="text-gray-600 mt-6 leading-relaxed">
              {typedProduct.description}
            </p>
          )}

          <div className="mt-4">
            {typedProduct.stock > 0 ? (
              <span className="text-green-600 font-medium text-sm">
                Stock disponible ({typedProduct.stock} unidades)
              </span>
            ) : (
              <span className="text-red-500 font-medium text-sm">
                Agotado
              </span>
            )}
          </div>

          <div className="mt-8">
            <AddToCartButton product={typedProduct} />
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
            <p className="font-semibold mb-1">Envío gratis</p>
            <p>En pedidos de más de 12 unidades.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
