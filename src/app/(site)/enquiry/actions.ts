"use server";

import { createEnquiry } from "@/lib/data/enquiries";
import type { CartItem } from "@/components/enquiry/enquiry-context";
import { formatPrice } from "@/lib/format";

export async function submitMultiProductEnquiry(
  items: CartItem[],
  customerDetails: { name: string; phone: string; note: string }
): Promise<{ success: boolean; message: string; whatsappUrl?: string }> {
  if (items.length === 0) {
    return { success: false, message: "Your enquiry list is empty." };
  }
  if (!customerDetails.name || !customerDetails.phone) {
    return { success: false, message: "Please provide your name and phone number." };
  }

  // Format the itemized list for the message body
  const itemListText = items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name}${item.model ? ` (${item.model})` : ""}\n   Quantity: ${item.quantity}${item.price ? `\n   Unit Price: ${formatPrice(item.price, item.currency)}` : ""}`
    )
    .join("\n\n");

  const fullMessage = `Enquiry List:\n\n${itemListText}${
    customerDetails.note ? `\n\nCustomer Note:\n${customerDetails.note}` : ""
  }`;

  try {
    await createEnquiry({
      productName: `Multiple Products (${items.length} items)`,
      customerName: customerDetails.name,
      phone: customerDetails.phone,
      quantity: items.reduce((sum, item) => sum + item.quantity, 0),
      message: fullMessage,
      source: "whatsapp", // using whatsapp as the eventual handoff destination
    });

    // Build the WhatsApp message payload
    let waMessage = `Hello Ventum,\n\nI'd like to enquire about the following products:\n\n${itemListText}\n\nName: ${customerDetails.name}`;
    if (customerDetails.note) {
      waMessage += `\nNote: ${customerDetails.note}`;
    }

    return {
      success: true,
      message: "Enquiry prepared successfully.",
      whatsappUrl: waMessage,
    };
  } catch (error) {
    console.error("Multi-product enquiry submission failed:", error);
    return { success: false, message: "Something went wrong saving the enquiry. You can still continue to WhatsApp." };
  }
}

