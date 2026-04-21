import type { GroundLookupResponse } from "./types";

export const LOOKUP_ENDPOINT = "https://extension.ground.news/search";
export const TOOLBAR_ENDPOINT =
  "https://production.checkitt.news/api/public/extension/toolbarData";

type LookupIdsResponse = {
  event?: { id?: string };
  source?: { id?: string };
};

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

export async function fetchGroundDataWithGetter(
  pageUrl: string,
  getJson: <T>(url: string) => Promise<T>
): Promise<GroundLookupResponse> {
  const normalizedUrl = normalizeLookupUrl(pageUrl);
  const lookup = await getJson<LookupIdsResponse>(
    `${LOOKUP_ENDPOINT}?url=${encodeURIComponent(normalizedUrl)}`
  );

  const storyId = lookup.event?.id;
  const sourceId = lookup.source?.id;
  if (!storyId || !sourceId) {
    throw new Error("No Ground News story found for this URL");
  }

  return getJson<GroundLookupResponse>(
    `${TOOLBAR_ENDPOINT}/${storyId}/${sourceId}`
  );
}
