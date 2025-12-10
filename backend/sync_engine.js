// backend/sync_engine.js
// Abigail Sync Engine (DSers-like) - MVP stub
// - Mappe produits fournisseurs -> catalogue local
// - Synchronise prix & stock (simulate polling logic)
// - TODO: add scheduling, DB persistence, supplier adapters.

import axios from "axios";

/**
 * mapSupplierProduct(supplierId, supplierProductData)
 * returns mapped product object for local catalog
 */
export function mapSupplierProduct(supplierId, supplierProductData) {
  // Basic mapping example
  return {
    supplierId,
    supplierSku: supplierProductData.sku || supplierProductData.id || null,
    title: supplierProductData.title || supplierProductData.name,
    priceSupplier: supplierProductData.price || supplierProductData.cost,
    images: supplierProductData.images || [],
    variations: supplierProductData.variants || [],
    lastSeen: Date.now()
  };
}

/**
 * syncPricesAndStock(localCatalog, supplierAdapter)
 * - localCatalog: array of items {id, supplierRef, desiredMargin...}
 * - supplierAdapter.getProduct(supplierRef) must exist
 */
export async function syncPricesAndStock(localCatalog, supplierAdapter) {
  const results = [];
  for (const item of localCatalog) {
    try {
      const sup = await supplierAdapter.getProduct(item.supplierRef);
      // compute retail price by margin
      const desiredMargin = item.desiredMargin || 0.4;
      const cost = sup.price || 0;
      const retail = Math.round((cost / (1 - desiredMargin)) * 100) / 100;

      // update stub (in real: update DB)
      results.push({ id: item.id, stock: sup.stock ?? null, cost, retail });
    } catch (e) {
      results.push({ id: item.id, error: e.message || String(e) });
    }
  }
  return results;
}

/**
 * Example supplierAdapter (to be implemented per supplier: CJ, AliExpress, etc.)
 * functions: getProduct(ref), placeOrder(orderData)
 */
export const exampleSupplierAdapter = {
  async getProduct(ref) {
    // TODO: implement API or scraping by product url/ref
    return { id: ref, price: 12.5, stock: 50, title: "Mock product", images: [] };
  },
  async placeOrder(orderData) {
    // TODO: implement real order placement for supplier
    return { ok: true, supplierOrderId: "MOCK-ORD-123" };
  }
};
