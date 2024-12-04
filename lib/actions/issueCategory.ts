"use server";

import prisma from "@/app/utils/db";
import { z } from "zod";

// Validace služebních kategorií
const issueCategorySchema = z.array(
  z.object({
    id: z
      .string()
      .refine((id) => /^[0-9]+$/.test(id) || /^[0-9a-fA-F\-]{36}$/.test(id), {
        message: "ID musí být buď číselné nebo ve formátu UUID",
      }),
    name: z.string(),
    duration: z
      .string()
      .regex(/^\d+min$/, "Duration must be in format like '30min'"),
  })
);

interface CreateIssueCategoryInput {
  siteId: string;
  issueCategory: {
    id: string;
    name: string;
    duration: string;
  }[];
}

// Vytvoření nebo aktualizace kategorií
export async function CreateIssueCategory(input: CreateIssueCategoryInput) {
  const { siteId, issueCategory } = input;

  // Validace vstupu
  const parsedIssue = issueCategorySchema.parse(issueCategory);

  try {
    // Transakce: odstranění starých záznamů a vytvoření nových
    await prisma.$transaction([
      prisma.issueCategory.deleteMany({
        where: { siteId },
      }),
      prisma.issueCategory.createMany({
        data: parsedIssue.map((category) => ({
          ...category,
          siteId,
        })),
      }),
    ]);

    return {
      success: true,
      message: "Kategorie byly úspěšně vytvořeny nebo aktualizovány!",
    };
  } catch (error) {
    const err = error as Error; // Přetypování na Error
    throw new Error(`Chyba při vytváření kategorií: ${err.message}`);
  }
}

// export async function getIssueCategory(siteId: string) {
//   //read issue category from db
//   try {
//     const issueCategory = await prisma.issueCategory.findMany({
//       where: { siteId },
//     });
//     return issueCategory;
//   } catch (error) {
//     console.error("Error fetching issue category:", error);
//     throw new Error("Chyba při načítání kategorií.");
//   }
// }

// Načtení kategorií pro konkrétní siteId
export async function fetchIssueCategory(siteId: string) {
  try {
    console.log("Fetching categories for siteId:", siteId);

    const categories = await prisma.issueCategory.findMany({
      where: { siteId },
      select: {
        id: true,
        name: true,
        duration: true,
      },
    });

    console.log("Categories fetched from database:", categories);
    return categories;
  } catch (error) {
    console.error("Error fetching issue categories:", error);
    throw new Error("Chyba při načítání kategorií.");
  }
}

// Uložení kategorií
export async function saveIssueCategory(input: {
  siteId: string;
  issueCategory: {
    id: string;
    name: string;
    duration: string;
  }[];
}) {
  const { siteId, issueCategory } = input;

  console.log("Saving categories for siteId:", siteId, issueCategory);

  // Validace vstupu
  const parsedIssue = issueCategorySchema.parse(issueCategory);

  try {
    await prisma.$transaction([
      prisma.issueCategory.deleteMany({
        where: { siteId },
      }),
      prisma.issueCategory.createMany({
        data: parsedIssue.map((category) => ({
          ...category,
          siteId,
        })),
      }),
    ]);

    console.log("Categories saved successfully for siteId:", siteId);
    return {
      success: true,
      message: "Kategorie byly úspěšně uloženy!",
    };
  } catch (error) {
    console.error("Error saving issue categories:", error);
    throw new Error("Chyba při ukládání kategorií.");
  }
}
