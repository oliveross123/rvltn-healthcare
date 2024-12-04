import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/hooks";

export default async function CalendlyDashboardPage() {
  const session = await requireUser();

  //"export default function" = používá se když je to route, pokud to je komponent může se použit "export function"
  return (
    <div>
      <h1>hello from CalendlyDashboardPage</h1>
    </div>
  );
}
