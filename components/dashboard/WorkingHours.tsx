"use client";

import { useState, useEffect } from "react";
import {
  fetchWorkingHours,
  saveWorkingHours,
} from "../../lib/actions/workingHours";
import { toast } from "sonner";
import { Button } from "../ui/button";

const daysOfWeek = [
  "Pondělí",
  "Úterý",
  "Středa",
  "Čtvrtek",
  "Pátek",
  "Sobota",
  "Neděle",
];

export default function WorkingHoursForm({ siteId }: { siteId: string }) {
  const [workingHours, setWorkingHours] = useState(
    daysOfWeek.map((_, index) => ({
      dayOfWeek: index,
      isActive: false,
      openTime: "",
      closeTime: "",
    }))
  );

  useEffect(() => {
    async function loadWorkingHours() {
      const existingHours = await fetchWorkingHours(siteId);
      if (existingHours && existingHours.length > 0) {
        const updatedHours = daysOfWeek.map((_, index) => {
          const existingDay = existingHours.find(
            (hour) => hour.dayOfWeek === index
          );
          return existingDay
            ? {
                dayOfWeek: index,
                isActive: true,
                openTime: existingDay.openTime,
                closeTime: existingDay.closeTime,
              }
            : {
                dayOfWeek: index,
                isActive: false,
                openTime: "",
                closeTime: "",
              };
        });
        setWorkingHours(updatedHours);
      }
    }
    loadWorkingHours();
  }, [siteId]);

  const handleHoursChange = (
    index: number,
    field: keyof (typeof workingHours)[0],
    value: string | boolean
  ) => {
    const updatedHours = [...workingHours];
    updatedHours[index][field] = value as never;
    setWorkingHours(updatedHours);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeHours = workingHours.filter((day) => day.isActive);

    try {
      await saveWorkingHours({ siteId, workingHours: activeHours });
      toast.success("Pracovní doba byla úspěšně uložena!");
    } catch (error) {
      toast.error("Chyba při ukládání pracovní doby!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        {workingHours.map((day, index) => (
          <div key={index} className="flex items-center gap-4 border-b pb-4">
            {/* Den */}
            <label className="flex items-center w-1/4">
              <input
                type="checkbox"
                checked={day.isActive}
                onChange={(e) =>
                  handleHoursChange(index, "isActive", e.target.checked)
                }
                className="mr-2"
              />
              <span>{daysOfWeek[index]}</span>
            </label>

            {/* Časy */}
            {day.isActive && (
              <div className="flex items-center w-3/4 gap-4">
                <input
                  type="time"
                  value={day.openTime}
                  onChange={(e) =>
                    handleHoursChange(index, "openTime", e.target.value)
                  }
                  className="flex-1 border rounded px-2 py-1"
                />
                <span>-</span>
                <input
                  type="time"
                  value={day.closeTime}
                  onChange={(e) =>
                    handleHoursChange(index, "closeTime", e.target.value)
                  }
                  className="flex-1 border rounded px-2 py-1"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <Button type="submit" className="mt-4 bg-green-500">
        Uložit pracovní dobu
      </Button>
    </form>
  );
}
