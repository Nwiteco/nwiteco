const grid = document.getElementById("product-grid");
const statusLine = document.getElementById("status-line");

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
    const price = item.our_price ? `$${item.our_price}` : "";
    const retailPrice = getRetailPrice(item);
    const desc = item.description || "";
    const image = getFirstImage(item);
    const isSold = isSoldRow(item);
    const statusLabel = getStatusLabel(item);
    const productUrl = `product.html?id=${encodeURIComponent(name)}`;

    return `
      <div class="tag-card">
        <div class="tag-string"></div>
        <div class="tag-body">
          <div class="tag-hole"></div>
          ${isSold ? '<div class="sold-stamp">SOLD</div>' : ""}
          ${!isSold && statusLabel ? `<div class="stock-badge">${statusLabel}</div>` : ""}
          <a href="${productUrl}" class="tag-photo-link">
            <img class="tag-photo" src="${image}" alt="${name}" loading="lazy">
          </a>
          <div class="tag-info">
            <a href="${productUrl}" class="tag-name-link"><p class="tag-name">${name}</p></a>
            <p class="tag-desc">${desc}</p>
            <div class="tag-row">
              <span class="price-label">Our price</span>
              <span class="tag-price">${price}</span>
              ${retailPrice ? `<span class="tag-retail"><s class="tag-retail-label">Retail Price</s><s class="tag-retail-value">${retailPrice}</s></span>` : ""}
            </div>
            ${isSold
              ? '<button class="tag-buy" disabled style="opacity:0.5;cursor:not-allowed;">Sold</button>'
              : `<button class="tag-buy" data-name="${escapeAttr(name)}">Add to cart</button>`
            }
          </div>
        </div>
      </div>`;
  }).join("");

  attachCartButtons(grid);
}

function showLoadError() {
  statusLine.textContent = "";
  grid.innerHTML = '<p class="error-state">Couldn\'t load the product list. Check products.csv.</p>';
}

loadCsv(CSV_URL, renderProducts, showLoadError);
