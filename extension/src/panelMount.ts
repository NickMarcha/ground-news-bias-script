import type { PanelView } from "./panelDom";
import { renderPanel } from "./panelDom";

export function mountPanel(view: PanelView): void {
  document.getElementById("gn-boot")?.remove();
  const root = document.getElementById("root");
  if (!root) {
    return;
  }
  renderPanel(root, view);
}
