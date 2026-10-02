export const uid = () => crypto.randomUUID();
export const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);
export const number = (n) => new Intl.NumberFormat("en-IN").format(n || 0);
export const initialBrand = {
  name: "Bloom & Bare",
  industry: "Beauty & skincare",
  description:
    "Thoughtfully made skincare. Plant-powered ingredients, everyday rituals, and a little more time for yourself.",
  website: "https://bloomandbare.example",
  color: "#876f4d",
  logo: "",
  tone: "Warm & friendly",
  audience: "People who love natural skincare and thoughtful everyday rituals",
  location: "Chennai, India",
  language: "English",
};
export const stock = [
  {
    id: "skincare",
    image: "/media/skincare.jpg",
    video: "/media/skincare.mp4",
    brand: "Bloom & Bare",
    title: "A little care. A lot of glow.",
    subtitle: "Your daily dose of naturally beautiful.",
    tag: "Skincare",
    category: "Beauty & skincare",
    color: "#775942",
    cta: "Find your glow",
  },
  {
    id: "coffee",
    image: "/media/coffee.jpg",
    video: "/media/coffee.mp4",
    brand: "Sunday Coffee",
    title: "Slow mornings. Better coffee.",
    subtitle: "Small-batch roasted. Made for your ritual.",
    tag: "Food & drink",
    category: "Food & beverage",
    color: "#c3814f",
    cta: "Shop the roast",
  },
  {
    id: "shoe",
    image: "/media/shoe.jpg",
    video: "/media/shoe.mp4",
    brand: "Stride",
    title: "Made for your next move.",
    subtitle: "Everyday comfort. Extraordinary energy.",
    tag: "Lifestyle",
    category: "Fashion & lifestyle",
    color: "#f26143",
    cta: "Find your pair",
  },
  {
    id: "biryani",
    image: "/media/biryani.jpg",
    video: "/media/biryani.mp4",
    brand: "Spice House",
    title: "Your weekend deserves this.",
    subtitle: "Slow-cooked biryani. A little extra happiness.",
    tag: "Food & drink",
    category: "Food & beverage",
    color: "#ed9b30",
    cta: "Order now",
  },
  {
    id: "perfume",
    image: "/media/perfume.jpg",
    video: "/media/perfume.mp4",
    brand: "Maison Muse",
    title: "Leave a little mystery.",
    subtitle: "A signature scent. Unmistakably you.",
    tag: "Beauty",
    category: "Beauty & skincare",
    color: "#9c7459",
    cta: "Discover the scent",
  },
  {
    id: "watch",
    image: "/media/watch.jpg",
    video: "/media/watch.mp4",
    brand: "Daylight",
    title: "Make time for what matters.",
    subtitle: "Quiet design for your everyday moments.",
    tag: "Accessories",
    category: "Fashion & lifestyle",
    color: "#658575",
    cta: "Explore the collection",
  },
];
export const defaultEdit = (s = stock[0]) => ({
  headline: s.title,
  subheadline: s.subtitle,
  brand: s.brand,
  cta: s.cta,
  color: s.color,
  textColor: "#ffffff",
  font: "DM Sans",
  fontSize: 48,
  align: "left",
  textY: 64,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  zoom: 100,
  panX: 50,
  panY: 50,
  rotate: 0,
  flip: false,
  overlay: 50,
  format: "9:16",
  duration: 12,
  trimStart: 0,
  trimEnd: 12,
  music: "none",
  volume: 25,
  showLogo: true,
  showText: true,
  showCta: true,
});
export const seedAssets = () =>
  stock.flatMap((s, i) => [
    {
      id: "asset-" + s.id,
      name: s.title,
      type: i % 2 === 0 ? "video" : "image",
      src: i % 2 === 0 ? s.video : s.image,
      poster: s.image,
      category: s.tag,
      createdAt: "2026-10-01T08:00:00.000Z",
      favorite: i === 0,
      edit: defaultEdit(s),
      prompt: s.subtitle,
      brand: s.brand,
    },
  ]);
export const seedCampaigns = () => [
  {
    id: "camp-glow",
    name: "The everyday glow",
    brand: "Bloom & Bare",
    assetId: "asset-skincare",
    channels: ["Meta"],
    goal: "Lead generation",
    status: "Active",
    dailyBudget: 500,
    days: 14,
    spend: 4850,
    impressions: 48620,
    clicks: 1634,
    leads: 42,
    createdAt: "2026-09-24T08:00:00.000Z",
    location: "Chennai, India",
    ageMin: 21,
    ageMax: 45,
    primaryText:
      "Make room for a little everyday care. Discover our plant-powered skincare collection.",
    headline: "Your daily dose of glow",
    cta: "Shop now",
    paid: true,
  },
  {
    id: "camp-coffee",
    name: "Your morning, upgraded",
    brand: "Sunday Coffee",
    assetId: "asset-coffee",
    channels: ["Meta", "Google"],
    goal: "Website traffic",
    status: "Active",
    dailyBudget: 750,
    days: 14,
    spend: 7620,
    impressions: 62940,
    clicks: 2480,
    leads: 68,
    createdAt: "2026-09-21T08:00:00.000Z",
    location: "Bengaluru, India",
    ageMin: 18,
    ageMax: 55,
    primaryText:
      "Meet your new morning ritual. Freshly roasted, delivered to your door.",
    headline: "Better mornings start here",
    cta: "Shop now",
    paid: true,
  },
  {
    id: "camp-stride",
    name: "A fresh start",
    brand: "Stride",
    assetId: "asset-shoe",
    channels: ["Google"],
    goal: "Sales",
    status: "Paused",
    dailyBudget: 600,
    days: 10,
    spend: 3450,
    impressions: 25430,
    clicks: 976,
    leads: 26,
    createdAt: "2026-09-18T08:00:00.000Z",
    location: "Mumbai, India",
    ageMin: 18,
    ageMax: 40,
    primaryText: "A new season. A new stride.",
    headline: "Go your own way",
    cta: "Shop now",
    paid: true,
  },
  {
    id: "camp-weekend",
    name: "Weekend specials",
    brand: "Spice House",
    assetId: "asset-biryani",
    channels: ["Meta"],
    goal: "Lead generation",
    status: "Draft",
    dailyBudget: 350,
    days: 7,
    spend: 0,
    impressions: 0,
    clicks: 0,
    leads: 0,
    createdAt: "2026-10-01T08:00:00.000Z",
    location: "Tirunelveli, India",
    ageMin: 18,
    ageMax: 60,
    primaryText: "Your favourite biryani is calling.",
    headline: "Make it a delicious weekend",
    cta: "Order now",
    paid: false,
  },
];
export const seedLeads = () =>
  [
    "Aarav Sharma",
    "Priya Nair",
    "Rohan Mehta",
    "Ananya Iyer",
    "Vikram Rao",
    "Sneha Menon",
    "Arjun Kumar",
    "Meera Shah",
  ].map((name, i) => ({
    id: "lead-" + i,
    name,
    email: name.toLowerCase().replace(" ", ".") + "@example.com",
    phone: "+91 00000 " + String(i + 10000),
    campaignId: i % 2 ? "camp-coffee" : "camp-glow",
    source: i % 3 === 0 ? "Google" : "Meta",
    status: ["New", "Contacted", "Qualified", "New"][i % 4],
    date: new Date(Date.UTC(2026, 9, 1, 10 - i)).toISOString(),
    notes: "",
    mock: true,
  }));
export const initialState = () => ({
  version: 1,
  brand: { ...initialBrand },
  assets: seedAssets(),
  campaigns: seedCampaigns(),
  leads: seedLeads(),
  profile: {
    name: "Alex Morgan",
    email: "alex@example.com",
    business: "Bloom & Bare",
  },
  connections: { Meta: true, Google: false, TikTok: false },
  settings: { emailNotifications: true, leadNotifications: true },
  payments: [],
  draft: null,
});
export function getStock(prompt = "", industry = "") {
  const match = (text) => {
    const p = text.toLowerCase();
    if (/coffee|cafe|roast/.test(p)) return stock[1];
    if (/biryani|restaurant|spice|food|rice/.test(p)) return stock[3];
    if (/shoe|sneaker|sport|fitness/.test(p)) return stock[2];
    if (/perfume|fragrance|scent/.test(p)) return stock[4];
    if (/watch|jewel|accessor/.test(p)) return stock[5];
    if (/skin|beauty|serum|glow/.test(p)) return stock[0];
  };
  return match(prompt) || match(industry) || stock[0];
}
export function generateAssets(
  {
    prompt,
    brand,
    type = "video",
    format = "9:16",
    duration = 12,
    count = 3,
    image,
    style = "Natural & editorial",
  },
  random = Math.random,
) {
  const s = getStock(prompt, brand.industry);
  const variants = [
    { title: s.title, subtitle: s.subtitle },
    {
      title: "Meet your new everyday favourite.",
      subtitle: "Made with care. Made for you.",
    },
    {
      title: "A little different. A little you.",
      subtitle: "Discover something worth coming back to.",
    },
  ];
  return Array.from({ length: count }, (_, i) => {
    const variant = variants[i % 3];
    const pick =
      i === 0
        ? s
        : random() > 0.55
          ? s
          : stock.filter((x) => x.category === s.category)[
              i % stock.filter((x) => x.category === s.category).length
            ];
    return {
      id: uid(),
      name:
        (brand.name || s.brand) +
        " · " +
        ["The product story", "The everyday ritual", "A fresh perspective"][
          i % 3
        ],
      type,
      src: type === "video" ? pick.video : image || pick.image,
      poster: type === "image" && image ? image : pick.image,
      category: s.tag,
      createdAt: new Date().toISOString(),
      favorite: false,
      brand: brand.name || s.brand,
      prompt,
      edit: {
        ...defaultEdit(s),
        headline: variant.title,
        subheadline: variant.subtitle,
        brand: brand.name || s.brand,
        color: brand.color || s.color,
        ...(style === "Bold & colourful"
          ? { saturation: 135, contrast: 115 }
          : style === "Minimal & modern"
            ? { saturation: 55, overlay: 35 }
            : {}),
        format,
        duration,
        trimEnd: duration,
      },
    };
  });
}
export function campaignTotals(campaigns) {
  return campaigns.reduce(
    (a, c) => ({
      spend: a.spend + c.spend,
      impressions: a.impressions + c.impressions,
      clicks: a.clicks + c.clicks,
      leads: a.leads + c.leads,
    }),
    { spend: 0, impressions: 0, clicks: 0, leads: 0 },
  );
}
export function validateCampaign(c) {
  if (!c.name?.trim()) return "Give your campaign a name.";
  if (!c.assetId) return "Choose a creative for your campaign.";
  if (!c.channels?.length) return "Select at least one advertising channel.";
  if (!Number.isFinite(Number(c.dailyBudget)) || Number(c.dailyBudget) < 100)
    return "Set a daily budget of at least ₹100.";
  if (
    !Number.isInteger(Number(c.days)) ||
    Number(c.days) < 1 ||
    Number(c.days) > 90
  )
    return "Choose a duration between 1 and 90 days.";
  if (
    c.ageMin != null &&
    (!Number.isInteger(Number(c.ageMin)) ||
      Number(c.ageMin) < 18 ||
      Number(c.ageMin) > 65)
  )
    return "Minimum age must be between 18 and 65.";
  if (
    c.ageMax != null &&
    (!Number.isInteger(Number(c.ageMax)) ||
      Number(c.ageMax) < Number(c.ageMin) ||
      Number(c.ageMax) > 65)
  )
    return "Choose a valid age range up to 65.";
  return "";
}
export function csv(rows) {
  return rows
    .map((row) =>
      row
        .map(
          (v) =>
            '"' +
            String(v ?? "")
              .replace(/^[=+@-]/, "'$&")
              .replaceAll('"', '""') +
            '"',
        )
        .join(","),
    )
    .join("\r\n");
}
export function saveBlob(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
export function exportCSV(rows, name) {
  saveBlob(new Blob([csv(rows)], { type: "text/csv;charset=utf-8;" }), name);
}
