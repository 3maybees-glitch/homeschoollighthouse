import assert from "node:assert/strict";
import test from "node:test";
import { canonicalOriginForHost, getSiteUrl } from "./site-url.ts";

test("apex production host canonicalizes to www", () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://homeschoollighthouse.com";
  assert.equal(getSiteUrl(), "https://www.homeschoollighthouse.com");
  process.env.NEXT_PUBLIC_SITE_URL = previous;
});

test("www and local origins stay stable", () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://www.homeschoollighthouse.com";
  assert.equal(getSiteUrl(), "https://www.homeschoollighthouse.com");
  process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
  assert.equal(getSiteUrl(), "http://localhost:3000");
  process.env.NEXT_PUBLIC_SITE_URL = previous;
});

test("only the apex hostname redirects", () => {
  assert.equal(canonicalOriginForHost("homeschoollighthouse.com"), "https://www.homeschoollighthouse.com");
  assert.equal(canonicalOriginForHost("www.homeschoollighthouse.com"), null);
  assert.equal(canonicalOriginForHost("localhost"), null);
});
