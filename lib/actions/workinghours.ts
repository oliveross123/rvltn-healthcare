"use server";

import prisma from "@/app/utils/db";
import { z } from "zod";

// Validace pracovních hodin
const workingHoursSchema = z.array(
  z.object({
    dayOfWeek: z.number().min(0).max(6), // 0 = Neděle, 6 = Sobota
    openTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Čas musí být ve formátu HH:mm"),
    closeTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Čas musí být ve formátu HH:mm"),
  })
);

interface CreateWorkingHoursInput {
  siteId: string;
  workingHours: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
  }[];
}

export async function createWorkingHours(input: CreateWorkingHoursInput) {
  const { siteId, workingHours } = input;

  // Validace vstupu
  const parsedHours = workingHoursSchema.parse(workingHours);

  // Transakce: smazání starých záznamů a vytvoření nových
  await prisma.$transaction([
    prisma.workingHours.deleteMany({
      where: { siteId },
    }),
    prisma.workingHours.createMany({
      data: parsedHours.map((hour) => ({
        ...hour,
        siteId,
      })),
    }),
  ]);
}

export async function fetchWorkingHours(siteId: string) {
  return prisma.workingHours.findMany({
    where: { siteId },
    select: {
      dayOfWeek: true,
      openTime: true,
      closeTime: true,
    },
  });
}

export async function saveWorkingHours(input: {
  siteId: string;
  workingHours: any[];
}) {
  const { siteId, workingHours } = input;

  // Odstranění `isActive` z pracovních hodin
  const sanitizedHours = workingHours.map(
    ({ dayOfWeek, openTime, closeTime }) => ({
      dayOfWeek,
      openTime,
      closeTime,
    })
  );

  // Transakce: odstranění starých záznamů a vytvoření nových
  await prisma.$transaction([
    prisma.workingHours.deleteMany({
      where: { siteId },
    }),
    prisma.workingHours.createMany({
      data: sanitizedHours.map((hour) => ({
        ...hour,
        siteId,
      })),
    }),
  ]);

  return {
    success: true,
    message: "Pracovní doba byla úspěšně aktualizována.",
  };
}
