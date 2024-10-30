import { FileIcon, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

interface iAppProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

export function EmptyState({
  buttonText,
  title,
  description,
  href,
}: iAppProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-mg border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex size-20 items-center justify-center rounded-full bg-green-400/30">
        <FileIcon className="size-10 text-primary" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">{title}</h2>
      <p className="mb-8 mt-2 text-center text-small leading-tight text-muted-foreground max-w-sm mx-auto">
        {description}
      </p>

      <Button asChild className="bg-green-400/70">
        <Link href={href}>
          <div className="flex items-center">
            <PlusCircle className="mr-2 size-4" />
            <span>{buttonText}</span>
          </div>
        </Link>
      </Button>
    </div>
  );
}
