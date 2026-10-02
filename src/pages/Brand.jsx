import React, { useState } from "react";
import {
  Palette,
  Check,
  UploadCloud,
  Sparkles,
  Save,
  ArrowUpRight,
} from "lucide-react";
import { useApp } from "../store";
import {
  PageHead,
  Button,
  Field,
  Upload,
  readUpload,
  navigate,
} from "../components/UI";
import { CreativeVisual } from "../components/Creative";
import { stock, defaultEdit } from "../data";
export default function Brand() {
  const { state, update, notify } = useApp();
  const [brand, setBrand] = useState({ ...state.brand });
  const patch = (key, value) => setBrand((b) => ({ ...b, [key]: value }));
  function save() {
    if (!brand.name.trim()) {
      notify("Add your business name.", "error");
      return;
    }
    update((s) => ({ ...s, brand }));
    notify("Your brand kit is saved. New creatives will use these details.");
  }
  return (
    <>
      <PageHead
        title="All the things that make you, you."
        description="Your colours, your voice, your story. A little consistency goes a long way."
      >
        <Button icon={Save} onClick={save}>
          Save brand kit
        </Button>
      </PageHead>
      <div className="brand-layout">
        <div>
          <section className="panel">
            <div className="panel-title">
              <span className="purple-icon">
                <Palette size={22} />
              </span>
              <div>
                <h2>The heart of your brand</h2>
                <p>Make every creative feel unmistakably yours.</p>
              </div>
            </div>
            <div className="brand-logo-editor">
              {brand.logo ? (
                <img src={brand.logo} alt="Brand logo" />
              ) : (
                <span style={{ background: brand.color }}>
                  {brand.name.slice(0, 1)}
                </span>
              )}
              <div>
                <b>Your brand mark</b>
                <p>Give your business a familiar face.</p>
                <Upload
                  onFile={async (file) => {
                    try {
                      patch("logo", await readUpload(file));
                    } catch (e) {
                      notify(e.message, "error");
                    }
                  }}
                >
                  <UploadCloud size={15} />
                  Upload logo
                </Upload>
                {brand.logo && (
                  <Button variant="ghost" onClick={() => patch("logo", "")}>
                    Remove
                  </Button>
                )}
              </div>
            </div>
            <div className="form-row">
              <Field label="Brand name">
                <input
                  value={brand.name}
                  onChange={(e) => patch("name", e.target.value)}
                />
              </Field>
              <Field label="Industry">
                <select
                  value={brand.industry}
                  onChange={(e) => patch("industry", e.target.value)}
                >
                  {[
                    "Beauty & skincare",
                    "Food & beverage",
                    "Fashion & lifestyle",
                    "Home & living",
                    "Professional services",
                    "Technology",
                    "Other",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Your story">
              <textarea
                rows={4}
                value={brand.description}
                onChange={(e) => patch("description", e.target.value)}
              />
            </Field>
            <div className="form-row">
              <Field label="Website">
                <input
                  value={brand.website}
                  onChange={(e) => patch("website", e.target.value)}
                />
              </Field>
              <Field label="Location">
                <input
                  value={brand.location}
                  onChange={(e) => patch("location", e.target.value)}
                />
              </Field>
            </div>
          </section>
          <section className="panel">
            <h2>A look and a voice of your own</h2>
            <Field label="Signature colour">
              <div className="brand-colors">
                {[
                  "#876f4d",
                  "#7048eb",
                  "#396b54",
                  "#d45a48",
                  "#253a64",
                  "#ba5885",
                ].map((c) => (
                  <button
                    key={c}
                    aria-label={"Choose colour " + c}
                    style={{ background: c }}
                    onClick={() => patch("color", c)}
                  >
                    {brand.color === c && <Check size={19} />}
                  </button>
                ))}
                <input
                  aria-label="Custom brand colour"
                  type="color"
                  value={brand.color}
                  onChange={(e) => patch("color", e.target.value)}
                />
                <span>{brand.color}</span>
              </div>
            </Field>
            <div className="form-row">
              <Field label="Tone of voice">
                <select
                  value={brand.tone}
                  onChange={(e) => patch("tone", e.target.value)}
                >
                  {[
                    "Warm & friendly",
                    "Bold & playful",
                    "Calm & thoughtful",
                    "Professional & clear",
                    "Premium & refined",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Language">
                <select
                  value={brand.language}
                  onChange={(e) => patch("language", e.target.value)}
                >
                  {[
                    "English",
                    "Tamil",
                    "Hindi",
                    "Malayalam",
                    "Telugu",
                    "Kannada",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Who do you create for?">
              <textarea
                rows={3}
                value={brand.audience}
                onChange={(e) => patch("audience", e.target.value)}
              />
            </Field>
            <p className="field-hint">
              Language and tone are saved as your brief. This demo uses English
              sample copy.
            </p>
          </section>
        </div>
        <aside className="brand-preview">
          <span className="soft-label">
            <Sparkles size={13} />A glimpse of your brand
          </span>
          <CreativeVisual
            asset={{
              name: "Brand preview",
              type: "image",
              poster: stock[0].image,
              edit: { ...defaultEdit(), brand: brand.name, color: brand.color },
            }}
          />
          <h3>One brand. Endless possibilities.</h3>
          <p>
            Your brand kit is the starting point for every new creative. Edit
            the details any time as your story grows.
          </p>
          <Button
            variant="secondary"
            className="full-width"
            icon={ArrowUpRight}
            onClick={() => {
              save();
              navigate("/studio");
            }}
          >
            Create with this brand
          </Button>
        </aside>
      </div>
    </>
  );
}
