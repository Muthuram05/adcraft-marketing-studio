import React, { useState } from "react";
import {
  Download,
  Users,
  Search,
  Mail,
  Phone,
  MessageSquare,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { useApp } from "../store";
import {
  PageHead,
  Button,
  SearchBox,
  Tabs,
  Badge,
  Channel,
  Modal,
  Field,
  Empty,
} from "../components/UI";
import { exportCSV } from "../data";
export default function Leads() {
  const { state, update, notify } = useApp();
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState("All leads"),
    [campaign, setCampaign] = useState(
      new URLSearchParams(location.hash.split("?")[1]).get("campaign") || "all",
    ),
    [selected, setSelected] = useState(null);
  const leads = state.leads.filter(
    (l) =>
      (filter === "All leads" || l.status === filter) &&
      (campaign === "all" || l.campaignId === campaign) &&
      (l.name + " " + l.email).toLowerCase().includes(search.toLowerCase()),
  );
  const current = state.leads.find((l) => l.id === selected);
  function patch(id, values) {
    update((s) => ({
      ...s,
      leads: s.leads.map((l) => (l.id === id ? { ...l, ...values } : l)),
    }));
  }
  function download() {
    exportCSV(
      [
        [
          "Name",
          "Email",
          "Phone",
          "Campaign",
          "Channel",
          "Status",
          "Created",
          "Notes",
        ],
        ...leads.map((l) => [
          l.name,
          l.email,
          l.phone,
          state.campaigns.find((c) => c.id === l.campaignId)?.name,
          l.source,
          l.status,
          l.date,
          l.notes,
        ]),
      ],
      "adcraft-leads.csv",
    );
    notify("Lead report downloaded.");
  }
  return (
    <>
      <PageHead
        title="Your next customer could be right here."
        description="Keep every enquiry close. Turn a little interest into a real connection."
      >
        <Button variant="secondary" icon={Download} onClick={download}>
          Export leads
        </Button>
      </PageHead>
      <div className="lead-summary">
        {[
          ["Total enquiries", state.leads.length, "purple"],
          [
            "New opportunities",
            state.leads.filter((l) => l.status === "New").length,
            "blue",
          ],
          [
            "In conversation",
            state.leads.filter((l) => l.status === "Contacted").length,
            "orange",
          ],
          [
            "Qualified leads",
            state.leads.filter((l) => l.status === "Qualified").length,
            "green",
          ],
        ].map(([label, value, color]) => (
          <div key={label}>
            <span className={"lead-summary-icon " + color}>
              <Users size={19} />
            </span>
            <div>
              <small>{label}</small>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </div>
      <div className="library-controls">
        <Tabs
          value={filter}
          onChange={setFilter}
          items={["All leads", "New", "Contacted", "Qualified", "Closed"]}
        />
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search leads"
        />
      </div>
      <section className="panel flush">
        <div className="table-toolbar">
          <span>{leads.length} sample enquiries</span>
          <select
            aria-label="Filter leads by campaign"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
          >
            <option value="all">All campaigns</option>
            {state.campaigns.map((c) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Campaign</th>
                <th>Source</th>
                <th>Status</th>
                <th>Received</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td>
                    <button
                      className="lead-name"
                      onClick={() => setSelected(l.id)}
                    >
                      <span className="lead-avatar">
                        {l.name
                          .split(" ")
                          .map((s) => s[0])
                          .join("")}
                      </span>
                      <span>
                        <b>{l.name}</b>
                        <small>{l.email}</small>
                      </span>
                    </button>
                  </td>
                  <td>
                    {state.campaigns.find((c) => c.id === l.campaignId)?.name ||
                      "Archived campaign"}
                  </td>
                  <td>
                    <Channel name={l.source} small />
                  </td>
                  <td>
                    <select
                      className={"status-select " + l.status.toLowerCase()}
                      aria-label={"Status for " + l.name}
                      value={l.status}
                      onChange={(e) => patch(l.id, { status: e.target.value })}
                    >
                      {["New", "Contacted", "Qualified", "Closed"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="muted">
                    {new Date(l.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td>
                    <button
                      className="icon-button"
                      aria-label={"Open lead " + l.name}
                      onClick={() => setSelected(l.id)}
                    >
                      <ArrowUpRight size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!leads.length && (
            <Empty
              title="A little quiet here, for now."
              description="Try another filter or simulate activity on an active campaign."
            />
          )}
        </div>
      </section>
      <p className="demo-caption">
        All contacts are fictional sample data. Status changes and notes stay in
        this browser.
      </p>
      {current && (
        <Modal
          title={current.name}
          description="A little context for your next conversation."
          onClose={() => setSelected(null)}
        >
          <div className="contact-details">
            <span>
              <Mail size={17} />
              {current.email}
            </span>
            <span>
              <Phone size={17} />
              {current.phone}
            </span>
          </div>
          <Field label="Lead status">
            <select
              value={current.status}
              onChange={(e) => patch(current.id, { status: e.target.value })}
            >
              {["New", "Contacted", "Qualified", "Closed"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Your notes">
            <textarea
              rows={5}
              value={current.notes}
              placeholder="Add a reminder, a next step, or a little context…"
              onChange={(e) => patch(current.id, { notes: e.target.value })}
            />
          </Field>
          <Button
            icon={Check}
            onClick={() => {
              setSelected(null);
              notify("Lead details saved.");
            }}
          >
            Done
          </Button>
        </Modal>
      )}
    </>
  );
}
