import { SubmitButton } from "@/components/dashboard/SubmitButtons";
import { PricingTable } from "@/components/shared/Pricing";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { stripe } from "@/app/utils/stripe";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";

async function getData(userId: string) {
  const data = await prisma.subscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      status: true,
      User: {
        select: {
          customerId: true,
        },
      },
    },
  });

  return data;
}

export default async function PricingPage() {
  const user = await requireUser();
  const data = await getData(user.id);

  async function createCustomerPortal() {
    "use server";

    const session = await stripe.billingPortal.sessions.create({
      customer: data?.User?.customerId as string,
      return_url:
        process.env.NODE_ENV === "production"
          ? "https://rvltn-healthcare.vercel.app//dashboard"
          : "http://localhost:3000/dashboard",
    });

    return redirect(session.url);
  }

  if (data?.status === "active") {
    return (
      <Card className="w-full ">
        <CardHeader>
          <CardTitle>Upravit Předplatné</CardTitle>
          <CardDescription>
            Kliknutím na tlačítko níže můžete upravit nastavení svého předplatné
            a vaše fakturační údaje.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createCustomerPortal}>
            <SubmitButton
              text="Upravit možnosti předplatného"
              className="bg-green-500"
            />
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <PricingTable />
    </div>
  );
}
