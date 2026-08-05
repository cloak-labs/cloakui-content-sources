export function stripTrailingSlash(url: string): string {
  if (!url) return "";
  if (url === "/") return url;
  return url.replace(/\/$/, "");
}
