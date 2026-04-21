import type { GroundLookupResponse } from "../../src/types";
import { biasPillStyle, GROUND_LOGO } from "../../src/panelHtml";

export type PanelView =
  | { type: "loading" }
  | { type: "error"; message: string; showClose: boolean }
  | { type: "result"; result: GroundLookupResponse; showClose: boolean };

function safeHttpsUrl(u: string): string | undefined {
  try {
    const parsed = new URL(u);
    if (parsed.protocol !== "https:") {
      return undefined;
    }
    return parsed.href;
  } catch {
    return undefined;
  }
}

function articleHref(slug: string): string {
  return `https://ground.news/article/${encodeURIComponent(slug)}`;
}

function legendPart(color: string, pct: number, label: string): HTMLSpanElement {
  const span = document.createElement("span");
  span.style.color = color;
  const strong = document.createElement("strong");
  strong.textContent = `${pct}%`;
  span.append(strong, document.createTextNode(` ${label}`));
  return span;
}

function appendCloseButton(parent: HTMLElement): void {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = "gn-close-btn";
  btn.style.cssText =
    "background:#2a2a2a;color:#fff;border:1px solid #444;border-radius:6px;padding:6px 12px;cursor:pointer;font:inherit";
  btn.textContent = "Close";
  parent.append(btn);
}

function appendCloseButtonAlt(parent: HTMLElement): void {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = "gn-close-btn";
  btn.style.cssText =
    "background:#2a2a2a;color:#ececec;border:1px solid #444;border-radius:6px;padding:6px 12px;cursor:pointer;font:inherit";
  btn.textContent = "Close";
  parent.append(btn);
}

export function renderPanel(root: HTMLElement, view: PanelView): void {
  root.replaceChildren();

  if (view.type === "loading") {
    const row = document.createElement("div");
    row.style.cssText =
      "padding:16px 18px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #2a2a2a";
    const img = document.createElement("img");
    img.src = GROUND_LOGO;
    img.alt = "";
    img.width = 80;
    img.height = 20;
    img.style.cssText = "object-fit:contain;opacity:.9";
    const span = document.createElement("span");
    span.style.color = "#a3a3a3";
    span.textContent = "Loading…";
    row.append(img, span);
    root.append(row);
    return;
  }

  if (view.type === "error") {
    const header = document.createElement("div");
    header.style.cssText =
      "padding:14px 16px;display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #2a2a2a";
    const logo = document.createElement("img");
    logo.src = GROUND_LOGO;
    logo.alt = "";
    logo.width = 80;
    logo.height = 20;
    logo.style.cssText = "object-fit:contain";
    header.append(logo);
    if (view.showClose) {
      appendCloseButton(header);
    }
    const body = document.createElement("div");
    body.style.cssText = "padding:16px 18px;color:#fca5a5";
    body.textContent = view.message;
    root.append(header, body);
    return;
  }

  const { result, showClose } = view;
  const pill = biasPillStyle(result.source.readableBias);
  const iconSrc = safeHttpsUrl(result.source.circleIcon);

  const header = document.createElement("div");
  header.style.cssText =
    "padding:12px 16px;display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #2a2a2a;background:linear-gradient(180deg,#1f1f1f,#161616)";
  const logo = document.createElement("img");
  logo.src = GROUND_LOGO;
  logo.alt = "Ground News";
  logo.width = 80;
  logo.height = 20;
  logo.style.cssText = "object-fit:contain";
  header.append(logo);
  if (showClose) {
    appendCloseButtonAlt(header);
  }

  const main = document.createElement("div");
  main.style.cssText = "padding:16px 18px 18px";

  const topRow = document.createElement("div");
  topRow.style.cssText =
    "display:flex;align-items:center;gap:12px;margin-bottom:14px";
  if (iconSrc) {
    const icon = document.createElement("img");
    icon.src = iconSrc;
    icon.alt = "";
    icon.width = 44;
    icon.height = 44;
    icon.style.cssText =
      "border-radius:50%;object-fit:cover;border:2px solid #333;background:#222";
    topRow.append(icon);
  }
  const textCol = document.createElement("div");
  textCol.style.cssText = "flex:1;min-width:0";
  const nameEl = document.createElement("div");
  nameEl.style.cssText = "font-weight:700;font-size:15px;color:#fafafa";
  nameEl.textContent = result.source.name;
  const biasWrap = document.createElement("div");
  biasWrap.style.cssText =
    "margin-top:6px;display:inline-block;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:.02em";
  biasWrap.style.background = pill.bg;
  biasWrap.style.color = pill.color;
  biasWrap.textContent = result.source.readableBias;
  textCol.append(nameEl, biasWrap);
  topRow.append(textCol);

  const summary = document.createElement("div");
  summary.style.cssText = "color:#a3a3a3;font-size:13px;margin-bottom:14px";
  const strong1 = document.createElement("strong");
  strong1.style.color = "#d4d4d4";
  strong1.textContent = String(result.story.sourceCount);
  summary.append(strong1, document.createTextNode(" sources covering this story · "));
  const strong2 = document.createElement("strong");
  strong2.style.color = "#d4d4d4";
  strong2.textContent = String(result.story.biasSourceCount);
  summary.append(strong2, document.createTextNode(" with bias ratings"));

  const spectrumLabel = document.createElement("div");
  spectrumLabel.style.cssText =
    "font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#737373;margin-bottom:8px";
  spectrumLabel.textContent = "Political spectrum (coverage)";

  const leftW = Math.max(result.story.left, 2);
  const centerW = Math.max(result.story.center, 2);
  const rightW = Math.max(result.story.right, 2);

  const bar = document.createElement("div");
  bar.style.cssText =
    "display:flex;height:10px;border-radius:6px;overflow:hidden;margin-bottom:10px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)";
  const segL = document.createElement("div");
  segL.title = `Left ${result.story.left}%`;
  segL.style.cssText = `flex:${leftW};min-width:4px;background:linear-gradient(90deg,#1d4ed8,#3b82f6)`;
  const segC = document.createElement("div");
  segC.title = `Center ${result.story.center}%`;
  segC.style.cssText = `flex:${centerW};min-width:4px;background:linear-gradient(90deg,#52525b,#a1a1aa)`;
  const segR = document.createElement("div");
  segR.title = `Right ${result.story.right}%`;
  segR.style.cssText = `flex:${rightW};min-width:4px;background:linear-gradient(90deg,#ef4444,#b91c1c)`;
  bar.append(segL, segC, segR);

  const legend = document.createElement("div");
  legend.style.cssText =
    "display:flex;justify-content:space-between;font-size:12px;margin-bottom:16px";
  legend.append(
    legendPart("#60a5fa", result.story.left, "left"),
    legendPart("#d4d4d4", result.story.center, "center"),
    legendPart("#f87171", result.story.right, "right")
  );

  const link = document.createElement("a");
  link.target = "_blank";
  link.rel = "noreferrer";
  link.href = articleHref(result.story.slug);
  link.style.cssText =
    "display:block;text-align:center;padding:11px 14px;border-radius:8px;background:#262626;color:#93c5fd;font-weight:600;text-decoration:none;border:1px solid #404040";
  link.textContent = "Open full coverage on Ground News";

  main.append(topRow, summary, spectrumLabel, bar, legend, link);
  root.append(header, main);
}
