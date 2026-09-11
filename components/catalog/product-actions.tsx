"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          <Button size="lg" className="sm:flex-1">
            <Send aria-hidden="true" />
            Request product
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request {name}</DialogTitle>
            <DialogDescription>
              Send us your details and we&apos;ll confirm price and availability.
            </DialogDescription>
          </DialogHeader>
          <EnquiryForm
            productId={productId}
            productName={name}
            whatsappNumber={whatsappNumber}
            whatsappMessage={whatsappMessage}
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <WhatsAppLink
        number={whatsappNumber}
        message={whatsappMessage}
        variant="secondary"
        size="lg"
        className="sm:flex-1"
        showIcon={false}
      >
        <MessageCircle aria-hidden="true" />
        Chat on WhatsApp
      </WhatsAppLink>
    </div>
  );
}
