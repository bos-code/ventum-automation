# Ventum Global Automation — art direction research

Date: 2026-09-12

## Decision

Use **Industrial Editorial**: a proper company website first, with a rigorous industrial catalogue underneath. The premium feel comes from authentic product photography, large visual scale, strong typographic hierarchy, restrained colour and varied section rhythm — not SaaS decoration.

Ventum navy `#06065C` and red `#ED0101` are used mainly for type, navigation, states and actions. Large sections remain white, warm-white or photography-led rather than flat red/navy blocks.

## Reference set

| Reference | What it teaches | Ventum transfer |
| --- | --- | --- |
| [Sirui Engineering redesign — Behance](https://www.behance.net/gallery/247006523/Website-Redesign-for-B2B-Manufacturing-Industry) | Procurement architecture can coexist with a corporate brand experience. | Homepage establishes the business; catalogue handles model/brand-driven discovery. |
| [Carbo industrial website — Behance](https://www.behance.net/gallery/219498431/Industrial-Website-Design-UXUI-for-Manufacturing) | Technical content feels premium when hierarchy and photography do the work. | Use restrained UI around strong equipment imagery. |
| [Ferox B2B industrial UX — Behance](https://www.behance.net/gallery/242455129/B2B-Industrial-Website-App-UI-UX-Design) | Industrial buyers benefit from clear filtering and enquiry paths. | Search/filter first in catalogue; multi-item enquiry instead of checkout. |
| [VAC AERO industrial redesign — Behance](https://www.behance.net/gallery/228778953/Industrial-UXUI-Design-for-Global-Manufacturing-Leader) | Large industrial photography and clear conversion hierarchy improve credibility. | Use real product/equipment imagery and keep sales CTAs obvious. |
| [DL Valve industrial concept — Behance](https://www.behance.net/gallery/255366839/Industrial-Website-UIUX-Design) | Strong hierarchy and product-led architecture can modernise a conventional industrial brand. | Borrow structure, not its generic card/icon treatment. |
| [Siteinspire — Product Catalogues & Collections](https://www.siteinspire.com/websites/category/product-catalogues-and-collections) | High-end catalogues rely on image scale, typography and spacing rather than decoration. | Let product images breathe and keep cards visually quiet. |
| [RIMOWA](https://www.rimowa.com/) | Campaign photography transitions cleanly into precise product browsing. | Hero can feel editorial while the catalogue remains systematic. |
| [RIMOWA all products](https://www.rimowa.com/ww/en/all-products/) | A scalable catalogue can stay visually premium at hundreds of products. | Build the six-product grid so it can grow without redesign. |
| [Flos Professional catalogue](https://professional.flos.com/en/global/all-products/) | Technical product families can be presented with gallery-level restraint. | Use category/product discovery with large clean images and little noise. |
| [Schneider Electric Nigeria — industrial automation](https://www.se.com/ng/en/work/products/industrial-automation-control/) | Industrial buyers need explicit product families, selectors and enquiry routes. | Keep category/brand/model navigation practical beneath the visual layer. |
| [Schneider Automation & Control Essentials Catalog 2026](https://www.se.com/ng/en/download/document/DIA5ED2170101EN/) | Model/reference accuracy and structured technical data are essential. | Never invent product markings/specifications; model numbers remain prominent. |
| [Siemens SIMATIC Automation](https://www.siemens.com/en-us/products/simatic/) | Serious industrial brands use real equipment and application photography to establish authority. | Use authentic equipment imagery rather than abstract industrial-tech graphics. |
| [Siemens low-voltage controls](https://www.siemens.com/en-us/products/low-voltage-controls-and-distribution/) | Product ranges and real use contexts can coexist on one page. | Combine brand presence with direct product-family discovery. |

## Rejected patterns

- Flat navy/red hero blocks
- Utility/announcement strip above the primary navigation
- Gradient blobs and generic dark SaaS visuals
- Technical grid wallpaper used as decoration
- Numbered editorial tiles
- Arrow-only CTAs
- Fake statistics, ratings or discounts
- Endless rounded cards
- Tiny tracked uppercase labels everywhere
- Orbit, float, glow or infinite decorative motion
- Generated images of identifiable electrical components

## Final page rhythm

Homepage:
1. Clean primary navigation
2. Photography/product-led editorial hero
3. Image-led category discovery
4. One dominant featured product composition + supporting products
5. Image-dense equipment gallery
6. Manufacturer logos
7. Concise company/location section
8. Sales/contact conversion
9. Clean footer

Catalogue:
- Search always visible
- Category + brand filters
- Product image dominates each card
- Brand and model are easily scannable
- Price and stock visible
- Labelled View action
- Add to enquiry action on every card
- Selection persists while browsing
- Multi-product WhatsApp handoff

## Typography

Keep the existing `Space Grotesk` display / `Geist` UI pairing. It is sufficiently industrial without becoming themed. Model/part numbers use `Geist Mono` selectively.

Scale rules:
- Hero: fluid ~48–102px depending on viewport
- Section headings: ~36–48px
- Product names: 18–24px
- Body: 15–18px
- Model numbers: 13–16px, medium/semibold
- Avoid customer-facing text below 12px except unavoidable legal metadata

## Colour

Core:
- Ventum navy: `#06065C`
- Ventum red: `#ED0101`
- Ink: `#111322`
- White: `#FFFFFF`
- Warm neutral: `#F8F8F5`
- Product stage: `#F3F3EF`
- Secondary text: `#656879`
- Divider: `#D9DBE4`

Navy/red are accents and controls, not default section backgrounds.

## Motion

Only one-time entrance/reveal, hover feedback, mobile sheet transitions and image-scale feedback. No persistent decorative movement. Respect `prefers-reduced-motion`.
