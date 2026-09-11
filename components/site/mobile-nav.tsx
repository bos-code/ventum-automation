"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface NavItem {
  href: string;
  label: string;
}

export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center border border-[#d9dbe4] text-[#06065c] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={21} />
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-none sm:rounded-none">
        <DialogTitle>Explore Ventum</DialogTitle>
        <DialogDescription>
          Electrical protection, control and automation supply.
        </DialogDescription>
        <nav
          aria-label="Mobile navigation"
          className="mt-4 border-t border-border"
        >
          {items.map((item) => (
            <DialogClose asChild key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-16 items-center justify-between border-b border-border text-xl font-medium tracking-tight"
              >
                {item.label}
                <ArrowUpRight size={20} />
              </Link>
            </DialogClose>
          ))}
        </nav>
        <p className="mt-4 text-sm text-muted-foreground">Lagos, Nigeria</p>
      </DialogContent>
    </Dialog>
  );
}
