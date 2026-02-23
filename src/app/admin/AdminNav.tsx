"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export default function AdminNav({ active }: { active: "pedidos" | "productos" }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
    router.refresh();
  }

  const links = [
    { href: "/admin/pedidos", label: "Pedidos", key: "pedidos" as const },
    { href: "/admin/productos", label: "Productos", key: "productos" as const },
  ];

  return (
    <div className="flex items-center justify-between mb-8 border-b pb-4">
      <div className="flex gap-4">
        {links.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            className={`font-semibold px-4 py-2 rounded-lg transition-colors ${
              active === link.key
                ? "bg-brand-blue text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm font-medium transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Salir
      </button>
    </div>
  );
}
