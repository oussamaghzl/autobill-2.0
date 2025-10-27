"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Paramètres", href: "/settings" },
  ];
  return (
    <aside className="w-64 min-h-screen bg-white shadow-md">
      <div className="p-5 border-b">
        <h1 className="text-xl font-bold">AutoBill 2.0</h1>
        <p className="text-xs text-gray-500">Factures automatiques</p>
      </div>
      <nav className="p-4 flex flex-col gap-2">
        {links.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 py-2 rounded-md ${
              pathname === l.href
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {l.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
