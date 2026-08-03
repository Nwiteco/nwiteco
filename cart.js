const cartContent = document.getElementById("cart-content");

function renderCart(rows) {
  const cart = getCart();
  const items = rows.filter(r => cart.includes((r.name || "").trim()));

  if (items.length === 0) {
    cartContent.innerHTML = `
      <div class="empty-state">
        <p>Your cart is empty.</p>
        <p><a href="index.html#shop">Browse the rack &rarr;</a></p>
      </div>`;
    return;
  }

  const total = items.reduce((sum, item) => sum + (parseFloat(item.our_price) || 0), 0);
  const soldItems = items.filter(isSoldRow);

  cartContent.innerHTML = `
    <div class="cart-list">
      ${items.map(item => {
        const name = item.name || "Untitled item";
        const price = item.our_price ? `$${item.our_price}` : "";
        const retailPrice = getRetailPrice(item);
        const image = getFirstImage(item);
        const sold = isSoldRow(item);
        const productUrl = `product.html?id=${encodeURIComponent(name)}`;
        return `
          <div class="cart-row">
            <a href="${productUrl}" class="tag-photo-link">
              <img class="cart-thumb" src="${image}" alt="${name}">
            </a>
            <div class="cart-row-info">
              <a href="${productUrl}" class="tag-name-link"><p class="cart-row-name">${name}</p></a>
              <p class="cart-row-price">
                <span class="price-label">Our price</span> ${price}
                ${retailPrice ? `<span class="tag-retail"><s class="tag-retail-label">Retail Price</s><s class="tag-retail-value">${retailPrice}</s></span>` : ""}
              </p>
              ${sold ? '<p class="cart-row-sold">This item just sold — you can still remove it below.</p>' : ""}
            </div>
            <button class="cart-remove" data-name="${escapeAttr(name)}">Remove</button>
          </div>`;
      }).join("")}
    </div>
    <div class="cart-summary">
      <p class="cart-total">Total: $${total.toFixed(2)}</p>
      ${soldItems.length > 0
        ? '<p class="cart-warning">One or more items in your cart have sold — remove them before sending your message.</p>'
        : ""
      }
      <a class="tag-buy cart-inquire" href="${buyLinkMultiple(items.map(i => i.name))}" target="_blank" rel="noopener">Message about these items</a>
    </div>
  `;

  cartContent.querySelectorAll(".cart-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.dataset.name);
      renderCart(rows);
    });
  });
}

function showCartError() {
  cartContent.innerHTML = '<p class="error-state">Couldn\'t load your cart. Check products.csv.</p>';
}

loadCsv(CSV_URL, renderCart, showCartError);
