import Image from "next/image";
import { productImageUrl } from "@/lib/appwrite/images";
import type { Product } from "@/lib/types";

// Present a specific component from its original group photograph, without
// retouching or generating any product labels. Only applies to these source files.
const componentFocus: Record<string, { file: string; center: number }> = {
  "posmith-nd1-63dc-c63-breaker": { file: "catalog_posmith_components", center: 11 },
  "posmith-psm-1-dc-surge-protection": { file: "catalog_posmith_components", center: 30 },
  "posmith-pva-1-voltage-protector": { file: "catalog_posmith_components", center: 49 },
  "joyelec-qyb2-63-c16-ac-breaker": { file: "catalog_joyelec_components", center: 90 },
  "joyelec-qy-spd-40-ac-surge-protection": { file: "catalog_joyelec_components", center: 69 },
  "joyelec-vap-80-voltage-current-protector": { file: "catalog_joyelec_components", center: 50 },
};

export function ProductPhoto({ product, sizes, preload = false }: { product: Product; sizes: string; preload?: boolean }) {
  const id = product.imageIds[0];
  if (!id) return <span className="flex h-full items-center justify-center p-6 text-center text-sm text-steel-600">Photo available on request</span>;
  const focus = componentFocus[product.slug];
  if (focus?.file === id) {
    return (
      <div className="relative mx-auto h-full w-[46%] overflow-hidden">
        <Image src={productImageUrl(id)} alt={`${product.brand} ${product.name}`} width={2048} height={1185}
          preload={preload} sizes="850px"
          className="absolute top-0 h-full w-auto max-w-none"
          style={{ left: "50%", transform: `translateX(-${focus.center}%)` }} />
      </div>
    );
  }
  return <Image src={productImageUrl(id)} alt={`${product.brand} ${product.name}`} fill preload={preload}
    sizes={sizes} className="object-contain p-4" />;
}
