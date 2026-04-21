import { fetchGroundDataExtension } from "./fetchExtension";
import { getExtension } from "./extensionRuntime";
import { mountPanel } from "./panelMount";

async function refresh(): Promise<void> {
  mountPanel({ type: "loading" });
  const ext = getExtension();

  const tabs = await ext.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  const url = tab?.url;

  if (!url || !/^https?:\/\//i.test(url)) {
    mountPanel({
      type: "error",
      message: "Open a normal http(s) tab to look up this page.",
      showClose: false
    });
    return;
  }

  try {
    const result = await fetchGroundDataExtension(url);
    mountPanel({ type: "result", result, showClose: false });
  } catch (error) {
    mountPanel({
      type: "error",
      message: error instanceof Error ? error.message : "Lookup failed",
      showClose: false
    });
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
