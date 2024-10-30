import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      firstName,
      lastName,
      email,
      phone,
      birthDate,
      petName,
      petSpecies,
      petBreed,
      petBirthDate,
      petGender,
      petWeight,
      petColor,
      petMicrochip,
      petNeutered,
      petVaccinated,
      petVaccineDate,
      petAllergies,
      petMedications,
      petConditions,
      petDiet,
    } = req.body;

    try {
      const newPatient = await prisma.patient.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          birthDate: new Date(birthDate),
          petName,
          petSpecies,
          petBreed,
          petBirthDate: new Date(petBirthDate),
          petGender,
          petWeight,
          petColor,
          petMicrochip,
          petNeutered,
          petVaccinated,
          petVaccineDate: petVaccineDate ? new Date(petVaccineDate) : null,
          petAllergies,
          petMedications,
          petConditions,
          petDiet,
          clinicId: "some_clinic_id", // You might want to get this dynamically based on the clinic
        },
      });

      res.status(201).json(newPatient);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating patient" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
