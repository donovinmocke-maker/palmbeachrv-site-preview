# Palm Beach RV & Boat Storage — website draft

Static HTML/CSS site (no build step). Open the folder with any local web server, for example:

```
python3 -m http.server 8080
```

Then visit http://localhost:8080

## What’s included

- Home, Units & pricing, Facility, About, Contact
- Blog (four facility-update galleries plus the March 2026 boat-storage article)
- Privacy, Terms, Disclaimer (official Termageddon documents already used on the current site)
- Sitemap

The header Enquiries button, the floating Enquiries bubble, and Chat with us buttons around the site open the on-site chat. The office number is kept as a smaller “Prefer to talk? Call (239) 523-0756” line, and in the footer and schema for local search.

Rent/reserve uses the official Storable `<rental-app>` widget from the current website (same organization, facility, and access key). It needs an internet connection to load.

## Not included yet

- Live “spaces available” count (placeholder comment is in the footer)
- Website chat widget (js/chat.js). Leave CHAT_ENDPOINT empty for offline FAQ mode; set it when the AI backend is ready. Callback requests in offline mode open a mailto to palmbeachstorage@gmail.com.
- Contact/waitlist form backend (the form opens an email to palmbeachstorage@gmail.com until a backend is connected)
- Facility update videos (too large to bundle; review notes mark where they go, shown on the preview only)
- Social media links (none were published on the current site)

This package is a draft for review. It has not been deployed.

## Facts waiting for the owner (Nov 21, 2026)

Unconfirmed facts are wrapped in `<span class="tbc" data-tbc="topic">` (office hours, gate hours, number of spaces,
current rates, electric included / 20 vs 30 amp by building, years serving Lee County). They render as normal text
here; the preview build (`../build_preview.py`) marks them "to confirm". Update the wording and remove the wrapper
once Teena confirms each one (questions-for-teena.md 1–4 and nice-to-haves). Re-run `../polish_site.py` is safe (idempotent).
