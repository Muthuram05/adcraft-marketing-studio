import React, { useState } from "react";
import {
  User,
  Link,
  Settings2,
  Download,
  Check,
  ShieldCheck,
  CreditCard,
  RotateCcw,
} from "lucide-react";
import { useApp } from "../store";
import {
  PageHead,
  Button,
  Tabs,
  Field,
  Toggle,
  Channel,
  Badge,
  Modal,
  Empty,
} from "../components/UI";
import { initialState, exportCSV, saveBlob, money } from "../data";
export default function Settings() {
  const { state, update, notify } = useApp();
  const [tab, setTab] = useState("Your profile"),
    [profile, setProfile] = useState(state.profile),
    [reset, setReset] = useState(false);
  const change = (key, value) => setProfile((p) => ({ ...p, [key]: value }));
  function save() {
    if (!profile.name.trim() || !/^\S+@\S+\.\S+$/.test(profile.email)) {
      notify("Enter your name and a valid email address.", "error");
      return;
    }
    update((s) => ({ ...s, profile }));
    notify("Your profile is saved.");
  }
  return (
    <>
      <PageHead
        title="A workspace that works for you."
        description="Your profile, your connections, your preferences."
      />
      <Tabs
        value={tab}
        onChange={setTab}
        items={["Your profile", "Connections", "Billing", "Preferences"]}
      />
      <div className="settings-body">
        {tab === "Your profile" ? (
          <section className="panel">
            <h2>The person behind the ideas</h2>
            <p className="muted">
              These details stay in your local demo workspace.
            </p>
            <div className="profile-large-avatar">
              {profile.name
                .split(" ")
                .map((s) => s[0])
                .join("")}
            </div>
            <div className="form-row">
              <Field label="Full name">
                <input
                  value={profile.name}
                  onChange={(e) => change("name", e.target.value)}
                />
              </Field>
              <Field label="Email address">
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => change("email", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Company">
              <input
                value={profile.business}
                onChange={(e) => change("business", e.target.value)}
              />
            </Field>
            <Button icon={Check} onClick={save}>
              Save profile
            </Button>
          </section>
        ) : tab === "Connections" ? (
          <section className="panel">
            <h2>Bring your channels together.</h2>
            <p className="muted">
              Explore how account connections will work. All connections below
              are simulated.
            </p>
            {["Meta", "Google", "TikTok"].map((ch) => (
              <div className="connection-row" key={ch}>
                <Channel name={ch} />
                <div>
                  <b>
                    {ch === "Meta"
                      ? "Facebook & Instagram"
                      : ch === "Google"
                        ? "Google Ads & YouTube"
                        : "TikTok for Business"}
                  </b>
                  <small>
                    {state.connections[ch]
                      ? "Demo account connected"
                      : "Connect a sample advertising account"}
                  </small>
                </div>
                <Button
                  variant={state.connections[ch] ? "secondary" : "primary"}
                  onClick={() => {
                    update((s) => ({
                      ...s,
                      connections: {
                        ...s.connections,
                        [ch]: !s.connections[ch],
                      },
                    }));
                    notify(
                      state.connections[ch]
                        ? ch + " demo account disconnected."
                        : ch + " demo account connected.",
                    );
                  }}
                >
                  {state.connections[ch] ? "Disconnect" : "Connect demo"}
                </Button>
              </div>
            ))}
            <p className="info-note">
              <ShieldCheck size={17} />
              No sign-in credentials or access to real ad accounts are
              requested.
            </p>
          </section>
        ) : tab === "Billing" ? (
          <section className="panel">
            <div className="section-title">
              <div>
                <h2>A clear view of your spending.</h2>
                <p className="muted">
                  Simulated payments from your demo campaigns.
                </p>
              </div>
              <Button
                variant="secondary"
                icon={Download}
                onClick={() =>
                  exportCSV(
                    [
                      ["Date", "Campaign", "Amount INR", "Status"],
                      ...state.payments.map((p) => [
                        p.date,
                        p.name,
                        p.amount,
                        p.status,
                      ]),
                    ],
                    "adcraft-demo-payments.csv",
                  )
                }
              >
                Export
              </Button>
            </div>
            {state.payments.length ? (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.payments.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{new Date(p.date).toLocaleDateString()}</td>
                        <td>{money(p.amount)}</td>
                        <td>
                          <Badge status="neutral">Simulated</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty
                icon={CreditCard}
                title="Nothing charged. Nothing to worry about."
                description="Demo payments will appear here after you launch a campaign."
              />
            )}
            <p className="demo-caption">
              There is no subscription and no real money changes hands in this
              prototype.
            </p>
          </section>
        ) : (
          <>
            <section className="panel">
              <h2>Keep the good things coming.</h2>
              <div className="preference-row">
                <div>
                  <b>Campaign updates</b>
                  <p>Remember my preference for campaign summaries.</p>
                </div>
                <Toggle
                  label="Campaign updates"
                  checked={state.settings.emailNotifications}
                  onChange={(v) =>
                    update((s) => ({
                      ...s,
                      settings: { ...s.settings, emailNotifications: v },
                    }))
                  }
                />
              </div>
              <div className="preference-row">
                <div>
                  <b>New lead notifications</b>
                  <p>Remember my preference for new enquiry alerts.</p>
                </div>
                <Toggle
                  label="New lead notifications"
                  checked={state.settings.leadNotifications}
                  onChange={(v) =>
                    update((s) => ({
                      ...s,
                      settings: { ...s.settings, leadNotifications: v },
                    }))
                  }
                />
              </div>
              <p className="field-hint">
                Preferences are saved. This demo does not send emails or
                messages.
              </p>
            </section>
            <section className="panel">
              <h2>Your workspace data</h2>
              <p className="muted">
                Download a backup of your campaigns, edits, leads and settings.
              </p>
              <Button
                variant="secondary"
                icon={Download}
                onClick={() => {
                  saveBlob(
                    new Blob([JSON.stringify(state, null, 2)], {
                      type: "application/json",
                    }),
                    "adcraft-workspace-backup.json",
                  );
                  notify("Workspace backup downloaded.");
                }}
              >
                Download workspace backup
              </Button>
              <div className="property-divider" />
              <h3>Start with a fresh canvas</h3>
              <p className="muted">
                Replace local changes with the original sample workspace.
              </p>
              <Button
                variant="danger"
                icon={RotateCcw}
                onClick={() => setReset(true)}
              >
                Reset demo workspace
              </Button>
            </section>
          </>
        )}
      </div>
      {reset && (
        <Modal
          title="Start fresh?"
          description="This removes your local campaigns, uploaded media and edits, then restores the sample workspace. Download a backup first if you want to keep your work."
          onClose={() => setReset(false)}
        >
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setReset(false)}>
              Keep my work
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                update(initialState());
                setReset(false);
                setProfile(initialState().profile);
                notify("Sample workspace restored.");
              }}
            >
              Reset local demo
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
