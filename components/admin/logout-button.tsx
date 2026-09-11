"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="text-white/85 hover:bg-white/10 hover:text-white"
      >
        <LogOut aria-hidden="true" />
        Sign out
      </Button>
    </form>
  );
}
