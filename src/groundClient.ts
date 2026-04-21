import { fetchGroundDataWithGetter } from "./lookupCore";

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

export { normalizeLookupUrl } from "./lookupCore";

export function fetchGroundDataForUrl(pageUrl: string) {
  return fetchGroundDataWithGetter(pageUrl, gmGetJson);
}
