import React from "react";
import clsx from "clsx";
import Image from "next/image";
import { StatusIcon } from "@/constants";

const StatusBadge = ({ status }: { status: Status }) => {
  return (
    <div
      className={clsx("status-badge", {
        "bg-green-600": status === "naplánovat",
        "bg-blue-600": status === "nevyřízene",
        "bg-red-600": status === "zrušit",
        "bg-gray-600": status === "vyřešeno",
      })}
    >
      <Image
        src={StatusIcon[status]}
        alt={status}
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-green-500": status === "naplánovat",
          "text-blue-500": status === "nevyřízene",
          "text-red-500": status === "zrušit",
          "text-white": status === "vyřešeno",
        })}
      >
        {status}
      </p>
    </div>
  );
};

export default StatusBadge;
