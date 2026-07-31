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
    const price = item.price ? `$${item.price}` : "";
    const desc = item.description || "";
    const image = getFirstImage(item);
    const isSold = isSoldRow(item);
    const productUrl = `product.html?id=${encodeURIComponent(name)}`;

    return `
      <div class="tag-card">
        <div class="tag-string"></div>
        <div class="tag-body">
          <div class="tag-hole"></div>
          ${isSold ? '<div class="sold-stamp">SOLD</div>' : ""}
          <a href="${productUrl}" class="tag-photo-link">
            <img class="tag-photo" src="${image}" alt="${name}" loading="lazy">
          </a>
          <div class="tag-info">
            <a href="${productUrl}" class="tag-name-link"><p class="tag-name">${name}</p></a>
            <p class="tag-desc">${desc}</p>
            <div class="tag-row">
              <span class="tag-price">${price}</span>
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

function showLoadError() {
  statusLine.textContent = "";
  grid.innerHTML = '<p class="error-state">Couldn\'t load the product list. Check products.csv.</p>';
}

loadCsv(CSV_URL, renderProducts, showLoadError);
