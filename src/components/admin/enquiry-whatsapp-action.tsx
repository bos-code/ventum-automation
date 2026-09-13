"use client";

import { useTransition } from "react";
import type { EnquiryStatus } from "@/lib/types";

interface EnquiryWhatsAppActionProps {
  enquiryId: string;
  customerName: string;
  phone: string;
  productName: string;
  quantity: number;
  currentStatus: EnquiryStatus;
  onStatusChange?: (id: string, status: EnquiryStatus) => Promise<void>;
}

export function formatWhatsAppNumber(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  // Nigerian format: 080... or 070... or 090... or 081... (11 digits starting with 0)
  if (digits.startsWith("0") && digits.length === 11) {
    return `234${digits.slice(1)}`;
  }
  if (digits.startsWith("234")) {
    return digits;
  }
  return digits;
}

export function EnquiryWhatsAppAction({
  enquiryId,
  customerName,
  phone,
  productName,
  quantity,
  currentStatus,
  onStatusChange,
}: EnquiryWhatsAppActionProps) {
  const [isPending, startTransition] = useTransition();
  const cleanPhone = formatWhatsAppNumber(phone);

  const message = `Hello ${customerName}, thank you for reaching out to Ventum Automation regarding your enquiry for ${productName} (${quantity} unit${
    quantity > 1 ? "s" : ""
  }). How can we assist you with your order?`;

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  function handleClick() {
    // Open WhatsApp in new window/tab
    window.open(waUrl, "_blank", "noopener,noreferrer");

    // Auto-mark as responded if currently 'new' or 'read'
    if (
      onStatusChange &&
      (currentStatus === "new" || currentStatus === "read")
    ) {
      startTransition(async () => {
        try {
          await onStatusChange(enquiryId, "responded");
        } catch (err) {
          console.error("Failed to auto-update enquiry status to responded:", err);
        }
      });
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      title={`Open WhatsApp chat with ${customerName}`}
    >
      <svg
        className="h-4 w-4 fill-current"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29" />
      </svg>
      <span>Reply via WhatsApp</span>
      {isPending && <span className="text-[10px] opacity-75">Updating...</span>}
    </button>
  );
}

