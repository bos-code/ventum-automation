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
import { AddToEnquiryButton } from "@/components/catalog/enquiry-selection";
import { productWhatsappMessage } from "@/lib/whatsapp";

interface ProductActionsProps {
  productId: string;
  slug: string;
  brand: string;
  name: string;
  model: string | null;
  price: number | null;
  currency: string;
  whatsappNumber: string;
}

export function ProductActions({
  productId,
  slug,
  brand,
  name,
  model,
  price,
  currency,
  whatsappNumber,
}: ProductActionsProps) {
  const [open, setOpen] = useState(false);
  const whatsappMessage = productWhatsappMessage({ name, model, price, currency });
  const selectionProduct = { id: productId, slug, brand, name, model, price, currency };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <WhatsAppLink
          number={whatsappNumber}
          message={whatsappMessage}
          variant="secondary"
          size="lg"
          className="min-h-12 rounded-none border-0 bg-[#ed0101] px-5 text-white hover:bg-[#c90000] hover:text-white"
          showIcon={false}
        >
          <MessageCircle size={16} aria-hidden="true" />
          Discuss on WhatsApp
        </WhatsAppLink>

        <AddToEnquiryButton
          product={selectionProduct}
          className="min-h-12"
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="group inline-flex min-h-11 items-center justify-between gap-5 px-1 text-sm font-semibold text-[#06065c] hover:text-[#ed0101]"
          >
            <span className="inline-flex items-center gap-2">
              <Send size={15} aria-hidden="true" />
              Send a formal product request
            </span>
            <ArrowUpRight size={16} />
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[88dvh] overflow-y-auto rounded-none border-0 p-0 sm:max-w-xl sm:rounded-none">
          <div className="border-b border-[#d9dbe4] bg-[#f8f8f5] px-6 py-7 sm:px-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold tracking-tight text-[#111322]">
                Request {name}
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-6 text-[#656879]">
                Send your details and quantity. The sales team will respond with availability and supply details.
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

      <div className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-2 gap-2 border-t border-[#d9dbe4] bg-white/96 px-3 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_rgba(17,19,34,0.08)] backdrop-blur sm:hidden">
        <AddToEnquiryButton product={selectionProduct} compact className="min-h-12" />
        <WhatsAppLink
          number={whatsappNumber}
          message={whatsappMessage}
          variant="secondary"
          size="md"
          className="min-h-12 rounded-none border-0 bg-[#ed0101] text-white hover:bg-[#c90000] hover:text-white"
          showIcon={false}
        >
          <MessageCircle size={15} aria-hidden="true" />
          WhatsApp
        </WhatsAppLink>
      </div>
    </div>
  );
}
