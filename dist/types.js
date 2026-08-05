// I don't know why, but re-exporting withPlugins from index.ts causes module parsing error, while exporting from here works:
export { withPlugins } from "@kaelan/with-plugins";
