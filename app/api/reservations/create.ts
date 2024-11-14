import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/utils/db";
import { reservationSchema } from "@/app/utils/zodSchemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Validace vstupních dat pomocí Zod
      const validatedData = reservationSchema.parse(req.body);

      // Přímé vytvoření rezervace s daty včetně `clinicId`
      const reservation = await prisma.appointment.create({
        data: {
          ...validatedData,
        },
      });

      res.status(201).json({ reservation });
    } catch (error) {
      res.status(400).json({ error: "Neplatný vstup", details: error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Metoda ${req.method} není povolena`);
  }
}
