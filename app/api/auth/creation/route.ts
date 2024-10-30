import prisma from "@/app/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    throw new Error("User not found");
  }

  // Hledáme kliniku podle ID uživatele
  let dbClinic = await prisma.clinic.findUnique({
    where: {
      id: user.id,
    },
  });

  // Pokud klinika neexistuje, vytvoříme novou
  if (!dbClinic) {
    dbClinic = await prisma.clinic.create({
      data: {
        id: user.id,
        name: user.given_name ?? "Unknown Clinic",
        email: user.email ?? "",
        address: "Unknown Address", // Add a default address or update with actual value if available
        profileImage:
          user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
        phoneNumber: null, // Defaulting to null if not available
      },
    });
  }

  return NextResponse.redirect("http://localhost:3000/dashboard");
}
