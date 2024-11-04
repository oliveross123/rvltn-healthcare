import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import * as Sentry from "@sentry/nextjs";
import { getUser } from "@/lib/actions/patient.actions";

const Success = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);

  if (!appointment) {
    return (
      <div className="flex h-screen max-h-screen px-[5%] place-items-center">
        <div className="text-center text-white">
          <h2 className="header mb-6 max-w-[600px]">Termín nenalezen</h2>
          <p>
            Prosím zkontrolujte informace detailu nebo zkuste znovu později.{" "}
          </p>
          <Button variant="outline" className="shad-primary-btn" asChild>
            <Link href={`/patients/${userId}/new-appointment`}>
              Nový termín
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Fetching the doctor's photo and details
  const doctor = Doctors.find(
    (doctor) => doctor.name === appointment.primaryPhysician
  );

  const user = await getUser(userId);

  Sentry.metrics.set("user_view_appointment-success", user.name);

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link
          href={"/"}
          className="-mt-10 text-lg md:text-2xl font-semibold bg-gradient-to-br from-green-500 via-green-500 to-dark-500 w-fit"
        >
          rvltnCare
        </Link>

        <section className="text-white flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            width={300}
            height={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Vaše <span className="text-green-500">rezervace termínu</span> byla
            úspěšně vytvořena 🎉
          </h2>

          <p>Brzy se vám ozveme s potvrzovací zprávou.</p>
        </section>

        <section className="request-details text-white">
          <p>Detaily schůzky:</p>
          <div className="flex items-center gap-3">
            {doctor?.image ? (
              <Image
                src={doctor.image}
                alt="doctor"
                width={100}
                height={100}
                className="size-6"
              />
            ) : (
              <p>Fotka doktora není k dispozici</p>
            )}
            <p className="whitespace-nowrap">
              MVDr. {doctor?.name || "Unknown"}
            </p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              width={24}
              height={24}
              alt="calendar"
            />

            <p>{formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>Nový termín</Link>
        </Button>

        <p className="copyright">© 2024 rvltnCare | rvltn.cz </p>
      </div>
    </div>
  );
};

export default Success;
