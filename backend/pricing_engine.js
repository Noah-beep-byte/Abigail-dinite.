// backend/pricing_engine.js
// Abigail Smart Pricing - basic rules engine
// - computeRetailPrice(cost, rules)
// - rule ideas: margin, competitor undercut, dynamic multiplier based on conversion

/**
 * computeRetailPrice(cost, rules)
 * rules = { targetMargin:0.35, competitorAdjustment:-0.05, shippingCost:2 }
 */
export function computeRetailPrice(cost, rules = {}) {
  const targetMargin = rules.targetMargin ?? 0.35;
  const shipping = rules.shippingCost ?? 0;
  const base = cost + shipping;
  let price = base / (1 - targetMargin);

  // competitor adjustment (if competitor lowered price)
  if (rules.competitorPrice) {
    const comp = Number(rules.competitorPrice);
    // if competitor price lower than our price, we can decide to undercut slightly
    if (!isNaN(comp) && comp > 0) {
      const undercut = Math.max(0, comp - 0.5); // undercut 0.5 by default
      // choose smaller of calculated price and undercut strategy
      price = Math.min(price, undercut);
    }
  }

  // round nicely
  return Math.round(price * 100) / 100;
}
