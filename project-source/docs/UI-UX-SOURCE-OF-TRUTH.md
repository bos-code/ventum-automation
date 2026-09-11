# Ventum Global Automation — UI/UX Source of Truth

## Core rule
MORE IMAGES. LESS TEXT. PRODUCT FIRST.

## Architecture
- Preserve the existing working Appwrite backend.
- Product/catalogue data remains in Appwrite database.
- Product media remains in Appwrite Storage in production.
- Tailwind remains the styling foundation.

## Visual direction
- Premium industrial/electrical catalogue.
- Image-dominant, human-designed, not generic SaaS.
- Dark cinematic hero + clean light catalogue + editorial industrial photography.
- Sharp geometry, thin dividers, restrained shadows, minimal glass.
- Ventum red `#ED0101`, navy `#06065C`, white `#FFFFFF`, neutral `#F2F2F2`.
- Use the actual Ventum logo only. Never rebuild it as a text monogram.

## Mobile-first rule
Design and QA at 320, 360, 390 and 430 px before tablet/desktop. Product imagery stays large. Touch targets must be usable. Filters use a mobile drawer/sheet.

## Image fidelity
Never alter product identity, brand marks, labels, model numbers, terminals, switch positions, dimensions, ports, screws, packaging or technical text. Permitted: denoise, sharpen, exposure/white-balance correction, straightening, crop, background cleanup around the product, and normalization of whitespace/scale.

## Hero
Target roughly 60–70% visual and 30–40% text/UI. Use real product photography or exact manufacturer imagery. Minimal copy, Catalogue CTA, WhatsApp/Sales CTA, visible controlled motion.

## Catalogue and cards
Image occupies most of each card. Show only useful metadata: brand, name, model, price, availability/action. Search + category + brand filtering. Avoid rating/discount/fake-commerce noise.

## PDP
Large gallery first, then brand/model/name, price, availability, compact specs, enquiry/WhatsApp, additional information and related products.

## Homepage rhythm
Hero → visual categories → featured product compositions → image-dense catalogue/gallery → Brands We Sell → concise image-led company/about → contact.

## Brands We Sell
Siemens, CHINT, ABB, Schneider Electric, Posmith and Legrand. Joyelec and Telemecanique where supported by supplied assets/product evidence.

## Motion
Hero reveal, image reveal/scale, product hover movement, scroll entrances, gallery transitions and mobile drawer/menu transitions. Respect `prefers-reduced-motion`. No bounce or decorative constant motion.

## Avoid
- AI-looking gradient/blob SaaS layouts
- endless rounded cards
- decorative icon grids
- fake stats
- generic generated electrical imagery
- copy-heavy sections
- product photos used as secondary decoration
- fake product models or specifications
