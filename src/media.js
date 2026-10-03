import { saveBlob } from "./data.js";
export const dimensions = (format) =>
  format === "1:1"
    ? [720, 720]
    : format === "16:9"
      ? [960, 540]
      : format === "4:5"
        ? [720, 900]
        : [540, 960];
export function wrap(ctx, text, maxWidth, maxLines = 4) {
  const words = String(text || "").split(/\s+/),
    lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? line + " " + word : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}
export function drawCreative(canvas, source, edit, time = 0) {
  const ctx = canvas.getContext("2d");
  const [w, h] = dimensions(edit.format);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#24212c";
  ctx.fillRect(0, 0, w, h);
  const sw = source?.videoWidth || source?.naturalWidth || 0,
    sh = source?.videoHeight || source?.naturalHeight || 0;
  if (sw && sh) {
    const motion =
      source instanceof HTMLImageElement && edit.motion
        ? 1 + 0.04 * Math.sin(time / 3)
        : 1;
    const cover = Math.max(w / sw, h / sh) * (edit.zoom / 100) * motion;
    const dw = sw * cover,
      dh = sh * cover;
    ctx.save();
    ctx.filter = `brightness(${edit.brightness}%) contrast(${edit.contrast}%) saturate(${edit.saturation}%)`;
    ctx.translate(w / 2, h / 2);
    ctx.rotate((edit.rotate * Math.PI) / 180);
    ctx.scale(edit.flip ? -1 : 1, 1);
    ctx.drawImage(
      source,
      -dw * (edit.panX / 100) + w * (edit.panX / 100) - w / 2,
      -dh * (edit.panY / 100) + h * (edit.panY / 100) - h / 2,
      dw,
      dh,
    );
    ctx.restore();
  }
  const overlay = Math.min(0.9, edit.overlay / 100);
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "rgba(0,0,0,.12)");
  grad.addColorStop(0.3, "rgba(0,0,0,0)");
  grad.addColorStop(1, `rgba(0,0,0,${overlay})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  const scale = w / 540,
    pad = 36 * scale;
  ctx.fillStyle = edit.textColor;
  ctx.textBaseline = "top";
  if (edit.showLogo) {
    ctx.font = `600 ${17 * scale}px "DM Sans",sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(edit.brand || "Your brand", pad, pad, w - 2 * pad);
  }
  if (edit.showText) {
    ctx.textAlign = edit.align;
    const x =
      edit.align === "center" ? w / 2 : edit.align === "right" ? w - pad : pad;
    ctx.font = `400 ${16 * scale}px "DM Sans",sans-serif`;
    const supportingLines = wrap(ctx, edit.subheadline, w - 2 * pad, 2);
    const gap = supportingLines.length ? 14 * scale : 0;
    const top = pad + (edit.showLogo ? 32 * scale : 0);
    const bottom = h - pad - (edit.showCta ? 62 * scale : 0);
    let fs = edit.fontSize * scale,
      lines,
      lh,
      textHeight;
    // Reserve space for both the supporting copy and the CTA in every format.
    for (let attempt = 0; attempt < 24; attempt++) {
      ctx.font = `700 ${fs}px "${edit.font}",sans-serif`;
      lines = wrap(ctx, edit.headline, w - 2 * pad, 4);
      lh = fs * 1.08;
      textHeight =
        lines.length * lh + gap + supportingLines.length * 22 * scale;
      if (textHeight <= bottom - top) break;
      fs *= 0.9;
    }
    let y = Math.max(
      top,
      Math.min(bottom - textHeight, (h * edit.textY) / 100),
    );
    lines.forEach((line, i) => ctx.fillText(line, x, y + i * lh, w - 2 * pad));
    y += lines.length * lh + gap;
    ctx.font = `400 ${16 * scale}px "DM Sans",sans-serif`;
    supportingLines.forEach((line, i) =>
      ctx.fillText(line, x, y + i * 22 * scale, w - 2 * pad),
    );
  }
  if (edit.showCta) {
    ctx.font = `600 ${14 * scale}px "DM Sans",sans-serif`;
    const width = Math.min(
        w - 2 * pad,
        ctx.measureText(edit.cta).width + 40 * scale,
      ),
      height = 44 * scale;
    const x =
      edit.align === "center"
        ? (w - width) / 2
        : edit.align === "right"
          ? w - pad - width
          : pad;
    ctx.fillStyle = edit.color;
    ctx.beginPath();
    ctx.roundRect(x, h - pad - height, width, height, 7 * scale);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      edit.cta || "Learn more",
      x + width / 2,
      h - pad - height / 2,
      width - 20 * scale,
    );
  }
}
export function loadSource(asset) {
  return new Promise((resolve, reject) => {
    if (asset.type === "video") {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      const timeout = setTimeout(
        () =>
          reject(
            new Error(
              "The video took too long to load. Try uploading a smaller clip.",
            ),
          ),
        20000,
      );
      video.onloadeddata = () => {
        clearTimeout(timeout);
        resolve(video);
      };
      video.onerror = () => {
        clearTimeout(timeout);
        reject(new Error("Could not load this video. Choose another clip."));
      };
      video.src = asset.src;
      video.load();
    } else {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () =>
        reject(new Error("Could not load this image. Choose another photo."));
      img.src = asset.src;
    }
  });
}
export async function exportImage(asset) {
  const canvas = document.createElement("canvas");
  const source = await loadSource({
    ...asset,
    type: "image",
    src: asset.type === "video" ? asset.poster : asset.src,
  });
  await document.fonts.ready;
  drawCreative(canvas, source, asset.edit);
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new Error("Image export is not available in this browser.");
  saveBlob(blob, asset.name.replace(/[^a-z0-9]/gi, "-") + ".png");
  return blob;
}
export function makeMusic(track, volume = 25) {
  if (track === "none") return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  const context = new AudioContext();
  const destination = context.createMediaStreamDestination();
  const gain = context.createGain();
  gain.gain.value = (volume / 100) * 0.045;
  gain.connect(destination);
  gain.connect(context.destination);
  const frequencies =
    track === "ambient" ? [220, 277.18, 329.63] : [261.63, 329.63, 392];
  const oscillators = frequencies.map((f, i) => {
    const o = context.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    const g = context.createGain();
    g.gain.value = 0.6;
    o.connect(g);
    g.connect(gain);
    o.start();
    return o;
  });
  context.resume();
  return {
    stream: destination.stream,
    stop: () => {
      oscillators.forEach((o) => o.stop());
      context.close();
    },
  };
}
export async function exportVideo(asset, onProgress, signal) {
  if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream)
    throw new Error(
      "Video export needs a current Chrome, Edge, or Safari browser.",
    );
  const edit = asset.edit;
  const clips = edit.scenes?.length
    ? edit.scenes
    : [
        {
          src: asset.src,
          type: asset.type,
          poster: asset.poster,
          duration: edit.duration,
        },
      ];
  const sources = await Promise.all(clips.map(loadSource));
  if (signal?.aborted) {
    sources.forEach((s) => s.pause?.());
    throw new Error("Export cancelled.");
  }
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  drawCreative(canvas, sources[0], edit);
  const stream = canvas.captureStream(30);
  const music = makeMusic(edit.music, edit.volume);
  music?.stream.getAudioTracks().forEach((track) => stream.addTrack(track));
  const types = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4",
  ];
  const mimeType = types.find((t) => MediaRecorder.isTypeSupported(t));
  if (!mimeType) {
    music?.stop();
    throw new Error("Your browser does not support video recording.");
  }
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 4000000,
  });
  const chunks = [];
  const start = edit.trimStart || 0,
    end = edit.trimEnd || edit.duration;
  const duration = Math.max(0.5, end - start);
  let raf,
    aborted = false;
  const stop = () => {
    cancelAnimationFrame(raf);
    sources.forEach((s) => s.pause?.());
    music?.stop();
    stream.getTracks().forEach((t) => t.stop());
  };
  const result = new Promise((resolve, reject) => {
    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    recorder.onerror = () => {
      stop();
      reject(new Error("The video could not be exported. Try again."));
    };
    recorder.onstop = () => {
      stop();
      if (aborted) reject(new Error("Export cancelled."));
      else resolve(new Blob(chunks, { type: mimeType }));
    };
  });
  const abort = () => {
    aborted = true;
    if (recorder.state !== "inactive") recorder.stop();
  };
  signal?.addEventListener("abort", abort, { once: true });
  recorder.start(100);
  let current = -1;
  const begin = performance.now();
  function frame() {
    if (signal?.aborted) return;
    const elapsed = (performance.now() - begin) / 1000;
    const time = start + elapsed;
    let cumulative = 0,
      index = clips.length - 1,
      localTime = 0;
    for (let i = 0; i < clips.length; i++) {
      if (time < cumulative + clips[i].duration) {
        index = i;
        localTime = time - cumulative;
        break;
      }
      cumulative += clips[i].duration;
    }
    const source = sources[index];
    if (current !== index) {
      sources.forEach((s) => s.pause?.());
      if (source instanceof HTMLVideoElement) {
        source.currentTime = localTime % (source.duration || 12);
        source.play().catch(() => {});
      }
      current = index;
    }
    drawCreative(canvas, source, edit, time);
    onProgress(Math.min(100, Math.round((elapsed / duration) * 100)));
    if (elapsed >= duration) {
      recorder.stop();
      return;
    }
    raf = requestAnimationFrame(frame);
  }
  frame();
  try {
    const blob = await result;
    saveBlob(
      blob,
      asset.name.replace(/[^a-z0-9]/gi, "-") +
        (mimeType.startsWith("video/mp4") ? ".mp4" : ".webm"),
    );
    return blob;
  } finally {
    signal?.removeEventListener("abort", abort);
  }
}
