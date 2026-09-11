# Project Brief — Ventum Global Automation

## Objective
Build a polished, mobile-first catalogue website for Ventum Global Automation using the client-provided ElectraFix Figma UI kit as visual/UX inspiration, while adapting the experience to an electrical-products supplier rather than an electrical-repair service.

## Business model
The website is primarily a catalogue and lead-generation channel. Customers browse products, open product details, submit an enquiry, and/or continue directly on WhatsApp. The business owner should be able to maintain a small catalogue without developer intervention.

## Business identity
- Customer-facing name: Ventum Global Automation
- Legal name: Ventum Global Services Ltd
- RC: 3777637
- Tagline: High Value and Quality Commodities
- Address: F1626 Alaba International Market, Ojo, Lagos, Nigeria
- WhatsApp: +234 806 487 0941
- Secondary phone: 07055595398
- Email: ventumglobal@gmail.com
- Domain: ventumautomation.com

## Business focus
Electrical products and automation equipment including circuit breakers, contactors, relays, surge protection devices, voltage protection, timers, solar protection products, switchgear, industrial electrical parts, switches, lighting, hand tools, and related equipment.

## Core V1 pages
- `/` homepage
- `/products` catalogue
- `/products/[slug]` product details
- `/admin/login`
- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]/edit`
- `/admin/categories`
- `/admin/enquiries`

About and Contact may remain homepage sections unless a separate page becomes useful.

## Homepage direction
Suggested order:
1. Navbar
2. Product-led hero
3. Product categories
4. Featured products
5. Brands We Sell
6. About Ventum
7. Why Buy From Ventum
8. Real stock/product gallery
9. Product enquiry/WhatsApp CTA
10. Contact/location
11. Footer

Use electrical products as the visual subjects. Do not copy ElectraFix worker photography literally.

## Core customer flow
Browse -> filter/search -> open product -> review price/specifications/availability -> Request Product or Chat on WhatsApp.

Request Product form:
- customer name
- phone/WhatsApp number
- quantity
- optional message

Submission:
1. validate server-side
2. store enquiry in Appwrite
3. send Telegram notification server-side
4. return success/failure state

## Admin scope
Keep the admin deliberately small:
- Appwrite admin authentication
- product CRUD
- category CRUD
- publish/unpublish product
- featured toggle
- in-stock/out-of-stock toggle
- image upload
- price, brand, model, descriptions and specifications
- view enquiries
- optionally mark enquiry contacted/resolved

No charts or decorative dashboard analytics.

## Explicitly out of scope for V1
- Stripe / Paystack
- cart
- checkout
- online payments
- customer accounts
- customer authentication
- delivery-rate calculation
- warehouse/ERP logic
- invoice engine
- elaborate order-state workflow
- Supabase
- Firebase
- Medusa
- Payload
- Shopify
- separate custom Node backend
- unnecessary microservices

## Visual direction
The ElectraFix Figma source is an inspiration/reference, not a template to relabel. Reuse its strengths: strong industrial composition, typography hierarchy, spacing, section rhythm, cards, responsive structure and product/service storytelling. Adapt those principles to a product-led supplier.

The finished site should feel credible, technical, clean and premium without looking over-designed or AI-generated.

## Brand/logo rule
The three supplied Ventum logo references are source-of-truth artwork. Never redesign, recolour, distort, crop destructively, redraw or create a stylistic interpretation of the VG mark. Sharpen/clean only where necessary while preserving the original artwork. The horizontal lockup should be the main website logo; the circular variant can serve compact/fav-icon/social contexts.

## Initial product categories
- Circuit Breakers
- Contactors & Relays
- Surge Protection
- Solar Protection
- Timers & Controllers
- Voltage Protection
- Electrical Accessories

Do not invent extra categories unless actual catalogue items justify them.
