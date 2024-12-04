import { signIn } from "@/lib/auth";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import Logo from "@/public/ikona_negativ.svg";
import Image from "next/image";
import { GoogleAuthButton } from "./dashboard/SubmitButtons";

export function AuthModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Try for free</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader className="flex flex-row items-center gap-2">
          <Image src={Logo} alt="Logo" className="size-10" />
          <h4 className="text-3xl font-semibold">
            rvltn<span className="text-primary">Care.io</span>
          </h4>
        </DialogHeader>
        <div className="flex flex-col mt-5">
          <form
            action={async () => {
              "use server";

              await signIn("google");
            }}
            className="w-full"
          >
            <GoogleAuthButton />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
