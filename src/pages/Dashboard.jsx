import React, { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  Sparkles,
  Video,
  ImageIcon,
  MousePointer2,
  Users,
  Eye,
  TrendingUp,
  Megaphone,
  MoreHorizontal,
  ChevronDown,
  Clock,
  Palette,
} from "lucide-react";
import { useApp } from "../store";
import {
  Button,
  PageHead,
  Channel,
  Badge,
  navigate,
  Empty,
} from "../components/UI";
import { CreativeCard, CreativeVisual } from "../components/Creative";
import { campaignTotals, money, number, stock, defaultEdit } from "../data";
export function Stats({ campaigns }) {
  const t = campaignTotals(campaigns);
  const stats = [
    [
      "Total ad spend",
      money(t.spend),
      "+8.2%",
      TrendingUp,
      "vs. previous period",
    ],
    [
      "Impressions",
      number(t.impressions),
      "+18.6%",
      Eye,
      "people seeing your ads",
    ],
    [
      "Link clicks",
      number(t.clicks),
      "+12.4%",
      MousePointer2,
      "visits to your business",
    ],
    ["Leads generated", number(t.leads), "+24.8%", Users, "new opportunities"],
  ];
  return (
    <div className="stats-grid">
      {stats.map(([label, value, change, Icon, sub]) => (
        <div className="stat-card" key={label}>
          <div className="stat-top">
            <span>{label}</span>
            <Icon size={17} />
          </div>
          <strong>{value}</strong>
          <div className="stat-bottom">
            <span>
              <TrendingUp size={12} />
              {change}
            </span>
            <small>{sub}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
export function CampaignTable({ campaigns, onAction }) {
  const { state } = useApp();
  return (
    <div className="table-wrap">
      <table className="data-table campaign-table">
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Status</th>
            <th>Channels</th>
            <th>Ad spend</th>
            <th>Leads</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => {
            const asset = state.assets.find((a) => a.id === c.assetId);
            return (
              <tr key={c.id}>
                <td>
                  <button
                    className="campaign-name-cell"
                    onClick={() =>
                      navigate(
                        c.status === "Draft"
                          ? "/review/" + c.id
                          : "/campaign/" + c.id,
                      )
                    }
                  >
                    <img src={asset?.poster || stock[0].image} alt="" />
                    <span>
                      <b>{c.name}</b>
                      <small>
                        {c.brand} <span>·</span> {c.goal}
                      </small>
                    </span>
                  </button>
                </td>
                <td>
                  <Badge status={c.status}>{c.status}</Badge>
                </td>
                <td>
                  <div className="channel-stack">
                    {c.channels.map((ch) => (
                      <Channel key={ch} name={ch} small />
                    ))}
                  </div>
                </td>
                <td className="tabular">{money(c.spend)}</td>
                <td className="tabular">{c.leads || "—"}</td>
                <td>
                  <button
                    className="icon-button"
                    aria-label={"View " + c.name}
                    onClick={() =>
                      navigate(
                        c.status === "Draft"
                          ? "/review/" + c.id
                          : "/campaign/" + c.id,
                      )
                    }
                  >
                    <ArrowUpRight size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!campaigns.length && (
        <Empty
          title="Your first campaign starts here"
          description="Turn a product and an idea into your next campaign."
          action={
            <Button onClick={() => navigate("/create")}>Create campaign</Button>
          }
        />
      )}
    </div>
  );
}
export default function Dashboard() {
  const { state } = useApp();
  const [prompt, setPrompt] = useState("");
  const firstName = state.profile.name.split(" ")[0];
  function start(type) {
    sessionStorage.setItem("adcraft-prompt", prompt);
    navigate("/studio?type=" + type);
  }
  const hero = {
    id: "hero",
    name: "Skincare campaign",
    src: stock[0].image,
    poster: stock[0].image,
    type: "image",
    edit: {
      ...defaultEdit(stock[0]),
      headline: "Good things. Naturally.",
      fontSize: 54,
      textY: 65,
      color: "#8c725b",
    },
  };
  return (
    <>
      <PageHead
        title={`Let’s make something great, ${firstName}.`}
        description="Your ideas, brought to life. Your campaigns, all in one place."
      >
        <Button
          variant="secondary"
          icon={Clock}
          onClick={() => navigate("/analytics")}
        >
          Last 30 days
          <ChevronDown size={14} />
        </Button>
      </PageHead>
      <section className="welcome-hero">
        <div className="hero-copy">
          <span className="hero-tag">
            <Sparkles size={14} />
            Your creative advantage
          </span>
          <h2>
            Big ideas.
            <br />
            Beautiful ads.
            <br />
            All you.
          </h2>
          <p>
            Turn a spark of inspiration into your next
            <br className="desktop-only" /> standout campaign. We’ll help with
            the rest.
          </p>
          <div className="hero-prompt">
            <input
              aria-label="Describe your next campaign"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && start("video")}
              placeholder="What are we creating today?"
            />
            <button
              aria-label="Generate from your idea"
              onClick={() => start("video")}
            >
              <ArrowUpRight size={21} />
            </button>
          </div>
          <div className="hero-chips">
            <button onClick={() => start("video")}>
              <Video size={14} />
              Create a video
            </button>
            <button onClick={() => start("image")}>
              <ImageIcon size={14} />
              Design an image
            </button>
            <button onClick={() => navigate("/templates")}>
              <Palette size={14} />
              Find inspiration
            </button>
          </div>
        </div>
        <div className="hero-art">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="hero-art-card back">
            <img src={stock[4].image} alt="Perfume creative inspiration" />
            <span>Make an impression.</span>
          </div>
          <div className="hero-art-card front">
            <CreativeVisual asset={hero} />
          </div>
          <div className="hero-float top">
            <span className="sparkle-square">
              <Sparkles size={18} />
            </span>
            <div>
              <b>Your brand. Your story.</b>
              <small>A little AI magic.</small>
            </div>
          </div>
          <div className="hero-float bottom">
            <span className="success-square">
              <TrendingUp size={18} />
            </span>
            <div>
              <b>Ready for the spotlight</b>
              <small>Made to stand out.</small>
            </div>
          </div>
          <div className="art-spark sparkle-a">✳</div>
          <div className="art-spark sparkle-b">✧</div>
        </div>
      </section>
      <div className="section-title">
        <div>
          <h2>A little look at the big picture</h2>
          <span>Sample performance across your campaigns</span>
        </div>
        <button className="text-button" onClick={() => navigate("/analytics")}>
          View analytics
          <ArrowRight size={15} />
        </button>
      </div>
      <Stats campaigns={state.campaigns} />
      <div className="section-title">
        <div>
          <h2>Your creative collection</h2>
          <span>Fresh ideas, ready for their moment.</span>
        </div>
        <button className="text-button" onClick={() => navigate("/library")}>
          View all creatives
          <ArrowRight size={15} />
        </button>
      </div>
      <div className="creative-grid dashboard-creatives">
        {state.assets.slice(0, 4).map((a) => (
          <CreativeCard key={a.id} asset={a} />
        ))}
      </div>
      <section className="campaign-section">
        <div className="section-title">
          <div>
            <h2>Campaigns in motion</h2>
            <span>Good things are happening.</span>
          </div>
          <button
            className="text-button"
            onClick={() => navigate("/campaigns")}
          >
            View all campaigns
            <ArrowRight size={15} />
          </button>
        </div>
        <CampaignTable campaigns={state.campaigns.slice(0, 4)} />
      </section>
    </>
  );
}
