import test from "node:test";
import assert from "node:assert/strict";
import { pageTitle } from "../src/navigation.js";

test("hidden navigation links still have correct page titles", () => {
  assert.equal(pageTitle("/library"), "Media library");
  assert.equal(pageTitle("/brand"), "Brand kit");
  assert.equal(pageTitle("/templates"), "Templates");
});

test("detail routes and unknown URLs have distinct titles", () => {
  assert.equal(pageTitle("/campaigns"), "My campaigns");
  assert.equal(pageTitle("/campaign/camp-glow"), "Campaign details");
  assert.equal(
    pageTitle("/editor/asset-coffee?campaign=123"),
    "Creative editor",
  );
  assert.equal(pageTitle("/review/new?asset=123"), "Review & launch");
  assert.equal(pageTitle("/settings"), "Settings");
  assert.equal(pageTitle("/settings-invalid"), "Page not found");
});
