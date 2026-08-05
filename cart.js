const cartContent = document.getElementById("cart-content");

// Plain-text version of the cart, for shoppers to copy/paste into
// Messenger (which — unlike email — can't be pre-filled automatically).
function buildCartSummaryText(items, total) {
  const lines = items.map(item => {
    const name = item.name || "Untitled item";
    const price = item.our_price ? `$${item.our_price}` : "";
    return price ? `- ${name} — ${price}` : `- ${name}`;
  });
  return `Hi! I'm interested in the following items:\n\n${lines.join("\n")}\n\nTotal: $${total.toFixed(2)}\n\nAre they still available?`;
}

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
  const summaryText = buildCartSummaryText(items, total);

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
      ${CONTACT_MODE === "messenger" ? `
        <div class="cart-copy-block">
          <p class="cart-copy-label">Copy this list, then paste it into your Messenger chat:</p>
          <textarea class="cart-copy-text" id="cart-copy-text" readonly rows="${items.length + 3}"></textarea>
          <button class="btn btn-outline cart-copy-btn" id="cart-copy-btn" type="button">Copy list</button>
        </div>
      ` : ""}
      <a class="tag-buy cart-inquire" href="${buyLinkMultiple(items.map(i => i.name))}" target="_blank" rel="noopener">Message about these items</a>
    </div>
  `;

  // Set the textarea's value via JS (not the template string above) so
  // item names/prices never need HTML-escaping.
  const copyTextEl = document.getElementById("cart-copy-text");
  if (copyTextEl) copyTextEl.value = summaryText;

  const copyBtn = document.getElementById("cart-copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(summaryText);
      } catch (e) {
        // Clipboard API unavailable (older browser, non-HTTPS, etc) —
        // fall back to selecting the text so the user can copy manually.
        copyTextEl.focus();
        copyTextEl.select();
        try { document.execCommand("copy"); } catch (e2) { /* give up quietly */ }
      }
      const original = copyBtn.textContent;
      copyBtn.textContent = "Copied ✓";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = original;
        copyBtn.classList.remove("copied");
      }, 1800);
    });
  }

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
