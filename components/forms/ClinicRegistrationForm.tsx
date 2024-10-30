"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { requireUser } from "@/app/utils/requireUser";

// Zod schema for form validation
const clinicSchema = z.object({
  name: z.string().nonempty("Clinic name is required"),
  address: z.string().nonempty("Address is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
});

type ClinicFormValues = z.infer<typeof clinicSchema>;

const ClinicRegistrationForm = () => {
  const router = useRouter();
  const form = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: "",
      address: "",
      email: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    // Ensure user is logged in before displaying form
    const fetchUser = async () => {
      const user = await requireUser();
      if (!user) {
        router.push("/api/auth/login");
      }
    };

    fetchUser();
  }, [router]);

  const onSubmit = async (values: ClinicFormValues) => {
    try {
      // API call to save clinic information
      const response = await fetch("/api/clinics/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to register clinic");
      }

      // Redirect to dashboard after successful registration
      router.push("/dashboard/clinics");
    } catch (error) {
      console.error("Error registering clinic:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <h1>Register Your Clinic</h1>

      <div>
        <label>Clinic Name</label>
        <Input placeholder="Clinic Name" {...form.register("name")} />
      </div>

      <div>
        <label>Address</label>
        <Input placeholder="Address" {...form.register("address")} />
      </div>

      <div>
        <label>Email</label>
        <Input placeholder="Email" {...form.register("email")} />
      </div>

      <div>
        <label>Phone Number</label>
        <Input placeholder="Phone Number" {...form.register("phoneNumber")} />
      </div>

      <Button type="submit">Register Clinic</Button>
    </form>
  );
};

export default ClinicRegistrationForm;
