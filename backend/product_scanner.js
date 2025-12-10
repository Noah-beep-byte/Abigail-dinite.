// backend/product_scanner.js
// Abigail Product Scanner (MVP stub)
// - Expose des fonctions pour extraire métadonnées d'une page produit.
// - Utilise axios pour requests HTML + parsing basique.
// - TODO: remplacer / améliorer par puppeteer pour JS heavy pages.

import axios from "axios";
import { JSDOM } from "jsdom";

/**
 * scanProduct(url)
 * returns: { title, price, images:[], variations:[], stock, seller, shipping, raw }
 */
export async function scanProduct(url) {
  try {
    const resp = await axios.get(url, { timeout: 15000, headers: { "User-Agent": "Mozilla/5.0" } });
    const dom = new JSDOM(resp.data);
    const doc = dom.window.document;

    // Heuristiques simples — améliorables
    const title = doc.querySelector("title")?.textContent?.trim() || "";
    const imgs = Array.from(doc.querySelectorAll("img")).map(i => i.src).filter(Boolean);
    const priceEl = doc.querySelector("[class*=price], [id*=price], meta[itemprop=price]")?.textContent || 
                    doc.querySelector("meta[property='product:price:amount']")?.content || "";
    const price = priceEl ? priceEl.trim() : "";

    // variations & stock: placeholders
    const variations = []; // TODO: parse selects/options
    const stock = null;
    const seller = doc.querySelector("[class*=seller], [class*=store], meta[name=author]")?.textContent || "";
    const shipping = null;

    return { url, title, price, images: imgs.slice(0, 12), variations, stock, seller, shipping, raw: resp.data.slice(0, 5000) };
  } catch (e) {
    console.error("scanProduct error", e.message || e);
    return { error: true, message: e.message || String(e) };
  }
}
