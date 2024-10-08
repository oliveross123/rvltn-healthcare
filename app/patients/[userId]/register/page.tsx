import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import * as Sentry from "@sentry/nextjs";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);

  Sentry.metrics.set("user_view_new-appointment", user.name);

  return (
    <div className="flex h-screen max-h-screen">
      {/* TODO: OTP VERIFICATION \ PASSKEY MODEL */}
      <section className="remove-scrollbar container">
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
          <RegisterForm user={user} />
          <p className="copyright py-12"> © 2024 rvltn.cz | rvltnCare</p>{" "}
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
