import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subdirectory = searchParams.get("subdirectory");

  console.log("Received subdirectory:", subdirectory);

  if (!subdirectory) {
    return NextResponse.json(
      { error: "Subdirectory is required" },
      { status: 400 }
    );
  }

  try {
    const clinic = await prisma.site.findUnique({
      where: { subdirectory },
      include: { User: true },
    });

    console.log("Clinic data fetched:", clinic);

    if (!clinic || !clinic.User) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    return NextResponse.json({ clinicId: clinic.User.id });
  } catch (error) {
    console.error("Error fetching clinic:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
