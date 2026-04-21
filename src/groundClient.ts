import type { GroundLookupResponse } from "./types";

const LOOKUP_ENDPOINT = "https://extension.ground.news/search";
const TOOLBAR_ENDPOINT =
  "https://production.checkitt.news/api/public/extension/toolbarData";

function gmGetJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url,
      timeout: 15000,
      onload: (response) => {
        if (response.status < 200 || response.status > 299) {
          reject(new Error(`Request failed: ${response.status}`));
          return;
        }
        try {
          resolve(JSON.parse(response.responseText) as T);
        } catch (error) {
          reject(error);
        }
      },
      onerror: () => reject(new Error("Network error")),
      ontimeout: () => reject(new Error("Request timed out"))
    });
  });
}

export function normalizeLookupUrl(rawUrl: string): string {
  const url = new URL(rawUrl);
  const dropParams = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid"
  ];

  for (const key of dropParams) {
    url.searchParams.delete(key);
  }

  return url.toString();
}

export async function fetchGroundDataForUrl(
  pageUrl: string
): Promise<GroundLookupResponse> {
  const normalizedUrl = normalizeLookupUrl(pageUrl);
  const lookup = await gmGetJson<{
    event?: { id?: string };
    source?: { id?: string };
  }>(`${LOOKUP_ENDPOINT}?url=${encodeURIComponent(normalizedUrl)}`);

  const storyId = lookup.event?.id;
  const sourceId = lookup.source?.id;
  if (!storyId || !sourceId) {
    throw new Error("No Ground News story found for this URL");
  }

  return gmGetJson<GroundLookupResponse>(`${TOOLBAR_ENDPOINT}/${storyId}/${sourceId}`);
}
