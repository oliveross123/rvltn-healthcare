import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";

export const siteSchema = z.object({
  name: z.string().min(1).max(35),
  description: z.string().min(1).max(100),
  subdirectory: z.string().min(1).max(40),
});

export const PostSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z.string().min(1).max(190),
  coverImage: z.string().min(1),
  smallDescription: z.string().min(1).max(200),
  articleContent: z.string().min(1),
});

export function SiteCreationSchema(options?: {
  isSubdirectoryUnique: () => Promise<boolean>;
}) {
  return z.object({
    subdirectory: z
      .string()
      .min(1)
      .max(40)
      .regex(/^[a-z]+$/, "Podadresář může obsahovat pouze malá písmena.")
      .transform((value) => value.toLowerCase())
      .pipe(
        z.string().superRefine((email, ctx) => {
          if (typeof options?.isSubdirectoryUnique !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }

          return options.isSubdirectoryUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message: "Zvolte jiný podadresář. Podadresář již existuje.",
              });
            }
          });
        })
      ),
    name: z.string().min(1).max(35),
    description: z.string().min(1).max(100),
  });
}

export const reservationSchema = z.object({
  patientFirstName: z.string().nonempty("Jméno je povinné"),
  patientLastName: z.string().nonempty("Příjmení je povinné"),
  contactPhone: z.string().min(9, "Telefonní číslo musí mít minimálně 9 znaků"),
  contactEmail: z.string().email("Neplatný formát e-mailu"),
  animalCategory: z.enum(["PES", "KOCKA", "JINE"]),
  animalBreed: z.string().nonempty("Plemeno je povinné"),
  notes: z.string().optional(),
  issueCategory: z.string().nonempty("Kategorie je povinná"),
  appointmentDateTime: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  clinicId: z.string().nonempty("ID kliniky je povinné"), // Ensure clinicId is validated
});
