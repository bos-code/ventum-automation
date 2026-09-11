import Link from "next/link";
import { MessageSquareText, Phone } from "lucide-react";
import { Table, TableWrap, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { EmptyState } from "@/components/site/empty-state";
import { EnquiryStatusSelect } from "@/components/admin/enquiry-status-select";
import { PriceTag } from "@/components/catalog/price-tag";
import { getAllEnquiries } from "@/lib/appwrite/enquiries";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Enquiries" };

export default async function AdminEnquiriesPage() {
  const enquiries = await getAllEnquiries();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ed0101]">
          Customers
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#06065c]">Enquiries</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {enquiries.length} enquir{enquiries.length === 1 ? "y" : "ies"}
        </p>
      </div>

      {enquiries.length === 0 ? (
        <EmptyState
          title="No enquiries yet"
          description="Product enquiries submitted from the site will appear here, and are also sent to Telegram instantly."
        />
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {enquiries.map((enquiry) => (
              <article key={enquiry.id} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{formatDateTime(enquiry.createdAt)}</p>
                    <h2 className="mt-1 line-clamp-2 font-semibold text-[#06065c]">{enquiry.productName}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {enquiry.productModel ? `${enquiry.productModel} · ` : ""}
                      <PriceTag price={enquiry.productPrice} currency={enquiry.productCurrency ?? "NGN"} />
                    </p>
                  </div>
                  <EnquiryStatusSelect id={enquiry.id} status={enquiry.status} />
                </div>

                <div className="mt-4 grid gap-3 rounded-xl bg-[#f7f7f9] p-3 text-sm">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Customer</p>
                    <p className="mt-1 font-medium">{enquiry.customerName}</p>
                  </div>
                  <a href={`tel:${enquiry.phone}`} className="flex min-h-10 items-center gap-2 font-medium text-[#06065c]">
                    <Phone className="size-4 text-[#ed0101]" aria-hidden="true" /> {enquiry.phone}
                  </a>
                  <p className="flex items-start gap-2 text-muted-foreground">
                    <MessageSquareText className="mt-0.5 size-4 shrink-0 text-[#ed0101]" aria-hidden="true" />
                    <span>{enquiry.message || "No message"}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Quantity: {enquiry.quantity}</p>
                </div>

                {enquiry.productId && (
                  <Link
                    href={`/admin/products/${enquiry.productId}/edit`}
                    className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-[#ed0101]"
                  >
                    View product
                  </Link>
                )}
              </article>
            ))}
          </div>

          <div className="hidden md:block">
            <TableWrap>
              <Table>
                <THead>
                  <TR>
                    <TH>Date</TH>
                    <TH>Product</TH>
                    <TH>Customer</TH>
                    <TH>Phone</TH>
                    <TH>Qty</TH>
                    <TH>Message</TH>
                    <TH>Status</TH>
                  </TR>
                </THead>
                <TBody>
                  {enquiries.map((enquiry) => (
                    <TR key={enquiry.id}>
                      <TD className="whitespace-nowrap text-sm text-muted-foreground">{formatDateTime(enquiry.createdAt)}</TD>
                      <TD>
                        <p className="font-medium">{enquiry.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {enquiry.productModel ? `${enquiry.productModel} · ` : ""}
                          <PriceTag price={enquiry.productPrice} currency={enquiry.productCurrency ?? "NGN"} />
                        </p>
                        {enquiry.productId && (
                          <Link href={`/admin/products/${enquiry.productId}/edit`} className="text-xs text-[#ed0101] hover:underline">
                            View product
                          </Link>
                        )}
                      </TD>
                      <TD className="text-sm">{enquiry.customerName}</TD>
                      <TD className="whitespace-nowrap text-sm"><a href={`tel:${enquiry.phone}`} className="hover:underline">{enquiry.phone}</a></TD>
                      <TD className="text-sm">{enquiry.quantity}</TD>
                      <TD className="max-w-xs text-sm text-muted-foreground"><span title={enquiry.message ?? undefined} className="line-clamp-2">{enquiry.message || "—"}</span></TD>
                      <TD><EnquiryStatusSelect id={enquiry.id} status={enquiry.status} /></TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </TableWrap>
          </div>
        </>
      )}
    </div>
  );
}
