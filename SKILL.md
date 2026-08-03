---
name: product-url-to-csv
description: Extracts structured product data (name, description, full description, image folder/filenames, status) from one or more e-commerce product page URLs and compiles it into a product.csv file, with our_price and retail_price left as fixed 0 placeholders. Use this whenever the user pastes one or more product page URLs and wants the data pulled out, scraped, extracted, cataloged, or turned into a spreadsheet/CSV — regardless of retailer (Canadian Tire, Best Buy, Home Depot, Walmart, Amazon, etc.). Trigger this even if the user just pastes a list of URLs with no other instructions, since that's the primary way this skill gets used.
---

# Product URL to CSV

Turns product page URLs into rows of structured data in a `product.csv` file, so the data can be reviewed and reused (e.g. imported into a catalog or CMS).

## Output format

Every row has exactly these eight columns, in this order:

| Column | Meaning |
|---|---|
| `name` | A short summary of the product name/title — **5 words maximum**, not the full page title |
| `our_price` | Literally `0` for every row — this column always gets this fixed value. It's what the reseller will actually charge, which this skill has no way to know |
| `retail_price` | Literally `0` for every row — this column always gets this fixed value, regardless of what price the page actually shows. The reseller fills this in themselves later |
| `description` | A short description, **10 words maximum**. Use the page's own short/teaser copy if there is one; if the page doesn't have anything short enough or usable, write one yourself from what you know about the product — every row needs a description, never leave this blank |
| `description_full` | A fuller description, **50 words maximum**, combining detail copy, bullet points, and spec highlights. If the page doesn't give you enough to work with, write one yourself from what you know about the product — every row needs this too, never leave it blank |
| `image_folder` | The product name, used as the folder reference the images would live under |
| `images` | Literally the string `1.jpg;2.jpg;3.jpg;4.jpg;5.jpg` for every row — this column always gets this fixed value, regardless of how many images the page actually has |
| `status` | Literally the string `available` for every row, regardless of how the scrape went — this column always gets this fixed value |

## Workflow

1. **Collect the URLs.** The user typically pastes these directly in chat, one or more per message.
2. **Fetch each page** with `web_fetch`. Do this one URL at a time — don't try to batch multiple URLs into one fetch.
3. **Extract the fields** by reading the fetched page content (see Field extraction below).
4. **Assemble one JSON record per product** with the eight keys above, and collect them into a list.
5. **Write the CSV** using the bundled script rather than hand-formatting the file yourself:
   ```bash
   python -m scripts.build_csv /path/to/records.json /mnt/user-data/outputs/product.csv
   ```
   Hand-joining fields with commas is what this script exists to avoid — product names and descriptions routinely contain commas, quotes, and stray whitespace that break a naively-written CSV.
6. **Present** `product.csv` to the user with `present_files` so they can review it.

## Field extraction

Retailer sites vary a lot in markup, so treat this as "find the right information," not "find it at this exact selector." A few things that generalize well across most e-commerce sites:

- **Name**: start from the page's main heading / product title, then boil it down to 5 words or fewer — keep the brand and the most identifying feature, drop size/color/model-number clutter unless nothing else distinguishes the product (e.g. "SportRack SR4885 Upshift Plus 1-Bike Upright Roof Top Mount Bike Rack, Black" → "SportRack Upright Bike Roof Rack").
- **our_price**: don't bother looking for this on the page — `our_price` is a fixed value (`0`) on every row, not derived from the actual page. The reseller fills this in themselves later.
- **retail_price**: don't bother looking for this on the page either — `retail_price` is also a fixed value (`0`) on every row, not derived from the actual page. The reseller fills this in themselves later, same as `our_price`.
- **description vs. description_full**: many product pages have both a short teaser (a sentence or two, sometimes shown above the fold) and a longer detail section (specs, bullet lists, "About this item," etc.) further down. Trim these down to fit the word limits (10 words for `description`, 50 for `description_full`) — cut filler and marketing flourish, keep the concrete facts (what it is, key features, materials, dimensions). Leave out warranty terms and condition/new-vs-used information entirely — that's not what these fields are for. When the page doesn't give you enough — or anything at all, as with a page that failed to load properly — write both fields yourself based on what the product name and any other context tells you it likely is. A reasonable, clearly-labeled-nowhere-as-fake description is more useful here than an empty cell.
- **image_folder**: same value as the (shortened) `name`. Its only purpose here is to tell whoever processes this CSV later which folder to save that product's images into.
- **images**: don't bother inspecting the page's image gallery — this field is a fixed placeholder value (`1.jpg;2.jpg;3.jpg;4.jpg;5.jpg`) on every row, not derived from the actual page.

## Failure handling

Sometimes a page won't load, will be blocked, or will be missing a field (this is common — many retail sites render price, and sometimes the whole page, via JavaScript that a plain fetch never sees). Don't let one bad URL stop the whole batch — always add a row for every URL given:

- `status` is always `"available"` and `our_price` and `retail_price` are always `0`, no matter what happened during the scrape — none of these columns vary (see Output format above).
- For `name`, fall back to a cleaned-up, 5-word-max version of the URL slug if the page didn't yield a usable title (e.g. `sportrack-sr4885-upshift-plus-1-bike...` → `SportRack Upright Bike Roof Rack`).
- `description` and `description_full` are never left blank — if the page doesn't give you enough, write them yourself (see Field extraction above), staying within the 10-word and 50-word limits.
- For any other field that's genuinely unavailable, leave it blank rather than inventing a value.
- Even though every row's `status` says `available`, still tell the user in your reply which rows had missing data (e.g. "Canadian Tire's page didn't return usable content — name is a best guess from the URL, and the description fields are blank") so they know which rows need a manual look before trusting the file.

## Example

Input:
```
https://www.canadiantire.ca/en/pdp/sportrack-sr4885-upshift-plus-1-bike-upright-roof-top-mount-bike-rack-black-0401178p.html
```

Output row:
```
name: SportRack Upright Bike Roof Rack
our_price: 0
retail_price: 0
description: A roof-mounted upright bike rack that carries one bike securely on top of your vehicle.
description_full: Upright roof mount holds bike by the wheels for a frame-safe carry. Tool-free assembly and mounting. Fits most factory and aftermarket crossbars. Includes integrated cable lock. Compatible with most bike types including many full-suspension frames...
image_folder: SportRack Upright Bike Roof Rack
images: 1.jpg;2.jpg;3.jpg;4.jpg;5.jpg
status: available
```
