import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Undo2,
  Redo2,
  Download,
  Save,
  Play,
  Pause,
  Type,
  SlidersHorizontal,
  Crop,
  Music2,
  Layers,
  Plus,
  Trash2,
  RotateCw,
  FlipHorizontal,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Check,
  ImageIcon,
  Video,
  X,
  LoaderCircle,
  MoveLeft,
  MoveRight,
  UploadCloud,
} from "lucide-react";
import { useApp } from "../store";
import {
  Button,
  Field,
  Tabs,
  Modal,
  Toggle,
  Upload,
  readUpload,
  navigate,
  Empty,
} from "../components/UI";
import { CanvasPreview } from "../components/Creative";
import { exportImage, exportVideo } from "../media";
const timeLabel = (n) =>
  `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;
function Range({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  suffix = "",
}) {
  return (
    <label className="range-field">
      <span>
        {label}
        <b>
          {Number(value).toFixed(step < 1 ? 1 : 0)}
          {suffix}
        </b>
      </span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
export default function Editor({ id }) {
  const { state, patchAsset, notify } = useApp();
  const campaignId = new URLSearchParams(location.hash.split("?")[1]).get(
    "campaign",
  );
  const original = state.assets.find((a) => a.id === id);
  const [asset, setAsset] = useState(original),
    [tab, setTab] = useState("text"),
    [playing, setPlaying] = useState(false),
    [time, setTime] = useState(0),
    [seek, setSeek] = useState(0),
    [history, setHistory] = useState([]),
    [future, setFuture] = useState([]),
    [exporting, setExporting] = useState(false),
    [progress, setProgress] = useState(0),
    [addScene, setAddScene] = useState(false),
    [error, setError] = useState(""),
    [saved, setSaved] = useState(true);
  const abort = useRef();
  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => {
    if (!asset) return;
    setSaved(false);
    const timer = setTimeout(() => {
      patchAsset(id, {
        edit: asset.edit,
        name: asset.name,
        src: asset.src,
        poster: asset.poster,
      });
      setSaved(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [asset]);
  if (!asset)
    return (
      <Empty
        title="This creative is no longer here"
        description="Choose another creative from your media library."
        action={
          <Button onClick={() => navigate("/library")}>
            Open media library
          </Button>
        }
      />
    );
  const e = asset.edit;
  function patch(values) {
    setHistory((h) => [...h.slice(-39), structuredClone(asset)]);
    setFuture([]);
    setAsset((a) => ({ ...a, edit: { ...a.edit, ...values } }));
  }
  function undo() {
    if (!history.length) return;
    setFuture((f) => [asset, ...f]);
    setAsset(history.at(-1));
    setHistory((h) => h.slice(0, -1));
  }
  function redo() {
    if (!future.length) return;
    setHistory((h) => [...h, asset]);
    setAsset(future[0]);
    setFuture((f) => f.slice(1));
  }
  function save() {
    patchAsset(id, {
      edit: asset.edit,
      name: asset.name,
      src: asset.src,
      poster: asset.poster,
    });
    setSaved(true);
    notify("Creative saved to your library.");
  }
  async function download() {
    setPlaying(false);
    setError("");
    setExporting(true);
    setProgress(0);
    abort.current = new AbortController();
    try {
      if (asset.type === "image") await exportImage(asset);
      else await exportVideo(asset, setProgress, abort.current.signal);
      notify(
        asset.type === "image"
          ? "Your edited image is downloaded."
          : "Your edited video is downloaded.",
      );
    } catch (err) {
      if (err.message !== "Export cancelled.") notify(err.message, "error");
    } finally {
      setExporting(false);
    }
  }
  const scenes = e.scenes?.length
    ? e.scenes
    : [
        {
          src: asset.src,
          poster: asset.poster,
          type: asset.type,
          duration: e.duration,
        },
      ];
  function updateScenes(next) {
    const duration = next.reduce((a, s) => a + s.duration, 0);
    patch({ scenes: next, duration, trimEnd: duration, trimStart: 0 });
    setSeek(0);
    setTime(0);
  }
  function insertScene(a) {
    if (scenes.length >= 6) {
      notify("Use up to six scenes per video.", "error");
      return;
    }
    updateScenes([
      ...scenes,
      { src: a.src, poster: a.poster, type: a.type, duration: 4 },
    ]);
    setAddScene(false);
  }
  return (
    <div className="editor-page">
      <div className="editor-top">
        <div className="editor-identity">
          <button
            className="icon-button"
            aria-label="Back to media library"
            onClick={() => {
              save();
              navigate("/library");
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <input
              aria-label="Creative name"
              value={asset.name}
              onChange={(ev) =>
                setAsset((a) => ({ ...a, name: ev.target.value }))
              }
            />
            <span className="saved-indicator">
              <Check size={12} />
              {saved ? "All changes saved" : "Saving changes…"}
            </span>
          </div>
        </div>
        <div className="editor-actions">
          <button
            className="icon-button"
            disabled={!history.length}
            aria-label="Undo edit"
            onClick={undo}
          >
            <Undo2 size={17} />
          </button>
          <button
            className="icon-button"
            disabled={!future.length}
            aria-label="Redo edit"
            onClick={redo}
          >
            <Redo2 size={17} />
          </button>
          <Button variant="secondary" icon={Download} onClick={download}>
            Export {asset.type}
          </Button>
          <Button
            icon={ArrowRight}
            onClick={() => {
              save();
              navigate(
                campaignId
                  ? "/review/" + campaignId
                  : "/review/new?asset=" + id,
              );
            }}
          >
            Use in campaign
          </Button>
        </div>
      </div>
      <div className="editor-workspace">
        <div className="editor-toolbar">
          {[
            ["text", "Text", Type],
            ["adjust", "Adjust", SlidersHorizontal],
            ["crop", "Layout", Crop],
            ...(asset.type === "video"
              ? [
                  ["audio", "Audio", Music2],
                  ["scenes", "Scenes", Layers],
                ]
              : []),
          ].map(([key, label, Icon]) => (
            <button
              key={key}
              className={tab === key ? "active" : ""}
              onClick={() => setTab(key)}
            >
              <Icon size={21} />
              <span>{label}</span>
            </button>
          ))}
        </div>
        <aside className="editor-properties">
          <h2>
            {tab === "text"
              ? "Make it your message"
              : tab === "adjust"
                ? "The finishing touches"
                : tab === "crop"
                  ? "Find your frame"
                  : tab === "audio"
                    ? "Set the mood"
                    : "Tell your story"}
          </h2>
          <p>
            {tab === "text"
              ? "A few words. A lasting impression."
              : tab === "adjust"
                ? "A little light makes all the difference."
                : tab === "crop"
                  ? "A perfect fit for every feed."
                  : tab === "audio"
                    ? "Original demo soundtracks for your ad."
                    : "Build your video, one moment at a time."}
          </p>
          {tab === "text" ? (
            <>
              <Field label="Headline">
                <textarea
                  rows={3}
                  value={e.headline}
                  onChange={(ev) => patch({ headline: ev.target.value })}
                  maxLength={120}
                />
              </Field>
              <Field label="Supporting text">
                <textarea
                  rows={2}
                  value={e.subheadline}
                  onChange={(ev) => patch({ subheadline: ev.target.value })}
                  maxLength={150}
                />
              </Field>
              <Field label="Brand name">
                <input
                  value={e.brand}
                  onChange={(ev) => patch({ brand: ev.target.value })}
                />
              </Field>
              <Field label="Button text">
                <input
                  value={e.cta}
                  onChange={(ev) => patch({ cta: ev.target.value })}
                  maxLength={35}
                />
              </Field>
              <Field label="Font">
                <select
                  value={e.font}
                  onChange={(ev) => patch({ font: ev.target.value })}
                >
                  <option>DM Sans</option>
                  <option>Georgia</option>
                  <option>Arial</option>
                  <option>Verdana</option>
                </select>
              </Field>
              <Range
                label="Text size"
                min={24}
                max={80}
                value={e.fontSize}
                onChange={(v) => patch({ fontSize: v })}
                suffix=" px"
              />
              <Range
                label="Text position"
                min={15}
                max={75}
                value={e.textY}
                onChange={(v) => patch({ textY: v })}
                suffix="%"
              />
              <div className="form-row">
                <Field label="Text colour">
                  <div className="color-input">
                    <input
                      aria-label="Text colour"
                      type="color"
                      value={e.textColor}
                      onChange={(ev) => patch({ textColor: ev.target.value })}
                    />
                    <span>{e.textColor}</span>
                  </div>
                </Field>
                <Field label="Button colour">
                  <div className="color-input">
                    <input
                      aria-label="Button colour"
                      type="color"
                      value={e.color}
                      onChange={(ev) => patch({ color: ev.target.value })}
                    />
                    <span>{e.color}</span>
                  </div>
                </Field>
              </div>
              <div className="alignment-buttons">
                {[
                  ["left", AlignLeft],
                  ["center", AlignCenter],
                  ["right", AlignRight],
                ].map(([v, Icon]) => (
                  <button
                    className={e.align === v ? "active" : ""}
                    key={v}
                    aria-label={"Align " + v}
                    onClick={() => patch({ align: v })}
                  >
                    <Icon size={17} />
                  </button>
                ))}
              </div>
              <div className="toggle-row">
                <span>Show brand name</span>
                <Toggle
                  label="Show brand name"
                  checked={e.showLogo}
                  onChange={(v) => patch({ showLogo: v })}
                />
              </div>
              <div className="toggle-row">
                <span>Show ad text</span>
                <Toggle
                  label="Show ad text"
                  checked={e.showText}
                  onChange={(v) => patch({ showText: v })}
                />
              </div>
              <div className="toggle-row">
                <span>Show button</span>
                <Toggle
                  label="Show button"
                  checked={e.showCta}
                  onChange={(v) => patch({ showCta: v })}
                />
              </div>
            </>
          ) : tab === "adjust" ? (
            <>
              <div className="filter-presets">
                {[
                  ["Original", 100, 100, 100],
                  ["Warm", 105, 105, 120],
                  ["Soft", 110, 85, 80],
                  ["Mono", 100, 110, 0],
                  ["Bold", 95, 130, 135],
                  ["Faded", 115, 80, 60],
                ].map(([label, b, c, s]) => (
                  <button
                    key={label}
                    onClick={() =>
                      patch({ brightness: b, contrast: c, saturation: s })
                    }
                  >
                    <img
                      src={asset.poster}
                      alt=""
                      style={{
                        filter: `brightness(${b}%) contrast(${c}%) saturate(${s}%)`,
                      }}
                    />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              <Range
                label="Brightness"
                min={40}
                max={160}
                value={e.brightness}
                onChange={(v) => patch({ brightness: v })}
              />
              <Range
                label="Contrast"
                min={40}
                max={160}
                value={e.contrast}
                onChange={(v) => patch({ contrast: v })}
              />
              <Range
                label="Saturation"
                min={0}
                max={200}
                value={e.saturation}
                onChange={(v) => patch({ saturation: v })}
              />
              <Range
                label="Text backdrop"
                min={0}
                max={90}
                value={e.overlay}
                onChange={(v) => patch({ overlay: v })}
                suffix="%"
              />
              <Button
                variant="secondary"
                className="full-width"
                onClick={() =>
                  patch({
                    brightness: 100,
                    contrast: 100,
                    saturation: 100,
                    overlay: 50,
                  })
                }
              >
                Reset adjustments
              </Button>
            </>
          ) : tab === "crop" ? (
            <>
              <Field label="Aspect ratio">
                <select
                  value={e.format}
                  onChange={(ev) => patch({ format: ev.target.value })}
                >
                  <option value="9:16">9:16 · Reels & Stories</option>
                  <option value="1:1">1:1 · Square</option>
                  <option value="4:5">4:5 · Portrait</option>
                  <option value="16:9">16:9 · Landscape</option>
                </select>
              </Field>
              <Range
                label="Zoom"
                min={100}
                max={200}
                value={e.zoom}
                onChange={(v) => patch({ zoom: v })}
                suffix="%"
              />
              <Range
                label="Horizontal position"
                value={e.panX}
                onChange={(v) => patch({ panX: v })}
              />
              <Range
                label="Vertical position"
                value={e.panY}
                onChange={(v) => patch({ panY: v })}
              />
              <div className="form-row">
                <Button
                  variant="secondary"
                  icon={RotateCw}
                  onClick={() => patch({ rotate: (e.rotate + 90) % 360 })}
                >
                  Rotate
                </Button>
                <Button
                  variant="secondary"
                  icon={FlipHorizontal}
                  onClick={() => patch({ flip: !e.flip })}
                >
                  Flip
                </Button>
              </div>
              <div className="property-divider" />
              <Upload
                onFile={async (file) => {
                  try {
                    const src = await readUpload(file);
                    setHistory((h) => [...h, asset]);
                    setAsset((a) => ({ ...a, src, poster: src }));
                    notify("Photo replaced.");
                  } catch (err) {
                    notify(err.message, "error");
                  }
                }}
                accept="image/*"
                className={
                  "btn secondary full-width " +
                  (asset.type === "video" ? "hidden" : "")
                }
              >
                <UploadCloud size={16} />
                Replace photo
              </Upload>
              <Button
                variant="ghost"
                className="full-width"
                onClick={() =>
                  patch({
                    zoom: 100,
                    panX: 50,
                    panY: 50,
                    rotate: 0,
                    flip: false,
                  })
                }
              >
                Reset layout
              </Button>
            </>
          ) : tab === "audio" ? (
            <>
              <div className="music-options">
                {[
                  ["none", "No music", "Let the visuals do the talking"],
                  [
                    "ambient",
                    "Warm ambient",
                    "A soft, original three-note harmony",
                  ],
                  [
                    "bright",
                    "Bright morning",
                    "A lighter, original three-note harmony",
                  ],
                ].map(([value, title, sub]) => (
                  <button
                    className={e.music === value ? "selected" : ""}
                    key={value}
                    onClick={() => patch({ music: value })}
                  >
                    <Music2 size={20} />
                    <div>
                      <b>{title}</b>
                      <small>{sub}</small>
                    </div>
                    {e.music === value && <Check size={16} />}
                  </button>
                ))}
              </div>
              <Range
                label="Music volume"
                value={e.volume}
                onChange={(v) => patch({ volume: v })}
                suffix="%"
              />
              <p className="info-note">
                Press play to hear the soundtrack. Music is included in the
                exported video; original sample clips are silent.
              </p>
            </>
          ) : (
            <>
              <div className="scene-list">
                {scenes.map((scene, i) => (
                  <div className="scene-list-item" key={i}>
                    <img src={scene.poster} alt={"Scene " + (i + 1)} />
                    <div>
                      <b>Scene {i + 1}</b>
                      <label>
                        <input
                          aria-label={"Scene " + (i + 1) + " duration"}
                          type="number"
                          min="1"
                          max="15"
                          value={scene.duration}
                          onChange={(ev) =>
                            updateScenes(
                              scenes.map((s, j) =>
                                j === i
                                  ? {
                                      ...s,
                                      duration: Math.min(
                                        15,
                                        Math.max(1, Number(ev.target.value)),
                                      ),
                                    }
                                  : s,
                              ),
                            )
                          }
                        />
                        sec
                      </label>
                    </div>
                    <div>
                      <button
                        className="icon-button"
                        disabled={i === 0}
                        aria-label={"Move scene " + (i + 1) + " earlier"}
                        onClick={() => {
                          const n = [...scenes];
                          [n[i - 1], n[i]] = [n[i], n[i - 1]];
                          updateScenes(n);
                        }}
                      >
                        <MoveLeft size={14} />
                      </button>
                      <button
                        className="icon-button"
                        disabled={scenes.length === 1}
                        aria-label={"Remove scene " + (i + 1)}
                        onClick={() =>
                          updateScenes(scenes.filter((_, j) => j !== i))
                        }
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="secondary"
                className="full-width"
                icon={Plus}
                onClick={() => setAddScene(true)}
                disabled={scenes.length >= 6}
              >
                Add a scene
              </Button>
              <p className="field-hint">
                Up to 6 scenes. Use images or video from your library.
              </p>
            </>
          )}
        </aside>
        <section className="editor-stage">
          <div className="stage-top">
            <span>{asset.type === "video" ? "Video" : "Image"} preview</span>
            <span>
              {e.format} <span>·</span>{" "}
              {asset.type === "video"
                ? timeLabel(e.trimEnd - e.trimStart)
                : "High quality"}
            </span>
          </div>
          <div className="canvas-wrap">
            <CanvasPreview
              asset={asset}
              playing={playing}
              seek={seek}
              onTime={setTime}
              onError={setError}
            />
            {error && <div className="canvas-error">{error}</div>}
          </div>
          <div className="stage-bottom">
            <span>
              <Check size={12} />
              Your changes appear in the export
            </span>
            {asset.type === "video" && (
              <button
                className="preview-play"
                aria-label={playing ? "Pause preview" : "Play preview"}
                onClick={() => setPlaying(!playing)}
              >
                {playing ? (
                  <Pause size={17} />
                ) : (
                  <Play size={17} fill="currentColor" />
                )}
                {playing ? "Pause preview" : "Play preview"}
              </button>
            )}
            <span>
              {asset.type === "video"
                ? `${timeLabel(time)} / ${timeLabel(e.duration)}`
                : "100%"}
            </span>
          </div>
          {asset.type === "video" && (
            <div className="timeline">
              <div className="timeline-head">
                <span>
                  <Layers size={14} />
                  Your story, frame by frame
                </span>
                <button
                  className="text-button"
                  onClick={() => setTab("scenes")}
                >
                  Edit scenes
                  <Plus size={12} />
                </button>
              </div>
              <div className="timeline-ruler">
                <span>0:00</span>
                <span>{timeLabel(e.duration / 4)}</span>
                <span>{timeLabel(e.duration / 2)}</span>
                <span>{timeLabel(e.duration * 0.75)}</span>
                <span>{timeLabel(e.duration)}</span>
              </div>
              <div className="timeline-track">
                {scenes.map((s, i) => (
                  <button
                    key={i}
                    style={{ flex: s.duration }}
                    onClick={() => {
                      setSeek(
                        scenes
                          .slice(0, i)
                          .reduce((sum, x) => sum + x.duration, 0),
                      );
                      setTab("scenes");
                    }}
                  >
                    {[1, 2, 3].map((j) => (
                      <img key={j} src={s.poster} alt="" />
                    ))}
                    <span>Scene {i + 1}</span>
                  </button>
                ))}
                <div
                  className="playhead"
                  style={{ left: (time / e.duration) * 100 + "%" }}
                />
              </div>
              <input
                className="timeline-seek"
                type="range"
                aria-label="Video playhead"
                min="0"
                max={e.duration}
                step="0.1"
                value={time}
                onChange={(ev) => {
                  setTime(Number(ev.target.value));
                  setSeek(Number(ev.target.value));
                }}
              />
              <div className="trim-controls">
                <Range
                  label="Trim start"
                  value={e.trimStart}
                  max={Math.max(0, e.trimEnd - 1)}
                  step={0.1}
                  onChange={(v) => {
                    patch({ trimStart: v });
                    setSeek(v);
                    setTime(v);
                  }}
                  suffix="s"
                />
                <Range
                  label="Trim end"
                  min={e.trimStart + 1}
                  max={e.duration}
                  step={0.1}
                  value={e.trimEnd}
                  onChange={(v) => patch({ trimEnd: v })}
                  suffix="s"
                />
              </div>
            </div>
          )}
        </section>
      </div>
      {addScene && (
        <Modal
          title="Add a little more to your story"
          description="Choose a creative from your library."
          wide
          onClose={() => setAddScene(false)}
        >
          <div className="scene-picker">
            {state.assets.map((a) => (
              <button key={a.id} onClick={() => insertScene(a)}>
                <img src={a.poster} alt={a.name} />
                <b>{a.name}</b>
                <small>{a.type}</small>
              </button>
            ))}
          </div>
        </Modal>
      )}
      {exporting && (
        <Modal
          title={
            asset.type === "video"
              ? "Your video is coming together."
              : "Finishing your image."
          }
          description={
            asset.type === "video"
              ? "Keep this tab open while your edits and soundtrack are rendered."
              : "Preparing your full-resolution PNG."
          }
          onClose={() => {
            abort.current?.abort();
            setExporting(false);
          }}
        >
          <div className="export-state">
            <LoaderCircle className="spin" size={32} />
            <strong>
              {asset.type === "video" ? progress + "%" : "Almost ready"}
            </strong>
            <div className="generation-progress">
              <div style={{ width: progress + "%" }} />
            </div>
            <small>
              {asset.type === "video"
                ? "Export takes approximately the length of your edited video."
                : "Your download will start automatically."}
            </small>
          </div>
          {asset.type === "video" && (
            <Button variant="secondary" onClick={() => abort.current?.abort()}>
              Cancel export
            </Button>
          )}
        </Modal>
      )}
    </div>
  );
}
