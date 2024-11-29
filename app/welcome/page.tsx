import React from "react";
import { Button } from "@/components/ui/button";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";

export default async function page() {
  const { getUser } = getKindeServerSession();
  const session = await getUser();
  return (
    <div className="pt-10">
      <h1>Vítejte</h1>

      {session ? (
        <LogoutLink>
          <Button>Odhlásit se</Button>
        </LogoutLink>
      ) : (
        <div>
          <RegisterLink>
            <Button>Registrovat se</Button>
          </RegisterLink>
          <LoginLink>
            <Button>Přihlásit se</Button>
          </LoginLink>
        </div>
      )}
    </div>
  );
}
