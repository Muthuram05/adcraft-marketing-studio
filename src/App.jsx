import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useApp } from "./store";
import Layout from "./components/Layout";
import { Button, Empty, navigate } from "./components/UI";
import Dashboard from "./pages/Dashboard";
import Studio from "./pages/Studio";
import Create from "./pages/Create";
import Editor from "./pages/Editor";
import Review from "./pages/Review";
import Library from "./pages/Library";
import Brand from "./pages/Brand";
import Campaigns, { CampaignDetail } from "./pages/Campaigns";
import Leads from "./pages/Leads";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";
export default function App() {
  const { loaded } = useApp();
  const [hash, setHash] = useState(location.hash.slice(1) || "/dashboard");
  useEffect(() => {
    const listener = () => {
      setHash(location.hash.slice(1) || "/dashboard");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", listener);
    return () => window.removeEventListener("hashchange", listener);
  }, []);
  const route = hash.split("?")[0];
  useEffect(() => {
    document.title =
      route === "/welcome"
        ? "AdCraft AI — Your next great ad starts with you"
        : "AdCraft AI — Creative workspace";
  }, [route]);
  if (!loaded)
    return (
      <div className="app-loading">
        <span className="logo-mark">
          <Sparkles size={28} />
        </span>
        <p>A little creative magic is loading…</p>
      </div>
    );
  if (route === "/welcome") return <Landing />;
  let page;
  if (route === "/dashboard") page = <Dashboard />;
  else if (route === "/studio") page = <Studio key={hash} />;
  else if (route === "/create") page = <Create />;
  else if (route.startsWith("/editor/"))
    page = <Editor id={route.split("/")[2]} key={route} />;
  else if (route.startsWith("/review/"))
    page = <Review id={route.split("/")[2]} key={route} />;
  else if (route === "/library") page = <Library />;
  else if (route === "/templates") page = <Library templates />;
  else if (route === "/brand") page = <Brand />;
  else if (route === "/campaigns") page = <Campaigns />;
  else if (route.startsWith("/campaign/"))
    page = <CampaignDetail id={route.split("/")[2]} />;
  else if (route === "/leads") page = <Leads key={hash} />;
  else if (route === "/analytics") page = <Analytics />;
  else if (route === "/settings") page = <Settings />;
  else
    page = (
      <Empty
        title="Let’s find your way back."
        description="This page isn’t part of your workspace."
        action={
          <Button onClick={() => navigate("/dashboard")}>
            Back to overview
          </Button>
        }
      />
    );
  return <Layout route={route}>{page}</Layout>;
}
