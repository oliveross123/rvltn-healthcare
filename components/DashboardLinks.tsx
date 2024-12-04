"use client";

import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  HomeIcon,
  LucideProps,
  Settings,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface iAppProps {
  id: number;
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export const dashboardLink: iAppProps[] = [
  {
    id: 0,
    name: "Event Types",
    href: "/nylas/dashboard",
    icon: HomeIcon,
  },
  {
    id: 1,
    name: "Schůzky",
    href: "/nylas/dashboard/schuzky",
    icon: Users2,
  },
  {
    id: 2,
    name: "Směny",
    href: "/nylas/dashboard/smeny",
    icon: CalendarCheck,
  },
  {
    id: 3,
    name: "Nastavení",
    href: "/nylas/dashboard/nastaveni",
    icon: Settings,
  },
];

export function DashboardLinks() {
  const pathname = usePathname();
  return (
    <>
      {dashboardLink.map((link) => (
        <Link
          className={cn(
            pathname === link.href
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground",
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
          )}
          key={link.id}
          href={link.href}
        >
          <link.icon className="size-4" />
          {link.name}
        </Link>
      ))}
    </>
  );
}
