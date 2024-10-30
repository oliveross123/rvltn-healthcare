import React from "react";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";

import AppointmentForm from "@/components/forms/AppointmentForm";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import SearchForm from "@/components/SearchForm";

const patientDatabase = () => {
  return (
    <div>
      hello from kartoteka;
      <SearchForm />
    </div>
  );
};

export default patientDatabase;
