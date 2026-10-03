import React, { useState, useEffect } from "react";
import {
  Building2,
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  Check,
  Target,
  Sparkles,
} from "lucide-react";
import { useApp } from "../store";
import {
  PageHead,
  Button,
  Field,
  ChannelPicker,
  Stepper,
  Upload,
  readUpload,
  navigate,
} from "../components/UI";
import { uid, validateAudience } from "../data";
import Studio from "./Studio";
export default function Create() {
  const { state, update, notify } = useApp();
  const [step, setStep] = useState(0),
    [error, setError] = useState("");
  const [form, setForm] = useState(
    () =>
      state.draft || {
        name: "",
        brand: state.brand.name,
        industry: state.brand.industry,
        description: state.brand.description,
        website: state.brand.website,
        logo: state.brand.logo,
        location: state.brand.location,
        ageMin: 21,
        ageMax: 45,
        gender: "Everyone",
        interests: "Skincare, wellness, sustainable living",
        channels: ["Meta"],
        goal: "Lead generation",
        dailyBudget: 500,
        days: 14,
        prompt: "",
      },
  );
  const patch = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  useEffect(() => {
    update((s) => ({ ...s, draft: form }));
  }, [form]);
  function next() {
    if (
      step === 0 &&
      (!form.brand.trim() || !form.description.trim() || !form.name.trim())
    ) {
      setError(
        "Add your campaign name, business name and a short description.",
      );
      return;
    }
    const audienceError = step === 1 ? validateAudience(form) : "";
    if (audienceError) {
      setError(audienceError);
      return;
    }
    setError("");
    setStep(step + 1);
    window.scrollTo(0, 0);
  }
  function selectAsset(asset, edit = false) {
    const campaign = {
      ...form,
      id: uid(),
      assetId: asset.id,
      status: "Draft",
      spend: 0,
      impressions: 0,
      clicks: 0,
      leads: 0,
      primaryText: form.description,
      headline: asset.edit.headline,
      cta: asset.edit.cta,
      createdAt: new Date().toISOString(),
      paid: false,
    };
    update((s) => ({
      ...s,
      campaigns: [campaign, ...s.campaigns],
      draft: null,
    }));
    navigate(
      edit
        ? "/editor/" + asset.id + "?campaign=" + campaign.id
        : "/review/" + campaign.id,
    );
  }
  return (
    <>
      <PageHead
        title="Let’s bring your next campaign to life."
        description="A few details. A little inspiration. Something entirely yours."
      >
        <span className="saved-indicator">
          <Check size={14} />
          Progress saved
        </span>
      </PageHead>
      <Stepper
        step={step}
        labels={["Your business", "Your audience", "Your creative"]}
        onChange={setStep}
      />
      {step === 2 ? (
        <Studio
          embedded
          brand={{
            ...state.brand,
            name: form.brand,
            industry: form.industry,
            description: form.description,
          }}
          initialPrompt={form.prompt}
          onSelect={selectAsset}
          onEdit={(asset) => selectAsset(asset, true)}
          onPromptChange={(value) => patch("prompt", value)}
        />
      ) : (
        <div className="wizard-layout">
          <section className="panel wizard-form">
            <div className="panel-title">
              <span className="purple-icon">
                {step === 0 ? <Building2 size={22} /> : <Target size={22} />}
              </span>
              <div>
                <h2>
                  {step === 0
                    ? "Tell us a little about your business."
                    : "Find your people."}
                </h2>
                <p>
                  {step === 0
                    ? "The more we know, the more your ads feel like you."
                    : "The right message deserves the right audience."}
                </p>
              </div>
            </div>
            {step === 0 ? (
              <>
                <Field label="Campaign name">
                  <input
                    placeholder="e.g. Our summer skincare collection"
                    value={form.name}
                    onChange={(e) => patch("name", e.target.value)}
                  />
                </Field>
                <div className="form-row">
                  <Field label="Business name">
                    <input
                      value={form.brand}
                      onChange={(e) => patch("brand", e.target.value)}
                    />
                  </Field>
                  <Field label="Business type">
                    <select
                      value={form.industry}
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
                      ].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="What makes your business special?">
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => patch("description", e.target.value)}
                    placeholder="Tell us about your products, your story, and what your customers love."
                  />
                </Field>
                <Field label="Website (optional)">
                  <input
                    value={form.website}
                    onChange={(e) => patch("website", e.target.value)}
                    placeholder="https://your-business.com"
                  />
                </Field>
                <Field label="Brand logo (optional)">
                  <div className="logo-upload">
                    {form.logo ? (
                      <img src={form.logo} alt="Your brand logo" />
                    ) : (
                      <span>{form.brand.slice(0, 1) || "B"}</span>
                    )}
                    <div>
                      <Upload
                        onFile={async (file) => {
                          try {
                            patch("logo", await readUpload(file));
                          } catch (e) {
                            notify(e.message, "error");
                          }
                        }}
                      >
                        <UploadCloud size={16} />
                        Upload logo
                      </Upload>
                      <p className="field-hint">PNG, JPG or WebP</p>
                    </div>
                  </div>
                </Field>
              </>
            ) : (
              <>
                <Field label="Where are your customers?">
                  <input
                    value={form.location}
                    onChange={(e) => patch("location", e.target.value)}
                    placeholder="City, region or country"
                  />
                </Field>
                <div className="form-row three">
                  <Field label="Minimum age">
                    <input
                      type="number"
                      min="18"
                      max="65"
                      value={form.ageMin}
                      onChange={(e) => patch("ageMin", Number(e.target.value))}
                    />
                  </Field>
                  <Field label="Maximum age">
                    <input
                      type="number"
                      min="18"
                      max="65"
                      value={form.ageMax}
                      onChange={(e) => patch("ageMax", Number(e.target.value))}
                    />
                  </Field>
                  <Field label="Gender">
                    <select
                      value={form.gender}
                      onChange={(e) => patch("gender", e.target.value)}
                    >
                      <option>Everyone</option>
                      <option>Women</option>
                      <option>Men</option>
                    </select>
                  </Field>
                </div>
                <Field label="Interests">
                  <input
                    value={form.interests}
                    onChange={(e) => patch("interests", e.target.value)}
                    placeholder="e.g. Coffee, cooking, travel"
                  />
                </Field>
                <div className="field">
                  <span className="field-label">
                    Where would you like to advertise?
                  </span>
                  <ChannelPicker
                    value={form.channels}
                    onChange={(v) => patch("channels", v)}
                  />
                </div>
                <Field label="What would you like to achieve?">
                  <select
                    value={form.goal}
                    onChange={(e) => patch("goal", e.target.value)}
                  >
                    <option>Lead generation</option>
                    <option>Website traffic</option>
                    <option>Sales</option>
                    <option>Brand awareness</option>
                  </select>
                </Field>
                <div className="form-row">
                  <Field label="Daily budget (₹)">
                    <input
                      type="number"
                      min="100"
                      max="100000"
                      value={form.dailyBudget}
                      onChange={(e) =>
                        patch("dailyBudget", Number(e.target.value))
                      }
                    />
                  </Field>
                  <Field label="Campaign duration">
                    <select
                      value={form.days}
                      onChange={(e) => patch("days", Number(e.target.value))}
                    >
                      {[7, 14, 30].map((n) => (
                        <option value={n} key={n}>
                          {n} days
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-footer">
              <Button
                variant="secondary"
                icon={ArrowLeft}
                onClick={() =>
                  step ? setStep(step - 1) : navigate("/dashboard")
                }
              >
                {step ? "Back" : "Cancel"}
              </Button>
              <Button icon={ArrowRight} onClick={next}>
                {step === 0 ? "Find your audience" : "Create your ad"}
              </Button>
            </div>
          </section>
          <aside className="wizard-aside">
            <div className="aside-art">
              <Sparkles size={45} />
              <span>
                Built around
                <br />
                <b>your business.</b>
              </span>
            </div>
            <h3>
              {step === 0
                ? "It starts with your story."
                : "A little focus goes a long way."}
            </h3>
            <p>
              {step === 0
                ? "From your first idea to your next customer, we’ll help you turn what makes your business special into an ad that feels just right."
                : "Start with the people most likely to love your product. You can adjust your channels and budget again before launching."}
            </p>
            <div className="aside-checks">
              <span>
                <Check size={15} />
                Your brand, at the heart of every ad
              </span>
              <span>
                <Check size={15} />
                Preview and edit before you launch
              </span>
              <span>
                <Check size={15} />
                You’re always in control
              </span>
            </div>
            <p className="demo-caption">
              Demo workspace · Nothing will be charged or published.
            </p>
          </aside>
        </div>
      )}
    </>
  );
}
