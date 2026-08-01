# Dana's Deal Depot — setup guide

This is a plain website: no software to install, no monthly hosting bill.
Follow the steps in order. Total time: about 45–60 minutes the first time.

Files in this folder:
- `index.html` — the home page (product grid)
- `product.html` — the product detail page (one page, reused for every item)
- `cart.html` — the cart page, where shoppers review everything they've
  added and send one message about it all
- `style.css` — all the visual design
- `product-utils.js` — shared settings (contact email, CSV location), cart
  logic, and helper functions used by every page
- `script.js` — builds the home page cards
- `product.js` — builds the detail page for whichever item was clicked
- `cart.js` — builds the cart page
- `products.csv` — your product list
- `images/` — one folder per product, containing that product's photos

---

## How the cart works

Shoppers tap **"Add to cart"** on any item (from the home page grid or a
product's own page). The button flips to **"In cart ✓"** — tapping it again
removes the item. A small count badge appears next to **Cart** in the
header on every page.

From the cart page, they see every item they've added, its price, and a
running **total**. One button — **"Message about these items"** — opens a
single pre-filled email (or Messenger, if you've switched `CONTACT_MODE`)
listing everything in the cart, so they only have to send one inquiry
instead of one per item.

The cart is stored in the shopper's own browser (via `localStorage`), not
on a server — there's no account or login. That means:
- It's per device/browser. If someone adds items on their phone and later
  opens the site on their laptop, the cart will be empty there.
- Clearing browser data, using private/incognito mode, or switching
  browsers will also clear it.
- Nothing is sent to you until the shopper actually taps "Message about
  these items" — adding to cart is just a local, temporary list.

This keeps things simple and free (no backend needed) while still letting
people batch up their questions into one message.

---

## Step 1 — Add photos to the images folder

Inside `images/`, create one folder per product, named exactly whatever you
want (spaces are fine), and drop that product's photos inside — as many as
you like, in whatever order you want them to appear.

```
images/
  Bike Rack/
    1.jpg
    2.jpg
    3.jpg
  Cast Iron Skillet/
    1.jpg
    2.jpg
```

Keep the filenames simple (`1.jpg`, `2.jpg`, etc. is easiest). The first
image in the list becomes the thumbnail shown on the home page.

---

## Step 2 — Manage products in products.csv

All your products live in `products.csv`, sitting right next to the website
files. It's a plain spreadsheet file — open it in Excel, Numbers, Google
Sheets, or even a basic text editor, edit it, and save.

1. Open `products.csv`. You'll see one row per product and these column
   headers in row 1:
   `name`, `price`, `description`, `description_full`, `image_folder`, `images`, `status`
2. Notes on each column:
   - **name** — required, and must be different for every product. It's
     shown on the site and is also what links a home page card to its
     product page (and how the cart matches saved items back to real
     products), so avoid using the exact same name twice.
   - **price** — just the number, e.g. `85` (no dollar sign)
   - **description** — a short one-line teaser shown on the home page card
   - **description_full** — the longer write-up shown on the product page
     (condition notes, dimensions, pickup details, etc.)
   - **image_folder** — the exact name of that product's folder inside
     `images/`, e.g. `Bike Rack`
   - **images** — the filenames inside that folder, separated by
     semicolons, in the order you want them shown, e.g. `1.jpg;2.jpg;3.jpg`
   - **status** — controls the badge shown on both pages:
     - leave blank, or write `available`, for normal items (no badge)
     - write `sold` for a "Sold" stamp across the photo, and the buy
       button is replaced with a disabled "Sold" button. If a shopper
       already has that item sitting in their cart from before it sold,
       the cart page will flag it so they know to remove it.
     - write anything else — e.g. `only 1 left`, `only 3 left`,
       `reserved` — and that exact text shows as a small badge in the
       corner of the photo, while the buy button stays active
3. Save the file, making sure it stays named `products.csv` and stays in
   the same folder as `index.html`.
   - **If using Excel or Numbers:** use "Save As" and choose the **CSV**
     format specifically — saving as `.xlsx` or `.numbers` will break it.
4. If your site is already uploaded to GitHub Pages, upload the updated
   `products.csv` (and any new image folders) to the same repo — the live
   site updates within a minute or two.

**Important:** because browsers block a webpage from reading local files
for security reasons, `products.csv` and your images will only load when
the site is viewed through a real web address (like your GitHub Pages URL
or your own domain) — not when you just double-click `index.html` on your
computer. To preview changes locally before uploading, run a tiny local
server: open a terminal in this folder and run `python3 -m http.server
8000`, then visit `http://localhost:8000` in your browser.

Clicking any product's photo or name on the home page takes shoppers to its
own page (`product.html?id=...`) with the full photo gallery and the
longer description.

---

## Step 3 — Set the "Message about these items" button

Open `product-utils.js` and find:
```js
const CONTACT_MODE = "email";
const CONTACT_EMAIL = "hello@example.com";
```
Replace the email with your real one — this one file controls the cart's
inquiry button, and every "Add to cart" button on the home page and product
pages. When a shopper sends the cart message, it'll open a pre-filled email
listing every item they added. (If you'd rather route buyers to Facebook
Messenger instead, set `CONTACT_MODE` to `"messenger"` and fill in your
`m.me` link just below it — note Messenger links can't be pre-filled with
the item list the way email can, so shoppers would need to type that part
themselves.)

---

## Step 4 — Add the free chatbot (Tawk.to)

1. Go to [tawk.to](https://www.tawk.to) and create a free account.
2. It'll walk you through adding a "property" (your website). Skip any paid prompts.
3. Go to **Administration → Channels → Chat Widget**. You'll see an embed
   code that looks like:
   ```html
   s1.src='https://embed.tawk.to/ABC123.../XYZ456...';
   ```
4. Open `index.html`, `product.html`, **and** `cart.html`, find the
   `<script>` block near the bottom marked `CHAT WIDGET` in each, and
   replace this line:
   ```js
   s1.src = 'https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
   ```
   with your actual IDs from Tawk.to, so the chat bubble shows up on the
   home page, product pages, and the cart page.
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

## Step 5 — Put the site online for free (GitHub Pages)

1. Go to [github.com](https://github.com) and create a free account.
2. Click the **+** in the top right → **New repository**. Name it anything,
   e.g. `deal-depot`. Set it to **Public**. Click **Create repository**.
3. On the new repo page, click **uploading an existing file**, then drag in
   everything from this folder: `index.html`, `product.html`, `cart.html`,
   `style.css`, `product-utils.js`, `script.js`, `product.js`, `cart.js`,
   `products.csv`, and the whole `images` folder. Click **Commit changes**.
4. Go to the repo's **Settings → Pages**.
5. Under "Build and deployment", set **Source** to **Deploy from a branch**,
   branch **main**, folder **/(root)**. Click **Save**.
6. Wait 1–2 minutes, then refresh — GitHub will show you a live URL like
   `https://yourusername.github.io/deal-depot/`. That's your site, live,
   for free, forever.

---

## Step 6 — Buy a domain and connect it (optional but recommended)

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

- **Shop name / colors:** edit the text in `index.html`, `product.html`,
  and `cart.html`, and the color values at the top of `style.css` (look
  for `:root`).
- **Adding products:** add photos to a new folder in `images/`, add a
  matching row to `products.csv`, and re-upload both.
- **Fonts:** currently Kalam (handwritten price tags), Work Sans (body
  text), and Space Mono (small labels like the status line) — all free via
  Google Fonts, already linked in each HTML page.

If anything breaks or you want changes (new sections, different layout,
payment buttons, etc.), come back and describe what you want — I can update
these files for you.
