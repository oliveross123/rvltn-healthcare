import React from "react";
import clsx from "clsx";
import Image from "next/image";

interface StatCardProps {
  type: "naplánovat" | "nevyřízene" | "zrušit";
  count: number;
  label: string;
  icon: string;
}

const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
  return (
    <div
      className={clsx("stat-card", {
        "bg-naplánovat": type === "naplánovat",
        "bg-nevyřízene": type === "nevyřízene",
        "bg-zrušit": type === "zrušit",
      })}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          height={32}
          width={32}
          alt={label}
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold">{count}</h2>
      </div>

      <p className="text-14-regular">{label}</p>
    </div>
  );
};

export default StatCard;
