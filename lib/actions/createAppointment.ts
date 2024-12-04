"use server";

import prisma from "@/app/utils/db";

import { AnimalCategory, IssueCategory } from "@prisma/client"; // Importujte vaše enumy z Prisma

export async function createAppointment(data: {
  patientFirstName: string;
  patientLastName: string;
  contactPhone: string;
  contactEmail: string;
  animalCategory: AnimalCategory; // Použití správného typu
  animalBreed: string;
  notes?: string;
  issueCategory: IssueCategory; // Použití správného typu
  appointmentDateTime: Date;
  clinicId: string;
}) {
  // Ověříme, zda již není daný čas rezervován
  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      clinicId: data.clinicId,
      appointmentDateTime: data.appointmentDateTime,
    },
  });

  if (existingAppointment) {
    throw new Error("Tento termín je již rezervován.");
  }

  // Vytvoření nové rezervace
  const newAppointment = await prisma.appointment.create({
    data: {
      patientFirstName: data.patientFirstName,
      patientLastName: data.patientLastName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      animalCategory: data.animalCategory,
      animalBreed: data.animalBreed,
      notes: data.notes,
      issueCategory: data.issueCategory,
      appointmentDateTime: data.appointmentDateTime,
      clinicId: data.clinicId,
    },
  });

  return newAppointment;
}
