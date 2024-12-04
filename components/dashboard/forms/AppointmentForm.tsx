"use client";

import { useParams } from "next/navigation";
import { CreateAppointmentInput } from "@/lib/actions/appointments";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FormEvent, useEffect, useState } from "react";
import { fetchIssueCategory } from "@/lib/actions/issueCategory";

interface IssueCategory {
  id: string;
  name: string;
  duration: string;
}

export default function AppointmentForm() {
  const { name: clinicId } = useParams<{ name: string }>();

  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [animalCategory, setAnimalCategory] = useState<
    "PES" | "KOCKA" | "JINE"
  >("PES");
  const [animalBreed, setAnimalBreed] = useState("");
  const [notes, setNotes] = useState("");
  const [issueCategory, setIssueCategory] = useState<string>();
  const [appointmentDateTime, setAppointmentDateTime] = useState(new Date());
  const [categories, setCategories] = useState<IssueCategory[]>([]);

  useEffect(() => {
    if (!clinicId) return;

    async function loadCategories() {
      try {
        const data = await fetchIssueCategory(clinicId);
        setCategories(data);
        if (data.length > 0) {
          setIssueCategory(data[9].id); // Nastavíme výchozí kategorii
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    loadCategories();
  }, [clinicId]);

  if (!clinicId) {
    return <p>Error: Subdirectory name is missing in the URL.</p>;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!issueCategory) {
      alert("Vyberte kategorii problému.");
      return;
    }

    const appointmentData: CreateAppointmentInput = {
      patientFirstName,
      patientLastName,
      contactPhone,
      contactEmail,
      animalCategory,
      animalBreed,
      notes,
      issueCategory, // Již není undefined
      appointmentDateTime,
      clinicId,
    };

    try {
      console.log("Submitting appointment data:", appointmentData);
      await CreateAppointmentInput(appointmentData);
      alert("Appointment created successfully!");
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-white">
      <div className="grid gap-4">
        <h1 className="text-3xl font-bold">Rezervace termínu</h1>
        <p className="text-green-500">Vyplňte formulář</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="patientFirstName">Jméno</Label>
          <Input
            className="bg-white rounded-md"
            value={patientFirstName}
            onChange={(e) => setPatientFirstName(e.target.value)}
            id="patientFirstName"
            placeholder="Vaše jméno"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="patientLastName">Příjmení</Label>
          <Input
            className="bg-white rounded-md"
            value={patientLastName}
            onChange={(e) => setPatientLastName(e.target.value)}
            id="patientLastName"
            placeholder="Vaše příjmení"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contactPhone">Telefon</Label>
          <Input
            className="bg-white rounded-md"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            id="contactPhone"
            placeholder="Telefonní číslo"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contactEmail">E-mail</Label>
          <Input
            className="bg-white rounded-md"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            id="contactEmail"
            placeholder="Váš e-mail"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Druh zvířete</Label>
          <Select
            onValueChange={(value) =>
              setAnimalCategory(value as "PES" | "KOCKA" | "JINE")
            }
            defaultValue="PES"
          >
            <SelectTrigger>
              <SelectValue placeholder="Vyberte kategorii" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PES">Pes</SelectItem>
              <SelectItem value="KOCKA">Kočka</SelectItem>
              <SelectItem value="JINE">Jiné</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="animalBreed">Plemeno zvířete</Label>
          <Input
            className="bg-white rounded-md"
            value={animalBreed}
            onChange={(e) => setAnimalBreed(e.target.value)}
            id="animalBreed"
            placeholder="Plemeno zvířete"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="issueCategory">Kategorie problému</Label>
          <Select
            onValueChange={(value) => setIssueCategory(value)}
            value={issueCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vyberte kategorii" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="appointmentDateTime">Datum a čas</Label>
          <Input
            className="bg-white rounded-md"
            value={appointmentDateTime.toISOString().slice(0, 16)}
            onChange={(e) => setAppointmentDateTime(new Date(e.target.value))}
            id="appointmentDateTime"
            type="datetime-local"
            placeholder="Datum a čas"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Zrušit</Button>
          <Button className="bg-green-500">Rezervovat</Button>
        </div>
      </div>
    </form>
  );
}
