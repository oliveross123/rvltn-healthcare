"use client";

import { useParams } from "next/navigation";
import PatientRegistrationFormV2 from "@/components/forms/PatientRegistrationFormV2";

const RegisterPage = () => {
  const params = useParams();
  const clinicId = Array.isArray(params?.clinicId)
    ? params.clinicId[0]
    : params.clinicId;

  return (
    <div>
      <h1>Register as a Patient</h1>
      {clinicId && <PatientRegistrationFormV2 clinicId={clinicId as string} />}
    </div>
  );
};

export default RegisterPage;
