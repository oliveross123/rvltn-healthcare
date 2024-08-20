"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import {
  CreateAppointmentSchema,
  getAppointmentSchema,
} from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import React from "react";
import { createAppointment } from "@/lib/actions/appointment.actions";

const AppointmentForm = ({
  userId,
  patientId,
  type,
}: {
  userId: string;
  patientId: string;
  type: "vytvořit" | "zrušit" | "naplánovat";
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);

    let status;
    switch (type) {
      case "naplánovat":
        status = "scheduled";
        break;
      case "zrušit":
        status = "cancelled";
        break;
      default:
        status = "pending";
        break;
    }

    try {
      if (type === "vytvořit" && patientId) {
        console.log("I AM HERE");

        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };

        //Sending package to the backend
        const appointment = await createAppointment(appointmentData);

        console.log(appointment);

        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.id}`
          );
        }
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  }

  let buttonLabel = "Get Started";

  switch (type) {
    case "zrušit":
      buttonLabel = "Zrušit termín";
      break;
    case "vytvořit":
      buttonLabel = "Vytvořit termín";
      break;
    case "naplánovat":
      buttonLabel = "Naplánovat termín";
      break;
    default:
      break;
  }

  return (
    <div className="text-light-200">
      {" "}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex-1"
        >
          <section className="mb-12 space-y-4">
            <h1 className="header">Nový termín</h1>
            <p className="text-dark-700">
              Domluvte si nový termín během několika sekund
            </p>
          </section>

          {type !== "zrušit" && (
            <>
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label="Lékař"
                placeholder="Vyberte lékaře"
              >
                {Doctors.map((doctor) => (
                  <SelectItem key={doctor.name} value={doctor.name}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <Image
                        src={doctor.image}
                        width={32}
                        height={32}
                        alt={doctor.name}
                        className="rounded-full border border-dark-500"
                      />
                      <p>{doctor.name} </p>
                    </div>
                  </SelectItem>
                ))}
              </CustomFormField>

              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="schedule"
                label="Očekávaný termín"
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm" // 24-hour format without AM/PM NOTWORKING !!!
                placeholder="Vyberte datum"
              />

              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="reason"
                  label="Důvod návštěvy"
                  placeholder="Důvod návštěvy"
                />

                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="note"
                  label="Poznámky"
                  placeholder="Napište poznámky"
                />
              </div>
            </>
          )}

          {type === "zrušit" && (
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="cancellationReason"
              label="Důvod for cancellation"
              placeholder="Uveďte důvod pro zrušení"
            />
          )}

          <SubmitButton
            isLoading={isLoading}
            className={`${
              type === "zrušit" ? "shad-danger-btn" : "shad-primary-btn"
            } w-full`}
          >
            {buttonLabel}
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default AppointmentForm;
