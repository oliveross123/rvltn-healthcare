import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date | string) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "cs-CZ",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "cs-CZ",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "cs-CZ",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "cs-CZ",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// Restrict to weekdays (Monday to Friday)
export const isWorkday = (date: Date) => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Only Monday to Friday
};

// Disable past dates
export const isFutureDate = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison
  return date >= today; // Only allow today and future dates
};

// Restrict hours to 8:00 - 15:30
export const filterWorkdayHours = (time: Date) => {
  const hour = time.getHours();
  const minute = time.getMinutes();
  return (hour >= 8 && hour < 15) || (hour === 15 && minute <= 30);
};

export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}
