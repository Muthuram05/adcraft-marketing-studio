import React, { useEffect, useRef } from "react";
import {
  ArrowRight,
  ChevronDown,
  X,
  Sparkles,
  Check,
  Plus,
  Search,
} from "lucide-react";
export const navigate = (path) => {
  window.location.hash = path;
  window.scrollTo(0, 0);
};
export function Button({
  children,
  variant = "primary",
  icon: Icon,
  className = "",
  ...props
}) {
  return (
    <button className={"btn " + variant + " " + className} {...props}>
      {Icon && <Icon size={16} />} {children}
    </button>
  );
}
export function Logo({ small = false, onClick }) {
  return (
    <button
      className={"logo " + (small ? "small" : "")}
      onClick={onClick || (() => navigate("/dashboard"))}
      aria-label="AdCraft AI home"
    >
      <span className="logo-mark">
        <Sparkles size={23} strokeWidth={2.3} />
      </span>
      {!small && (
        <span>
          AdCraft<span className="logo-ai">AI</span>
        </span>
      )}
    </button>
  );
}
export function PageHead({ eyebrow, title, description, children }) {
  return (
    <div className="page-head">
      <div>
        {eyebrow && <div className="breadcrumb">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="head-actions">{children}</div>}
    </div>
  );
}
export function Field({ label, hint, children, error }) {
  return (
    <label className={"field " + (error ? "invalid" : "")}>
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
export function Badge({ children, status = "neutral" }) {
  return (
    <span className={"badge " + status.toLowerCase().replaceAll(" ", "-")}>
      <i />
      {children}
    </span>
  );
}
export function Channel({ name, small = false }) {
  return (
    <span className={"channel " + (small ? "compact" : "")}>
      <span className={"channel-symbol " + name.toLowerCase()}>
        {name === "Meta" ? "∞" : name === "Google" ? "G" : "♪"}
      </span>
      {!small && (
        <span>
          {name === "Meta"
            ? "Meta Ads"
            : name === "Google"
              ? "Google Ads"
              : "TikTok Ads"}
        </span>
      )}
    </span>
  );
}
export function ChannelPicker({ value, onChange }) {
  return (
    <div className="channel-picker">
      {["Meta", "Google", "TikTok"].map((name) => (
        <button
          key={name}
          type="button"
          className={
            "channel-option " + (value.includes(name) ? "selected" : "")
          }
          onClick={() =>
            onChange(
              value.includes(name)
                ? value.filter((v) => v !== name)
                : [...value, name],
            )
          }
        >
          <Channel name={name} />
          <span className="check-box">
            {value.includes(name) && <Check size={13} />}
          </span>
          <small>
            {name === "Meta"
              ? "Facebook & Instagram"
              : name === "Google"
                ? "Search, Display & YouTube"
                : "For you feed & video"}
          </small>
        </button>
      ))}
    </div>
  );
}
export function Modal({ title, description, children, onClose, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusables = [
          ...ref.current.querySelectorAll(
            'button,input,select,textarea,a[href],[tabindex="0"]',
          ),
        ].filter((x) => !x.disabled);
        const first = focusables[0],
          last = focusables.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={"modal " + (wide ? "wide" : "")}
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <button
          className="icon-button modal-close"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2>{title}</h2>
        {description && <p className="muted">{description}</p>}
        {children}
      </div>
    </div>
  );
}
export function Empty({ icon: Icon = Sparkles, title, description, action }) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <Icon size={28} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="search-box">
      <Search size={17} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="icon-button"
          aria-label="Clear search"
          onClick={() => onChange("")}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className={"toggle " + (checked ? "on" : "")}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}
export function Stepper({ step, labels, onChange }) {
  return (
    <div className="stepper">
      {labels.map((label, i) => (
        <React.Fragment key={label}>
          {i > 0 && (
            <span className={"step-line " + (step >= i ? "done" : "")} />
          )}
          <button
            type="button"
            className={
              "step " + (step === i ? "current" : step > i ? "complete" : "")
            }
            disabled={i > step}
            onClick={() => onChange?.(i)}
          >
            <span>{step > i ? <Check size={14} /> : i + 1}</span>
            <b>{label}</b>
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
export function Tabs({ value, onChange, items }) {
  return (
    <div className="tabs" role="tablist">
      {items.map((item) => {
        const v = typeof item === "string" ? item : item.value;
        const label = typeof item === "string" ? item : item.label;
        return (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={value === v}
            className={value === v ? "active" : ""}
            onClick={() => onChange(v)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
export function Upload({
  onFile,
  accept = "image/*",
  children,
  multiple = false,
  className = "",
}) {
  const ref = useRef();
  return (
    <>
      <input
        type="file"
        accept={accept}
        ref={ref}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          onFile(multiple ? [...e.target.files] : e.target.files[0]);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        className={className || "btn secondary"}
        onClick={() => ref.current.click()}
      >
        {children || (
          <>
            <Plus size={16} />
            Upload
          </>
        )}
      </button>
    </>
  );
}
export async function readUpload(file) {
  if (!file) throw new Error("Choose a file to upload.");
  if (!/^(image|video)\//.test(file.type))
    throw new Error("Please choose an image or video file.");
  if (file.size > 30 * 1024 * 1024)
    throw new Error("Choose a file smaller than 30 MB.");
  const data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  if (file.type.startsWith("video/")) return data;
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = data;
  });
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.88);
}
