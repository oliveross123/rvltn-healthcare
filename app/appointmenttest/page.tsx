"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/columns";

const Appointmenttest = () => {
  const [appointments, setAppointments] = useState({
    scheduledCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
    documents: [],
  });

  // Fetch appointments and set them to state
  const fetchAppointments = async () => {
    const fetchedAppointments = await getRecentAppointmentList();
    setAppointments(fetchedAppointments);
  };

  // Use useEffect to fetch appointments every 10 minutes
  useEffect(() => {
    // Fetch the appointments initially
    fetchAppointments();

    // Set an interval to update appointments every 10 minutes (600,000 ms)
    const intervalId = setInterval(() => {
      fetchAppointments();
    }, 600000); // 600,000 ms = 10 minutes

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures it runs once after mount

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link
          href={"/dashboard"}
          className=" text-lg md:text-2xl font-semibold bg-gradient-to-br from-green-500 via-green-500 to-dark-500 cursor-pointer"
        >
          rvltnCare
        </Link>

        <p className="text-16-semibold cursor-pointer">
          Administrátorský panel
        </p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Vítejte 👋</h1>
          <p className="">Začněte den kontrolou termínů</p>
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

export default Appointmenttest;
