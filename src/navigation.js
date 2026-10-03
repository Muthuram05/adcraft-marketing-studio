const titles = {
  "/dashboard": "Overview",
  "/campaigns": "My campaigns",
  "/studio": "Creative studio",
  "/library": "Media library",
  "/brand": "Brand kit",
  "/templates": "Templates",
  "/leads": "Leads",
  "/analytics": "Analytics",
  "/settings": "Settings",
  "/create": "Create campaign",
};

// Page titles also cover routes whose sidebar links are temporarily hidden.
export function pageTitle(route) {
  const path = route.split("?")[0];
  if (titles[path]) return titles[path];
  if (path.startsWith("/editor/")) return "Creative editor";
  if (path.startsWith("/review/")) return "Review & launch";
  if (path.startsWith("/campaign/")) return "Campaign details";
  return "Page not found";
}
