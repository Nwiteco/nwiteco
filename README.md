# Dana's Deal Depot — setup guide

This is a plain website: 4 files, no software to install, no monthly hosting bill.
Follow the steps in order. Total time: about 45–60 minutes the first time.

Files in this folder:
- `index.html` — the page itself
- `style.css` — all the visual design
- `script.js` — loads your product list and builds the cards
- `products.csv` — sample products (you'll replace this with your Google Sheet)

---

## Step 1 — Manage products in products.csv

All your products live in `products.csv`, sitting right next to the website
files. It's a plain spreadsheet file — open it in Excel, Numbers, Google
Sheets, or even a basic text editor, edit it, and save.

1. Open `products.csv`. You'll see one row per product and these column
   headers in row 1: `name`, `price`, `description`, `image`, `status`, `sku`
2. Add, edit, or delete rows as needed. Notes on each column:
   - **price** — just the number, e.g. `85` (no dollar sign)
   - **image** — a direct image URL. Easiest source: upload the photo to
     [postimages.org](https://postimages.org) (free, no account needed) and copy
     the "Direct link" it gives you.
   - **status** — leave blank (or write `available`) for items for sale,
     write `sold` to grey it out with a "Sold" stamp.
   - **sku** — optional, any short code you want for your own tracking.
3. Save the file, making sure it stays named `products.csv` and stays in
   the same folder as `index.html`.
   - **If using Excel or Numbers:** use "Save As" and choose the **CSV**
     format specifically — saving as `.xlsx` or `.numbers` will break it.
4. If your site is already uploaded to GitHub Pages, upload the updated
   `products.csv` to the same repo to overwrite the old one (drag it in,
   GitHub will ask to confirm the replacement) — the live site updates
   within a minute or two.

**Important:** because browsers block a webpage from reading local files
for security reasons, `products.csv` will only load when the site is
viewed through a real web address (like your GitHub Pages URL or your own
domain) — not when you just double-click `index.html` on your computer. To
preview changes locally before uploading, run a tiny local server: open a
terminal in this folder and run `python3 -m http.server 8000`, then visit
`http://localhost:8000` in your browser.

---

## Step 2 — Set the "Message to buy" button

Open `script.js` and find:
```js
const CONTACT_MODE = "email";
const CONTACT_EMAIL = "hello@example.com";
```
Replace the email with your real one. Each "Message to buy" button will open
a pre-filled email with the item name. (If you'd rather route buyers to
Facebook Messenger instead, see Step 4 below — set `CONTACT_MODE` to
`"messenger"` and fill in your `m.me` link.)

---

## Step 3 — Add the free chatbot (Tawk.to)

1. Go to [tawk.to](https://www.tawk.to) and create a free account.
2. It'll walk you through adding a "property" (your website). Skip any paid prompts.
3. Go to **Administration → Channels → Chat Widget**. You'll see an embed
   code that looks like:
   ```html
   s1.src='https://embed.tawk.to/ABC123.../XYZ456...';
   ```
4. Open `index.html`, find the `<script>` block near the bottom marked
   `CHAT WIDGET`, and replace this line:
   ```js
   s1.src = 'https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
   ```
   with your actual IDs from Tawk.to.
5. Install the free **Tawk.to app** on your phone (iOS/Android) so you get
   a notification and can reply the moment someone messages you on the site.

That's it — a chat bubble now appears in the corner of every page, for free,
with no message limits.

**Alternative:** if you'd rather keep everything inside Facebook (since you
already use Marketplace), you can use the free **Facebook Page Messenger
plugin** instead of Tawk.to. That requires you to have a Facebook Page (not
just a personal profile) and to add your live domain to Meta's allowed
domains list under your Page's Messenger settings. Tawk.to is simpler to set
up for a first site, so it's the default here — but ask me any time if you'd
like the Facebook version instead.

---

## Step 4 — Put the site online for free (GitHub Pages)

1. Go to [github.com](https://github.com) and create a free account.
2. Click the **+** in the top right → **New repository**. Name it anything,
   e.g. `deal-depot`. Set it to **Public**. Click **Create repository**.
3. On the new repo page, click **uploading an existing file**, then drag in
   all 4 files from this folder (`index.html`, `style.css`, `script.js`,
   `products.csv`). Click **Commit changes**.
4. Go to the repo's **Settings → Pages**.
5. Under "Build and deployment", set **Source** to **Deploy from a branch**,
   branch **main**, folder **/(root)**. Click **Save**.
6. Wait 1–2 minutes, then refresh — GitHub will show you a live URL like
   `https://yourusername.github.io/deal-depot/`. That's your site, live,
   for free, forever.

---

## Step 5 — Buy a domain and connect it (optional but recommended)

A domain (e.g. `danasdealdepot.com`) costs roughly $9–15/year — the only
cost in this whole setup.

1. Buy a domain at [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)
   (sold at cost, no markup) or [Namecheap](https://www.namecheap.com)
   (very newbie-friendly, cheap first-year prices).
2. In your domain registrar's DNS settings, add these records so it points
   at GitHub Pages:
   - Four **A records** for the root domain (`@`), pointing to:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One **CNAME record** for `www`, pointing to `yourusername.github.io`
3. Back in your GitHub repo's **Settings → Pages**, enter your custom
   domain (e.g. `danasdealdepot.com`) in the "Custom domain" box and save.
   Tick **Enforce HTTPS** once it becomes available (can take a few hours).

DNS changes can take anywhere from 10 minutes to 24 hours to fully kick in —
this is normal, not a sign something's broken.

---

## Customizing later

- **Shop name / colors:** edit the text in `index.html` and the color
  values at the top of `style.css` (look for `:root`).
- **Adding products:** just add a row to `products.csv` and re-upload it.
- **Fonts:** currently Kalam (handwritten price tags), Work Sans (body
  text), and Space Mono (SKU codes) — all free via Google Fonts, already
  linked in `index.html`.

If anything breaks or you want changes (new sections, different layout,
payment buttons, etc.), come back and describe what you want — I can update
these files for you.
