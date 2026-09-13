"use server";

import { revalidatePath } from "next/cache";
import { updateEnquiryStatus } from "@/lib/data/enquiries";
import type { EnquiryStatus } from "@/lib/types";

export async function changeEnquiryStatus(
  id: string,
  status: EnquiryStatus
): Promise<void> {
  await updateEnquiryStatus(id, status);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}
