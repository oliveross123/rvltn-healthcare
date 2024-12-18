"use client";

import { DeleteSite } from "@/app/actions";
import { UploadImageForm } from "@/components/dashboard/forms/UploadImageForm";
import { SubmitButton } from "@/components/dashboard/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import CreateProcedureForm from "@/components/dashboard/forms/CreateProcedure";
import ProcedureList from "@/components/dashboard/forms/ProcedureForm";

export default function SettingsSiteRoute() {
  const params = useParams();
  const siteId = Array.isArray(params.siteId)
    ? params.siteId[0]
    : params.siteId;

  if (!siteId) {
    // Handle the case where siteId is undefined
    return <p>Error: Site ID not found</p>;
  }

  return (
    <>
      <div className="flex items-center gap-x-2">
        <Button variant="outline" size="icon">
          <Link href={`/dashboard/sites/${siteId}`}>
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h3 className="text-xl font-semibold">Go back</h3>
      </div>

      <UploadImageForm siteId={siteId} />

      <Card className="">
        <CardHeader>
          <CardTitle className="">Kategorie Procedur</CardTitle>
          <CardDescription>
            Vaše klinika může mít až 10 procedur. Procedury slouží k organizaci
            a automatizaci vaší kliniky, jsou vyzobrazovaný v rezervačním
            formulaří pacinetů. <br />
            <span className="text-red-500">
              Pokud potřebujete více kategorii kontaktuje podporu
            </span>
          </CardDescription>
        </CardHeader>
        <ProcedureList siteId={siteId} />
        <CardFooter>
          <CreateProcedureForm siteId={siteId} />
        </CardFooter>
      </Card>

      <Card className="border-red-500 bg-red-500/10">
        <CardHeader>
          <CardTitle className="text-red-500">Danger</CardTitle>
          <CardDescription>
            This will delete your site and all articles associated with it.
            Click the button below to delete everything.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <form action={DeleteSite}>
            <input type="hidden" name="siteId" value={siteId} />
            <SubmitButton text="Delete everything" variant="destructive" />
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
