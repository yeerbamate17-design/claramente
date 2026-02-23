import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatCurrency, truncateId } from "@/lib/utils";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import AdminNav from "../AdminNav";
import OrderActions from "./OrderActions";

export default async function AdminPedidosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin");

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdminNav active="pedidos" />

      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">
        Pedidos
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">ID</th>
                <th className="text-left px-4 py-3 font-semibold">Cliente</th>
                <th className="text-left px-4 py-3 font-semibold">WhatsApp</th>
                <th className="text-left px-4 py-3 font-semibold">Entrega</th>
                <th className="text-left px-4 py-3 font-semibold">Total</th>
                <th className="text-left px-4 py-3 font-semibold">Estado</th>
                <th className="text-left px-4 py-3 font-semibold">Fecha</th>
                <th className="text-left px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">
                    {truncateId(order.id)}
                  </td>
                  <td className="px-4 py-3">{order.customer_name}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://wa.me/${order.customer_whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      {order.customer_whatsapp}
                    </a>
                  </td>
                  <td className="px-4 py-3 capitalize">{order.delivery_type}</td>
                  <td className="px-4 py-3 font-bold">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-4 py-3">
                    <OrderActions order={order} />
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    No hay pedidos todavía.
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
