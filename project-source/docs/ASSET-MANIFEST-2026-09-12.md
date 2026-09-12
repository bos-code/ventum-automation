# Ventum Global Automation — asset manifest

Date: 2026-09-12

This manifest separates safe presentation work from product-identity work. No catalogue product image may be generated or visually altered in a way that changes markings, terminals, ratings, pole count, switch position or model identity.

## Ventum identity

| Asset | Current path | Status | Usage |
| --- | --- | --- | --- |
| Horizontal Ventum lockup | `public/brand/ventum-horizontal.png` | CLEANED / EXISTING | Header/footer. Always `object-contain`; never crop. |
| Ventum mark | `public/brand/ventum-mark.png` | CLEANED / EXISTING | Favicon/compact identity only where already appropriate. |
| Original horizontal source | `project-source/assets/source-images/raw/ventum-logo-horizontal.jpg` | SOURCE | Preserve as provenance; do not use directly where its background/tile is visible. |
| Original square source | `project-source/assets/source-images/raw/ventum-logo-square.jpg` | SOURCE | Preserve as provenance. |

## Manufacturer logos supplied by client

All public PNG versions are used on white containers with `object-contain`, centred optical spacing and no CSS recolouring/grayscale.

| Brand | Public asset | Raw supplied source | Status |
| --- | --- | --- | --- |
| ABB | `public/brand-logos/abb-logo.png` | `project-source/assets/source-images/raw/abb-logo.jpg` | CLEANED / EXISTING |
| Joyelec | `public/brand-logos/joyelec-logo.png` | `project-source/assets/source-images/raw/joyelec-logo.jpg` | CLEANED / EXISTING |
| Legrand | `public/brand-logos/legrand-logo.png` | `project-source/assets/source-images/raw/legrand-logo.jpg` | CLEANED / EXISTING |
| Posmith | `public/brand-logos/posmith-logo.png` | `project-source/assets/source-images/raw/posmith-logo.jpg` | CLEANED / EXISTING |
| Schneider Electric | `public/brand-logos/schneider-electric-logo.png` | `project-source/assets/source-images/raw/schneider-electric-logo.jpg` | CLEANED / EXISTING |
| Siemens | `public/brand-logos/siemens-logo.png` | `project-source/assets/source-images/raw/siemens-logo.jpg` | CLEANED / EXISTING |

Do not redraw, recolour or force any manufacturer mark into a crop. If a source logo still contains a baked-in black/white tile, replace only the background with transparency while preserving the mark pixel-for-pixel.

## Confirmed catalogue data currently stored in project source

The repository currently documents four confirmed product records. Do not claim six exact verified models until the missing exact model data is supplied.

| Brand | Product/model | Existing source | Status |
| --- | --- | --- | --- |
| Telemecanique / Schneider | D0910 Contactor — `LC1-D0910 M7C` | `project-source/assets/source-images/raw/telemecanique-d0910-contactors.jpg` | CLIENT SOURCE / MODEL REQUIRES FINAL MANUFACTURER CROSS-CHECK |
| Schneider Electric (repository label) | SUL 181 h | referenced in `products.confirmed.json` | PLACEHOLDER / BRAND-MODEL IDENTITY REQUIRES CHECK |
| Joyelec | DJO Solar Protection Box — model not recorded | `project-source/assets/source-images/raw/joyelec-distribution-box-closed.jpg` | CLEANED SOURCE / NOT EXACT-MODEL VERIFIED |
| Posmith | DPO Solar Protection Box — model not recorded | `project-source/assets/source-images/raw/posmith-distribution-box-open.jpg` | CLEANED SOURCE / NOT EXACT-MODEL VERIFIED |

Additional supplied product/detail photography:
- `joyelec-components-detail.jpg`
- `joyelec-distribution-box-open.jpg`
- `posmith-components-detail.jpg`
- `telemecanique-d0910-contactors-wide.jpg`

These are safe for editorial/category presentation only when they accurately represent what the caption implies. They are not substitutes for a verified exact-model image on a product detail page.

## Product-image output standard

Every catalogue image should ultimately be normalised to:
- 4:3 product stage for cards
- neutral `#F3F3EF` / transparent-safe background
- consistent optical scale, not identical pixel bounding boxes
- 7–10% visual padding around the object
- `object-contain`
- no crop through labels, terminals, switches, screws, packaging or model markings
- no generated electrical products

Permitted cleanup: background removal, straightening, exposure/white-balance correction, denoise, conservative sharpening, whitespace normalisation and web optimisation.

## Editorial/hero asset policy

Homepage atmosphere may use authentic industrial/environment photography or supplied product photographs. Generated imagery may be used only for non-specific atmosphere and must never depict an identifiable branded catalogue component as if it were stock.

The current implementation deliberately uses real catalogue imagery instead of introducing unverified external product assets.
