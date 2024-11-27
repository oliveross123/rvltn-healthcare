import { DeleteSite } from "@/app/actions";
import { UploadImageForm } from "@/components/dashboard/forms/UploadImageForm";
import { SubmitButton } from "@/components/dashboard/SubmitButtons";
import WorkingHoursForm from "@/components/dashboard/WorkingHours";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardContent } from "@mui/material";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsSiteRoute({
  params,
}: {
  params: { siteId: string };
}) {
  return (
    <>
      <div className="flex items-center gap-x-2">
        <Button variant="outline" size="icon">
          <Link href={`/dashboard/sites/${params.siteId}`}>
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h3 className="text-xl font-semibold">Zpět</h3>
      </div>

      <UploadImageForm siteId={params.siteId} />

      <Card className="flex">
        <CardHeader>
          <CardTitle className="text-white">Pracovní doba</CardTitle>
          <CardDescription className="text-green-500">
            Doporučujeme nastavit vaše ordinační hodiny zde pro kompletní
            automatizaci.
          </CardDescription>

          <CardContent className="grid grid-cols-2 ">
            <WorkingHoursForm siteId={params.siteId} />{" "}
            {/* Správné předání siteId */}
          </CardContent>
        </CardHeader>
      </Card>

      <Card className="border-red-500 bg-red-500/10">
        <CardHeader>
          <CardTitle className="text-red-500">Pozor !</CardTitle>
          <CardDescription>
            Tohle je nevratná akce, pokud smažete web, nebudete jej moci
            obnovit.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <form action={DeleteSite}>
            <input type="hidden" name="siteId" value={params.siteId} />
            <SubmitButton text="Smazat vše" variant="destructive" />
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
