# Ventum UI revamp — research and implementation

## Direction

Keep the approved dark industrial hero, Ventum navy/red, image-led catalogue and enquiry flow. Give the equipment room to speak: clean photo surfaces, restrained typography, readable product identifiers, useful navigation and short customer-facing copy.

This is an adaptation of the documented reference direction. The original ElectraFix file and supplied product/logo images were not available in the workspace during this pass, so exact visual matching remains pending.

## Sources checked

| Source | Evidence and relevance | Decision for Ventum |
| --- | --- | --- |
| [Pinterest: electrical component distributor](https://dk.pinterest.com/pin/design-for-an-electrical-component-distributor-website--364650901052095366/) | Relevant pin surfaced in search; direct page fetch failed. | Discovery reference only; do not claim a visual review or copy its imagery. |
| [Pinterest: industrial product / web layout board](https://fi.pinterest.com/rosebryar2/industrial-product-design/) | Search-indexed collection of industrial product and web layout ideas. | Secondary discovery source, not an approved design or source of product photos. |
| [Behance: Industrial Automation & Electrification](https://www.behance.net/gallery/246072601/Industrial-Automation-Electrification-Website) | Designer describes a clear industrial hierarchy and corporate presentation. | Keep information hierarchy simple, with a clear transition from introduction to catalogue. |
| [Dribbble: Electrical equipment homepage](https://dribbble.com/shots/27022808-Electrical-equipment-homepage-design) | Designer describes strong contrast, category discovery, stock information and direct catalogue access. | Adopt the category/conversion structure; omit its saturated gradients and heavy graphic treatment. |
| [Zypsy: Podium Automation](https://www.zypsy.com/work/podium) | Case study grounds identity in actual control panels, workshop visits and electrical schematics. | Use authentic equipment and a specific business identity as the visual foundation. |
| [Schneider: contactors](https://www.se.com/us/en/product-subcategory/1510-contactors-reversing-contactors/) | Product ranges have distinct names, selection context and direct product links. | Make brand/model and product selection readable; keep technical detail on product pages. |

The repository names Brauer/Creght and VOLTIX as composition references. The current Creght search result is an AI website builder; it does not verify the specific historical Brauer composition. Keep the written reference intent, but do not claim to have inspected the missing original reference.

## Applied changes

- Rebuilt the homepage hero with direct catalogue search and a large product stage when photographs exist. A real product list replaces the image stage when no photography is available.
- Simplified the header, navigation and brand strip; removed pseudo-technical system labels.
- Category tiles use unobstructed photos and separate text. Categories with no published products are omitted from homepage discovery.
- Product cards emphasize the image, brand, name, model, price and availability. Removed diagram overlays and specification clutter from cards.
- Reduced repetitive homepage copy and removed the redundant benefits block.
- Matched catalogue and detail pages to the same sharp, light surfaces.
- Added a mobile filter sheet and accessible navigation dialog; section links close the menu.
- Preserved Appwrite records/storage, enquiry actions, WhatsApp links and administration logic.

## Asset status and remaining visual gate

The live local catalogue returned four published products with no attached image IDs. The source-image paths in the new manifests do not exist locally. Brand names are rendered as text; the actual Ventum artwork still needs to be supplied. No replacement stock photos, generated equipment, invented models, or manufacturer logos were introduced.

The photo-present hero/gallery and final brand match must be inspected with the authentic assets. The approved execution plan also requires a deployed visual inspection before the overall redesign can be called complete.
