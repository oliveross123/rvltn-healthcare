import { Calendar, CloudLightning, CloudRain, PenIcon } from "lucide-react";

const features = [
  {
    name: "Kartotéka a QR Kartičky pro pacienty",
    description:
      "Vygenerujte QR kartičky pro pacienty hned po kontrole přímo v systému. Odešlete pacientovi SMS s recepty a doporučením k léčbě",
    icon: CloudRain,
  },
  {
    name: "Jednoduché ovládání",
    description: "Intuitivní systém na pár kliknutí",
    icon: CloudLightning,
  },
  {
    name: "Automatizace Kalendáře",
    description:
      "Nastavte si doby kdy můžete přijímat pacienty a nechte je se sami objednávat",
    icon: Calendar,
  },
  {
    name: "CMS Modul",
    description:
      "Vytvořte si web kliniky a nechte systém pracovat za vás. Piště články, optimalizujte SEO a mnohem více",
    icon: PenIcon,
  },
];

export function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="max-w-2xl mx-auto lg:text-center">
        <p className="font-semibold leading-7 text-green-500">
          Operujte s čistou hlavou
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Zautomatizujte svůj chod kliniky a vyhněte se tak všedním problémům
        </h1>
        <p className="mt-6 text-base leading-snug text-muted-foreground">
          Díky rvltnCare si můžete zautomatizovat kalendář a domlouvání termínů.{" "}
          <br />
          <br />
          Můžete si vytvořit u nás web kliniky který celý process zautomatizuje
          díky sms nebo e-mail notifikacím!
          <br /> <br />
          Generujte QR kartičky pro zákazníky a mnohem více.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-16">
              <div className="text-base font-semibold leading-7">
                <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-green-500">
                  <feature.icon className="size-6 text-white" />
                </div>
                {feature.name}
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
