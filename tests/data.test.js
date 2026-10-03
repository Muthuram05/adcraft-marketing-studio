import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import {
  initialState,
  getStock,
  generateAssets,
  validateCampaign,
  validateAudience,
  campaignTotals,
  csv,
  stock,
} from "../src/data.js";

test("explicit product prompt takes priority over the saved brand industry", () => {
  assert.equal(
    getStock("A freshly roasted coffee launch", "Food & beverage").id,
    "coffee",
  );
  assert.equal(getStock("New sneakers", "Beauty & skincare").id, "shoe");
  assert.equal(
    getStock("Our new collection", "Beauty & skincare").id,
    "skincare",
  );
});

test("mock generation creates independent, editable assets with the chosen format and length", () => {
  const brand = {
    name: "Test Coffee",
    industry: "Food & beverage",
    color: "#123456",
  };
  const assets = generateAssets(
    { prompt: "coffee", brand, duration: 6, format: "1:1" },
    () => 1,
  );
  assert.equal(assets.length, 3);
  assert.equal(new Set(assets.map((a) => a.id)).size, 3);
  for (const a of assets) {
    assert.equal(a.src, "/media/coffee.mp4");
    assert.equal(a.edit.duration, 6);
    assert.equal(a.edit.trimEnd, 6);
    assert.equal(a.edit.format, "1:1");
    assert.equal(a.edit.brand, "Test Coffee");
    assert.equal(a.edit.color, "#123456");
  }
  assets[0].edit.headline = "Changed";
  assert.notEqual(assets[1].edit.headline, "Changed");
});

test("uploaded image is used for photo generation and style changes rendering settings", () => {
  const image = "data:image/png;base64,TEST";
  const [photo] = generateAssets({
    prompt: "coffee",
    brand: initialState().brand,
    type: "image",
    image,
    style: "Bold & colourful",
  });
  assert.equal(photo.src, image);
  assert.equal(photo.poster, image);
  assert.equal(photo.edit.saturation, 135);
  const [video] = generateAssets({
    prompt: "coffee",
    brand: initialState().brand,
    type: "video",
    image,
  });
  assert.equal(video.poster, "/media/coffee.jpg");
});

test("approval validation rejects missing assets, channels, invalid budgets and audience ranges", () => {
  const valid = {
    name: "Launch",
    assetId: "asset-coffee",
    channels: ["Meta", "Google"],
    dailyBudget: 500,
    days: 7,
    location: "Chennai, India",
    ageMin: 21,
    ageMax: 45,
  };
  assert.equal(validateCampaign(valid), "");
  for (const change of [
    { name: " " },
    { assetId: "" },
    { channels: [] },
    { dailyBudget: 99 },
    { dailyBudget: Infinity },
    { dailyBudget: "abc" },
    { days: 0 },
    { days: 91 },
    { days: 1.5 },
    { ageMin: 17 },
    { ageMin: 45, ageMax: 21 },
    { ageMax: 66 },
    { ageMax: 45.5 },
    { location: " " },
  ])
    assert.notEqual(
      validateCampaign({ ...valid, ...change }),
      "",
      JSON.stringify(change),
    );
});

test("campaign setup and approval use the same audience validation", () => {
  const audience = {
    channels: ["Meta", "Google"],
    location: "Chennai",
    dailyBudget: 500,
    days: 14,
    ageMin: 21,
    ageMax: 45,
  };
  assert.equal(validateAudience(audience), "");
  for (const change of [
    { ageMax: 45.5 },
    { ageMin: "" },
    { ageMax: "" },
    { ageMax: undefined },
    { ageMin: undefined },
    { ageMin: 50 },
    { dailyBudget: Infinity },
    { channels: [] },
    { location: " " },
  ]) {
    const invalid = { ...audience, ...change };
    assert.notEqual(validateAudience(invalid), "", JSON.stringify(change));
    assert.equal(
      validateCampaign({ ...invalid, name: "QA", assetId: "asset-coffee" }),
      validateAudience(invalid),
    );
  }
});

test("dashboard totals reflect campaign spend and performance", () => {
  assert.deepEqual(campaignTotals([]), {
    spend: 0,
    impressions: 0,
    clicks: 0,
    leads: 0,
  });
  assert.deepEqual(campaignTotals(initialState().campaigns), {
    spend: 15920,
    impressions: 136990,
    clicks: 5090,
    leads: 136,
  });
});

test("CSV exports preserve quotes and newlines and neutralize spreadsheet formulas", () => {
  assert.equal(
    csv([
      ["Name", "Notes"],
      ["A, B", 'Said "hello"\nAgain'],
    ]),
    '"Name","Notes"\r\n"A, B","Said ""hello""\nAgain"',
  );
  assert.equal(
    csv([["=1+1", "+91 00000", "@SUM(A1)", "-2"]]),
    '"\'=1+1","\'+91 00000","\'@SUM(A1)","\'-2"',
  );
});

test("every seeded media source is bundled locally and all relationships resolve", () => {
  for (const s of stock)
    for (const file of [s.image, s.video])
      assert.ok(existsSync(new URL("../public" + file, import.meta.url)), file);
  const state = initialState();
  for (const c of state.campaigns)
    assert.ok(state.assets.some((a) => a.id === c.assetId));
  for (const l of state.leads)
    assert.ok(state.campaigns.some((c) => c.id === l.campaignId));
});
