"use client";

import { useState } from "react";
import { ArrowUpRight, MessageCircle, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { productWhatsappMessage } from "@/lib/whatsapp";

interface ProductActionsProps {
  productId: string;
  name: string;
  model: string | null;
  price: number | null;
  currency: string;
  whatsappNumber: string;
}

export function ProductActions({
  productId,
  name,
  model,
  price,
  currency,
  whatsappNumber,
}: ProductActionsProps) {
  const [open, setOpen] = useState(false);
  const whatsappMessage = productWhatsappMessage({ name, model, price, currency });

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="group inline-flex min-h-12 items-center justify-between gap-5 bg-[#ed0101] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#c90000] sm:flex-1"
          >
            <span className="inline-flex items-center gap-3">
              <Send size={16} aria-hidden="true" />
              Request product
            </span>
            <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[88dvh] overflow-y-auto rounded-none border-0 p-0 sm:max-w-xl sm:rounded-none">
          <div className="bg-[#06065c] px-6 py-7 text-white sm:px-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold tracking-tight text-white">
                Request {name}
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-6 text-white/65">
                Send us your details and the sales team will confirm price and availability.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 sm:p-8">
            <EnquiryForm
              productId={productId}
              productName={name}
              whatsappNumber={whatsappNumber}
              whatsappMessage={whatsappMessage}
              onSuccess={() => setOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <WhatsAppLink
        number={whatsappNumber}
        message={whatsappMessage}
        variant="secondary"
        size="lg"
        className="min-h-12 rounded-none border border-[#d9dbe4] bg-white px-5 text-[#111322] hover:border-[#06065c] hover:bg-white sm:flex-1"
        showIcon={false}
      >
        <MessageCircle size={16} aria-hidden="true" />
        Chat on WhatsApp
      </WhatsAppLink>

      <div className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-2 gap-2 border-t border-[#d9dbe4] bg-white/96 px-3 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_rgba(3,3,59,0.08)] backdrop-blur sm:hidden">
        <button
          type="button"
          className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#ed0101] px-3 text-sm font-semibold text-white"
          onClick={() => setOpen(true)}
        >
          <Send size={15} aria-hidden="true" />
          Request
        </button>
        <WhatsAppLink
          number={whatsappNumber}
          message={whatsappMessage}
          variant="secondary"
          size="md"
          className="min-h-12 rounded-none border border-[#06065c]/15 bg-[#06065c] text-white hover:bg-[#03033b] hover:text-white"
          showIcon={false}
        >
          <MessageCircle size={15} aria-hidden="true" />
          WhatsApp
        </WhatsAppLink>
      </div>
    </div>
  );
}
