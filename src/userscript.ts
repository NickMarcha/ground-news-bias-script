import { fetchGroundDataForUrl } from "./groundClient";

const PANEL_ID = "gn-minimal-panel";

const GROUND_LOGO =
  "https://groundnews.b-cdn.net/assets/logo/ground_new_logo_header.svg?width=72";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function biasPillStyle(readableBias: string): { bg: string; color: string } {
  const b = readableBias.toLowerCase();
  if (b.includes("far left") || b === "left" || b.includes("lean left")) {
    return { bg: "linear-gradient(135deg,#1e3a5f,#2563eb)", color: "#e8f0ff" };
  }
  if (b.includes("far right") || b === "right" || b.includes("lean right")) {
    return { bg: "linear-gradient(135deg,#7f1d1d,#dc2626)", color: "#fff1f1" };
  }
  if (b.includes("center")) {
    return { bg: "linear-gradient(135deg,#3f3f46,#71717a)", color: "#f4f4f5" };
  }
  return { bg: "linear-gradient(135deg,#404040,#525252)", color: "#fafafa" };
}

function panelBaseStyles(panel: HTMLElement): void {
  panel.style.cssText = [
    "position:fixed",
    "top:16px",
    "right:16px",
    "width:360px",
    "max-height:78vh",
    "overflow:auto",
    "z-index:2147483647",
    "background:#161616",
    "color:#ececec",
    "border:1px solid #333",
    "border-radius:12px",
    "padding:0",
    "font:14px/1.45 system-ui,-apple-system,sans-serif",
    "box-shadow:0 12px 40px rgba(0,0,0,.45)"
  ].join(";");
}

function ensurePanel(): HTMLElement {
  const existing = document.getElementById(PANEL_ID);
  if (existing) {
    return existing;
  }

  const panel = document.createElement("div");
  panel.id = PANEL_ID;
  panelBaseStyles(panel);
  document.body.appendChild(panel);
  return panel;
}

function renderLoading(panel: HTMLElement): void {
  panel.innerHTML = `
    <div style="padding:16px 18px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #2a2a2a">
      <img src="${GROUND_LOGO}" alt="" width="72" height="18" style="object-fit:contain;opacity:.9"/>
      <span style="color:#a3a3a3">Loading…</span>
    </div>`;
}

function renderError(panel: HTMLElement, message: string): void {
  const safe = escapeHtml(message);
  panel.innerHTML = `
    <div style="padding:14px 16px;display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #2a2a2a">
      <img src="${GROUND_LOGO}" alt="" width="72" height="18" style="object-fit:contain"/>
      <button type="button" id="gn-close-btn" style="background:#2a2a2a;color:#fff;border:1px solid #444;border-radius:6px;padding:6px 12px;cursor:pointer;font:inherit">Close</button>
    </div>
    <div style="padding:16px 18px;color:#fca5a5">${safe}</div>`;
  panel.querySelector("#gn-close-btn")?.addEventListener("click", () => panel.remove());
}

function renderResult(
  panel: HTMLElement,
  input: {
    sourceName: string;
    sourceIcon: string;
    sourceBias: string;
    sourceCount: number;
    biasSourceCount: number;
    left: number;
    center: number;
    right: number;
    storySlug: string;
  }
): void {
  const pill = biasPillStyle(input.sourceBias);
  const name = escapeHtml(input.sourceName);
  const bias = escapeHtml(input.sourceBias);
  const slug = encodeURIComponent(input.storySlug);
  const iconUrl = escapeHtml(input.sourceIcon);

  const leftW = Math.max(input.left, 2);
  const centerW = Math.max(input.center, 2);
  const rightW = Math.max(input.right, 2);

  panel.innerHTML = `
    <div style="padding:12px 16px;display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #2a2a2a;background:linear-gradient(180deg,#1f1f1f,#161616)">
      <img src="${GROUND_LOGO}" alt="Ground News" width="80" height="20" style="object-fit:contain"/>
      <button type="button" id="gn-close-btn" style="background:#2a2a2a;color:#ececec;border:1px solid #444;border-radius:6px;padding:6px 12px;cursor:pointer;font:inherit">Close</button>
    </div>
    <div style="padding:16px 18px 18px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <img src="${iconUrl}" alt="" width="44" height="44" style="border-radius:50%;object-fit:cover;border:2px solid #333;background:#222"/>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:15px;color:#fafafa">${name}</div>
          <div style="margin-top:6px;display:inline-block;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:.02em;background:${pill.bg};color:${pill.color}">${bias}</div>
        </div>
      </div>
      <div style="color:#a3a3a3;font-size:13px;margin-bottom:14px">
        <strong style="color:#d4d4d4">${input.sourceCount}</strong> sources covering this story
        · <strong style="color:#d4d4d4">${input.biasSourceCount}</strong> with bias ratings
      </div>
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#737373;margin-bottom:8px">Political spectrum (coverage)</div>
      <div style="display:flex;height:10px;border-radius:6px;overflow:hidden;margin-bottom:10px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)">
        <div title="Left ${input.left}%" style="flex:${leftW};min-width:4px;background:linear-gradient(90deg,#1d4ed8,#3b82f6)"></div>
        <div title="Center ${input.center}%" style="flex:${centerW};min-width:4px;background:linear-gradient(90deg,#52525b,#a1a1aa)"></div>
        <div title="Right ${input.right}%" style="flex:${rightW};min-width:4px;background:linear-gradient(90deg,#ef4444,#b91c1c)"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:16px">
        <span style="color:#60a5fa"><strong>${input.left}%</strong> left</span>
        <span style="color:#d4d4d4"><strong>${input.center}%</strong> center</span>
        <span style="color:#f87171"><strong>${input.right}%</strong> right</span>
      </div>
      <a target="_blank" rel="noreferrer" href="https://ground.news/article/${slug}" style="display:block;text-align:center;padding:11px 14px;border-radius:8px;background:#262626;color:#93c5fd;font-weight:600;text-decoration:none;border:1px solid #404040">Open full coverage on Ground News</a>
    </div>`;

  panel.querySelector("#gn-close-btn")?.addEventListener("click", () => panel.remove());
}

async function runLookup(): Promise<void> {
  const panel = ensurePanel();
  renderLoading(panel);

  try {
    const result = await fetchGroundDataForUrl(window.location.href);
    renderResult(panel, {
      sourceName: result.source.name,
      sourceIcon: result.source.circleIcon,
      sourceBias: result.source.readableBias,
      sourceCount: result.story.sourceCount,
      biasSourceCount: result.story.biasSourceCount,
      left: result.story.left,
      center: result.story.center,
      right: result.story.right,
      storySlug: result.story.slug
    });
  } catch (error) {
    renderError(
      panel,
      error instanceof Error ? error.message : "Unexpected lookup error"
    );
    GM_notification({
      title: "Ground News Lookup",
      text: "No matching Ground News story found for this page.",
      timeout: 4000
    });
  }
}

GM_registerMenuCommand("Ground News: Check Current Page", () => {
  void runLookup();
});
