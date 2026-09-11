"use server";

import type { ActionResult, EnquiryStatus } from "@/types";
import { assertAdmin } from "./guard";
import { enquiryStatusSchema } from "@/lib/validation/enquiry";
import { setEnquiryStatus } from "@/lib/appwrite/enquiries";

export async function setEnquiryStatusAction(
  input: unknown,
): Promise<ActionResult<{ status: EnquiryStatus }>> {
  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  const parsed = enquiryStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid request." };

  try {
    const enquiry = await setEnquiryStatus(parsed.data.id, parsed.data.status);
    return { ok: true, data: { status: enquiry.status } };
  } catch (error) {
    console.error("[enquiries] status update failed", error);
    return { ok: false, error: "Could not update the enquiry." };
  }
}
