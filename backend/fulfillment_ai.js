// backend/fulfillment_ai.js
// Abigail Fulfillment AI - stub for Auto-ordering & tracking flow
// - schedulePlaceOrder(order) : will call supplier adapter
// - handleTrackingUpdate(supplierOrderId)

import { exampleSupplierAdapter } from "./sync_engine.js";
import { sendToBridge } from "./whatsapp_bridge.js"; // assumes you have this file

export async function schedulePlaceOrder(order) {
  // order: { orderId, productRef, quantity, customer: {name, phone, address} }
  try {
    // 1) choose supplier (use logic: best price, stock, shipping)
    const supplier = exampleSupplierAdapter;

    // 2) create supplier order
    const resp = await supplier.placeOrder({
      productRef: order.productRef,
      qty: order.quantity,
      customer: order.customer
    });

    // 3) persist supplier order id (here: console)
    console.log("Supplier response:", resp);

    // 4) notify customer via bridge
    if (order.customer?.phone) {
      await sendToBridge({
        to: order.customer.phone,
        text: `Merci ${order.customer.name}, votre commande est passée. Réf: ${resp.supplierOrderId || resp.id || "en attente"}`
      });
    }

    return { ok: true, supplierResp: resp };
  } catch (e) {
    console.error("schedulePlaceOrder error", e.message || e);
    return { ok: false, error: e.message || String(e) };
  }
}

export async function handleTrackingUpdate(supplierOrderId, tracking) {
  // TODO: persist tracking, notify customer, update shop order
  console.log("Tracking update", supplierOrderId, tracking);
}
