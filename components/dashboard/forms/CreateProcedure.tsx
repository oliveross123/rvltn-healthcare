"use client";

import { FormEvent, useState } from "react";
import { createProcedure } from "@/lib/actions/procedures";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "../SubmitButtons";

interface CreateProcedureFormProps {
  siteId: string;
}

export default function CreateProcedureForm({
  siteId,
}: CreateProcedureFormProps) {
  // Deklarace stavových proměnných
  const [name, setName] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || duration <= 0) {
      alert("Zadejte název a dobu trvání procedury.");
      return;
    }

    try {
      await createProcedure({ name, duration, siteId });
      alert("Procedura byla úspěšně vytvořena.");
      setName("");
      setDuration(0);
    } catch (error) {
      console.error(error);
      alert("Došlo k chybě pri vytváření procedury.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-between gap-6 bg-card p-4 rounded-md"
    >
      {/* Název procedury */}
      <div className="flex flex-col w-1/3">
        <label htmlFor="name" className="shad-input-label mb-2">
          Název procedury:
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Název"
          className="shad-input"
        />
      </div>

      {/* Doba trvání */}
      <div className="flex flex-col w-1/4">
        <label htmlFor="duration" className="shad-input-label mb-2">
          Doba trvání (min):
        </label>
        <Input
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          placeholder="Doba trvání"
          className="shad-input"
        />
      </div>

      {/* Tlačítko odeslat */}
      <div className="flex flex-col items-center">
        <SubmitButton
          text="Přidat proceduru"
          variant="default"
          className="px-6 py-2 font-semibold text-sm mt-5"
        />
      </div>
    </form>
  );
}
