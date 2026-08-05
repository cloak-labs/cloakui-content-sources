import type { ContentSourceConfig, Url, ContentSourceEnvironment } from "./types.js";
/**
 * Represents a single Content Source with helper methods for URL resolution,
 * path building, and common operations.
 */
export declare class ContentSource {
    config: ContentSourceConfig;
    private _url;
    private readonly _urlsByEnvironment?;
    get name(): string;
    /**
     * Creates a new ContentSource from a configuration object.
     * Normalizes the URL structure internally for consistent access.
     */
    constructor(config: ContentSourceConfig);
    /**
     * Gets the resolved configuration after applying plugins (caches the result for future calls).
     * @param config The Content Source configuration
     * @returns The resolved configuration
     */
    applyPlugins(): Promise<ContentSource>;
    client<TClient = any>(): TClient | undefined;
    getConfig(): ContentSourceConfig;
    /**
     * Gets the URL for the active environment.
     * @returns The active URL
     */
    getActiveUrl(): Url;
    /**
     * Gets the URL for a specific environment.
     * @param environment The environment to get the URL for
     * @returns The URL for the specified environment
     */
    getUrl(environment: ContentSourceEnvironment): Url;
    /**
     * Gets the URL for the active environment (alias for getActiveUrl).
     * @returns The active URL
     */
    getUrl(): Url;
    /**
     * Gets the admin URL by combining the base URL with the admin path.
     * @param environment Optional environment override
     * @returns The full admin URL
     */
    getAdminUrl(environment?: ContentSourceEnvironment): Url;
    getProjectUrl(environment?: ContentSourceEnvironment): Url;
    /**
     * Gets the content URL by combining the base URL with the content path.
     * @param environment Optional environment override
     * @returns The full content URL
     */
    getAssetsUrl(environment?: ContentSourceEnvironment): Url;
    getApiUrl(environment?: ContentSourceEnvironment): Url;
    /**
     * Resolves a relative path against the base URL.
     * @param path The path to resolve (e.g., "/api/posts", "wp-json")
     * @param environment Optional environment override
     * @returns The full URL
     */
    resolvePath(path: string, environment?: ContentSourceEnvironment): Url;
    setActiveEnvironment(environment: ContentSourceEnvironment): ContentSource;
    /**
     * Gets a meta value by key with optional type casting.
     * @template T The expected meta value type
     * @param key The meta key
     * @returns The meta value or undefined
     */
    getMeta<T = any>(key: string): T | undefined;
    /**
     * Creates a deep clone of this instance.
     * @returns A new ContentSource with the same configuration
     */
    clone(): ContentSource;
}
//# sourceMappingURL=ContentSource.d.ts.map