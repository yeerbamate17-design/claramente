"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const totalUnits = useCartStore((s) => s.totalUnits());

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/tienda", label: "Tienda" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-clara-mente.png"
                alt="ClaraMente"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="font-heading font-bold text-xl text-brand-blue">
                ClaraMente
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-brand-blue font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Cart + Mobile toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-brand-blue transition-colors"
                aria-label="Abrir carrito"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalUnits > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-blue text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalUnits}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-gray-700"
                aria-label="Abrir menú"
              >
                {mobileOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden pb-4 border-t border-gray-100">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 px-2 text-gray-700 hover:text-brand-blue font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
