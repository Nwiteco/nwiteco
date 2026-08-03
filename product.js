const content = document.getElementById("product-content");

function getRequestedId() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("id") || "").trim();
}

function renderProduct(row) {
  const name = row.name || "Untitled item";
  const price = row.our_price ? `$${row.our_price}` : "";
  const retailPrice = row.retail_price ? `$${row.retail_price}` : "";
  const desc = row.description_full || row.description || "";
  const isSold = isSoldRow(row);
  const statusLabel = getStatusLabel(row);
  const images = imageList(row);
  const mainImage = images[0] || "https://placehold.co/800x600?text=No+Photo";

  document.title = `${name} — Nwiteco`;

  content.innerHTML = `
    <div class="product-layout">
      <div>
        <div class="gallery-main">
          <img id="main-image" src="${mainImage}" alt="${name}">
        </div>
        ${images.length > 1 ? `
          <div class="gallery-thumbs" id="gallery-thumbs">
            ${images.map((src, i) => `<img src="${src}" alt="${name} photo ${i + 1}" class="${i === 0 ? "active" : ""}" data-src="${src}">`).join("")}
          </div>` : ""}
      </div>
      <div class="product-detail-tag">
        <div class="tag-hole"></div>
        <h1>${name}</h1>
        <div class="product-detail-price-row">
          <span class="price-label">Our price</span>
          <span class="product-detail-price">${price}</span>
          ${retailPrice ? `<span class="tag-retail"><s><span class="tag-retail-label">Retail Price</span> <span class="tag-retail-value">${retailPrice}</span></s></span>` : ""}
        </div>
        ${isSold ? '<div class="product-sold-banner">Sold</div><br>' : ""}
        ${!isSold && statusLabel ? `<div class="product-stock-banner">${statusLabel}</div><br>` : ""}
        <p class="product-detail-desc">${desc}</p>
        ${isSold
          ? '<button class="tag-buy" disabled style="opacity:0.5;cursor:not-allowed;max-width:260px;">Sold</button>'
          : `<button class="tag-buy" style="display:inline-block;max-width:260px;" data-name="${escapeAttr(name)}">Add to cart</button>`
        }
      </div>
    </div>
  `;

  const thumbs = document.getElementById("gallery-thumbs");
  if (thumbs) {
    thumbs.addEventListener("click", (e) => {
      if (e.target.tagName !== "IMG") return;
      document.getElementById("main-image").src = e.target.dataset.src;
      thumbs.querySelectorAll("img").forEach(img => img.classList.remove("active"));
      e.target.classList.add("active");
    });
  }

  attachCartButtons(content);
}

function showNotFound() {
  content.innerHTML = `
    <div class="error-state">
      <p>Couldn't find that item — it may have sold or the link is out of date.</p>
      <p><a href="index.html#shop">Browse everything currently available &rarr;</a></p>
    </div>`;
}

const requestedId = getRequestedId();

if (!requestedId) {
  showNotFound();
} else {
  loadCsv(CSV_URL, (rows) => {
    const match = rows.find(r => (r.name || "").trim() === requestedId);
    if (match) {
      renderProduct(match);
    } else {
      showNotFound();
    }
  }, showNotFound);
}
