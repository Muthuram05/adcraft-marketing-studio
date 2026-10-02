import React, { useState } from "react";
import {
  Plus,
  UploadCloud,
  ImageIcon,
  Video,
  Heart,
  SlidersHorizontal,
  Sparkles,
  ArrowUpRight,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { useApp } from "../store";
import {
  PageHead,
  Button,
  Tabs,
  SearchBox,
  Empty,
  Upload,
  readUpload,
  navigate,
} from "../components/UI";
import { CreativeCard, CreativeVisual } from "../components/Creative";
import { uid, stock, defaultEdit } from "../data";
export default function Library({ templates = false }) {
  const { state, addAssets, patchAsset, notify } = useApp();
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState("All creatives"),
    [sort, setSort] = useState("newest");
  const assets = state.assets
    .filter((a) => !a.archived)
    .filter(
      (a) =>
        filter === "All creatives" ||
        (filter === "Videos" && a.type === "video") ||
        (filter === "Images" && a.type === "image") ||
        (filter === "Favorites" && a.favorite),
    )
    .filter((a) =>
      (a.name + " " + a.category + " " + a.brand)
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : new Date(b.createdAt) - new Date(a.createdAt),
    );
  async function upload(file) {
    try {
      const src = await readUpload(file);
      const type = file.type.startsWith("video") ? "video" : "image";
      let poster = src,
        duration = 12;
      if (type === "video") {
        const video = document.createElement("video");
        video.src = src;
        await new Promise((resolve, reject) => {
          video.onloadeddata = resolve;
          video.onerror = () =>
            reject(
              new Error("This video format is not supported. Try an MP4."),
            );
        });
        const canvas = document.createElement("canvas");
        canvas.width = 540;
        canvas.height = 720;
        canvas.getContext("2d").drawImage(video, 0, 0, 540, 720);
        poster = canvas.toDataURL("image/jpeg", 0.8);
        duration = Math.min(60, Math.round(video.duration) || 12);
      }
      const asset = {
        id: uid(),
        name: file.name.replace(/\.[^.]+$/, ""),
        type,
        src,
        poster,
        category: "Uploaded",
        brand: state.brand.name,
        createdAt: new Date().toISOString(),
        favorite: false,
        edit: {
          ...defaultEdit(),
          brand: state.brand.name,
          color: state.brand.color,
          duration,
          trimEnd: duration,
          showText: false,
          showCta: false,
          showLogo: false,
        },
      };
      addAssets([asset]);
      notify("Your media is ready to edit.");
    } catch (e) {
      notify(e.message, "error");
    }
  }
  function template(s) {
    const asset = {
      id: uid(),
      name: s.brand + " · " + s.tag + " template",
      type: "image",
      src: s.image,
      poster: s.image,
      category: s.tag,
      brand: state.brand.name,
      createdAt: new Date().toISOString(),
      favorite: false,
      edit: {
        ...defaultEdit(s),
        brand: state.brand.name,
        color: state.brand.color,
      },
    };
    addAssets([asset]);
    navigate("/editor/" + asset.id);
  }
  return (
    <>
      <PageHead
        title={
          templates
            ? "A head start for your next big idea."
            : "A home for your best ideas."
        }
        description={
          templates
            ? "Thoughtfully designed starting points. Ready for your own little twist."
            : "Everything you’ve created, uploaded, and made your own."
        }
      >
        {!templates && (
          <Upload accept="image/*,video/mp4,video/webm" onFile={upload}>
            <UploadCloud size={16} />
            Upload media
          </Upload>
        )}
        <Button icon={Plus} onClick={() => navigate("/studio")}>
          Create something new
        </Button>
      </PageHead>
      {templates ? (
        <>
          <div className="templates-banner">
            <Sparkles size={25} />
            <div>
              <h2>A little inspiration, a lot of you.</h2>
              <p>Choose a starting point and make it your own in the editor.</p>
            </div>
            <span>6 curated templates</span>
          </div>
          <div className="template-grid">
            {stock.map((s) => (
              <article className="template-card" key={s.id}>
                <CreativeVisual
                  asset={{
                    id: s.id,
                    name: s.title,
                    src: s.image,
                    poster: s.image,
                    type: "image",
                    edit: defaultEdit(s),
                  }}
                />
                <div>
                  <span className="soft-label">{s.tag}</span>
                  <h3>{s.title}</h3>
                  <Button
                    variant="secondary"
                    icon={ArrowUpRight}
                    onClick={() => template(s)}
                  >
                    Use template
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="library-controls">
            <Tabs
              value={filter}
              onChange={setFilter}
              items={["All creatives", "Videos", "Images", "Favorites"]}
            />
            <div>
              <SearchBox
                value={search}
                onChange={setSearch}
                placeholder="Search your creatives"
              />
              <select
                aria-label="Sort creatives"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>
          <div className="library-count">
            {assets.length} creative{assets.length !== 1 ? "s" : ""}{" "}
            <span>Ready for their moment.</span>
          </div>
          {assets.length ? (
            <div className="creative-grid library-grid">
              {assets.map((a) => (
                <div key={a.id}>
                  <CreativeCard asset={a} />
                  <div className="library-card-actions">
                    <button
                      className="text-button"
                      onClick={() => {
                        const copy = {
                          ...a,
                          id: uid(),
                          name: a.name + " (copy)",
                          createdAt: new Date().toISOString(),
                        };
                        addAssets([copy]);
                        notify("Creative duplicated.");
                      }}
                    >
                      Duplicate
                    </button>
                    <button
                      className="text-button muted"
                      onClick={() => {
                        patchAsset(a.id, { archived: true });
                        notify("Creative archived. You can restore it below.");
                      }}
                    >
                      Archive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              icon={ImageIcon}
              title={
                filter === "Favorites"
                  ? "Keep your favourites close."
                  : "A little space for your next idea."
              }
              description={
                filter === "Favorites"
                  ? "Tap the heart on a creative to save it here."
                  : "Try another search, upload a photo, or create something new."
              }
              action={
                <Button onClick={() => navigate("/studio")}>
                  Create an ad
                </Button>
              }
            />
          )}
          <details className="archive-list">
            <summary>
              Archived creatives (
              {state.assets.filter((a) => a.archived).length})
            </summary>
            {state.assets
              .filter((a) => a.archived)
              .map((a) => (
                <div key={a.id}>
                  <span>{a.name}</span>
                  <Button
                    variant="ghost"
                    icon={RotateCcw}
                    onClick={() => {
                      patchAsset(a.id, { archived: false });
                      notify("Creative restored.");
                    }}
                  >
                    Restore
                  </Button>
                </div>
              ))}
          </details>
        </>
      )}
    </>
  );
}
