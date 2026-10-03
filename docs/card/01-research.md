# Online name card with QR: research

Goal: a name card that is easy to open, save and pass on, linking the website, LinkedIn and Instagram.

## Options compared

| Option | How people receive it | Pros | Cons |
|---|---|---|---|
| **A. Card web page** (`/card/`) + QR to its URL | Scan, tap a link, or get the URL by chat | Works on every phone with a camera and browser; can be updated without reprinting; small QR | Needs internet to open |
| **B. vCard QR** (contact data inside the QR) | Scan, then "Add to contacts" | Works offline; one-step save | Static (reprint to change); dense code if many fields; no links to socials page |
| **C. Apple / Google Wallet pass** | Tap "Add to Wallet" | Sits in Wallet, quick to re-show | Apple needs a paid Developer Program membership and a Pass Type ID certificate to sign passes; extra signing service; separate Google setup |
| **D. Paid card services** (Linktree-style, HiHello, etc.) | Their link or app | Ready-made | Third-party branding, subscriptions, data hosted elsewhere |

## Recommendation

**A + vCard download**, all hosted on the existing GitHub Pages site (free, no third party):

1. `/card/` page: photo, name, role, buttons for *Save contact* (.vcf, already built), email, phone, WhatsApp, LinkedIn, Instagram, website.
2. One QR pointing to `/card/` (short URL → low-density code that scans easily when small).
3. **Share** button (Web Share API on phones → WhatsApp, Telegram, AirDrop…), with *Copy link* fallback where unsupported (e.g. Firefox).
4. Full-screen "Show QR" mode for handing your phone to someone in person.
5. Printable card (85 × 55 mm front/back) and downloadable QR image (SVG/PNG) for physical cards, email signatures, slides.
6. Wallet pass: skip for now (cost + certificate); revisit if wanted.

## QR print rules (for physical cards)

- Size ≥ 2 cm, ideally 2.5 cm on a business card.
- Quiet zone ≥ 4 modules of white space around the code (ISO/IEC 18004).
- Low error-correction level (L or M) keeps the code sparse for a short URL; dark on light, no logo overlay at this size.
- Test-scan the printed proof on both iPhone and Android before ordering.

## vCard format

Use vCard 3.0 (already what the site's `.vcf` uses): iPhone and Android import it natively; 4.0 support is inconsistent.

## Caveat

If the domain changes later (custom domain), printed QRs would point to the old URL. GitHub Pages redirects project URLs to a custom domain once configured, but deciding the domain before printing is safest.

## Sources

- Wallet vs vCard vs URL trade-offs: https://lynkle.com/resources/qr-code-business-card , https://qrlynx.com/blog/apple-wallet-vs-google-wallet-business-cards
- Apple pass signing needs Developer Program + Pass Type ID certificate: https://developer.apple.com/help/account/capabilities/create-wallet-identifiers-and-certificates/
- QR size, quiet zone, error correction: https://scanova.io/blog/minimum-qr-code-size/ , https://wavecnct.com/blogs/how-small-can-a-qr-code-be
- vCard 3.0 vs 4.0 compatibility: https://www.vcardqrcodegenerator.com/blog/vcard-qr-code-format/ (secondary source)
- Web Share API support: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share , https://caniuse.com/mdn-api_navigator_share
