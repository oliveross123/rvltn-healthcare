"use client";

import Image from "next/image";
import PatientForm from "@/components/forms/PatientForm";
import Link from "next/link";
import PasskeyModal from "@/components/PasskeyModal";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Home = () => {
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

  useEffect(() => {
    // Nastaví `isClient` na true po renderování na klientu
    setIsClient(true);
  }, []);

  return (
    <div className="flex h-screen max-h-screen">
      {isClient && isAdmin && <PasskeyModal />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <div className="-mt-10 max-w-[120ox]">
            <Link
              href={"/"}
              className="-mt-10 text-lg md:text-2xl font-semibold bg-gradient-to-br from-green-500 via-green-500 to-dark-500"
            >
              rvltnCare
            </Link>
          </div>

          <PatientForm />

          <div
            className="text-14-regular mt-20 flex 
          justify-between"
          >
            <Link href="/welcome" className="text-red-500">
              Nový DASHBOARD !
            </Link>
            <Link href="/?admin=true" className="text-green-500">
              Admin <span className="text-white"> 123456</span>
            </Link>
          </div>
        </div>

        <footer>
          <p className="justify-items-end text-dark-600 xl:text-left">
            © 2024 rvltn.cz | rvltnCare
          </p>
        </footer>
      </section>

      {isClient && (
        <Image
          src="/assets/images/onboarding-img.png"
          height={1000}
          width={1000}
          alt="patient"
          className="side-img max-w-[50%]"
        />
      )}
    </div>
  );
};

export default Home;
