import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  ShieldCheck,
  Edit3,
  CreditCard,
  Wallet,
  Calendar,
  Target,
  MapPin,
  Sparkles,
  Rocket,
  LoaderCircle,
  ChevronDown,
  ImageIcon,
} from "lucide-react";
import { useApp } from "../store";
import {
  Button,
  PageHead,
  Field,
  ChannelPicker,
  Channel,
  Badge,
  Modal,
  Empty,
  navigate,
} from "../components/UI";
import { CreativeVisual, CreativePlayer } from "../components/Creative";
import { uid, money, validateCampaign } from "../data";
export default function Review({ id }) {
  const { state, update, notify } = useApp();
  const existing = state.campaigns.find((c) => c.id === id);
  const aid = new URLSearchParams(location.hash.split("?")[1]).get("asset");
  const [campaign, setCampaign] = useState(
    () =>
      existing || {
        id: uid(),
        name: state.brand.name + " · New campaign",
        brand: state.brand.name,
        assetId: aid || state.assets[0]?.id,
        channels: ["Meta"],
        goal: "Lead generation",
        dailyBudget: 500,
        days: 14,
        location: state.brand.location,
        ageMin: 21,
        ageMax: 45,
        status: "Draft",
        spend: 0,
        impressions: 0,
        clicks: 0,
        leads: 0,
        createdAt: new Date().toISOString(),
        primaryText: state.brand.description,
        headline:
          state.assets.find((a) => a.id === aid)?.edit.headline ||
          "Discover something made for you.",
        cta: "Learn more",
        paid: false,
      },
  );
  const [approved, setApproved] = useState(false),
    [checkout, setCheckout] = useState(false),
    [payment, setPayment] = useState("card"),
    [launching, setLaunching] = useState(false),
    [launched, setLaunched] = useState(false),
    [choose, setChoose] = useState(false),
    [error, setError] = useState("");
  const asset = state.assets.find((a) => a.id === campaign.assetId);
  const patch = (key, value) => setCampaign((c) => ({ ...c, [key]: value }));
  const total = Number(campaign.dailyBudget) * Number(campaign.days);
  function saveDraft() {
    const err = validateCampaign(campaign);
    if (err) {
      setError(err);
      return;
    }
    update((s) => ({
      ...s,
      campaigns: s.campaigns.some((c) => c.id === campaign.id)
        ? s.campaigns.map((c) => (c.id === campaign.id ? campaign : c))
        : [campaign, ...s.campaigns],
    }));
    notify("Campaign saved as a draft.");
    navigate("/campaigns");
  }
  function review() {
    const err = validateCampaign(campaign);
    if (err) {
      setError(err);
      return;
    }
    if (!approved) {
      setError("Approve the creative and campaign settings before continuing.");
      return;
    }
    setError("");
    setCheckout(true);
  }
  async function launch() {
    if (launching) return;
    setLaunching(true);
    await new Promise((r) => setTimeout(r, 1200));
    const active = {
      ...campaign,
      status: "Active",
      paid: true,
      launchedAt: new Date().toISOString(),
    };
    update((s) => ({
      ...s,
      campaigns: s.campaigns.some((c) => c.id === active.id)
        ? s.campaigns.map((c) => (c.id === active.id ? active : c))
        : [active, ...s.campaigns],
      payments: [
        {
          id: uid(),
          campaignId: active.id,
          name: active.name,
          amount: total,
          date: new Date().toISOString(),
          status: "Simulated",
          method: payment,
        },
        ...s.payments,
      ],
    }));
    setLaunching(false);
    setCheckout(false);
    setLaunched(true);
    notify("Your demo campaign is live.");
  }
  if (!asset)
    return (
      <Empty
        title="Choose a creative to get started"
        description="Your campaign needs a photo or a video."
        action={
          <Button onClick={() => navigate("/studio")}>Create an ad</Button>
        }
      />
    );
  if (launched)
    return (
      <section className="launch-success">
        <div className="success-confetti">
          <Rocket size={42} />
        </div>
        <span className="soft-label">And we’re off!</span>
        <h1>Your next chapter is live.</h1>
        <p>
          “{campaign.name}” is ready for its moment.
          <br />
          Your demo campaign is now active.
        </p>
        <div className="launch-summary">
          <CreativeVisual asset={asset} />
          <div>
            <h3>{campaign.name}</h3>
            <div className="channel-stack">
              {campaign.channels.map((ch) => (
                <Channel key={ch} name={ch} />
              ))}
            </div>
            <span>
              {money(campaign.dailyBudget)} / day · {campaign.days} days
            </span>
            <Badge status="active">Active demo campaign</Badge>
          </div>
        </div>
        <Button
          icon={ArrowRight}
          onClick={() => navigate("/campaign/" + campaign.id)}
        >
          View campaign & results
        </Button>
        <button className="text-button" onClick={() => navigate("/dashboard")}>
          Back to overview
        </button>
        <p className="demo-caption">
          No payment was taken. No real ads were published.
        </p>
      </section>
    );
  return (
    <>
      <PageHead
        eyebrow="Your campaign / The finishing touches"
        title="Looking good. Ready for the world?"
        description="One last look at your creative, your audience, and your plan."
      >
        <Button variant="secondary" onClick={saveDraft}>
          Save as draft
        </Button>
      </PageHead>
      <div className="review-layout">
        <div className="review-main">
          <section className="panel">
            <div className="section-title">
              <h2>Your creative, in the feed</h2>
              <Button
                variant="ghost"
                icon={Edit3}
                onClick={() => {
                  update((s) => ({
                    ...s,
                    campaigns: s.campaigns.some((c) => c.id === campaign.id)
                      ? s.campaigns.map((c) =>
                          c.id === campaign.id ? campaign : c,
                        )
                      : [campaign, ...s.campaigns],
                  }));
                  navigate("/editor/" + asset.id + "?campaign=" + campaign.id);
                }}
              >
                Edit creative
              </Button>
            </div>
            <div className="social-preview">
              <div className="social-preview-head">
                <span style={{ background: state.brand.color }}>
                  {campaign.brand.slice(0, 1)}
                </span>
                <div>
                  <b>{campaign.brand}</b>
                  <small>Sponsored · Demo preview</small>
                </div>
                <span>•••</span>
              </div>
              <p>{campaign.primaryText}</p>
              <CreativePlayer key={asset.id} asset={asset} />
              <div className="social-preview-footer">
                <div>
                  <small>{state.brand.website.replace("https://", "")}</small>
                  <b>{campaign.headline}</b>
                </div>
                <span>{campaign.cta}</span>
              </div>
            </div>
            <button
              className="text-button change-creative"
              onClick={() => setChoose(true)}
            >
              <ImageIcon size={15} />
              Choose a different creative
            </button>
          </section>
          <section className="panel">
            <h2>A few words to go with it</h2>
            <Field label="Ad copy">
              <textarea
                rows={3}
                value={campaign.primaryText}
                onChange={(e) => patch("primaryText", e.target.value)}
                maxLength={1000}
              />
            </Field>
            <div className="form-row">
              <Field label="Headline">
                <input
                  value={campaign.headline}
                  onChange={(e) => patch("headline", e.target.value)}
                  maxLength={100}
                />
              </Field>
              <Field label="Call to action">
                <select
                  value={campaign.cta}
                  onChange={(e) => patch("cta", e.target.value)}
                >
                  {[
                    ...new Set([
                      campaign.cta,
                      "Learn more",
                      "Shop now",
                      "Sign up",
                      "Get quote",
                      "Order now",
                    ]),
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
          </section>
        </div>
        <aside className="review-sidebar">
          <section className="panel">
            <h2>Your campaign plan</h2>
            <Field label="Campaign name">
              <input
                value={campaign.name}
                onChange={(e) => patch("name", e.target.value)}
              />
            </Field>
            <div className="field">
              <span className="field-label">Advertising channels</span>
              <ChannelPicker
                value={campaign.channels}
                onChange={(v) => patch("channels", v)}
              />
            </div>
            {campaign.channels.includes("Google") && (
              <Field label="Google campaign type">
                <select
                  value={campaign.googleType || "Demand Gen"}
                  onChange={(e) => patch("googleType", e.target.value)}
                >
                  <option>Demand Gen</option>
                  <option>Performance Max</option>
                  <option>Display</option>
                </select>
              </Field>
            )}
            <Field label="Campaign goal">
              <select
                value={campaign.goal}
                onChange={(e) => patch("goal", e.target.value)}
              >
                <option>Lead generation</option>
                <option>Website traffic</option>
                <option>Sales</option>
                <option>Brand awareness</option>
              </select>
            </Field>
            <Field label="Location">
              <input
                value={campaign.location}
                onChange={(e) => patch("location", e.target.value)}
              />
            </Field>
            <div className="form-row">
              <Field label="Minimum age">
                <input
                  type="number"
                  min="18"
                  max="65"
                  value={campaign.ageMin}
                  onChange={(e) => patch("ageMin", Number(e.target.value))}
                />
              </Field>
              <Field label="Maximum age">
                <input
                  type="number"
                  min="18"
                  max="65"
                  value={campaign.ageMax}
                  onChange={(e) => patch("ageMax", Number(e.target.value))}
                />
              </Field>
            </div>
            <div className="form-row">
              <Field label="Daily budget (₹)">
                <input
                  min="100"
                  type="number"
                  value={campaign.dailyBudget}
                  onChange={(e) => patch("dailyBudget", Number(e.target.value))}
                />
              </Field>
              <Field label="Days">
                <input
                  min="1"
                  max="90"
                  type="number"
                  value={campaign.days}
                  onChange={(e) => patch("days", Number(e.target.value))}
                />
              </Field>
            </div>
            <div className="budget-summary">
              <div>
                <span>Daily budget, across selected channels</span>
                <b>{money(campaign.dailyBudget)}</b>
              </div>
              <div>
                <span>Campaign duration</span>
                <b>{campaign.days} days</b>
              </div>
              <div className="budget-total">
                <span>Total ad budget</span>
                <strong>{money(total)}</strong>
              </div>
            </div>
          </section>
          <section className="panel approval-panel">
            <label className="approval-check">
              <input
                type="checkbox"
                checked={approved}
                onChange={(e) => {
                  setApproved(e.target.checked);
                  setError("");
                }}
              />
              <span>
                I’ve reviewed the creative, audience and budget, and approve
                this demo campaign.
              </span>
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <Button className="full-width" icon={Rocket} onClick={review}>
              Approve & continue
            </Button>
            <p className="demo-caption">
              <ShieldCheck size={12} />
              Demo checkout · No real charge
            </p>
          </section>
        </aside>
      </div>
      {choose && (
        <Modal
          title="Find the right creative"
          wide
          onClose={() => setChoose(false)}
        >
          <div className="scene-picker">
            {state.assets.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  patch("assetId", a.id);
                  setChoose(false);
                }}
              >
                <img src={a.poster} alt={a.name} />
                <b>{a.name}</b>
                <small>
                  {a.type} · {a.edit.format}
                </small>
              </button>
            ))}
          </div>
        </Modal>
      )}
      {checkout && (
        <Modal
          title="Give your campaign its moment."
          description="Complete this simulated checkout to launch your demo campaign."
          onClose={() => !launching && setCheckout(false)}
        >
          <div className="checkout-total">
            <span>Total campaign budget</span>
            <strong>{money(total)}</strong>
            <small>
              {campaign.days} days · {campaign.channels.join(" + ")}
            </small>
          </div>
          <div className="payment-methods">
            <button
              className={payment === "card" ? "selected" : ""}
              onClick={() => setPayment("card")}
            >
              <CreditCard size={20} />
              <div>
                <b>Demo card</b>
                <small>Test payment · no card details needed</small>
              </div>
              {payment === "card" && <Check size={16} />}
            </button>
            <button
              className={payment === "upi" ? "selected" : ""}
              onClick={() => setPayment("upi")}
            >
              <Wallet size={20} />
              <div>
                <b>Demo UPI</b>
                <small>Simulated instant payment</small>
              </div>
              {payment === "upi" && <Check size={16} />}
            </button>
          </div>
          <div className="info-note">
            <ShieldCheck size={18} />
            <span>
              This is a mock payment. No money is collected and no real
              advertising accounts are charged.
            </span>
          </div>
          <Button
            className="full-width"
            icon={launching ? LoaderCircle : Rocket}
            disabled={launching}
            onClick={launch}
          >
            {launching
              ? "Launching your campaign…"
              : "Simulate payment & launch"}
          </Button>
        </Modal>
      )}
    </>
  );
}
