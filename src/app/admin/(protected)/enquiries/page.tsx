import { getAllEnquiries } from "@/lib/data/enquiries";
import { changeEnquiryStatus } from "./actions";
import { formatPrice } from "@/lib/format";
import { EnquiryWhatsAppAction } from "@/components/admin/enquiry-whatsapp-action";
import type { EnquiryStatus } from "@/lib/types";

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  new: "bg-ventum-red-600 text-offwhite",
  read: "bg-ventum-blue-600 text-offwhite",
  responded: "bg-green-700 text-offwhite",
  closed: "bg-steel-600 text-offwhite",
};

const NEXT_STATUS: Record<EnquiryStatus, EnquiryStatus[]> = {
  new: ["read", "closed"],
  read: ["responded", "closed"],
  responded: ["closed"],
  closed: ["new"],
};

export default async function AdminEnquiriesPage() {
  const enquiries = await getAllEnquiries();

  return (
    <div>
      <h1 className="font-display text-xl font-extrabold tracking-tight text-navy-950 sm:text-2xl">
        Enquiries
      </h1>
      <p className="mt-2 text-sm text-steel-600">
        Most recent first. {enquiries.length} total.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {enquiries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-navy-950/20 bg-white p-8 text-center">
            <p className="font-display text-sm font-bold text-navy-950">
              No enquiries yet
            </p>
            <p className="mx-auto mt-1 max-w-xs text-sm text-steel-600">
              Messages from the website and WhatsApp buttons will appear here as
              customers send them.
            </p>
          </div>
        )}
        {enquiries.map((enquiry) => (
          <div
            key={enquiry.id}
            className="rounded-2xl border border-navy-950/10 bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[enquiry.status]}`}
                >
                  {enquiry.status}
                </span>
                <h2 className="mt-2 font-display text-lg font-bold text-navy-950">
                  {enquiry.productName}
                  {enquiry.productModel ? ` (${enquiry.productModel})` : ""}
                </h2>
                {enquiry.productPrice != null && (
                  <p className="text-sm text-steel-600">
                    {formatPrice(enquiry.productPrice, enquiry.productCurrency ?? "NGN")} &times; {enquiry.quantity}
                  </p>
                )}
              </div>
              <p className="text-xs text-steel-600">
                {new Date(enquiry.createdAt).toLocaleString("en-NG")}
              </p>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:max-w-md">
              <div>
                <dt className="text-xs uppercase tracking-wide text-steel-600">Name</dt>
                <dd className="font-semibold text-navy-950">{enquiry.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-steel-600">Phone</dt>
                <dd className="font-semibold text-navy-950">
                  <a href={`tel:${enquiry.phone}`} className="hover:text-ventum-blue-600">
                    {enquiry.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-steel-600">Source</dt>
                <dd className="font-semibold text-navy-950">{enquiry.source}</dd>
              </div>
            </dl>

            {enquiry.message && (
              <p className="mt-3 rounded-lg border border-navy-950/10 bg-mist-100 p-3 text-sm text-steel-700">
                {enquiry.message}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <EnquiryWhatsAppAction
                enquiryId={enquiry.id}
                customerName={enquiry.customerName}
                phone={enquiry.phone}
                productName={enquiry.productName}
                quantity={enquiry.quantity}
                currentStatus={enquiry.status}
                onStatusChange={changeEnquiryStatus}
              />
              {NEXT_STATUS[enquiry.status].map((nextStatus) => (
                <form
                  key={nextStatus}
                  action={changeEnquiryStatus.bind(null, enquiry.id, nextStatus)}
                >
                  <button
                    type="submit"
                    className="inline-flex min-h-11 items-center rounded-full border border-navy-950/15 px-4 text-xs font-semibold text-navy-950 transition-colors hover:bg-navy-950 hover:text-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
                  >
                    Mark {nextStatus}
                  </button>
                </form>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
