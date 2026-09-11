# Ventum Asset Location Handoff

## Direct answer for Claude / Codex / VS Code

The real Ventum source assets and project research are organized under `project-source/`.

- Original Ventum logo, supplied product photos and supplied brand assets: `project-source/assets/source-images/raw/`
- Visual/reference material: `project-source/assets/references/`
- Approved UI/UX source of truth: `project-source/docs/UI-UX-SOURCE-OF-TRUTH.md`
- Research and reference direction: `project-source/docs/RESEARCH-AND-REFERENCES.md`
- Approved execution plan: `project-source/docs/EXECUTION-PLAN.md`
- Confirmed product names, prices and specifications: `project-source/data/products.confirmed.json`
- Brand asset/brand list manifest: `project-source/data/brand-assets.json`

## Important asset rule

Do not invent, redraw, recolor, relabel or replace supplied Ventum/product assets. Preserve product identity, logos, model numbers, labels and technical details. Processed web derivatives should be created separately from the raw originals.

## ElectraFix reference

The ElectraFix UI-kit direction is documented in `project-source/docs/RESEARCH-AND-REFERENCES.md`. If the original ElectraFix ZIP is not physically present in this repository, do not pretend it is. Use the documented direction until the original reference package is added locally.

## Appwrite production rule

`project-source/` is the repository development/source archive. Production catalogue records belong in the existing Appwrite database, and production product media belongs in Appwrite Storage. Do not create a second hard-coded runtime catalogue from these files.
