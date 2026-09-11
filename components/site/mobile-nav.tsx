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
          className="inline-flex size-11 items-center justify-center border border-[#d9dbe4] bg-white text-[#06065c] transition-colors hover:border-[#06065c] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={21} />
        </button>
      </DialogTrigger>

      <DialogContent className="inset-x-0 bottom-0 top-auto w-full max-w-none translate-x-0 translate-y-0 rounded-none border-x-0 border-b-0 p-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2">
        <div className="bg-[#06065c] px-5 pb-5 pt-6 text-white sm:px-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ed0101]">Ventum Global Automation</p>
          <DialogTitle className="mt-3 text-2xl font-semibold tracking-tight text-white">Explore</DialogTitle>
          <DialogDescription className="mt-2 max-w-sm text-sm leading-6 text-white/60">
            Electrical protection, control and automation equipment supplied from Lagos.
          </DialogDescription>
        </div>

        <nav aria-label="Mobile navigation" className="bg-white px-5 pb-2 sm:px-7">
          {items.map((item, index) => (
            <DialogClose asChild key={item.href}>
              <Link
                href={item.href}
                className="group grid min-h-[68px] grid-cols-[28px_1fr_24px] items-center gap-3 border-b border-[#d9dbe4] text-[#111322]"
              >
                <span className="font-mono text-[10px] text-[#8a8d98]">0{index + 1}</span>
                <span className="text-xl font-semibold tracking-tight">{item.label}</span>
                <ArrowUpRight size={19} className="text-[#ed0101] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </DialogClose>
          ))}
        </nav>

        <div className="flex items-center justify-between bg-[#f7f7f4] px-5 py-4 text-xs text-[#656879] sm:px-7">
          <span>Lagos, Nigeria</span>
          <span>Industrial supply</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
