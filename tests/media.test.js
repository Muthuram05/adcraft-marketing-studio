import test from "node:test";
import assert from "node:assert/strict";
import { drawCreative, dimensions } from "../src/media.js";
import { defaultEdit } from "../src/data.js";

function renderText(edit) {
  const text = [],
    buttons = [];
  const context = {
    font: "",
    clearRect() {},
    fillRect() {},
    beginPath() {},
    fill() {},
    createLinearGradient: () => ({ addColorStop() {} }),
    measureText(value) {
      return {
        width: value.length * Number(this.font.match(/([\d.]+)px/)[1]) * 0.55,
      };
    },
    fillText(value, x, y, maxWidth) {
      text.push({
        value,
        x,
        y,
        maxWidth,
        font: this.font,
        size: Number(this.font.match(/([\d.]+)px/)[1]),
      });
    },
    roundRect(x, y, width, height) {
      buttons.push({ x, y, width, height });
    },
  };
  const canvas = { width: 0, height: 0, getContext: () => context };
  drawCreative(canvas, null, edit);
  return { text, buttons, canvas };
}

test("ad copy stays above the CTA in portrait, square, and landscape exports", () => {
  for (const format of ["9:16", "4:5", "1:1", "16:9"]) {
    for (const fontSize of [48, 96]) {
      const { text, buttons, canvas } = renderText({
        ...defaultEdit(),
        format,
        fontSize,
        textY: 90,
        headline:
          "Fresh coffee for all your slow mornings and everyday rituals",
        subheadline: "Small-batch roasted. Made for your daily ritual.",
      });
      assert.deepEqual([canvas.width, canvas.height], dimensions(format));
      const copy = text.filter((t) => /^(700|400) /.test(t.font));
      assert.ok(copy.length > 1);
      for (const line of copy) {
        assert.ok(line.y >= 0, `${format}: copy above canvas`);
        assert.ok(
          line.y + line.size < buttons[0].y,
          `${format}: text overlaps CTA`,
        );
        assert.ok(
          line.maxWidth < canvas.width,
          `${format}: text width is bounded`,
        );
      }
    }
  }
});
