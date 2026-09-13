import Link from "next/link";
import { getAllProductsForAdmin } from "@/lib/data/products";
import { getAllEnquiries } from "@/lib/data/enquiries";

export default async function AdminDashboardPage() {
  const [products, enquiries] = await Promise.all([
    getAllProductsForAdmin(),
    getAllEnquiries(),
  ]);

  const newEnquiries = enquiries.filter((e) => e.status === "new").length;
  const publishedProducts = products.filter((p) => p.published).length;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy-950">
        Dashboard
      </h1>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <Link
          href="/admin/enquiries"
          className="rounded-2xl border border-navy-950/10 bg-white p-6 hover:border-ventum-blue-500"
        >
          <p className="text-sm font-semibold text-steel-600">New enquiries</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-ventum-red-600">
            {newEnquiries}
          </p>
        </Link>
        <Link
          href="/admin/products"
          className="rounded-2xl border border-navy-950/10 bg-white p-6 hover:border-ventum-blue-500"
        >
          <p className="text-sm font-semibold text-steel-600">Published products</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-navy-950">
            {publishedProducts} / {products.length}
          </p>
        </Link>
        <Link
          href="/admin/settings"
          className="rounded-2xl border border-navy-950/10 bg-white p-6 hover:border-ventum-blue-500"
        >
          <p className="text-sm font-semibold text-steel-600">Site settings</p>
          <p className="mt-2 font-display text-lg font-bold text-navy-950">
            Edit contact info &rarr;
          </p>
        </Link>
      </div>
    </div>
  );
}
