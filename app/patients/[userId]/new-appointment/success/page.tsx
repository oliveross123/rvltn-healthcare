import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
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
            <p className="whitespace-nowrap">Dr. {doctor?.name || "Unknown"}</p>
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

        <p className="copyright">© 2024 HealthCare by rvltn </p>
      </div>
    </div>
  );
};

export default Success;
