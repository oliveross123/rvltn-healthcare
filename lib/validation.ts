import { z } from "zod";

// Definování typu pro české hodnoty pohlaví
export const GenderEnum = z.enum(["muž", "žena", "jiné"]);

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Jméno musí mít alespoň 2 znaky")
    .max(50, "Jméno může mít maximálně 50 znaků"),
  email: z.string().email("Neplatná emailová adresa"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Neplatné telefonní číslo"),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "Jméno musí mít alespoň 2 znaky")
    .max(50, "Jméno může mít maximálně 50 znaků"),
  email: z.string().email("Neplatná emailová adresa"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Neplatné telefonní číslo"),
  birthDate: z.coerce.date(),
  gender: GenderEnum, // Použití definovaného typu pro gender
  address: z
    .string()
    .min(5, "Adresa musí mít alespoň 5 znaků")
    .max(500, "Adresa může mít maximálně 500 znaků"),
  occupation: z
    .string()
    .min(2, "Povolání musí mít alespoň 2 znaky")
    .max(500, "Povolání může mít maximálně 500 znaků"),
  emergencyContactName: z
    .string()
    .min(2, "Jméno kontaktní osoby musí mít alespoň 2 znaky")
    .max(50, "Jméno kontaktní osoby může mít maximálně 50 znaků"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Neplatné telefonní číslo"
    ),
  primaryPhysician: z.string().min(2, "Vyberte alespoň jednoho lékaře"),
  insuranceProvider: z
    .string()
    .min(2, "Název pojišťovny musí mít alespoň 2 znaky")
    .max(50, "Název pojišťovny může mít maximálně 50 znaků"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Číslo pojistky musí mít alespoň 2 znaky")
    .max(50, "Číslo pojistky může mít maximálně 50 znaků"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Pro pokračování musíte souhlasit s léčbou",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Pro pokračování musíte souhlasit s poskytnutím informací",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Pro pokračování musíte souhlasit s ochranou soukromí",
    }),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Vyberte alespoň jednoho lékaře"),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Důvod musí mít alespoň 2 znaky")
    .max(500, "Důvod může mít maximálně 500 znaků"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Vyberte alespoň jednoho lékaře"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Vyberte alespoň jednoho lékaře"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Důvod musí mít alespoň 2 znaky")
    .max(500, "Důvod může mít maximálně 500 znaků"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}
