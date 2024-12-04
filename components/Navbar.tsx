import Link from "next/link";
import Logo from "@/public/ikona_negativ.svg";
import Image from "next/image";
import { Button } from "./ui/button";
import { AuthModal } from "./AuthModal";

export function Navbar() {
  return (
    <div className="relative flex flex-col w-full py-5 mx-auto md:flex-row md:items-center md:justify-between">
      <Link href="/Nylas" className="flex items-center gap-2">
        <h3 className="text-3xl mb-5 font-semibold">
          rvltn<span className="text-green-400">Care.io</span>
        </h3>
      </Link>

      <AuthModal />
    </div>
  );
}
