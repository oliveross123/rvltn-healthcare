import { Navbar } from "@/components/Navbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CalendlyPage() {
  const session = await auth();

  if (session?.user) {
    return redirect("/nylas/dashboard");
  }
  return (
    <>
      <div className="flex flex-row h-14  border-b px-4 lg:h-[60px]">
        <Navbar />
      </div>
      <div>
        <h1>hello from CalendlyPage</h1>
      </div>
    </>
  );
}
