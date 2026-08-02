/*
  Shared config and helpers used by every page (home, product detail, cart).
  Loaded before the page-specific script.
*/

// Product data lives in products.csv, sitting next to these files.
const CSV_URL = "products.csv";

// Where "Message about these items" sends people from the cart. Defaults
// to a mailto link pre-filled with every item in the cart. Swap for your
// Facebook Page Messenger link (m.me/yourpagename) if you'd rather chat
// there — note Messenger links can't be pre-filled with item names, so
// the message would need to be typed in manually on that platform.
const CONTACT_MODE = "email"; // "email" or "messenger"
const CONTACT_EMAIL = "hello@example.com";
const MESSENGER_LINK = "https://m.me/yourpagename";

// Key used to store the cart in the visitor's browser (localStorage).
// The cart is per-browser/device — nothing is sent anywhere until the
// customer taps the inquiry button on the cart page.
const CART_KEY = "nwiteco_cart";

function getFirstImage(row) {
  const list = imageList(row);
  return list.length ? list[0] : "https://placehold.co/400x300?text=No+Photo";
}

function imageList(row) {
  const folder = (row.image_folder || "").trim();
  const files = (row.images || "").split(";").map(f => f.trim()).filter(Boolean);
  if (!folder || files.length === 0) return [];
  return files.map(f => `images/${encodeURIComponent(folder)}/${encodeURIComponent(f)}`);
}

function isSoldRow(row) {
  return (row.status || "").trim().toLowerCase() === "sold";
}

function getStatusLabel(row) {
  const status = (row.status || "").trim();
  if (!status) return null;
  const lower = status.toLowerCase();
  if (lower === "available" || lower === "sold") return null;
  return status;
}

// Escapes a value for safe use inside an HTML attribute (e.g. data-name="...").
function escapeAttr(str) {
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function buyLink(itemName) {
  if (CONTACT_MODE === "messenger") return MESSENGER_LINK;
  const subject = encodeURIComponent("I want to buy: " + itemName);
  const body = encodeURIComponent("Hi! Is this item still available?\n\nItem: " + itemName);
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

// Same idea as buyLink, but for inquiring about several items in the cart
// at once.
function buyLinkMultiple(itemNames) {
  if (CONTACT_MODE === "messenger") return MESSENGER_LINK;
  const subject = encodeURIComponent(
    `I want to buy ${itemNames.length} item${itemNames.length === 1 ? "" : "s"}`
  );
  const list = itemNames.map(n => `- ${n}`).join("\n");
  const body = encodeURIComponent(
    `Hi! I'm interested in the following items:\n\n${list}\n\nAre they still available?`
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
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

/* =========================================================
   Cart (stored in the visitor's browser via localStorage)
   ========================================================= */

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveCart(itemNames) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(itemNames));
  } catch (e) {
    // Storage unavailable (private browsing, quota, etc). Fail quietly.
  }
}

function isInCart(name) {
  return getCart().includes(name);
}

function addToCart(name) {
  const cart = getCart();
  if (!cart.includes(name)) {
    cart.push(name);
    saveCart(cart);
  }
  updateCartBadge();
}

function removeFromCart(name) {
  const cart = getCart().filter(n => n !== name);
  saveCart(cart);
  updateCartBadge();
}

// Updates the little count badge next to the "Cart" link in the header,
// if one is present on the page.
function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  const count = getCart().length;
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline-flex" : "none";
}

// Wires up every "Add to cart" button inside a container so it toggles
// the item in/out of the cart and reflects the current state. Used on
// both the home page grid and the product detail page.
function attachCartButtons(container) {
  container.querySelectorAll(".tag-buy[data-name]").forEach(btn => {
    const name = btn.dataset.name;

    const refresh = () => {
      if (isInCart(name)) {
        btn.textContent = "In cart ✓";
        btn.classList.add("in-cart");
      } else {
        btn.textContent = "Add to cart";
        btn.classList.remove("in-cart");
      }
    };

    refresh();

    btn.addEventListener("click", () => {
      if (isInCart(name)) {
        removeFromCart(name);
      } else {
        addToCart(name);
      }
      refresh();
    });
  });
}

// Keep the header badge in sync on every page as soon as this file loads.
updateCartBadge();

/* =========================================================
   Mobile menu (hamburger toggle in the header)
   ========================================================= */

// Shared by index.html, product.html, and cart.html. Toggles the nav
// links open/closed on narrow screens, and closes automatically when a
// link is tapped or the window is resized back up to desktop width.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  const closeMenu = () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
});
