"use server";

import prisma from "@/app/utils/db";

// Načtení procedur pro konkrétní kliniku
export async function getProcedures(siteId: string) {
  return await prisma.procedure.findMany({
    where: { clinicId: siteId },
  });
}

// Přidání nové procedury
export async function addProcedure(
  siteId: string,
  name: string,
  duration: number
) {
  const count = await prisma.procedure.count({
    where: { clinicId: siteId },
  });

  if (count >= 10) {
    throw new Error("Klinika nemůže mít více než 10 procedur.");
  }

  return await prisma.procedure.create({
    data: {
      name,
      duration,
      clinicId: siteId,
    },
  });
}

// Úprava procedury
export async function updateProcedure(
  procedureId: string,
  name: string,
  duration: number
) {
  return await prisma.procedure.update({
    where: { id: procedureId },
    data: {
      name,
      duration,
    },
  });
}

// Mazání procedury
export async function deleteProcedure(procedureId: string) {
  return await prisma.procedure.delete({
    where: { id: procedureId },
  });
}
