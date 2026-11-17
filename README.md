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

The header Enquiries button and the floating Enquiries bubble open the on-site chat. The hero Call button remains a phone link.

Rent/reserve uses the official Storable `<rental-app>` widget from the current website (same organization, facility, and access key). It needs an internet connection to load.

## Not included yet

- Live “spaces available” count (placeholder comment is in the footer)
- Website chat widget (js/chat.js). Leave CHAT_ENDPOINT empty for offline FAQ mode; set it when the AI backend is ready. Callback requests in offline mode open a mailto to palmbeachstorage@gmail.com.
- Contact/waitlist form backend (the form opens an email to palmbeachstorage@gmail.com until a backend is connected)
- Facility update videos (too large to bundle; TODOs are on those blog posts)
- Social media links (none were published on the current site)

This package is a draft for review. It has not been deployed.
