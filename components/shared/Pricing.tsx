import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { SubmitButton } from "../dashboard/SubmitButtons";
import Link from "next/link";
import { CreateSubscription } from "@/app/actions";

interface iAppProps {
  id: number;
  cardTitle: string;
  cardDescription: string;
  priceTitle: string;
  beneftis: string[];
}

export const PricingPlans = [
  {
    id: 0,
    cardTitle: "Basic",
    cardDescription: "For small teams",
    priceTitle: "Free",
    beneftis: ["1 User", "10 Projects", "2GB Storage"],
  },
  {
    id: 1,
    cardTitle: "Pro",
    cardDescription: "For medium teams",
    priceTitle: "$20",
    beneftis: ["5 Users", "50 Projects", "20GB Storage"],
  },
];

export function PricingTable() {
  return (
    <>
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-semibold text-primary">Pricing</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Pricing plans for everyone and every budget!
        </h1>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center leading-tight text-muted-foreground">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio cupiditate
        modi blanditiis.
      </p>

      <div className="grid grid-cols-1 gap-8 mt-16 lg:grid-cols-2">
        {PricingPlans.map((item) => (
          <Card
            key={item.id}
            className={item.id === 1 ? "border-green-500" : ""}
          >
            <CardHeader>
              <CardTitle>
                {item.id === 1 ? (
                  <div className="flex items-center justify-between">
                    <h3 className="text-green-500">Startup</h3>

                    <p className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-500">
                      Most popular
                    </p>
                  </div>
                ) : (
                  <>{item.cardTitle}</>
                )}
              </CardTitle>
              <CardDescription>{item.cardDescription}</CardDescription>
            </CardHeader>

            <CardContent>
              <p className="mt-6 text-3xl font-bold tracking-tight">
                {item.priceTitle}
              </p>

              <ul className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground">
                {item.beneftis.map(
                  (
                    benefit,
                    index //DONT USE INDEX FOR MAPING WHEN THE DATA IN THE OBJECT ARE SUPPOSED TO CHANGE OR UPDATE IN REALTIME
                  ) => (
                    <li key={index} className="flex gap-x-3 text-white">
                      <Check className="text-green-500 size-5" />

                      {benefit}
                    </li>
                  )
                )}
              </ul>
            </CardContent>
            <CardFooter>
              {item.id === 1 ? (
                <form className="w-full" action={CreateSubscription}>
                  <SubmitButton
                    text="Buy Plan"
                    className="mt-5 w-full bg-green-500"
                  />
                </form>
              ) : (
                <Button variant="outline" className="mt-5 w-full" asChild>
                  <Link href="/dashboard">Try for free</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
