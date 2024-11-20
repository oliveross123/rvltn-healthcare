"use client";

import { useSearchParams } from "next/navigation";

export default function SearchBar() {
  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  // This will be logged on the server during the initial render
  // and on the client on subsequent navigations.
  console.log(search);

  return <>Search: {search}</>;
}
