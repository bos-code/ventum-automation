"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select } from "@/components/ui/select";
import type { EnquiryStatus } from "@/types";
import { setEnquiryStatusAction } from "@/lib/actions/enquiries";

const OPTIONS: { value: EnquiryStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "resolved", label: "Resolved" },
];

export function EnquiryStatusSelect({
  id,
  status,
}: {
  id: string;
  status: EnquiryStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onChange(next: EnquiryStatus) {
    startTransition(async () => {
      const result = await setEnquiryStatusAction({ id, status: next });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <Select
      value={status}
      disabled={isPending}
      onChange={(e) => onChange(e.target.value as EnquiryStatus)}
      aria-label="Enquiry status"
      className="h-9 w-36"
    >
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}
