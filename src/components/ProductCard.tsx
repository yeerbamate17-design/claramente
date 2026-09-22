"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency, getContentInfo, getPackSavings } from "@/lib/utils";
import type { Product } from "@/lib/types";
import toast from "react-hot-toast";

export default function ProductCard({
  product,
  referenceIndividualPrice,
}: {
  product: Product;
  referenceIndividualPrice?: number;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const outOfStock = product.stock <= 0;
  const content = getContentInfo(product.category);
  const savings =
    product.category === "pack" && referenceIndividualPrice
      ? getPackSavings(referenceIndividualPrice, product.price)
      : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <Link href={`/producto/${product.id}`} className="relative aspect-square">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Sin imagen</span>
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-bold px-4 py-2 rounded-full text-sm">
              Agotado
            </span>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link
          href={`/producto/${product.id}`}
          className="font-heading font-semibold text-gray-900 hover:text-brand-blue transition-colors"
        >
          {product.name}
        </Link>

        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">
          {content.volumeLabel}
        </p>

        <p className="text-brand-blue font-bold text-xl mt-2">
          {formatCurrency(product.price)}
        </p>

        {savings && (
          <p className="text-green-600 text-xs font-semibold mt-1">
            Ahorrás {formatCurrency(savings.savings)} · {formatCurrency(savings.unitPrice)} por unidad
          </p>
        )}

        <div className="mt-2 text-xs text-gray-500 leading-snug space-y-0.5">
          <p>{content.equivalenceLabel}</p>
          <p>{content.proteinLabel}</p>
        </div>

        <div className="mt-auto pt-4">
          <button
            onClick={() => {
              addItem(product);
              toast.success(`${product.name} agregado al carrito`);
            }}
            disabled={outOfStock}
            className="w-full flex items-center justify-center gap-2 bg-brand-blue text-white font-semibold py-2.5 px-4 rounded-xl hover:bg-brand-blue-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
