"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useEnquiry } from "./enquiry-context";
import { submitMultiProductEnquiry } from "@/app/(site)/enquiry/actions";
import { formatPrice } from "@/lib/format";
import { productImageUrl } from "@/lib/appwrite/images";

export function EnquiryDrawer({ whatsappNumber }: { whatsappNumber: string }) {
  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
    removeItem,
    updateQuantity,
    clearCart,
  } = useEnquiry();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Lock body scroll when open
  useEffect(() => {
    if (!isDrawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isDrawerOpen, setDrawerOpen]);

  if (!isDrawerOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    
    setStatus("submitting");
    setErrorMsg("");

    const res = await submitMultiProductEnquiry(items, { name, phone, note });

    if (res.whatsappUrl) {
      // Handoff to WhatsApp
      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(res.whatsappUrl)}`;
      window.open(waUrl, "_blank");
      
      // Reset and close
      clearCart();
      setDrawerOpen(false);
      setStatus("idle");
      setName("");
      setPhone("");
      setNote("");
    } else {
      setStatus("error");
      setErrorMsg(res.message);
    }
  };

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
        className="fixed inset-0 z-[100] bg-navy-950/60 backdrop-blur-sm transition-opacity"
      />

      <div
        role="dialog"
        aria-label="Enquiry List"
        className="fixed inset-y-0 right-0 z-[101] flex w-full max-w-md flex-col bg-navy-950 border-l border-white/10 shadow-2xl transition-transform sm:w-[400px]"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
          <h2 className="font-display text-lg font-bold text-offwhite">
            Enquiry List ({items.length})
          </h2>
          <button
            type="button"
            className="rounded-md text-steel-400 hover:text-white focus-visible:outline-2 focus-visible:outline-ventum-blue-500"
            onClick={() => setDrawerOpen(false)}
          >
            <span className="sr-only">Close panel</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-steel-400">Your enquiry list is empty.</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="mt-4 font-semibold text-ventum-blue-400 hover:text-ventum-blue-300"
              >
                Continue browsing &rarr;
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-white/5 border border-white/10">
                    {item.imageIds[0] ? (
                      <Image
                        src={productImageUrl(item.imageIds[0])}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-navy-900" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-offwhite text-sm line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs text-steel-400 font-mono">
                        {item.brand} {item.model ? `· ${item.model}` : ""}
                      </p>
                      {item.price && (
                        <p className="mt-1 text-sm font-bold text-offwhite">
                          {formatPrice(item.price, item.currency)}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded border border-white/10 bg-navy-900">
                        <button
                          type="button"
                          className="px-2 py-1 text-steel-400 hover:text-white"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          &minus;
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-offwhite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="px-2 py-1 text-steel-400 hover:text-white"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-medium text-ventum-red-400 hover:text-ventum-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/10 bg-navy-900/50 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="drawer-name" className="sr-only">Name</label>
                  <input
                    id="drawer-name"
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="h-10 w-full rounded border border-white/10 bg-navy-900 px-3 text-sm text-offwhite focus-visible:outline-2 focus-visible:outline-ventum-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="drawer-phone" className="sr-only">Phone</label>
                  <input
                    id="drawer-phone"
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone/WhatsApp"
                    className="h-10 w-full rounded border border-white/10 bg-navy-900 px-3 text-sm text-offwhite focus-visible:outline-2 focus-visible:outline-ventum-blue-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="drawer-note" className="sr-only">Optional note</label>
                <input
                  id="drawer-note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional note / Company"
                  className="h-10 w-full rounded border border-white/10 bg-navy-900 px-3 text-sm text-offwhite focus-visible:outline-2 focus-visible:outline-ventum-blue-500"
                />
              </div>

              {status === "error" && (
                <p className="text-xs text-ventum-red-400">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-2 h-11 w-full rounded bg-ventum-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-ventum-red-500 disabled:opacity-50"
              >
                {status === "submitting" ? "Preparing..." : "Send via WhatsApp"}
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="text-xs text-steel-400 hover:text-white"
              >
                Continue browsing
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

