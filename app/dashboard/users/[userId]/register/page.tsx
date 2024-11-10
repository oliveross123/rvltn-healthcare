"use client";

import { useParams } from "next/navigation";
import PatientRegistrationFormV2 from "@/components/forms/PatientRegistrationFormV2";

const RegisterPage = () => {
  const params = useParams();
  const userId = Array.isArray(params?.userId)
    ? params.userId[0]
    : params.userId;

  return (
    <div>
      <h1>Register as a Patient</h1>
      {userId && <PatientRegistrationFormV2 userId={userId as string} />}
    </div>
  );
};

export default RegisterPage;
