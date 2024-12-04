"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  fetchIssueCategory,
  saveIssueCategory,
} from "@/lib/actions/issueCategory";

const DefaultCategories = [
  { id: "0", name: "Vstupní vyšetření", duration: "30min" },
  { id: "1", name: "Kontrola", duration: "20min" },
  { id: "2", name: "Očkování", duration: "10min" },
  { id: "3", name: "Konzultace", duration: "10min" },
  { id: "4", name: "Drápky, žlázky", duration: "15min" },
  { id: "5", name: "Kašel, kýchání", duration: "30min" },
  { id: "6", name: "Stomatologická konzultace", duration: "30min" },
  { id: "7", name: "Kulhání", duration: "30min" },
  { id: "8", name: "Jiné", duration: "20min" },
];

interface IssueCategory {
  id: string; // UUID or predefined string ID
  name: string;
  duration: string;
}

export default function ServiceCategoriesForm({ siteId }: { siteId: string }) {
  const [categories, setCategories] = useState<IssueCategory[]>([]);
  const [newCategory, setNewCategory] = useState<IssueCategory>({
    id: "",
    name: "",
    duration: "",
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const existingCategories = await fetchIssueCategory(siteId);

        // Sloučení výchozích a existujících kategorií
        const mergedCategories = DefaultCategories.map((defaultCat) => {
          const existingCat = existingCategories.find(
            (cat) => cat.id === defaultCat.id
          );
          return existingCat || defaultCat;
        }).concat(
          existingCategories.filter(
            (cat) =>
              !DefaultCategories.some((defaultCat) => defaultCat.id === cat.id)
          )
        );

        setCategories(mergedCategories);
      } catch (error) {
        toast.error("Chyba při načítání kategorií!");
      }
    }
    loadCategories();
  }, [siteId]);

  const handleCategoryChange = (
    id: string,
    field: keyof IssueCategory,
    value: string
  ) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, [field]: value } : category
      )
    );
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.duration) {
      toast.error("Vyplňte název a délku trvání nové kategorie!");
      return;
    }

    const newId = crypto.randomUUID(); // Generování unikátního ID pro nové kategorie
    setCategories((prev) => [...prev, { ...newCategory, id: newId }]);
    setNewCategory({ id: "", name: "", duration: "" });
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Uložíme všechny kategorie, včetně změněných výchozích kategorií
      await saveIssueCategory({ siteId, issueCategory: categories });
      toast.success("Kategorie byly úspěšně uloženy!");
    } catch (error) {
      toast.error("Chyba při ukládání kategorií!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center gap-4 border-b pb-4"
          >
            {/* Název kategorie */}
            <input
              type="text"
              value={category.name}
              onChange={(e) =>
                handleCategoryChange(category.id, "name", e.target.value)
              }
              placeholder="Název kategorie"
              className="flex-1 border rounded px-2 py-1"
            />
            {/* Délka trvání */}
            <input
              type="text"
              value={category.duration}
              onChange={(e) =>
                handleCategoryChange(category.id, "duration", e.target.value)
              }
              placeholder="Délka (např. 30min)"
              className="flex-1 border rounded px-2 py-1"
            />
            <Button
              type="button"
              onClick={() => handleDeleteCategory(category.id)}
              className="bg-red-500"
            >
              Smazat
            </Button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4">
        {/* Přidání nové kategorie */}
        <input
          type="text"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Nová kategorie"
          className="flex-1 border rounded px-2 py-1"
        />
        <input
          type="text"
          value={newCategory.duration}
          onChange={(e) =>
            setNewCategory((prev) => ({ ...prev, duration: e.target.value }))
          }
          placeholder="Délka (např. 30min)"
          className="flex-1 border rounded px-2 py-1"
        />
        <Button type="button" onClick={handleAddCategory} className="bg-white">
          Přidat
        </Button>
      </div>
      <Button type="submit" className="mt-4 bg-green-500">
        Uložit kategorie
      </Button>
    </form>
  );
}
