import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Video,
  ImageIcon,
  UploadCloud,
  ArrowRight,
  ArrowLeft,
  Check,
  RefreshCw,
  Layers,
  Plus,
  X,
  ArrowUpRight,
  LoaderCircle,
} from "lucide-react";
import { useApp } from "../store";
import {
  PageHead,
  Button,
  Field,
  Tabs,
  Upload,
  readUpload,
  navigate,
  Stepper,
} from "../components/UI";
import { CreativeCard } from "../components/Creative";
import { generateAssets, stock } from "../data";
const ideas = [
  "A feel-good skincare launch with a fresh, natural look",
  "A warm coffee ad for slow Sunday mornings",
  "A bold sneaker campaign for your next adventure",
  "A delicious biryani weekend offer",
];
export default function Studio({
  embedded = false,
  brand: brandProp,
  onSelect,
  onEdit,
  initialPrompt = "",
  onPromptChange,
}) {
  const { state, addAssets, notify } = useApp();
  const brand = brandProp || state.brand;
  const [type, setType] = useState(
      new URLSearchParams(location.hash.split("?")[1]).get("type") || "video",
    ),
    [prompt, setPrompt] = useState(
      () => initialPrompt || sessionStorage.getItem("adcraft-prompt") || "",
    ),
    [format, setFormat] = useState("9:16"),
    [duration, setDuration] = useState(12),
    [style, setStyle] = useState("Natural & editorial"),
    [image, setImage] = useState(null),
    [loading, setLoading] = useState(false),
    [progress, setProgress] = useState(0),
    [results, setResults] = useState([]),
    [selected, setSelected] = useState(null),
    [error, setError] = useState("");
  const timer = useRef();
  useEffect(() => {
    onPromptChange?.(prompt);
  }, [prompt]);
  useEffect(() => {
    sessionStorage.removeItem("adcraft-prompt");
    return () => clearInterval(timer.current);
  }, []);
  function generate() {
    if (!prompt.trim()) {
      setError("Describe the product or the ad you want to create.");
      return;
    }
    setError("");
    setLoading(true);
    setResults([]);
    setProgress(0);
    let tick = 0;
    timer.current = setInterval(() => {
      tick++;
      setProgress(tick);
      if (tick >= 5) {
        clearInterval(timer.current);
        const assets = generateAssets({
          prompt,
          brand,
          type,
          format,
          duration,
          count: 3,
          image,
          style,
        });
        addAssets(assets);
        setResults(assets);
        setSelected(assets[0].id);
        setLoading(false);
        notify("Three fresh creatives are ready. Make them yours.");
      }
    }, 650);
  }
  const upload = async (file) => {
    try {
      setImage(await readUpload(file));
    } catch (e) {
      notify(e.message, "error");
    }
  };
  function choose(a) {
    setSelected(a.id);
  }
  return (
    <>
      {!embedded && (
        <PageHead
          title="A little idea. A lot of possibility."
          description="Tell us what you have in mind. Let’s make something worth stopping for."
        >
          <span className="soft-label">
            <Sparkles size={14} />
            Creative studio
          </span>
        </PageHead>
      )}
      {loading ? (
        <section className="generation-state">
          <div className="generation-orbit">
            <span />
            <div>
              <Sparkles size={36} />
            </div>
          </div>
          <h2>A little creative magic is happening.</h2>
          <p>Giving your idea a look, a voice, and a personality.</p>
          <div className="generation-progress">
            <div style={{ width: progress * 20 + "%" }} />
          </div>
          <div className="generation-steps">
            {[
              "Getting to know your brand",
              "Finding the right creative direction",
              "Preparing your sample visuals",
              "Adding your brand’s finishing touches",
              "Getting everything ready for you",
            ].map((s, i) => (
              <div
                key={s}
                className={progress > i ? "done" : progress === i ? "now" : ""}
              >
                {progress > i ? (
                  <Check size={15} />
                ) : progress === i ? (
                  <LoaderCircle size={15} className="spin" />
                ) : (
                  <span />
                )}
                {s}
              </div>
            ))}
          </div>
          <span className="demo-caption">
            Demo generation uses curated sample media.
          </span>
          <Button
            variant="ghost"
            onClick={() => {
              clearInterval(timer.current);
              setLoading(false);
            }}
          >
            Cancel generation
          </Button>
        </section>
      ) : results.length ? (
        <section>
          <div className="results-heading">
            <div>
              <span className="soft-label">
                <Check size={14} />
                Ready when you are
              </span>
              <h2>Your idea, in three different lights.</h2>
              <p>
                Pick your favourite. Add your finishing touches. Make it yours.
              </p>
            </div>
            <Button variant="secondary" icon={RefreshCw} onClick={generate}>
              Generate again
            </Button>
          </div>
          <div className="creative-grid results-grid">
            {results.map((a) => (
              <CreativeCard
                key={a.id}
                asset={state.assets.find((x) => x.id === a.id) || a}
                onSelect={choose}
                selected={selected === a.id}
              />
            ))}
          </div>
          <div className="results-footer">
            <Button
              variant="secondary"
              icon={ArrowLeft}
              onClick={() => setResults([])}
            >
              Back to your idea
            </Button>
            <div>
              <Button
                variant="secondary"
                onClick={() =>
                  onEdit
                    ? onEdit(state.assets.find((a) => a.id === selected))
                    : navigate("/editor/" + selected)
                }
              >
                Edit selected creative
              </Button>
              <Button
                icon={ArrowRight}
                onClick={() =>
                  onSelect
                    ? onSelect(state.assets.find((a) => a.id === selected))
                    : navigate("/review/new?asset=" + selected)
                }
              >
                {onSelect ? "Review campaign" : "Use in a campaign"}
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <div className="studio-layout">
          <section className="panel studio-form">
            <div className="panel-title">
              <span className="purple-icon">
                <Sparkles size={20} />
              </span>
              <div>
                <h2>What are we creating?</h2>
                <p>A great ad starts with a little inspiration.</p>
              </div>
            </div>
            <div className="creation-types">
              {[
                ["video", "Video ad", Video, "Make your story move"],
                ["image", "Image ad", ImageIcon, "Make a lasting impression"],
              ].map(([v, label, Icon, sub]) => (
                <button
                  key={v}
                  className={type === v ? "selected" : ""}
                  onClick={() => setType(v)}
                >
                  <Icon size={23} />
                  <b>{label}</b>
                  <small>{sub}</small>
                  {type === v && (
                    <span>
                      <Check size={13} />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <Field label="Describe your idea" error={error}>
              <textarea
                rows={5}
                placeholder="e.g. Create a fresh, playful ad for our natural skincare collection. Think soft light, botanical ingredients, and a little everyday luxury."
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setError("");
                }}
                maxLength={2000}
              />
            </Field>
            <div className="prompt-ideas">
              <span>Need a spark?</span>
              {[
                "Skincare launch",
                "Sunday coffee",
                "New sneakers",
                "Weekend special",
              ].map((label, i) => (
                <button key={label} onClick={() => setPrompt(ideas[i])}>
                  {label}
                  <Plus size={11} />
                </button>
              ))}
            </div>
            <Field
              label="Product photo"
              hint="Optional. Used for image ads; demo videos use sample clips."
            >
              <div className="product-upload">
                {image ? (
                  <>
                    <img src={image} alt="Uploaded product reference" />
                    <span>Your product photo is ready</span>
                    <button
                      className="icon-button"
                      aria-label="Remove uploaded photo"
                      onClick={() => setImage(null)}
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <UploadCloud size={23} />
                    <div>
                      <Upload onFile={upload} className="upload-inline">
                        Upload a product photo
                      </Upload>
                      <small>JPG, PNG or WebP · up to 30 MB</small>
                    </div>
                  </>
                )}
              </div>
            </Field>
            <div className="form-row">
              <Field label="Ad format">
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="9:16">9:16 · Reels & Stories</option>
                  <option value="1:1">1:1 · Square feed</option>
                  <option value="4:5">4:5 · Portrait feed</option>
                  <option value="16:9">16:9 · YouTube & display</option>
                </select>
              </Field>
              {type === "video" ? (
                <Field label="Video length">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  >
                    <option value="6">6 seconds</option>
                    <option value="12">12 seconds</option>
                    <option value="18">18 seconds</option>
                    <option value="24">24 seconds</option>
                  </select>
                </Field>
              ) : (
                <Field label="Creative style">
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                  >
                    <option>Natural & editorial</option>
                    <option>Bold & colourful</option>
                    <option>Minimal & modern</option>
                  </select>
                </Field>
              )}
            </div>
            <div className="generation-settings">
              <span>
                <Layers size={15} />
                {type === "video"
                  ? "Veo-inspired sample videos"
                  : "Curated product photography"}
              </span>
              <span>3 variations</span>
            </div>
            <Button
              className="full-width generate-button"
              icon={Sparkles}
              onClick={generate}
            >
              Generate {type === "video" ? "videos" : "images"}
              <ArrowRight size={17} />
            </Button>
            <p className="demo-caption">
              Demo mode · Sample media, no credits or payment required.
            </p>
          </section>
          <aside className="studio-inspiration">
            <div className="inspiration-title">
              <span className="soft-label">A little inspiration</span>
              <h2>
                Made to catch
                <br />a second look.
              </h2>
              <p>Your brand deserves more than a scroll-by.</p>
            </div>
            <div className="inspiration-image">
              <img
                src={type === "video" ? stock[0].image : stock[4].image}
                alt="Product photography inspiration"
              />
              <span className="inspiration-badge">
                <Sparkles size={14} />
                Your next great creative
              </span>
            </div>
            <div className="brand-context">
              <span className="brand-dot" style={{ background: brand.color }} />
              <div>
                <b>Made for {brand.name}</b>
                <p>
                  {brand.tone} · {brand.language}
                </p>
              </div>
              <button
                className="icon-button"
                aria-label="Edit brand kit"
                onClick={() => navigate("/brand")}
              >
                <ArrowUpRight size={17} />
              </button>
            </div>
            <div className="creative-tip">
              <b>A small tip for a big difference</b>
              <p>
                Mention your product, your audience, and how you want the ad to
                feel. A little detail goes a long way.
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
