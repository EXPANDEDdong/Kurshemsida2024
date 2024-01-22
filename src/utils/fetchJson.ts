import deepmerge from "deepmerge";

export default async function fetchJson<T = any>(
  url: string,
  options: RequestInit | null = null
): Promise<T | null> {
  try {
    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const mergedOptions = deepmerge(defaultOptions, options ?? {});
    const response = await fetch(url, mergedOptions);
    const responseJson = await response.json();
    const { success } = responseJson;
    if (!response.ok && success === undefined) {
      throw new Error(`Fetch failed with status: ${response.status}`);
    }
    return responseJson as T;
  } catch (error) {
    console.error("Error fetching JSON:", error);
    return null;
  }
}
