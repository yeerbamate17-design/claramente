"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Save } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Product, ProductCategory } from "@/lib/types";
import toast from "react-hot-toast";

export default function ProductRow({ product }: { product: Product }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: product.name,
    price: product.price.toString(),
    stock: product.stock.toString(),
    category: product.category,
    is_active: product.is_active,
  });

  async function handleSave() {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({
        name: form.name,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        category: form.category,
        is_active: form.is_active,
      })
      .eq("id", product.id);

    if (error) {
      toast.error("Error al actualizar");
    } else {
      toast.success("Producto actualizado");
      setEditing(false);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      toast.error("Error al eliminar");
    } else {
      toast.success("Producto eliminado");
      router.refresh();
    }
  }

  async function toggleActive() {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);

    if (error) {
      toast.error("Error al actualizar");
    } else {
      router.refresh();
    }
  }

  if (editing) {
    return (
      <tr className="bg-blue-50">
        <td className="px-4 py-3">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-lg px-2 py-1 text-sm"
          />
        </td>
        <td className="px-4 py-3">
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as ProductCategory })
            }
            className="border rounded-lg px-2 py-1 text-sm"
          >
            <option value="individual">Individual</option>
            <option value="pack">Pack</option>
            <option value="mayorista">Mayorista</option>
          </select>
        </td>
        <td className="px-4 py-3">
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-20 border rounded-lg px-2 py-1 text-sm"
          />
        </td>
        <td className="px-4 py-3">
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="w-16 border rounded-lg px-2 py-1 text-sm"
          />
        </td>
        <td className="px-4 py-3">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            className="accent-brand-blue"
          />
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
            >
              <Save className="h-4 w-4" />
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-xs text-gray-500 hover:underline"
            >
              Cancelar
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 font-medium">{product.name}</td>
      <td className="px-4 py-3 capitalize">{product.category}</td>
      <td className="px-4 py-3 font-bold">{formatCurrency(product.price)}</td>
      <td className="px-4 py-3">{product.stock}</td>
      <td className="px-4 py-3">
        <button
          onClick={toggleActive}
          className={`w-10 h-6 rounded-full relative transition-colors ${
            product.is_active ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              product.is_active ? "left-5" : "left-1"
            }`}
          />
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-brand-blue hover:underline font-medium"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
