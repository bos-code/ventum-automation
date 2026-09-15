import Link from "next/link";
import { getAllProductsForAdmin } from "@/lib/data/products";
import { getAllEnquiries } from "@/lib/data/enquiries";

export default async function AdminDashboardPage() {
  const [products, enquiries] = await Promise.all([
    getAllProductsForAdmin(),
    getAllEnquiries(),
  ]);

  const newEnquiries = enquiries.filter((e) => e.status === "new").length;
  const live = products.filter((p) => p.published).length;
  const drafts = products.length - live;
  // Drafts the publish gate is actively holding back.
  const blocked = products.filter((p) => !p.published && p.imageIds.length === 0).length;

  const stats = [
    {
      href: "/admin/enquiries",
      label: "New enquiries",
      value: String(newEnquiries),
      tone: newEnquiries > 0 ? "alert" : "plain",
    },
    {
      href: "/admin/products",
      label: "Live products",
      value: `${live} / ${products.length}`,
      tone: "plain",
    },
    {
      href: "/admin/products",
      label: "Drafts",
      value: String(drafts),
      tone: "plain",
    },
    {
      href: "/admin/products",
      label: "Missing an image",
      value: String(blocked),
      tone: blocked > 0 ? "warn" : "plain",
    },
  ] as const;

  return (
    <div>
      <h1 className="font-display text-xl font-extrabold tracking-tight text-navy-950 sm:text-2xl">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-steel-600">
        A quick read on what needs attention today.
      </p>

      {/* Two up on a phone, four across from tablet. */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-navy-950/10 bg-white p-4 transition-colors hover:border-ventum-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 sm:p-5"
          >
            <p className="text-xs font-semibold text-steel-600">{stat.label}</p>
            <p
              className={`mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl ${
                stat.tone === "alert"
                  ? "text-ventum-red-700"
                  : stat.tone === "warn"
                    ? "text-amber-800"
                    : "text-navy-950"
              }`}
            >
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {blocked > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 sm:p-5">
          <p className="font-display text-sm font-bold text-amber-900">
            {blocked} {blocked === 1 ? "product is" : "products are"} waiting on a photo
          </p>
          <p className="mt-1 text-sm text-amber-800">
            Products without an image stay as drafts and are not shown on the
            site. Add a photo to publish {blocked === 1 ? "it" : "them"}.
          </p>
          <Link
            href="/admin/products"
            className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-navy-950 px-4 text-xs font-semibold text-offwhite transition-colors hover:bg-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
          >
            Review drafts
          </Link>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-navy-950/10 bg-white p-4 sm:p-5">
        <h2 className="font-display text-sm font-bold text-navy-950">Quick actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/admin/products"
            className="inline-flex min-h-11 items-center rounded-xl bg-navy-950 px-4 text-xs font-semibold text-offwhite transition-colors hover:bg-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
          >
            Add a product
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex min-h-11 items-center rounded-xl border border-navy-950/15 px-4 text-xs font-semibold text-navy-950 transition-colors hover:bg-mist-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
          >
            Read enquiries
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex min-h-11 items-center rounded-xl border border-navy-950/15 px-4 text-xs font-semibold text-navy-950 transition-colors hover:bg-mist-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
          >
            Update contact details
          </Link>
        </div>
      </div>
    </div>
  );
}
