import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subdirectory } = req.query;

  // Debugging log
  console.log("Received subdirectory parameter:", subdirectory);

  if (!subdirectory || typeof subdirectory !== "string") {
    console.error("Invalid or missing subdirectory parameter:", subdirectory);
    return res
      .status(400)
      .json({ error: "Invalid or missing subdirectory parameter" });
  }

  try {
    const clinic = await prisma.site.findUnique({
      where: { subdirectory },
      select: {
        id: true,
        userId: true,
        User: { select: { id: true } },
      },
    });

    if (!clinic) {
      console.error("Clinic not found for subdirectory:", subdirectory);
      return res.status(404).json({
        error: "Clinic not found for the provided subdirectory.",
      });
    }

    if (!clinic.User) {
      console.error("Associated user not found for clinic ID:", clinic.id);
      return res.status(404).json({
        error: "Associated user not found for this clinic.",
      });
    }

    return res
      .status(200)
      .json({ clinicId: clinic.id, userId: clinic.User.id });
  } catch (error) {
    console.error("Error fetching clinic data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
