// /app/api/clinics/register/route.ts

import { NextResponse } from "next/server";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";

export async function POST(req: Request) {
  try {
    // Ověření uživatele pomocí requireUser
    const user = await requireUser();

    // Přečtení dat z těla požadavku
    const body = await req.json();
    const { name, address, email, profileImage, phoneNumber } = body;

    if (!name || !address || !email) {
      return NextResponse.json(
        { error: "Name, address, and email are required" },
        { status: 400 }
      );
    }

    // Uložení nové kliniky do databáze
    const clinic = await prisma.clinic.create({
      data: {
        name,
        address,
        email,
        profileImage,
        phoneNumber,
        // Pokud chcete propojit kliniku s uživatelem, použijte user.id jako unikátní ID uživatele
        // userId: user.id,
      },
    });

    return NextResponse.json(clinic, { status: 201 });
  } catch (error) {
    console.error("Failed to register clinic:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
