import { fetchGroundDataForUrl } from "./groundClient";

const PANEL_ID = "gn-minimal-panel";

function ensurePanel(): HTMLElement {
  const existing = document.getElementById(PANEL_ID);
  if (existing) {
    return existing;
  }

  const panel = document.createElement("div");
  panel.id = PANEL_ID;
  panel.style.position = "fixed";
  panel.style.top = "16px";
  panel.style.right = "16px";
  panel.style.width = "340px";
  panel.style.maxHeight = "70vh";
  panel.style.overflow = "auto";
  panel.style.zIndex = "2147483647";
  panel.style.background = "#111";
  panel.style.color = "#f2f2f2";
  panel.style.border = "1px solid #444";
  panel.style.borderRadius = "8px";
  panel.style.padding = "12px";
  panel.style.font = "14px/1.4 system-ui, sans-serif";
  panel.style.boxShadow = "0 8px 30px rgba(0,0,0,0.4)";
  document.body.appendChild(panel);
  return panel;
}

function renderLoading(panel: HTMLElement): void {
  panel.innerHTML = "<strong>Ground News</strong><div>Loading...</div>";
}

function renderError(panel: HTMLElement, message: string): void {
  panel.innerHTML = `<strong>Ground News</strong><div>${message}</div>`;
}

function renderResult(
  panel: HTMLElement,
  input: {
    sourceName: string;
    sourceBias: string;
    sourceCount: number;
    biasSourceCount: number;
    left: number;
    center: number;
    right: number;
    storySlug: string;
  }
): void {
  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <strong>Ground News</strong>
      <button id="gn-close-btn" style="background:#333;color:#fff;border:1px solid #555;border-radius:4px;padding:2px 8px;cursor:pointer">Close</button>
    </div>
    <div style="margin-top:8px">
      <div><strong>Source:</strong> ${input.sourceName}</div>
      <div><strong>Bias:</strong> ${input.sourceBias}</div>
      <div><strong>Coverage:</strong> ${input.sourceCount} sources (${input.biasSourceCount} with bias data)</div>
      <div style="margin-top:8px"><strong>Distribution</strong></div>
      <div>Left: ${input.left}% | Center: ${input.center}% | Right: ${input.right}%</div>
      <div style="margin-top:8px">
        <a target="_blank" rel="noreferrer" href="https://ground.news/article/${input.storySlug}" style="color:#7db7ff">Open on Ground News</a>
      </div>
    </div>
  `;

  const closeButton = panel.querySelector<HTMLButtonElement>("#gn-close-btn");
  closeButton?.addEventListener("click", () => {
    panel.remove();
  });
}

async function runLookup(): Promise<void> {
  const panel = ensurePanel();
  renderLoading(panel);

  try {
    const result = await fetchGroundDataForUrl(window.location.href);
    renderResult(panel, {
      sourceName: result.source.name,
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
