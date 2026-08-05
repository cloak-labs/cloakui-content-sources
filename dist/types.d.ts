import type { Plugin } from "@kaelan/with-plugins";
export { withPlugins } from "@kaelan/with-plugins";
export { Plugin };
export type Url = `http://${string}` | `https://${string}`;
export type ContentSourceEnvironment = "local" | "staging" | "production";
export type ContentSourceConfig = {
    /** Provide a unique name for this Content Source to differentiate it from others. */
    name?: string;
    /** The base URL of the Content Source. */
    url: Url | {
        local: Url;
        staging: Url;
        production: Url;
    };
    activeEnvironment: ContentSourceEnvironment;
    /** The root URL path where you access your Content Source's project (usually this is the root of the adminPath and apiPath). */
    projectPath: "/" | `/${string}`;
    /** The root URL path where you access your Content Source's admin UI. */
    adminPath: "/" | `/${string}`;
    /** The root URL path where your Content Source stores file assets (images, videos, etc.) */
    assetsPath: "/" | `/${string}`;
    /** The root URL path where your Content Source stores API endpoints. */
    apiPath: "/" | `/${string}`;
    /**
     * * Content Source Client ====================
     * The client is a function/class/ORM for interacting with this Content Source. We hold no opinions
     * about how it should work -- we just provide a standardized place to store it.
     */
    client?: Function;
    /**
     * `meta` can be used to store anything you want about the Content Source.
     * It's particularly useful for plugins to store stuff.
     */
    meta?: Record<string, any>;
    /**
     * * Plugins ====================
     * A plugin is simply a function that receives the current ContentSourceConfig and returns a modified
     * version for the next plugin to consume, until the final plugin returns the final config. Plugins allow
     * you to package up reusable config options, or build better APIs for setting the Content Source config.
     */
    plugins?: Plugin<ContentSourceConfig>[];
};
//# sourceMappingURL=types.d.ts.map