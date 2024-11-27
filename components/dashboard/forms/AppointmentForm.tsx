"use client";

import { useParams } from "next/navigation";
import { CreateAppointmentInput } from "@/lib/actions/appointments"; // Import správné funkce
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@mui/material";
import { FormEvent, useState } from "react";

export default function AppointmentForm() {
  const { name } = useParams<{ name: string }>();

  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [animalCategory, setAnimalCategory] = useState<
    "PES" | "KOCKA" | "JINE"
  >("PES");
  const [animalBreed, setAnimalBreed] = useState("");
  const [notes, setNotes] = useState("");
  const [issueCategory, setIssueCategory] = useState<
    "AKUTNI_PRIKLAD" | "STRIHANI_DRAPKU" | "KONTROLA" | "OCKOVANI"
  >("AKUTNI_PRIKLAD");
  const [appointmentDateTime, setAppointmentDateTime] = useState(new Date());

  if (!name) {
    return <p>Error: Subdirectory name is missing in the URL.</p>;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const appointmentData = {
      patientFirstName,
      patientLastName,
      contactPhone,
      contactEmail,
      animalCategory,
      animalBreed,
      notes,
      issueCategory,
      appointmentDateTime,
      clinicId: name, // Přímo použijeme `name` jako `clinicId`
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
            onValueChange={(value) =>
              setIssueCategory(
                value as
                  | "AKUTNI_PRIKLAD"
                  | "STRIHANI_DRAPKU"
                  | "KONTROLA"
                  | "OCKOVANI"
              )
            }
            defaultValue="AKUTNI_PRIKLAD"
          >
            <SelectTrigger>
              <SelectValue placeholder="Vyberte kategorii" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AKUTNI_PRIKLAD">Akutní případ</SelectItem>
              <SelectItem value="STRIHANI_DRAPKU">Stříhání drápku</SelectItem>
              <SelectItem value="KONTROLA">Kontrola</SelectItem>
              <SelectItem value="OCKOVANI">Očkování</SelectItem>
            </SelectContent>
          </Select>
        </div>
        //TODO: vytvořit vlastní komponent pro koplexní kalendář co řeší
        problematiku mazlíčka i doktora 
        
        //TODO: vlastní komponent pro komplexní
        kalendář, v části kdy klinika si vytváři web, přidat možnost vyplnit
        ordinační hodiny které se propíšou do kalendáře.

        
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

//TODO: SMS & E-mail Notifikace
//TODO: Toast notifikace a přesměrování
//TODO: Implementace systému dynamické pracovní doby s možností nastavení intervalů, typů služeb a blokování obsazených termínů
