import { EmptyState } from "@/components/dashboard/EmptyState";
import prisma from "../utils/db";
import { requireUser } from "../utils/requireUser";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Defaultimage from "@/public/default.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import StatCard from "@/components/StatCard";

async function getData(userId: string) {
  const [sites, articles] = await Promise.all([
    prisma.site.findMany({
      where: {
        clinicId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    }),
    prisma.post.findMany({
      where: {
        clinicId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    }),
  ]);

  return { sites, articles };
}

async function Admin() {
  const [appointments] = await getRecentAppointmentList();
}

export default async function DashbaordIndexPage() {
  const user = await requireUser();
  const clinicId = user.id;
  const { articles, sites } = await getData(user.id);

  const appointments = await getRecentAppointmentList();

  return (
    <div>
      <div className="">
        <h1 className="text-2xl font-semibold mb-5">Přehled termínu</h1>
        <section className="admin-stat flex gap-4">
          <Link href={`dashboard/clinics/${clinicId}/appointments`}>
            <div className="flex gap-4">
              <StatCard
                type="naplánovat"
                count={appointments.scheduledCount}
                label="Naplánované termíny"
                icon="/assets/icons/appointments.svg"
              />
              <StatCard
                type="nevyřízene"
                count={appointments.pendingCount}
                label="Nevyřízene termíny"
                icon="/assets/icons/pending.svg"
              />
              <StatCard
                type="zrušit"
                count={appointments.cancelledCount}
                label="Zrušené termíny"
                icon="/assets/icons/cancelled.svg"
              />
            </div>
          </Link>
        </section>
      </div>
      <h1 className="text-2xl font-semibold mb-5 mt-5">Váš Web</h1>
      {sites.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {sites.map((item) => (
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
                  <Link href={`/dashboard/sites/${item.id}`}>Zobrazit web</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="You dont have any sites"
          description="You currently dont have any Sites. Please create some so you can see them right here."
          href="/dashboard/sites/new"
          buttonText="Create Site"
        />
      )}
      <h1 className="text-2xl mt-10 font-semibold mb-5">Vaše články</h1>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {articles.map((item) => (
            <Card key={item.id}>
              <Image
                src={item.image ?? Defaultimage}
                alt={item.title}
                className="rounded-t-lg object-cover w-full h-[200px]"
                width={400}
                height={200}
              />

              <CardHeader>
                <CardTitle className="truncate">{item.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {item.smallDescription}
                </CardDescription>
              </CardHeader>

              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/sites/${item.siteId}/${item.id}`}>
                    Upravit články
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="You dont have any articles"
          description="You currently dont have any articles. Please create some so you can see them right here."
          href="/dashboard/sites"
          buttonText="Create Article"
        />
      )}
    </div>
  );
}
