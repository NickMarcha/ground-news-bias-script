type ExtensionTabs = typeof browser.tabs;

type ExtensionNamespace = {
  tabs: ExtensionTabs;
};

export function getExtension(): ExtensionNamespace {
  const global = globalThis as typeof globalThis & {
    browser?: ExtensionNamespace;
    chrome?: ExtensionNamespace;
  };
  const ext = global.browser ?? global.chrome;
  if (!ext?.tabs) {
    throw new Error("WebExtension API (browser/chrome) is not available in this context.");
  }
  return ext;
}
