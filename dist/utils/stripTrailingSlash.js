export function stripTrailingSlash(url) {
    if (!url)
        return "";
    if (url === "/")
        return url;
    return url.replace(/\/$/, "");
}
