export function setPanelHtml(html: string): void {
  document.getElementById("gn-boot")?.remove();
  const root = document.getElementById("root");
  if (!root) {
    return;
  }
  root.innerHTML = html;
}
