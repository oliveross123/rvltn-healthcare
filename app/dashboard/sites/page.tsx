import prisma from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import Defaultimage from "@/public/default.png";
import { cookies } from "next/headers";
import { EmptyState } from "@/components/dashboard/EmptyState";

async function getData(userId: string) {
  try {
    console.log("Fetching data for userId:", userId); // Debugging log
    const data = await prisma.site.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("Data fetched:", data); // Debugging log
    return data;
  } catch (error) {
    console.error("Error fetching data for userId:", userId, error); // Error handling
    return []; // Return empty array to prevent issues if data fetching fails
  }
}

export default async function SitesRoute() {
  // Get cookies directly without awaiting the function itself
  const cookieStore = cookies();
  const idToken = (await cookieStore).get("id_token")?.value;
  console.log("ID Token:", idToken); // Debugging log

  if (!idToken) {
    console.warn("No ID Token found, redirecting to login."); // Warning log
    return redirect("/api/auth/login");
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  console.log("User fetched:", user); // Debugging log

  if (!user) {
    console.warn("No user found, redirecting to login."); // Warning log
    return redirect("/api/auth/login");
  }

  const data = await getData(user.id);

  return (
    <>
      <div className="flex w-full justify-end">
        <Button asChild className="bg-green-400/70">
          <Link href={"/dashboard/sites/new"}>
            <div className="flex items-center">
              <PlusCircle className="mr-2 size-4" />
              <span>Create Site</span>
            </div>
          </Link>
        </Button>
      </div>

      {data.length === 0 ? ( // Updated conditional to handle empty data
        <EmptyState
          title="You don't have any sites created"
          description="You currently don’t have any sites. Please create some so that you can see them here."
          buttonText="Create Site"
          href="/dashboard/sites/new"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {data.map((item) => (
            <Card key={item.id}>
              <Image
                src={item.imageUrl ?? Defaultimage}
                alt={item.name}
                className="rounded-t-lg object-cover w-full h-[200px]"
                width={400}
                height={200}
              />

              <CardHeader>
                <CardTitle className="truncate">{item.name}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/sites/${item.id}`}>
                    View articles
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
