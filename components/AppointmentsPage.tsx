"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import { DataTable } from "@/components/table/DataTable";

interface AppointmentData {
  id: string;
  clientName: string;
  clientEmail: string;
  date: Date;
  status: "SCHEDULED" | "PENDING" | "CANCELLED";
  clinicId: string;
  primaryPhysicianId: string;
  reason: string | null;
  note: string | null;
  cancellationReason: string | null;
  doctorId: string; // Upraveno: odstraněn možný null
  patientId: string; // Upraveno: odstraněn možný null
  createdAt: Date;
  updatedAt: Date;
}

export default function AppointmentsPage() {
  const { clinicId } = useParams();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);

  // Fetch appointments using Prisma
  const fetchAppointments = async () => {
    if (!clinicId) return;

    try {
      const response = await fetch(
        `/api/appointments/recent?clinicId=${clinicId}`
      );
      if (!response.ok) {
        throw new Error("Error fetching appointments");
      }

      const data = await response.json();
      // Ensure the data contains all necessary fields and set defaults if missing
      const formattedData = data.documents.map((appointment: any) => ({
        ...appointment,
        doctorId: appointment.doctorId ?? "Unknown", // Výchozí hodnota pro doctorId
        patientId: appointment.patientId ?? "Unknown", // Výchozí hodnota pro patientId
      }));

      setAppointments(formattedData);
      setScheduledCount(data.scheduledCount);
      setPendingCount(data.pendingCount);
      setCancelledCount(data.cancelledCount);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [clinicId]);

  if (!clinicId) {
    return <div>Loading...</div>;
  }

  // Define columns for DataTable
  const columns = [
    { header: "Client Name", accessor: "clientName" },
    { header: "Client Email", accessor: "clientEmail" },
    { header: "Date", accessor: "date" },
    { header: "Status", accessor: "status" },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link
          href={"/dashboard"}
          className="text-lg md:text-2xl font-semibold bg-gradient-to-br from-green-500 via-green-500 to-dark-500 cursor-pointer"
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
          <p>Začněte den kontrolou termínů</p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="naplánovat"
            count={scheduledCount}
            label="Naplánované termíny"
            icon="/assets/icons/appointments.svg"
          />

          <StatCard
            type="nevyřízene"
            count={pendingCount}
            label="Nevyřízené termíny"
            icon="/assets/icons/pending.svg"
          />

          <StatCard
            type="zrušit"
            count={cancelledCount}
            label="Zrušené termíny"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        <DataTable columns={columns} data={appointments} />
      </main>
    </div>
  );
}
