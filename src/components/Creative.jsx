import React, { useRef, useEffect, useState } from "react";
import {
  Play,
  Pause,
  Heart,
  MoreHorizontal,
  ImageIcon,
  Video,
  ArrowUpRight,
  Download,
  Pencil,
  Check,
} from "lucide-react";
import { useApp } from "../store";
import { navigate, Button } from "./UI";
import { drawCreative, loadSource, makeMusic } from "../media";
export function CreativeVisual({ asset, className = "", onClick }) {
  const e = asset.edit;
  return (
    <div
      className={"creative-visual " + className}
      style={{ aspectRatio: e.format.replace(":", "/") }}
      onClick={onClick}
    >
      <img
        src={asset.poster || asset.src}
        alt={asset.name}
        loading="lazy"
        style={{
          filter: `brightness(${e.brightness}%) contrast(${e.contrast}%) saturate(${e.saturation}%)`,
          transform: `scale(${e.zoom / 100}) rotate(${e.rotate}deg) scaleX(${e.flip ? -1 : 1})`,
          objectPosition: `${e.panX}% ${e.panY}%`,
        }}
      />
      <div
        className="creative-shade"
        style={{
          background: `linear-gradient(180deg,rgba(0,0,0,.15),transparent 30%,rgba(0,0,0,${e.overlay / 100}))`,
        }}
      />
      {e.showLogo && (
        <div className="creative-brand" style={{ color: e.textColor }}>
          {e.brand}
        </div>
      )}
      {e.showText && (
        <div
          className="creative-copy"
          style={{
            textAlign: e.align,
            color: e.textColor,
            top: `${Math.min(68, e.textY)}%`,
            fontFamily: e.font,
          }}
        >
          <strong style={{ fontSize: `${e.fontSize / 5.4}cqw` }}>
            {e.headline}
          </strong>
          <small>{e.subheadline}</small>
        </div>
      )}
      {e.showCta && (
        <span
          className={"creative-cta align-" + e.align}
          style={{ background: e.color }}
        >
          {e.cta}
          <ArrowUpRight size={11} />
        </span>
      )}
    </div>
  );
}
export function CreativeCard({
  asset,
  onSelect,
  selected = false,
  compact = false,
}) {
  const { patchAsset } = useApp();
  return (
    <article className={"creative-card " + (selected ? "chosen" : "")}>
      <div className="creative-card-picture">
        <CreativeVisual
          asset={asset}
          onClick={() =>
            onSelect ? onSelect(asset) : navigate("/editor/" + asset.id)
          }
        />
        <span className="media-type">
          {asset.type === "video" ? (
            <Video size={12} />
          ) : (
            <ImageIcon size={12} />
          )}{" "}
          {asset.type === "video" ? `${asset.edit.duration}s` : "Image"}
        </span>
        <button
          className={"favorite " + (asset.favorite ? "active" : "")}
          aria-label={
            asset.favorite ? "Remove from favorites" : "Add to favorites"
          }
          onClick={() => patchAsset(asset.id, { favorite: !asset.favorite })}
        >
          <Heart size={15} fill={asset.favorite ? "currentColor" : "none"} />
        </button>
        {asset.type === "video" && (
          <button
            className="play-bubble"
            aria-label={"Play " + asset.name}
            onClick={() => navigate("/editor/" + asset.id)}
          >
            <Play size={18} fill="currentColor" />
          </button>
        )}
        {selected && (
          <span className="selected-bubble">
            <Check size={15} />
          </span>
        )}
      </div>
      <div className="creative-card-body">
        <div>
          <h3>{asset.name}</h3>
          <p>
            {asset.category} <span>·</span> {asset.edit.format}
          </p>
        </div>
        <button
          className="icon-button"
          aria-label={"Edit " + asset.name}
          onClick={() => navigate("/editor/" + asset.id)}
        >
          <Pencil size={15} />
        </button>
      </div>
      {onSelect && (
        <button
          className={"select-creative " + (selected ? "selected" : "")}
          onClick={() => onSelect(asset)}
        >
          {selected ? (
            <>
              <Check size={14} />
              Selected creative
            </>
          ) : (
            <>
              Use this creative
              <ArrowUpRight size={14} />
            </>
          )}
        </button>
      )}
    </article>
  );
}
export function CanvasPreview({
  asset,
  playing = false,
  onTime,
  seek = 0,
  onError,
  canvasRef,
}) {
  const localRef = useRef(),
    ref = canvasRef || localRef;
  const sourcesRef = useRef([]),
    clock = useRef(0),
    raf = useRef(),
    musicRef = useRef(),
    editRef = useRef(asset.edit);
  const [ready, setReady] = useState(0);
  editRef.current = asset.edit;
  const clips = asset.edit.scenes?.length
    ? asset.edit.scenes
    : [
        {
          src: asset.src,
          type: asset.type,
          poster: asset.poster,
          duration: asset.edit.duration,
        },
      ];
  const signature = clips.map((x) => x.src).join("|");
  useEffect(() => {
    let cancelled = false;
    load();
    async function load() {
      try {
        const sources = await Promise.all(clips.map(loadSource));
        if (!cancelled) {
          sourcesRef.current.forEach((s) => s.pause?.());
          sourcesRef.current = sources;
          setReady((x) => x + 1);
        }
      } catch (e) {
        onError?.(e.message);
      }
    }
    return () => {
      cancelled = true;
      sourcesRef.current.forEach((s) => s.pause?.());
    };
  }, [signature]);
  function draw(time, play) {
    let cumulative = 0,
      index = clips.length - 1,
      local = 0;
    for (let i = 0; i < clips.length; i++) {
      if (time < cumulative + clips[i].duration) {
        index = i;
        local = time - cumulative;
        break;
      }
      cumulative += clips[i].duration;
    }
    const source = sourcesRef.current[index];
    if (!source || !ref.current) return;
    sourcesRef.current.forEach((s, i) => {
      if (s instanceof HTMLVideoElement) {
        if (i === index) {
          if (Math.abs(s.currentTime - (local % (s.duration || 12))) > 0.4)
            s.currentTime = local % (s.duration || 12);
          if (play && s.paused) s.play().catch(() => {});
          else if (!play) s.pause();
        } else s.pause();
      }
    });
    drawCreative(ref.current, source, editRef.current, time);
  }
  useEffect(() => {
    clock.current = seek;
    draw(seek, playing);
  }, [seek, ready]);
  useEffect(() => {
    if (!playing) {
      draw(clock.current, false);
      return;
    }
    let previous = performance.now();
    function tick(now) {
      const e = editRef.current;
      clock.current += (now - previous) / 1000;
      previous = now;
      if (clock.current > e.trimEnd) clock.current = e.trimStart || 0;
      if (clock.current < (e.trimStart || 0)) clock.current = e.trimStart || 0;
      draw(clock.current, true);
      onTime?.(clock.current);
      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      sourcesRef.current.forEach((s) => s.pause?.());
    };
  }, [playing, ready, signature]);
  useEffect(() => {
    if (!playing) draw(clock.current, false);
  }, [asset.edit]);
  useEffect(() => {
    if (playing && asset.edit.music !== "none")
      musicRef.current = makeMusic(asset.edit.music, asset.edit.volume);
    return () => {
      musicRef.current?.stop();
      musicRef.current = null;
    };
  }, [playing, asset.edit.music, asset.edit.volume]);
  return (
    <canvas
      ref={ref}
      className="creative-canvas"
      aria-label={"Preview of " + asset.name}
      style={{ aspectRatio: asset.edit.format.replace(":", "/") }}
    />
  );
}

export function CreativePlayer({ asset }) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  if (asset.type !== "video") return <CreativeVisual asset={asset} />;
  return (
    <div className="creative-player">
      <CanvasPreview
        asset={asset}
        playing={playing}
        seek={asset.edit.trimStart || 0}
        onError={setError}
      />
      <button
        className="player-control"
        aria-label={
          playing ? "Pause campaign preview" : "Play campaign preview"
        }
        onClick={() => setPlaying(!playing)}
      >
        {playing ? <Pause size={17} /> : <Play size={17} />}{" "}
        {playing ? "Pause" : "Play video"}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
