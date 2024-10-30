import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useRouter } from "next/navigation";

// Zod schema for form validation
const patientSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  birthDate: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), "Invalid birth date"),
  petName: z.string().nonempty("Pet name is required"),
  petSpecies: z.string().nonempty("Pet species is required"),
  petBreed: z.string().nonempty("Pet breed is required"),
  petBirthDate: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), "Invalid pet birth date"),
  petGender: z.string().nonempty("Pet gender is required"),
  petWeight: z.preprocess((value) => parseFloat(value as string), z.number()),
  petColor: z.string().nonempty("Pet color is required"),
  petMicrochip: z.string().optional(),
  petNeutered: z.boolean().optional(),
  petVaccinated: z.boolean().optional(),
  petVaccineDate: z
    .string()
    .optional()
    .refine(
      (value) => !value || !isNaN(Date.parse(value)),
      "Invalid vaccine date"
    ),
  petAllergies: z.string().optional(),
  petMedications: z.string().optional(),
  petConditions: z.string().optional(),
  petDiet: z.string().optional(),
});

export default function PatientRegistrationFormV2({
  clinicId,
}: {
  clinicId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      birthDate: new Date().toISOString().split("T")[0],
      petName: "",
      petSpecies: "",
      petBreed: "",
      petBirthDate: new Date().toISOString().split("T")[0],
      petGender: "",
      petWeight: 0,
      petColor: "",
      petMicrochip: "",
      petNeutered: false,
      petVaccinated: false,
      petVaccineDate: "",
      petAllergies: "",
      petMedications: "",
      petConditions: "",
      petDiet: "",
    },
  });

  // Handler for form submission
  const onSubmit = async (values: z.infer<typeof patientSchema>) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/clinics/${clinicId}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create patient");
      }

      // Redirect to the appointments dashboard after successful registration
      router.push(`/dashboard/clinics/${clinicId}/appointments`);
    } catch (error) {
      console.error("Error creating patient:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h1>Patient Registration Form</h1>

        {/* First Name */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Birth Date */}
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pet Information */}
        {/* Continue adding the other fields similarly... */}

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register Patient"}
        </Button>
      </form>
    </Form>
  );
}
