import { DashboardItems } from "@/components/dashboard/DashboardItems";
import {
  CalendarCheck,
  CircleUser,
  DollarSign,
  Globe,
  Home,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const clinicId = user?.id;

  // Check if clinicId is available
  if (!clinicId) {
    return <div>Loading...</div>; // Nebo zpracujte chybu, jak je třeba
  }

  const navLinks = [
    {
      name: "Nástěnka",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Termíny",
      href: `/dashboard/clinics/${clinicId}/appointments`,
      icon: CalendarCheck,
    },
    {
      name: "Pacienti",
      href: `/dashboard/clinics/${clinicId}/patientDatabase`,
      icon: CircleUser,
    },
    {
      name: "Web",
      href: "/dashboard/sites",
      icon: Globe,
    },
    {
      name: "Ceník",
      href: "/dashboard/pricing",
      icon: DollarSign,
    },
  ];

  return (
    <section className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-gr">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
            <Link
              href="/welcome"
              className="flex items-center gap-2 font-semibold"
            >
              <h3 className="blur text-2xl mb-5">
                rvltn<span className="text-green-400">Care.io</span>
              </h3>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="cursor-pointer grid items-start px-2 font-medium lg:px-4">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  <div className="flex items-center gap-2 my-2">
                    <link.icon className="h-5 w-5" />
                    <span>{link.name}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="ml-auto flex items-center gap-x-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <LogoutLink>Odhlásit se</LogoutLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </section>
  );
}
