"use server";

import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  PATIENT_COLLECTION_ID,
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { getAppointmentsByClinicId } from "../appointments";
import KindeAuth from "@kinde-oss/kinde-auth-nextjs";
import { getUser } from "@kinde-oss/kinde-auth-nextjs";

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.log(error);
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );
  } catch (error) {
    console.log(error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );
    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }
    const smsMessage = `
            Hi, its Healthcare.
          ${
            type === "naplánovat"
              ? `Váš termín byl naplánovan na datum:  ${
                  formatDateTime(appointment.schedule!).dateTime
                } with MVDr. ${appointment.primaryPhysician}`
              : `Váš termín byl zrušen - důvod: ${appointment.cancellationReason}`
          }`;

    await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.log(error);
  }
};
export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );
    return parseStringify(message);
  } catch (error) {
    console.log("An error ocurred while sending sms", error);
  }
};

export const updatePatient = async (
  userId: string, // Přidání userId argumentu zde
  patientId: string,
  patientData: Partial<{
    name: string;
    age: number;
    phone: string;
    notes: string;
  }>
) => {
  try {
    // Načtení uživatele s userId
    const user = await getUser(userId);

    // Ověření oprávnění uživatele
    if (!user || !user.permissions?.includes("edit_patient_data")) {
      throw new Error(
        "Unauthorized: You do not have permission to edit patient data."
      );
    }

    const updatedPatient = await databases.updateDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      patientId,
      patientData
    );

    if (!updatedPatient) {
      throw new Error("Patient not found");
    }

    // Použití user.id jako clinicId pro revalidaci cesty
    const clinicId = user.id;
    revalidatePath(`/dashboard/clinics/${clinicId}/patientDatabase`);

    return parseStringify(updatedPatient);
  } catch (error) {
    console.log("An error occurred while updating patient", error);
    throw error;
  }
};
