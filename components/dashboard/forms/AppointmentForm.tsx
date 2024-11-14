"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAppointment } from "@/lib/actions/appointments";
import { Card, Input } from "@mui/material";
import { FormEvent } from "react";
import { useState } from "react";

export const revalidate = 1;

export default function AppointmentForm() {
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [animalCategory, setAnimalCategory] = useState("pes");
  const [animalBreed, setAnimalBreed] = useState("");
  const [notes, setNotes] = useState("");
  const [issueCategory, setIssueCategory] = useState("");
  const [appointmentDateTime, setAppointmentDateTime] = useState(new Date());
  const [clinicId, setClinicId] = useState("");

  const mapAnimalCategory = (category: string): "PES" | "KOCKA" | "JINE" => {
    switch (category.toLowerCase()) {
      case "pes":
        return "PES";
      case "kočka":
        return "KOCKA";
      default:
        return "JINE";
    }
  };

  const mapIssueCategory = (
    issue: string
  ): "AKUTNI_PRIKLAD" | "STRIHANI_DRAPKU" | "KONTROLA" | "OCKOVANI" => {
    switch (issue.toLowerCase()) {
      case "akutní případ":
        return "AKUTNI_PRIKLAD";
      case "stříhání drápku":
        return "STRIHANI_DRAPKU";
      case "kontrola":
        return "KONTROLA";
      default:
        return "OCKOVANI";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createAppointment({
        patientFirstName,
        patientLastName,
        contactPhone,
        contactEmail,
        animalCategory: mapAnimalCategory(animalCategory),
        animalBreed,
        notes,
        issueCategory: mapIssueCategory(issueCategory),
        appointmentDateTime,
        clinicId,
      });
    } catch (error) {
      // show some toast or alert to the user
      console.error("Error creating reservation:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="text-white">
      <div className="grid gap-4">
        <h1 className="text-3xl font-bold">Rezervace termínu</h1>
        <p className="text-green-500">Vyplňtě formulář</p>
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
            onValueChange={(value) => setAnimalCategory(value)}
            defaultValue="---"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pes">Pes</SelectItem>
              <SelectItem value="kočka">Kočka</SelectItem>
              <SelectItem value="jiné">Jiné</SelectItem>
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
          <Label htmlFor="notes">Poznámky</Label>
          <Input
            className="bg-white rounded-md"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            id="notes"
            placeholder="Poznámky"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="issueCategory">Kategorie problému</Label>
          <Select
            onValueChange={(value) => setIssueCategory(value)}
            defaultValue="---"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Akutní případ">Akutní případ</SelectItem>
              <SelectItem value="Stříhání drápku">Stříhání drápků</SelectItem>
              <SelectItem value="Kontrola">Kontrola</SelectItem>
              <SelectItem value="Ockovani">Očkování</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="appointmentDateTime">Datum a čas</Label>
          <Input
            className="bg-white rounded-md"
            value={appointmentDateTime.toISOString().slice(0, 16)} // fromat date for input tpe = "datetime-local"
            onChange={(e) => setAppointmentDateTime(new Date(e.target.value))} // convert input value to Date
            id="appointmentDateTime"
            type="datetime-local"
            placeholder="Datum a čas"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="clinicId">Klinika</Label>
          <Input
            className="bg-white rounded-md"
            value={clinicId}
            onChange={(e) => setClinicId(e.target.value)}
            id="clinicId"
            placeholder="Klinika"
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
