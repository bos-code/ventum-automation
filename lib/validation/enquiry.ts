import { z } from "zod";

const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(30, "Phone number is too long")
  .regex(/^[+()\d][\d\s()+-]*$/, "Enter a valid phone number");

/**
 * Product enquiry from the "Request Product" form. Used by both the
 * client form (react-hook-form) and the server action.
 *
 * - `productId` is echoed by the client but never trusted — the server
 *   re-loads the product to snapshot its real name / model / price.
 * - `company` is a honeypot: bots fill it, humans never see it.
 */
export const enquiryFormSchema = z.object({
  productId: z.string().trim().min(1).max(64),
  customerName: z
    .string()
    .trim()
    .min(2, "Enter your name")
    .max(120, "Name is too long"),
  phone,
  quantity: z
    .number({ error: "Enter a quantity" })
    .int("Enter a whole number")
    .min(1, "Quantity must be at least 1")
    .max(100000, "That quantity looks too large"),
  message: z.string().trim().max(2000, "Message is too long").optional(),
  company: z.string().max(0).optional(),
});

/** Field shape the enquiry form binds to. */
export type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;

/** Admin: change an enquiry's status. */
export const enquiryStatusSchema = z.object({
  id: z.string().trim().min(1).max(64),
  status: z.enum(["new", "contacted", "resolved"]),
});
