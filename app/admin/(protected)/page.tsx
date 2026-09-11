import Link from "next/link";
import { ArrowRight, MessageSquare, Package, Plus, Tags } from "lucide-react";
import { getAllProducts } from "@/lib/appwrite/products";
import { getAllCategories } from "@/lib/appwrite/categories";
import { getAllEnquiries, summariseEnquiries } from "@/lib/appwrite/enquiries";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const [products, categories, enquiries] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getAllEnquiries(),
  ]);
  const enquiryStats = summariseEnquiries(enquiries);

  const cards = [
    {
      href: "/admin/products",
      icon: Package,
      title: "Products",
      value: products.length,
      detail: `${products.filter((p) => p.published).length} published`,
    },
    {
      href: "/admin/categories",
      icon: Tags,
      title: "Categories",
      value: categories.length,
      detail: `${categories.filter((c) => c.published).length} published`,
    },
    {
      href: "/admin/enquiries",
      icon: MessageSquare,
      title: "Enquiries",
      value: enquiryStats.total,
      detail: `${enquiryStats.new} new`,
    },
  ];

  return (
    <div className="space-y-7 sm:space-y-9">
      <section className="overflow-hidden rounded-[24px] bg-[#06065c] p-5 text-white sm:p-7 lg:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ed0101]">
          Ventum Admin
        </p>
        <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Catalogue overview
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
              Manage products, categories and customer enquiries from one place.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ed0101] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d80000]"
          >
            <Plus className="size-4" aria-hidden="true" /> Add product
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="grid size-10 place-items-center rounded-xl bg-[#06065c]/7">
                <card.icon className="size-5 text-[#06065c]" aria-hidden="true" />
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </div>
            <p className="mt-5 text-sm font-medium text-muted-foreground">{card.title}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-[#06065c]">{card.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{card.detail}</p>
          </Link>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#06065c]">Quick actions</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin/products/new"
            className="flex min-h-14 items-center justify-between rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold transition hover:border-[#06065c]/30"
          >
            Add a new product <Plus className="size-4 text-[#ed0101]" aria-hidden="true" />
          </Link>
          <Link
            href="/admin/categories"
            className="flex min-h-14 items-center justify-between rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold transition hover:border-[#06065c]/30"
          >
            Manage categories <Tags className="size-4 text-[#ed0101]" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
