import assert from "node:assert/strict";
import test from "node:test";
import { paginate } from "./paginate.ts";

test("returns the first page of a large catalog", () => {
  const items = Array.from({ length: 16000 }, (_, index) => index);
  const page = paginate(items, 1);
  assert.equal(page.items.length, 24);
  assert.equal(page.total, 16000);
  assert.equal(page.rangeStart, 1);
  assert.equal(page.rangeEnd, 24);
  assert.equal(page.pageCount, Math.ceil(16000 / 24));
});

test("clamps a page past the end", () => {
  const page = paginate([1, 2, 3], 9, 2);
  assert.equal(page.page, 2);
  assert.deepEqual(page.items, [3]);
});
