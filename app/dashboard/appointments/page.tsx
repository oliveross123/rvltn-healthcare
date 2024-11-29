import React from "react";
import Link from "next/link";
import Image from "next/image";
import StatCard from "@/components/StatCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/columns";

const Appointments = async () => {
  const appointments = await getRecentAppointmentList();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          {/* <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="Logo"
            className="h-8 w-fit"
          /> */}

          <Link
            href={"/"}
            className="-mt-10 text-lg md:text-2xl font-semibold bg-gradient-to-br from-green-500 via-green-500 to-dark-500"
          >
            rvltnCare
          </Link>
        </Link>

        <p className="text-16-semibold">Přehled termínu</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Vítejte 👋</h1>
          <p className="text-dark-700">Začněte den kontrolou termínů</p>
        </section>

        <section className="admin-stat">
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
        </section>

        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  );
};

export default Appointments;
