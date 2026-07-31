/*
  Product data lives in products.csv, sitting next to this script.
  Open that file in any spreadsheet app (Excel, Numbers, Google Sheets,
  or a plain text editor) to add, edit, or remove items, then save it
  back out as products.csv. See README.md for details.
*/
const CSV_URL = "products.csv";

/*
  Where "Message to buy" sends people. Defaults to a mailto link
  pre-filled with the item name. Swap for your Facebook Page Messenger
  link (m.me/yourpagename) if you'd rather chat there.
*/
const CONTACT_MODE = "email"; // "email" or "messenger"
const CONTACT_EMAIL = "hello@example.com";
const MESSENGER_LINK = "https://m.me/yourpagename";

const grid = document.getElementById("product-grid");
const statusLine = document.getElementById("status-line");

function buyLink(itemName) {
  if (CONTACT_MODE === "messenger") return MESSENGER_LINK;
  const subject = encodeURIComponent("I want to buy: " + itemName);
  const body = encodeURIComponent("Hi! Is this item still available?\n\nItem: " + itemName);
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

function renderProducts(rows) {
  const items = rows.filter(r => (r.name || "").trim() !== "");

  if (items.length === 0) {
    statusLine.textContent = "";
    grid.innerHTML = '<p class="empty-state">Nothing tagged yet — check back soon.</p>';
    return;
  }

  statusLine.textContent = `${items.length} item${items.length === 1 ? "" : "s"} on the rack`;

  grid.innerHTML = items.map(item => {
    const name = item.name || "Untitled item";
    const price = item.price ? `$${item.price}` : "";
    const desc = item.description || "";
    const image = item.image || "https://placehold.co/400x300?text=No+Photo";
    const sku = item.sku || "";
    const isSold = (item.status || "").trim().toLowerCase() === "sold";

    return `
      <div class="tag-card">
        <div class="tag-string"></div>
        <div class="tag-body">
          <div class="tag-hole"></div>
          ${isSold ? '<div class="sold-stamp">SOLD</div>' : ""}
          <img class="tag-photo" src="${image}" alt="${name}" loading="lazy">
          <div class="tag-info">
            <p class="tag-name">${name}</p>
            <p class="tag-desc">${desc}</p>
            <div class="tag-row">
              <span class="tag-price">${price}</span>
              <span class="tag-sku">${sku}</span>
            </div>
            ${isSold
              ? '<button class="tag-buy" disabled style="opacity:0.5;cursor:not-allowed;">Sold</button>'
              : `<a class="tag-buy" href="${buyLink(name)}" target="_blank" rel="noopener">Message to buy</a>`
            }
          </div>
        </div>
      </div>`;
  }).join("");
}

function loadCsv(url, onSuccess, onError) {
  Papa.parse(url, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (results) => onSuccess(results.data),
    error: onError
  });
}

function init() {
  loadCsv(CSV_URL, renderProducts, showLoadError);
}

function showLoadError() {
  statusLine.textContent = "";
  grid.innerHTML = '<p class="error-state">Couldn\'t load the product list. Check products.csv or your Google Sheet link.</p>';
}

init();
