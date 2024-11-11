import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/ikona_negativ.svg";
import { Button } from "../ui/button";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import HeroImage from "@/public/assets/images/hero-dashboard2.png";

export function Hero() {
  return (
    <>
      <div className="relative flex flex-col w-full py-5 mx-auto md:flex-row md:items-center md:justify-between">
        <div className="flex flex-row items-center justify-between text-sm lg:justify-start">
          <Link href="/" className="flex items-center gap-2">
            {/* <Image src={Logo} className="size-10  rounded" alt="Logo" /> */}

            <h4 className=" rounded text-lg md:text-2xl font-semibold bg-gradient-to-br from-green-500 via-green-500 to-dark-500 ">
              rvltnCare
            </h4>
          </Link>

          {/* <div className="md:hidden">
                <ThemeToggle /> Je třeba dodělat, není hotov - je potřeba pak přepsat celou stylizaci aby byla v pořádku aby seděl kontrast barev!
          </div> */}
        </div>
        <nav className="hidden md:flex md:justify-end md:space-x-4">
          {/* <ThemeToggle /> */}

          <LoginLink>
            <Button variant="secondary">Přihlásit</Button>
          </LoginLink>
          <RegisterLink>
            <Button>Registrovat</Button>
          </RegisterLink>
        </nav>
      </div>

      <section className="relative flex items-center justify-center">
        <div className="relative items-center w-full py-12 lg:py-20">
          <div className="text-center">
            <span className="text-sm text-primary font-medium tracking-tight bg-green-500/40 px-4 py-2 rounded-full ">
              Profesionální rezervační a informační systém pro veterinární
              kliniky
            </span>

            <h1 className="mt-8 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-none">
              Automatizujte všední rutinu
              <span className="block text-green-500 mt-2">
                Během několika minut!
              </span>
            </h1>
            <p className="max-w-xl mx-auto mt-4 text-base font-light lg:text-lg text-muted-foreground tracking-tight">
              Vést kliniku není jednoduché, ale s námi to bude hračka. Zbavte se
              denních problémů a nechte nás o vše postarat.
            </p>
            <div className="flex items-center gap-x-5 w-full justify-center mt-5">
              <LoginLink>
                <Button variant="secondary">Přihlásit</Button>
              </LoginLink>
              <RegisterLink>
                <Button>Vyzkoušet zdarma!</Button>
              </RegisterLink>
            </div>
          </div>

          <div className="relative items-center w-full py-12 mx-auto mt-12">
            <svg
              className="absolute -mt-24 blur-3xl"
              fill="none"
              viewBox="0 0 400 400"
              height="100%"
              width="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_10_20)">
                <g filter="url(#filter0_f_10_20)">
                  <path
                    d="M128.6 0H0V322.2L106.2 134.75L128.6 0Z"
                    fill="#24ae7c"
                  ></path>
                  <path
                    d="M0 322.2V400H240H320L106.2 134.75L0 322.2Z"
                    fill="#24ae7c"
                  ></path>
                  <path
                    d="M320 400H400V78.75L106.2 134.75L320 400Z"
                    fill="#24ae7c"
                  ></path>
                  <path
                    d="M400 0H128.6L106.2 134.75L400 78.75V0Z"
                    fill="#24ae7c"
                  ></path>
                </g>
              </g>
              <defs>
                <filter
                  colorInterpolationFilters="sRGB"
                  filterUnits="userSpaceOnUse"
                  height="720.666"
                  id="filter0_f_10_20"
                  width="720.666"
                  x="-160.333"
                  y="-160.333"
                >
                  <feFlood
                    floodOpacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feBlend
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    mode="normal"
                    result="shape"
                  ></feBlend>
                  <feGaussianBlur
                    result="effect1_foregroundBlur_10_20"
                    stdDeviation="77.1666"
                  ></feGaussianBlur>
                </filter>
              </defs>
            </svg>
            <Image
              src={HeroImage}
              alt="Hero image"
              className="relative object-cover w-full border rounded-lg shadow-2xl lg:rounded-2xl"
            />
          </div>
        </div>
      </section>
    </>
  );
}
