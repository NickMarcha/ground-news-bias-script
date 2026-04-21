declare function GM_registerMenuCommand(
  caption: string,
  onClick: () => void | Promise<void>
): number;

declare function GM_notification(details: {
  text: string;
  title?: string;
  timeout?: number;
}): void;

declare function GM_xmlhttpRequest(details: {
  method: "GET" | "POST";
  url: string;
  headers?: Record<string, string>;
  onload?: (response: { status: number; responseText: string }) => void;
  onerror?: () => void;
  ontimeout?: () => void;
  timeout?: number;
}): void;
