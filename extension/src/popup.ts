import { fetchGroundDataExtension } from "./fetchExtension";
import { getExtension } from "./extensionRuntime";
import {
  buildErrorPanelHtml,
  buildLoadingHtml,
  buildResultPanelHtml
} from "../../src/panelHtml";

function setRoot(html: string): void {
  document.getElementById("gn-boot")?.remove();
  const root = document.getElementById("root");
  if (!root) {
    return;
  }
  root.innerHTML = html;
}

function bindClose(): void {
  document.querySelector("#gn-close-btn")?.addEventListener("click", () => {
    window.close();
  });
}

async function main(): Promise<void> {
  setRoot(buildLoadingHtml());
  const ext = getExtension();

  const tabs = await ext.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  const url = tab?.url;

  if (!url || !/^https?:\/\//i.test(url)) {
    setRoot(
      buildErrorPanelHtml("Open a normal http(s) tab to look up this page.", {
        showClose: true
      })
    );
    bindClose();
    return;
  }

  try {
    const result = await fetchGroundDataExtension(url);
    setRoot(buildResultPanelHtml(result, { showClose: true }));
    bindClose();
  } catch (error) {
    setRoot(
      buildErrorPanelHtml(
        error instanceof Error ? error.message : "Lookup failed",
        { showClose: true }
      )
    );
    bindClose();
  }
}

void main();
