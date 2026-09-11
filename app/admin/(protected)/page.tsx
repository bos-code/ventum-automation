import Link from "next/link";
import { ArrowRight, MessageSquare, Package, Tags } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          A quick overview of your catalogue and enquiries.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className="size-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{card.value}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  {card.detail}
                  <ArrowRight className="size-3" aria-hidden="true" />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="text-sm font-medium text-primary hover:underline"
        >
          + Add a product
        </Link>
        <Link
          href="/admin/categories"
          className="text-sm font-medium text-primary hover:underline"
        >
          + Add a category
        </Link>
      </div>
    </div>
  );
}
