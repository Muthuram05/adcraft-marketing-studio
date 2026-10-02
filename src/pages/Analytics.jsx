import React, { useState } from "react";
import { Download, TrendingUp, ArrowUpRight } from "lucide-react";
import { useApp } from "../store";
import { PageHead, Button, Tabs, Channel } from "../components/UI";
import { Stats } from "./Dashboard";
import { campaignTotals, number, money, exportCSV } from "../data";
export default function Analytics() {
  const { state, notify } = useApp();
  const [range, setRange] = useState("30"),
    [metric, setMetric] = useState("Impressions");
  const campaigns = state.campaigns.filter((c) => c.status !== "Draft");
  const total = campaignTotals(campaigns);
  const factor = Number(range) / 30;
  const scaled = campaigns.map((c) => ({
    ...c,
    spend: Math.round(c.spend * factor),
    impressions: Math.round(c.impressions * factor),
    clicks: Math.round(c.clicks * factor),
    leads: Math.round(c.leads * factor),
  }));
  const values = [
    12, 18, 15, 27, 22, 36, 32, 44, 40, 55, 48, 63, 56, 71, 65, 83, 73, 89, 80,
    94,
  ];
  const metricValues = values.map((v, i) =>
    metric === "Clicks"
      ? v * (0.65 + (i % 3) * 0.12)
      : metric === "Leads"
        ? v * (0.3 + (i % 4) * 0.16)
        : v,
  );
  const points = metricValues
    .map((v, i) => `${55 + i * 42},${250 - v * 2.05}`)
    .join(" ");
  function download() {
    exportCSV(
      [
        ["Period", "Campaign", "Spend INR", "Impressions", "Clicks", "Leads"],
        ...scaled.map((c) => [
          range + " days",
          c.name,
          c.spend,
          c.impressions,
          c.clicks,
          c.leads,
        ]),
      ],
      "adcraft-analytics.csv",
    );
    notify("Analytics report downloaded.");
  }
  return (
    <>
      <PageHead
        title="See the story behind the numbers."
        description="A clearer picture of what’s working, and where to go next."
      >
        <select
          aria-label="Analytics period"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="7">Last 7 days</option>
          <option value="14">Last 14 days</option>
          <option value="30">Last 30 days</option>
        </select>
        <Button variant="secondary" icon={Download} onClick={download}>
          Export report
        </Button>
      </PageHead>
      <Stats campaigns={scaled} />
      <section className="panel performance-chart">
        <div className="section-title">
          <div>
            <h2>A little momentum, every day.</h2>
            <span>Illustrative trend · Last {range} days</span>
          </div>
          <Tabs
            value={metric}
            onChange={setMetric}
            items={["Impressions", "Clicks", "Leads"]}
          />
        </div>
        <div className="chart-legend">
          <span>
            <i />
            {metric}
          </span>
          <small>Simulated data</small>
        </div>
        <svg
          className="chart"
          viewBox="0 0 900 290"
          role="img"
          aria-label={`Illustrative ${metric.toLowerCase()} trend over ${range} days`}
        >
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8056ed" stopOpacity=".2" />
              <stop offset="100%" stopColor="#8056ed" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[45, 95, 145, 195, 245].map((y, i) => (
            <g key={y}>
              <line
                x1="50"
                x2="875"
                y1={y}
                y2={y}
                stroke="#eeeef3"
                strokeDasharray="4 5"
              />
              <text x="5" y={y + 4} fill="#9995a8" fontSize="11">
                {Math.round(
                  (5 - i) *
                    (((metric === "Impressions"
                      ? total.impressions
                      : metric === "Clicks"
                        ? total.clicks
                        : total.leads) *
                      factor) /
                      20),
                )}
              </text>
            </g>
          ))}
          <polygon points={`55,250 ${points} 853,250`} fill="url(#chartFill)" />
          <polyline
            points={points}
            fill="none"
            stroke="#8056ed"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {[0, 4, 8, 12, 16, 19].map((i) => (
            <g key={i}>
              <circle
                cx={55 + i * 42}
                cy={250 - metricValues[i] * 2.05}
                r="4"
                fill="#fff"
                stroke="#8056ed"
                strokeWidth="2"
              />
              <text
                x={55 + i * 42}
                y="280"
                textAnchor="middle"
                fill="#9995a8"
                fontSize="11"
              >
                Day {Math.max(1, Math.round(((i + 1) * Number(range)) / 20))}
              </text>
            </g>
          ))}
        </svg>
      </section>
      <div className="analytics-bottom">
        <section className="panel">
          <h2>Where your audience finds you</h2>
          <p className="muted">Spend by advertising channel</p>
          {["Meta", "Google", "TikTok"].map((ch) => {
            const spend = scaled.reduce(
                (sum, c) =>
                  sum +
                  (c.channels.includes(ch) ? c.spend / c.channels.length : 0),
                0,
              ),
              all = scaled.reduce((sum, c) => sum + c.spend, 0);
            return (
              <div className="channel-performance" key={ch}>
                <div>
                  <Channel name={ch} />
                  <b>{money(spend)}</b>
                </div>
                <div className="channel-progress">
                  <span
                    style={{
                      width: (all ? (spend / all) * 100 : 0) + "%",
                      background:
                        ch === "Meta"
                          ? "#7650df"
                          : ch === "Google"
                            ? "#85b2ec"
                            : "#e3a1cb",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </section>
        <section className="panel">
          <h2>Campaigns making a difference</h2>
          <p className="muted">Your top campaigns by enquiries</p>
          {[...scaled]
            .sort((a, b) => b.leads - a.leads)
            .slice(0, 3)
            .map((c, i) => (
              <div className="top-campaign" key={c.id}>
                <span>{i + 1}</span>
                <div>
                  <b>{c.name}</b>
                  <small>{c.brand}</small>
                </div>
                <strong>
                  {c.leads}
                  <small>leads</small>
                </strong>
              </div>
            ))}
        </section>
      </div>
      <p className="demo-caption">
        All analytics are simulated. Period selectors scale sample totals for
        this demo; they are not real historical reports.
      </p>
    </>
  );
}
