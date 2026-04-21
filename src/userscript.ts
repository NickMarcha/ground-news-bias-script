import { fetchGroundDataForUrl } from "./groundClient";
import {
  buildErrorPanelHtml,
  buildLoadingHtml,
  buildResultPanelHtml
} from "./panelHtml";

const PANEL_ID = "gn-minimal-panel";

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

function bindClose(panel: HTMLElement): void {
  panel.querySelector("#gn-close-btn")?.addEventListener("click", () => {
    panel.remove();
  });
}

async function runLookup(): Promise<void> {
  const panel = ensurePanel();
  panel.innerHTML = buildLoadingHtml();

  try {
    const result = await fetchGroundDataForUrl(window.location.href);
    panel.innerHTML = buildResultPanelHtml(result, { showClose: true });
    bindClose(panel);
  } catch (error) {
    panel.innerHTML = buildErrorPanelHtml(
      error instanceof Error ? error.message : "Unexpected lookup error",
      { showClose: true }
    );
    bindClose(panel);
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
