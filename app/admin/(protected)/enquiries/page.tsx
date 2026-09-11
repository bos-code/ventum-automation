import Link from "next/link";
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
        <h1 className="text-xl font-semibold">Enquiries</h1>
        <p className="text-sm text-muted-foreground">
          {enquiries.length} enquir{enquiries.length === 1 ? "y" : "ies"}
        </p>
      </div>

      {enquiries.length === 0 ? (
        <EmptyState
          title="No enquiries yet"
          description="Product enquiries submitted from the site will appear here, and are also sent to Telegram instantly."
        />
      ) : (
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
                  <TD className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDateTime(enquiry.createdAt)}
                  </TD>
                  <TD>
                    <p className="font-medium">{enquiry.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {enquiry.productModel ? `${enquiry.productModel} · ` : ""}
                      <PriceTag
                        price={enquiry.productPrice}
                        currency={enquiry.productCurrency ?? "NGN"}
                      />
                    </p>
                    {enquiry.productId && (
                      <Link
                        href={`/admin/products/${enquiry.productId}/edit`}
                        className="text-xs text-primary hover:underline"
                      >
                        View product
                      </Link>
                    )}
                  </TD>
                  <TD className="text-sm">{enquiry.customerName}</TD>
                  <TD className="whitespace-nowrap text-sm">
                    <a
                      href={`tel:${enquiry.phone}`}
                      className="hover:underline"
                    >
                      {enquiry.phone}
                    </a>
                  </TD>
                  <TD className="text-sm">{enquiry.quantity}</TD>
                  <TD className="max-w-xs text-sm text-muted-foreground">
                    <span title={enquiry.message ?? undefined} className="line-clamp-2">
                      {enquiry.message || "—"}
                    </span>
                  </TD>
                  <TD>
                    <EnquiryStatusSelect id={enquiry.id} status={enquiry.status} />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </TableWrap>
      )}
    </div>
  );
}
