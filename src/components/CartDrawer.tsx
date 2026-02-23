"use client";

import { X, Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalUnits = useCartStore((s) => s.totalUnits());
  const subtotal = useCartStore((s) => s.subtotal());

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-heading font-bold text-lg">
            Carrito ({totalUnits})
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Tu carrito está vacío
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 items-center bg-gray-50 rounded-xl p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item.product.name}
                    </p>
                    <p className="text-brand-blue font-bold text-sm">
                      {formatCurrency(item.product.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-bold text-sm w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t p-4 space-y-3">
              {totalUnits > FREE_SHIPPING_THRESHOLD && (
                <div className="bg-green-50 text-green-700 text-sm font-medium px-3 py-2 rounded-lg text-center">
                  🚚 ¡Envío gratis!
                </div>
              )}

              <div className="flex justify-between font-bold text-lg">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full bg-brand-blue text-white text-center font-semibold py-3 rounded-xl hover:bg-brand-blue-dark transition-colors"
              >
                Ir al checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
