"use client";

import Link from "next/link";
import type { ProductCategory } from "@/lib/types";

const categories: { key: ProductCategory; label: string }[] = [
  { key: "individual", label: "Individual" },
  { key: "pack", label: "Pack" },
  { key: "mayorista", label: "Mayorista" },
];

export default function CategoryTabs({
  activeCategory,
}: {
  activeCategory: string;
}) {
  return (
    <div className="flex gap-2">
      {categories.map((cat) => (
        <Link
          key={cat.key}
          href={`/tienda?cat=${cat.key}`}
          className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-colors ${
            activeCategory === cat.key
              ? "bg-brand-blue text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
