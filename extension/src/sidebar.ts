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

async function refresh(): Promise<void> {
  setRoot(buildLoadingHtml());
  const ext = getExtension();

  const tabs = await ext.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  const url = tab?.url;

  if (!url || !/^https?:\/\//i.test(url)) {
    setRoot(
      buildErrorPanelHtml("Open a normal http(s) tab to look up this page.", {
        showClose: false
      })
    );
    return;
  }

  try {
    const result = await fetchGroundDataExtension(url);
    setRoot(buildResultPanelHtml(result, { showClose: false }));
  } catch (error) {
    setRoot(
      buildErrorPanelHtml(
        error instanceof Error ? error.message : "Lookup failed",
        { showClose: false }
      )
    );
  }
}

void refresh();

getExtension().tabs.onActivated.addListener(() => {
  void refresh();
});

getExtension().tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status !== "complete") {
    return;
  }
  const [active] = await getExtension().tabs.query({
    active: true,
    currentWindow: true
  });
  if (active.id !== undefined && active.id === tabId) {
    void refresh();
  }
});
