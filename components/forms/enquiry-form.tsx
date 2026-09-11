"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/forms/field";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import {
  enquiryFormSchema,
  type EnquiryFormValues,
} from "@/lib/validation/enquiry";
import { submitEnquiry } from "@/lib/actions/enquiry";

interface EnquiryFormProps {
  productId: string;
  productName: string;
  whatsappNumber: string;
  whatsappMessage: string;
  onSuccess?: () => void;
}

export function EnquiryForm({
  productId,
  productName,
  whatsappNumber,
  whatsappMessage,
  onSuccess,
}: EnquiryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      productId,
      customerName: "",
      phone: "",
      quantity: 1,
      message: "",
      company: "",
    },
  });

  async function onSubmit(values: EnquiryFormValues) {
    const result = await submitEnquiry(values);

    if (result.ok) {
      toast.success("Enquiry sent", {
        description: "We'll get back to you shortly with price and availability.",
      });
      reset();
      onSuccess?.();
      return;
    }

    if (result.fieldErrors) {
      for (const [key, messages] of Object.entries(result.fieldErrors)) {
        if (messages?.[0]) {
          setError(key as keyof EnquiryFormValues, { message: messages[0] });
        }
      }
    }
    toast.error("Could not send enquiry", { description: result.error });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <input type="hidden" {...register("productId")} />
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="enquiry-company">Company (leave blank)</label>
        <input
          id="enquiry-company"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>

      <Field label="Your name" required error={errors.customerName?.message}>
        {(props) => (
          <Input
            {...props}
            {...register("customerName")}
            autoComplete="name"
            placeholder="e.g. Emeka Okafor"
          />
        )}
      </Field>

      <Field
        label="WhatsApp / phone number"
        required
        error={errors.phone?.message}
        hint="We'll use this to reply with price and availability."
      >
        {(props) => (
          <Input
            {...props}
            {...register("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="e.g. 0803 000 0000"
          />
        )}
      </Field>

      <Field label="Quantity" required error={errors.quantity?.message}>
        {(props) => (
          <Input
            {...props}
            {...register("quantity", { valueAsNumber: true })}
            type="number"
            min={1}
            step={1}
            className="w-32"
          />
        )}
      </Field>

      <Field
        label="Message"
        error={errors.message?.message}
        hint="Optional — anything else we should know."
      >
        {(props) => (
          <Textarea
            {...props}
            {...register("message")}
            rows={3}
            placeholder={`I'd like to enquire about the ${productName}.`}
          />
        )}
      </Field>

      <div className="flex flex-col gap-2 pt-1 sm:flex-row">
        <Button type="submit" disabled={isSubmitting} className="sm:flex-1">
          {isSubmitting ? "Sending…" : "Send enquiry"}
        </Button>
        <WhatsAppLink
          number={whatsappNumber}
          message={whatsappMessage}
          variant="secondary"
          className="sm:flex-1"
        >
          WhatsApp instead
        </WhatsAppLink>
      </div>
    </form>
  );
}
