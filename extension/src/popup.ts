import { fetchGroundDataExtension } from "./fetchExtension";
import { getExtension } from "./extensionRuntime";
import { mountPanel } from "./panelMount";

function bindClose(): void {
  document.querySelector("#gn-close-btn")?.addEventListener("click", () => {
    window.close();
  });
}

async function main(): Promise<void> {
  mountPanel({ type: "loading" });
  const ext = getExtension();

  const tabs = await ext.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  const url = tab?.url;

  if (!url || !/^https?:\/\//i.test(url)) {
    mountPanel({
      type: "error",
      message: "Open a normal http(s) tab to look up this page.",
      showClose: true
    });
    bindClose();
    return;
  }

  try {
    const result = await fetchGroundDataExtension(url);
    mountPanel({ type: "result", result, showClose: true });
    bindClose();
  } catch (error) {
    mountPanel({
      type: "error",
      message: error instanceof Error ? error.message : "Lookup failed",
      showClose: true
    });
    bindClose();
  }
}

void main();
