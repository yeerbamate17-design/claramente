"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, Loader2 } from "lucide-react";
import type { ProductCategory } from "@/lib/types";
import toast from "react-hot-toast";

export default function ProductForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "individual" as ProductCategory,
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    let image_url: string | null = null;

    // Upload image if provided
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        toast.error("Error al subir la imagen");
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      image_url = urlData.publicUrl;
    }

    const { error } = await supabase.from("products").insert({
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      category: form.category,
      is_active: form.is_active,
      image_url,
    });

    if (error) {
      toast.error("Error al crear producto: " + error.message);
    } else {
      toast.success("Producto creado");
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "individual",
        is_active: true,
      });
      setImageFile(null);
      setOpen(false);
      router.refresh();
    }
    setSaving(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-brand-blue text-white font-semibold py-2.5 px-5 rounded-xl hover:bg-brand-blue-dark transition-colors"
      >
        <Plus className="h-4 w-4" />
        Nuevo producto
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="font-heading font-bold text-lg mb-4">Nuevo producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría *
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value as ProductCategory,
                })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
            >
              <option value="individual">Individual</option>
              <option value="pack">Pack</option>
              <option value="mayorista">Mayorista</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <input
              type="number"
              required
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagen
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-blue file:text-white file:font-semibold hover:file:bg-brand-blue-dark file:cursor-pointer"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            className="accent-brand-blue"
          />
          <span className="text-sm font-medium">Activo (visible en tienda)</span>
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-blue text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-brand-blue-dark disabled:bg-gray-300 transition-colors flex items-center gap-2"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Crear producto
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="bg-gray-100 text-gray-700 font-medium py-2.5 px-6 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
