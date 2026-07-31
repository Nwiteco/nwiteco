/*
  Shared config and helpers used by both script.js (home page) and
  product.js (product detail page). Loaded before either of those files.
*/

// Product data lives in products.csv, sitting next to these files.
const CSV_URL = "products.csv";

// Where "Message to buy" sends people. Defaults to a mailto link
// pre-filled with the item name. Swap for your Facebook Page Messenger
// link (m.me/yourpagename) if you'd rather chat there.
const CONTACT_MODE = "email"; // "email" or "messenger"
const CONTACT_EMAIL = "hello@example.com";
const MESSENGER_LINK = "https://m.me/yourpagename";

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

function buyLink(itemName) {
  if (CONTACT_MODE === "messenger") return MESSENGER_LINK;
  const subject = encodeURIComponent("I want to buy: " + itemName);
  const body = encodeURIComponent("Hi! Is this item still available?\n\nItem: " + itemName);
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
