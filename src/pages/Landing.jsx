import React, { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Play,
  Check,
  ImageIcon,
  Video,
  TrendingUp,
  Palette,
  Rocket,
  ChevronDown,
} from "lucide-react";
import { useApp } from "../store";
import { Logo, Button, Modal, Field, navigate } from "../components/UI";
import { CreativeVisual } from "../components/Creative";
import { stock, defaultEdit } from "../data";
export default function Landing() {
  const { state, update } = useApp();
  const [open, setOpen] = useState(false),
    [name, setName] = useState(state.profile.name),
    [faq, setFaq] = useState(0);
  const questions = [
    [
      "Do I need design experience?",
      "Not a bit. Start with your product and an idea. Choose a creative, adjust it in the editor, and make it yours.",
    ],
    [
      "Can I try the entire workflow?",
      "Yes. This demo includes brand setup, sample generation, image and video editing, campaign approval, mock payments, analytics, and leads.",
    ],
    [
      "Will this publish real ads or charge me?",
      "No. This is a local demo. Generation uses sample media, payments are simulated, and no real advertising accounts are contacted.",
    ],
    [
      "Where is my work saved?",
      "Your campaigns and edits are saved in this browser. You can download images, export videos, and back up your workspace in Settings.",
    ],
  ];
  return (
    <div className="landing">
      <header className="landing-nav">
        <Logo onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
        <nav>
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("features")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Features
          </a>
          <a
            href="#how"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("how")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            How it works
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("faq")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            FAQs
          </a>
        </nav>
        <div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            Open workspace
          </Button>
          <Button onClick={() => setOpen(true)}>
            Get started
            <ArrowRight size={16} />
          </Button>
        </div>
      </header>
      <section className="landing-hero">
        <div>
          <span className="hero-tag">
            <Sparkles size={14} />A little AI. A lot of possibility.
          </span>
          <h1>
            Your next great ad
            <br />
            starts with <em>you.</em>
          </h1>
          <p>
            Turn your product into beautiful images, standout videos, and
            campaigns that bring your business to life.
          </p>
          <Button
            className="landing-cta"
            icon={Sparkles}
            onClick={() => setOpen(true)}
          >
            Let’s create something great
            <ArrowRight size={17} />
          </Button>
          <span className="landing-small">
            <Check size={14} />
            Explore the full demo. No credit card needed.
          </span>
          <div className="landing-trust">
            <div>
              {["A", "P", "M", "R"].map((s, i) => (
                <span
                  key={s}
                  style={{
                    background: ["#e1d8ca", "#eed0c4", "#d5dee0", "#dbcdee"][i],
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
            <span>
              Made for the people
              <br />
              <b>behind the business.</b>
            </span>
          </div>
        </div>
        <div className="landing-showcase">
          {[stock[4], stock[0], stock[1]].map((s, i) => (
            <div key={s.id} className={"landing-ad ad-" + i}>
              <CreativeVisual
                asset={{
                  name: s.title,
                  poster: s.image,
                  type: "image",
                  edit: defaultEdit(s),
                }}
              />
            </div>
          ))}
          <span className="landing-floating">
            <Sparkles size={19} />
            Your brand. Beautifully brought to life.
          </span>
        </div>
      </section>
      <div className="landing-platforms">
        <span>One creative home. All your favourite channels.</span>
        <b className="meta-word">∞ Meta</b>
        <b>
          <span className="google-g">G</span> Google Ads
        </b>
        <b>♪ TikTok</b>
        <b>◎ Instagram</b>
      </div>
      <section id="features" className="landing-features">
        <h2>Everything your next big idea needs.</h2>
        <p>From the first spark to the final finishing touch.</p>
        <div>
          {[
            [
              ImageIcon,
              "Images with a point of view",
              "A product photo. A few words. A fresh way to show up.",
            ],
            [
              Video,
              "Stories that move",
              "Create short videos, build scenes, and set the right mood.",
            ],
            [
              Rocket,
              "Campaigns made simple",
              "Choose your channels, set your budget, and see it all in one place.",
            ],
          ].map(([Icon, title, desc]) => (
            <article key={title}>
              <span className="purple-icon">
                <Icon size={25} />
              </span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="how" className="landing-how">
        <div>
          <span className="soft-label">
            From a little idea to a bigger audience
          </span>
          <h2>
            You bring the story.
            <br />
            We’ll bring the spark.
          </h2>
          <Button onClick={() => navigate("/create")}>
            Create your first campaign
            <ArrowRight size={16} />
          </Button>
        </div>
        <ol>
          {[
            [
              "Tell us about your business",
              "Your product, your audience, your personality.",
            ],
            [
              "Make something worth a second look",
              "Generate, preview, and add your own finishing touches.",
            ],
            [
              "Give it a moment in the spotlight",
              "Approve your creative, choose your channels, and explore results.",
            ],
          ].map(([t, d], i) => (
            <li key={t}>
              <span>{i + 1}</span>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section id="faq" className="landing-faq">
        <h2>A few things you might be wondering.</h2>
        {questions.map(([q, a], i) => (
          <div key={q}>
            <button
              aria-expanded={faq === i}
              onClick={() => setFaq(faq === i ? -1 : i)}
            >
              {q}
              <ChevronDown size={18} />
            </button>
            {faq === i && <p>{a}</p>}
          </div>
        ))}
      </section>
      <footer className="landing-footer">
        <Logo />
        <span>Made for your next big idea.</span>
        <small>Demo experience · No real ads or payments</small>
      </footer>
      {open && (
        <Modal
          title="Good things start with an introduction."
          description="Make this demo workspace feel a little more like you."
          onClose={() => setOpen(false)}
        >
          <Field label="What should we call you?">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </Field>
          <Button
            className="full-width"
            disabled={!name.trim()}
            onClick={() => {
              update((s) => ({
                ...s,
                profile: { ...s.profile, name: name.trim() },
              }));
              navigate("/dashboard");
            }}
          >
            Enter my workspace
            <ArrowRight size={16} />
          </Button>
          <p className="demo-caption">
            This creates a local demo profile. No account registration required.
          </p>
        </Modal>
      )}
    </div>
  );
}
