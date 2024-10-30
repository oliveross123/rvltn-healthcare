"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/app/dashboard/layout"; // ensure navLinks is an array of NavLink objects

interface NavLink {
  href: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function DashboardItems() {
  const pathname = usePathname();
  return (
    <>
      {(navLinks as NavLink[]).map((item) => (
        <Link
          href={item.href}
          key={item.name}
          className={cn(
            pathname === item.href ? "text-green-400" : "text-white",
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-green-400/70"
          )}
        >
          <item.icon className="size-4" />
          {item.name}
        </Link>
      ))}
    </>
  );
}
