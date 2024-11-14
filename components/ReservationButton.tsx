import Link from "next/link";
import { Button } from "./ui/button";

interface ReservationButtonProps {
  clinicName: string; // Dynamický parametr pro název kliniky
}

export function ReservationButton({ clinicName }: ReservationButtonProps) {
  return (
    // Přesměrování na formulář rezervace s dynamickým názvem kliniky
    <Link href={`/blog/${clinicName}/reservation`}>
      <Button className="bg-green-500 hover-smooth:bg-green-700 text-white font-bold py-2 px-4 rounded ml-10 hover:bg-gray-200/40">
        Ask for reservation
      </Button>
    </Link>
  );
}
