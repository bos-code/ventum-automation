# Ventum Project Source Pack

This folder is the repository source-of-truth for the Ventum Global Automation frontend work.

## Structure
- `docs/` — approved UI/UX rules, research synthesis and execution plan.
- `data/` — confirmed product/pricing/spec information and brand manifest.
- `assets/source-images/raw/` — original supplied Ventum/product/brand images. Preserve originals; create derivatives separately.
- `assets/references/` — visual/reference material only; not product truth.

## Production rule
The repo is the development/source archive. Runtime catalogue records belong in the existing Appwrite database and runtime media belongs in Appwrite Storage. The frontend should read from Appwrite rather than hard-coding a second catalogue.

## Core design rule
MORE IMAGES. LESS TEXT. PRODUCT FIRST.
