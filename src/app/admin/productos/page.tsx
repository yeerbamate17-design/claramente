import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "../AdminNav";
import ProductForm from "./ProductForm";
import ProductRow from "./ProductRow";

export default async function AdminProductosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdminNav active="productos" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          Productos
        </h1>
      </div>

      {/* Add product form */}
      <ProductForm />

      {/* Products table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                <th className="text-left px-4 py-3 font-semibold">Categoría</th>
                <th className="text-left px-4 py-3 font-semibold">Precio</th>
                <th className="text-left px-4 py-3 font-semibold">Stock</th>
                <th className="text-left px-4 py-3 font-semibold">Activo</th>
                <th className="text-left px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products?.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
              {(!products || products.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    No hay productos. Creá el primero arriba.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
