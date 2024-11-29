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
const userSchema = z.object({
  name: z.string().nonempty("user name is required"),
  address: z.string().nonempty("Address is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
});

type userFormValues = z.infer<typeof userSchema>;

const userRegistrationForm = () => {
  const router = useRouter();
  const form = useForm<userFormValues>({
    resolver: zodResolver(userSchema),
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

  const onSubmit = async (values: userFormValues) => {
    try {
      // API call to save user information
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      // Redirect to dashboard after successful registration
      router.push("/dashboard/users");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <h1>Register Your user</h1>

      <div>
        <label>user Name</label>
        <Input placeholder="user Name" {...form.register("name")} />
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

      <Button type="submit">Register user</Button>
    </form>
  );
};

export default userRegistrationForm;
