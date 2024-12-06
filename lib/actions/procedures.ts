"use server";

import prisma from "@/app/utils/db";

interface CreateProcedureInput {
  name: string;
  duration: number;
  siteId: string;
}

export async function createProcedure(input: CreateProcedureInput) {
  try {
    const procedureCount = await prisma.procedure.count({
      where: {
        clinicId: input.siteId,
      },
    });

    if (procedureCount >= 10) {
      throw new Error("Maximum number of procedures reached for this site.");
    }

    const newProcedure = await prisma.procedure.create({
      data: {
        name: input.name,
        duration: input.duration,
        clinicId: input.siteId,
      },
    });

    return newProcedure;
  } catch (error) {
    console.error("Error creating procedure:", error);
    throw new Error("Failed to create procedure");
  }
}

// Načtení procedur podle siteId
export async function getProcedureBySiteId(siteId: string) {
  try {
    const procedure = await prisma.procedure.findMany({
      where: {
        clinicId: siteId,
      },
    });
    return procedure;
  } catch (error) {
    console.error("Error fetching procedures:", error);
    return null;
  }
}
