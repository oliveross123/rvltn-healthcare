import Image from "next/image";
import Link from "next/link";

import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";

import * as Sentry from "@sentry/nextjs";

const Appointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);

  Sentry.metrics.set("user_view_register", patient.name);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <div className="sub-container max-w-[496px]">
            {/* <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          /> */}
            <div className="-mt-10 max-w-[120ox]">
              <Link
                href={"/"}
                className="-mt-10 text-lg md:text-2xl font-semibold bg-gradient-to-br from-green-500 via-green-500 to-dark-500"
              >
                rvltnCare
              </Link>
            </div>
          </div>

          <AppointmentForm
            patientId={patient?.$id}
            userId={userId}
            type="create"
          />

          <p className="copyright mt-10 py-12">© 2024 rvltn.cz | rvltnCare </p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default Appointment;
