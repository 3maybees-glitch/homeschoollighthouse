import assert from "node:assert/strict";
import test from "node:test";
import { selectNavigatorPriceId, type NavigatorPriceSnapshot } from "./navigator-price.ts";

const archivedSeventySeven: NavigatorPriceSnapshot = {
  id: "price_old_77",
  active: false,
  currency: "usd",
  type: "one_time",
  unitAmount: 7700,
  productId: "prod_navigator",
  productName: "The Navigator",
};

const currentFortySeven: NavigatorPriceSnapshot = {
  id: "price_current_47",
  active: true,
  currency: "usd",
  type: "one_time",
  unitAmount: 4700,
  productId: "prod_navigator",
  productName: "The Navigator",
};

test("keeps the configured price when it is already the active $47 price", () => {
  assert.equal(selectNavigatorPriceId(currentFortySeven, [archivedSeventySeven]), "price_current_47");
});

test("replaces an archived $77 price with the active $47 price on the same product", () => {
  assert.equal(
    selectNavigatorPriceId(archivedSeventySeven, [archivedSeventySeven, currentFortySeven]),
    "price_current_47",
  );
});

test("finds the $47 price on a renamed Navigator product", () => {
  const otherProduct = {
    ...currentFortySeven,
    id: "price_new_product_47",
    productId: "prod_navigator_v2",
  };
  assert.equal(selectNavigatorPriceId(archivedSeventySeven, [otherProduct]), "price_new_product_47");
});

test("does not charge an unrelated $47 price", () => {
  const unrelated: NavigatorPriceSnapshot = {
    ...currentFortySeven,
    id: "price_other_47",
    productId: "prod_other",
    productName: "Something Else",
  };
  assert.equal(selectNavigatorPriceId(archivedSeventySeven, [unrelated]), null);
});

test("does not use an active price that is still $77", () => {
  const stillWrong: NavigatorPriceSnapshot = { ...archivedSeventySeven, active: true };
  assert.equal(selectNavigatorPriceId(stillWrong, []), null);
});
