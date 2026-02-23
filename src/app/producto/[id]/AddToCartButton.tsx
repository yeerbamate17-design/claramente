"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/types";
import toast from "react-hot-toast";

export default function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const outOfStock = product.stock <= 0;

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="px-4 py-3 hover:bg-gray-100 transition-colors"
          disabled={outOfStock}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="px-4 py-3 font-bold text-center min-w-[3rem]">
          {qty}
        </span>
        <button
          onClick={() => setQty(qty + 1)}
          className="px-4 py-3 hover:bg-gray-100 transition-colors"
          disabled={outOfStock}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        onClick={() => {
          addItem(product, qty);
          toast.success(`${qty}x ${product.name} agregado al carrito`);
          setQty(1);
        }}
        disabled={outOfStock}
        className="flex-1 flex items-center justify-center gap-2 bg-brand-blue text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-blue-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        <ShoppingCart className="h-5 w-5" />
        {outOfStock ? "Agotado" : "Agregar al carrito"}
      </button>
    </div>
  );
}
