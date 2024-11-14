"use client";

import { useState, useEffect } from "react";
import { createAppointment } from "@/lib/actions/appointments";
import { useParams } from "next/navigation"; // Correct use for Next.js 15 with app directory
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { cs } from "date-fns/locale";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function ReservationPage() {
  const params = useParams();
  const name = params?.name; // Fetch the `name` parameter safely

  const [formData, setFormData] = useState({
    patientFirstName: "",
    patientLastName: "",
    contactPhone: "",
    contactEmail: "",
    animalCategory: "Pes", // Default value
    animalBreed: "",
    notes: "",
    issueCategory: "Akutní případ", // Default value
    appointmentDateTime: new Date(),
    clinicId: "", // Will be set based on `name`
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch clinicId based on 'name' (subdirectory) once component mounts
  useEffect(() => {
    if (name) {
      // Fetch clinic data based on 'name'
      fetch(`/api/clinic-by-subdirectory?subdirectory=${name}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch clinic data");
          }
          return response.json();
        })
        .then((data) => {
          if (data?.clinicId) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              clinicId: data.clinicId,
            }));
          } else {
            setMessage("ID kliniky nebylo nalezeno.");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch clinicId", error);
          setMessage("Nepodařilo se načíst informace o klinice.");
        });
    }
  }, [name]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData({ ...formData, appointmentDateTime: date });
    }
  };

  const isWorkday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Translate values for animalCategory and issueCategory
    const translatedAnimalCategory =
      formData.animalCategory === "Pes"
        ? "PES"
        : formData.animalCategory === "Kočka"
        ? "KOCKA"
        : "JINE";

    const translatedIssueCategory =
      formData.issueCategory === "Akutní případ"
        ? "AKUTNI_PRIKLAD"
        : formData.issueCategory === "Stříhání drápku"
        ? "STRIHANI_DRAPKU"
        : formData.issueCategory === "Kontrola"
        ? "KONTROLA"
        : "OCKOVANI";

    try {
      const result = await createAppointment({
        ...formData,
        animalCategory: translatedAnimalCategory,
        issueCategory: translatedIssueCategory,
      });
      if (result.success) {
        setMessage("Rezervace byla úspěšně vytvořena!");
      } else {
        setMessage(`Chyba při vytváření rezervace: ${result.error}`);
      }
    } catch (error) {
      setMessage("Nastala chyba při odesílání dat.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-green-500">
        Rezervace termínu
      </h1>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Form elements */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Jméno
          </label>
          <input
            type="text"
            name="patientFirstName"
            value={formData.patientFirstName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Příjmení
          </label>
          <input
            type="text"
            name="patientLastName"
            value={formData.patientLastName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Telefon
          </label>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            E-mail
          </label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Kategorie zvířete
          </label>
          <TextField
            select
            name="animalCategory"
            value={formData.animalCategory}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            required
          >
            <MenuItem value="Pes">Pes</MenuItem>
            <MenuItem value="Kočka">Kočka</MenuItem>
            <MenuItem value="Jiné">Jiné</MenuItem>
          </TextField>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Plemeno
          </label>
          <input
            type="text"
            name="animalBreed"
            value={formData.animalBreed}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Poznámka
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            rows={3}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Kategorie problému
          </label>
          <TextField
            select
            name="issueCategory"
            value={formData.issueCategory}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            required
          >
            <MenuItem value="Akutní případ">Akutní případ</MenuItem>
            <MenuItem value="Stříhání drápku">Stříhání drápku</MenuItem>
            <MenuItem value="Kontrola">Kontrola</MenuItem>
            <MenuItem value="Očkování">Očkování</MenuItem>
          </TextField>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Datum a čas schůzky
          </label>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
            <DateTimePicker
              value={formData.appointmentDateTime}
              onChange={handleDateChange}
              shouldDisableDate={isWorkday}
              minTime={new Date(new Date().setHours(8, 0, 0, 0))}
              maxTime={new Date(new Date().setHours(17, 30, 0, 0))}
              disablePast
            />
          </LocalizationProvider>
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Odesílání..." : "Rezervovat"}
        </button>
      </form>
    </div>
  );
}
