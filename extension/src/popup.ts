import { fetchGroundDataExtension } from "./fetchExtension";
import { getExtension } from "./extensionRuntime";
import { setPanelHtml } from "./panelMount";
import {
  buildErrorPanelHtml,
  buildLoadingHtml,
  buildResultPanelHtml
} from "../../src/panelHtml";

function bindClose(): void {
  document.querySelector("#gn-close-btn")?.addEventListener("click", () => {
    window.close();
  });
}

async function main(): Promise<void> {
  setPanelHtml(buildLoadingHtml());
  const ext = getExtension();

  const tabs = await ext.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  const url = tab?.url;

  if (!url || !/^https?:\/\//i.test(url)) {
    setPanelHtml(
      buildErrorPanelHtml("Open a normal http(s) tab to look up this page.", {
        showClose: true
      })
    );
    bindClose();
    return;
  }

  try {
    const result = await fetchGroundDataExtension(url);
    setPanelHtml(buildResultPanelHtml(result, { showClose: true }));
    bindClose();
  } catch (error) {
    setPanelHtml(
      buildErrorPanelHtml(
        error instanceof Error ? error.message : "Lookup failed",
        { showClose: true }
      )
    );
    bindClose();
  }
}

void main();
