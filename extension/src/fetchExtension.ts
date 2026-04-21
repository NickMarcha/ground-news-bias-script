import { fetchGroundDataWithGetter } from "../../src/lookupCore";

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function fetchGroundDataExtension(pageUrl: string) {
  return fetchGroundDataWithGetter(pageUrl, getJson);
}
