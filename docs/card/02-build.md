# Online name card: what was built

| URL | What |
|---|---|
| `/card/` | Phone-first card: photo, name, role; **Save contact** (.vcf); Email, Call, WhatsApp, LinkedIn, Instagram, GitHub, Website; **Share** (native share sheet, falls back to *Copy link*); **Show QR** (full-screen, white, for in-person scanning) |
| `/card/print/` | Print-ready front and back, each 91 × 61 mm (85 × 55 mm card + 3 mm bleed, 4 mm safe margin). Not in the sitemap. |
| `/card-qr.svg` | The QR as a vector file for print shops, email signatures and slides |

## Details
- QR is generated at build time with `qrcode` (`src/lib/qr.ts`): error correction M, 4-module quiet zone, encodes the `/card/` URL, so the card can be edited without reprinting.
- On the print card the QR is 30 mm wide including the quiet zone (≈ 24 mm code), above the 2–2.5 cm guidance.
- WhatsApp link: `https://wa.me/<number>` built from the phone in `profile.yaml`.
- Linked from the footer and the About page.
- Tests: both pages render without errors or sideways scroll, have no serious axe violations, and the card test checks every contact link, the WhatsApp URL, the QR dialog and the SVG download.

## How to print
1. Open `/card/print/`, press **Print / Save as PDF**.
2. Margins **None**, scale **100%**, background graphics **on** → you get a 2-page PDF (front, back).
3. Send the PDF to the print shop as "85 × 55 mm, 3 mm bleed included".
4. Test-scan a proof on iPhone and Android.

If the site moves to a custom domain, reprint: the QR encodes the full URL.
