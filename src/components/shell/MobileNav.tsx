"use client";

import Link from "next/link";

const items = [
  { href: "/calculator", label: "Calculator" },
  { href: "/hs-classifier", label: "HS Finder" },
  { href: "/compare", label: "Compare" },
  { href: "/dashboard/saved", label: "Saved" }
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white lg:hidden">
      <ul className="grid grid-cols-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block px-2 py-2 text-center text-xs font-medium text-slate-700 hover:bg-blue-50"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

