import React, { useState } from "react";
import {
  LayoutGrid,
  Megaphone,
  ImageIcon,
  Palette,
  Users,
  ChartNoAxesCombined,
  PanelsTopLeft,
  Settings,
  Plus,
  Sparkles,
  ChevronDown,
  Bell,
  Search,
  ArrowUpRight,
  PanelLeftClose,
  Menu,
  X,
  Check,
  HelpCircle,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useApp } from "../store";
import { Logo, navigate, Button, Modal } from "./UI";
const items = [
  ["/dashboard", "Overview", LayoutGrid],
  ["/campaigns", "My campaigns", Megaphone],
  ["/studio", "Creative studio", Sparkles],
  ["/library", "Media library", ImageIcon],
  ["/brand", "Brand kit", Palette],
  ["/leads", "Leads", Users],
  ["/analytics", "Analytics", ChartNoAxesCombined],
  ["/templates", "Templates", PanelsTopLeft],
];
export default function Layout({ route, children }) {
  const { state } = useApp();
  const [mobile, setMobile] = useState(false),
    [notifications, setNotifications] = useState(false),
    [help, setHelp] = useState(false),
    [profile, setProfile] = useState(false);
  const title =
    items.find(([path]) => route.startsWith(path))?.[1] ||
    (route.startsWith("/editor")
      ? "Creative editor"
      : route.startsWith("/review")
        ? "Review & launch"
        : route.startsWith("/create")
          ? "Create campaign"
          : route.startsWith("/campaign/")
            ? "Campaign details"
            : "Settings");
  return (
    <div className="app-shell">
      {mobile && (
        <div className="sidebar-scrim" onClick={() => setMobile(false)} />
      )}
      <aside className={"sidebar " + (mobile ? "open" : "")}>
        <div className="sidebar-logo">
          <Logo />
          <button
            className="icon-button mobile-only"
            aria-label="Close menu"
            onClick={() => setMobile(false)}
          >
            <X size={20} />
          </button>
        </div>
        <button className="workspace-switch" onClick={() => navigate("/brand")}>
          <span className="workspace-avatar">
            {state.brand.name.slice(0, 1)}
          </span>
          <span>
            <b>{state.brand.name}</b>
            <small>Your workspace</small>
          </span>
          <ChevronDown size={14} />
        </button>
        <Button
          className="new-campaign"
          icon={Plus}
          onClick={() => {
            navigate("/create");
            setMobile(false);
          }}
        >
          Create campaign
        </Button>
        <nav className="main-nav" aria-label="Main navigation">
          {items.map(([path, label, Icon]) => (
            <a
              key={path}
              href={"#" + path}
              onClick={() => setMobile(false)}
              className={route.startsWith(path) ? "active" : ""}
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === "Leads" && (
                <span className="nav-count">
                  {state.leads.filter((l) => l.status === "New").length}
                </span>
              )}
              {label === "Creative studio" && (
                <span className="new-pill">New</span>
              )}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="plan-card">
            <span className="plan-icon">
              <Sparkles size={17} />
            </span>
            <b>A little spark. Endless ideas.</b>
            <p>Your next great ad is one idea away.</p>
            <button onClick={() => navigate("/studio")}>
              Let’s create something <ArrowUpRight size={14} />
            </button>
          </div>
          <a
            className={
              "utility-link " + (route === "/settings" ? "active" : "")
            }
            href="#/settings"
          >
            <Settings size={18} />
            Settings
          </a>
          <button className="utility-link" onClick={() => setHelp(true)}>
            <HelpCircle size={18} />
            Help & getting started
            <ArrowUpRight size={14} />
          </button>
          <div className="sidebar-profile">
            <button
              className="user-avatar"
              onClick={() => navigate("/settings")}
            >
              {state.profile.name
                .split(" ")
                .map((x) => x[0])
                .slice(0, 2)
                .join("")}
            </button>
            <div>
              <b>{state.profile.name}</b>
              <small>Personal workspace</small>
            </div>
            <button
              className="icon-button"
              aria-label="Open account settings"
              onClick={() => navigate("/settings")}
            >
              <ChevronDown size={15} />
            </button>
          </div>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <div className="topbar-title">
            <button
              className="icon-button mobile-only"
              aria-label="Open menu"
              onClick={() => setMobile(true)}
            >
              <Menu size={21} />
            </button>
            <span className="desktop-only">
              <LayoutGrid size={16} />
            </span>
            <span className="topbar-slash">/</span>
            {title}
          </div>
          <div className="topbar-right">
            <span className="demo-indicator">
              <i />
              Demo workspace
            </span>
            <button
              className="icon-button"
              aria-label="Search media library"
              onClick={() => navigate("/library")}
            >
              <Search size={19} />
            </button>
            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              onClick={() => setNotifications(true)}
            >
              <Bell size={19} />
              <i />
            </button>
            <span className="topbar-divider" />
            <button
              className="user-avatar small"
              aria-label="Account menu"
              onClick={() => setProfile(!profile)}
            >
              {state.profile.name
                .split(" ")
                .map((x) => x[0])
                .slice(0, 2)
                .join("")}
            </button>
            {profile && (
              <div className="profile-dropdown">
                <b>{state.profile.name}</b>
                <small>{state.profile.email}</small>
                <button
                  onClick={() => {
                    navigate("/settings");
                    setProfile(false);
                  }}
                >
                  <Settings size={15} />
                  Account settings
                </button>
                <button
                  onClick={() => {
                    navigate("/welcome");
                    setProfile(false);
                  }}
                >
                  <ExternalLink size={15} />
                  Visit landing page
                </button>
              </div>
            )}
          </div>
        </header>
        <main
          className={
            "page-content " +
            (route.startsWith("/editor") ? "editor-content" : "")
          }
        >
          {children}
        </main>
        <footer className="app-footer">
          <span>Made for your next big idea.</span>
          <span>
            AdCraft AI <span>✦</span> Demo experience
          </span>
        </footer>
      </div>
      {notifications && (
        <Modal
          title="You’re all caught up"
          description="A little update from your workspace."
          onClose={() => setNotifications(false)}
        >
          <div className="notification-item">
            <span className="notification-icon">
              <Check size={18} />
            </span>
            <div>
              <b>Your creative workspace is ready</b>
              <p>
                Create a campaign, edit your first ad, and explore sample leads.
              </p>
              <small>Just now</small>
            </div>
          </div>
          <div className="info-note">
            Campaign results and notifications in this workspace are simulated.
          </div>
          <Button onClick={() => setNotifications(false)}>Got it</Button>
        </Modal>
      )}
      {help && (
        <Modal
          title="From idea to your first campaign"
          onClose={() => setHelp(false)}
        >
          <ol className="help-steps">
            <li>
              <b>Make it yours.</b> Add your business details and colours in
              Brand kit.
            </li>
            <li>
              <b>Find your creative spark.</b> Enter a prompt to generate sample
              images and playable videos.
            </li>
            <li>
              <b>Give it your finishing touch.</b> Edit text, colours, crops,
              video timing and music.
            </li>
            <li>
              <b>Take it live.</b> Choose channels, approve your ad and complete
              the demo checkout.
            </li>
          </ol>
          <p className="info-note">
            This is a complete local demo. No real payments, ads, or messages
            are sent. Changes are saved in this browser.
          </p>
          <Button
            onClick={() => {
              setHelp(false);
              navigate("/create");
            }}
          >
            Create my first campaign
          </Button>
        </Modal>
      )}
    </div>
  );
}
