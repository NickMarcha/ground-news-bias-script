import type { GroundLookupResponse } from "./types";

export const GROUND_LOGO =
  "https://groundnews.b-cdn.net/assets/logo/ground_new_logo_header.svg?width=80";

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function biasPillStyle(readableBias: string): { bg: string; color: string } {
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

export function buildLoadingHtml(): string {
  return `
    <div style="padding:16px 18px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #2a2a2a">
      <img src="${GROUND_LOGO}" alt="" width="80" height="20" style="object-fit:contain;opacity:.9"/>
      <span style="color:#a3a3a3">Loading…</span>
    </div>`;
}

export function buildErrorPanelHtml(message: string, options?: { showClose?: boolean }): string {
  const showClose = options?.showClose !== false;
  const safe = escapeHtml(message);
  const closeBtn = showClose
    ? `<button type="button" id="gn-close-btn" style="background:#2a2a2a;color:#fff;border:1px solid #444;border-radius:6px;padding:6px 12px;cursor:pointer;font:inherit">Close</button>`
    : "";
  return `
    <div style="padding:14px 16px;display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #2a2a2a">
      <img src="${GROUND_LOGO}" alt="" width="80" height="20" style="object-fit:contain"/>
      ${closeBtn}
    </div>
    <div style="padding:16px 18px;color:#fca5a5">${safe}</div>`;
}

export function buildResultPanelHtml(
  result: GroundLookupResponse,
  options?: { showClose?: boolean }
): string {
  const showClose = options?.showClose !== false;
  const pill = biasPillStyle(result.source.readableBias);
  const name = escapeHtml(result.source.name);
  const bias = escapeHtml(result.source.readableBias);
  const slug = encodeURIComponent(result.story.slug);
  const iconUrl = escapeHtml(result.source.circleIcon);

  const leftW = Math.max(result.story.left, 2);
  const centerW = Math.max(result.story.center, 2);
  const rightW = Math.max(result.story.right, 2);

  const closeBtn = showClose
    ? `<button type="button" id="gn-close-btn" style="background:#2a2a2a;color:#ececec;border:1px solid #444;border-radius:6px;padding:6px 12px;cursor:pointer;font:inherit">Close</button>`
    : "";

  return `
    <div style="padding:12px 16px;display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #2a2a2a;background:linear-gradient(180deg,#1f1f1f,#161616)">
      <img src="${GROUND_LOGO}" alt="Ground News" width="80" height="20" style="object-fit:contain"/>
      ${closeBtn}
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
        <strong style="color:#d4d4d4">${result.story.sourceCount}</strong> sources covering this story
        · <strong style="color:#d4d4d4">${result.story.biasSourceCount}</strong> with bias ratings
      </div>
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#737373;margin-bottom:8px">Political spectrum (coverage)</div>
      <div style="display:flex;height:10px;border-radius:6px;overflow:hidden;margin-bottom:10px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)">
        <div title="Left ${result.story.left}%" style="flex:${leftW};min-width:4px;background:linear-gradient(90deg,#1d4ed8,#3b82f6)"></div>
        <div title="Center ${result.story.center}%" style="flex:${centerW};min-width:4px;background:linear-gradient(90deg,#52525b,#a1a1aa)"></div>
        <div title="Right ${result.story.right}%" style="flex:${rightW};min-width:4px;background:linear-gradient(90deg,#ef4444,#b91c1c)"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:16px">
        <span style="color:#60a5fa"><strong>${result.story.left}%</strong> left</span>
        <span style="color:#d4d4d4"><strong>${result.story.center}%</strong> center</span>
        <span style="color:#f87171"><strong>${result.story.right}%</strong> right</span>
      </div>
      <a target="_blank" rel="noreferrer" href="https://ground.news/article/${slug}" style="display:block;text-align:center;padding:11px 14px;border-radius:8px;background:#262626;color:#93c5fd;font-weight:600;text-decoration:none;border:1px solid #404040">Open full coverage on Ground News</a>
    </div>`;
}
