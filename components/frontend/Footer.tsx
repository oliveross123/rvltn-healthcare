import { InstagramIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function Footer() {
  return (
    <>
      <div className="mt-20 grid- grid-rows-2">
        <Link href="https://www.instagram.com/rvltn.cz/">
          <div className="flex items-center">
            <InstagramIcon
              className="cursor-pointer bg-from-green-500 bg-gradient-to-br from-purple-500 via-orange-500 to-pink-500 rounded"
              size={24} // Nastav velikost podle potřeby
            />{" "}
            <span className="ml-2">rvltn.cz</span>
          </div>
        </Link>
        <div className="flex items-center">
          <MailIcon className="mr-2 mt-2 text-white" size={24} />
          <span className="mt-1">jtrtik@rvltn.cz</span>
        </div>
      </div>
    </>
  );
}
