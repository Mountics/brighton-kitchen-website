# Brighton College Kitchen website

Static marketing site promoting kitchen hire at Brighton College facilities in Melbourne and Brisbane, available when the kitchens are not in use for college activities. Main goal: generate kitchen hire enquiries.

Audiences: RTOs and training providers, trainers and hospitality educators, chefs and caterers, food businesses and entrepreneurs.

## Structure

- `index.html` – homepage: hero, gallery, who can hire, intro, locations, how it works, why choose our kitchens, FAQs, final call to action
- `enquire.html` – enquiry form page (all "Enquire" buttons link here; `?location=Melbourne` or `?location=Brisbane` pre-selects the city)
- `css/styles.css` – all styles, colour tokens in `:root`
- `js/main.js` – FAQ accordion and form behaviour, no dependencies
- `images/` – logo, kitchen photos, section icons

Plain HTML, CSS and JavaScript. No build step: open `index.html` in a browser or serve the folder.

## Design rules

- Font: Inter (Google Fonts)
- Brand colours: blue `#0b58a6`, orange `#f1592a`, navy `#0a2c52`, ink `#0f1b2b`, sand background `#f6f5f1`
- Square corners everywhere (no border-radius), no drop shadows
- Layouts use flex and grid with wrapping so every section works at phone width
- Use plain, everyday wording in copy

## Contact details

- Phone: 1800 462 744, email: info@brighton.edu.au (footer and enquiry page)
- Footer Privacy Policy and Terms and Conditions link to the main Brighton College site

## Still to do

- Connect the enquiry form to a real handler (email service, CRM or backend). The confirmation message must only show after a successful submission. See the TODO in `js/main.js`.
- Confirm with Brighton College before publishing any claims about equipment, access, licensing, storage, capacity, pricing or availability. The hero copy ("fully-equipped", "hourly, daily and monthly hire") and the "Why choose our kitchens" highlights need sign-off.
- Optional: separate Melbourne and Brisbane location pages with location-specific photos and access details.
