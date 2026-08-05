import { withPlugins } from "@kaelan/with-plugins";
import type {
  ContentSourceConfig,
  Url,
  ContentSourceEnvironment,
} from "./types.js";

/**
 * Represents a single Content Source with helper methods for URL resolution,
 * path building, and common operations.
 */
export class ContentSource {
  // Single config object containing all properties
  config: ContentSourceConfig;

  // Private properties (normalized from config)
  private _url: Url;
  private readonly _urlsByEnvironment?: Record<ContentSourceEnvironment, Url>;

  get name(): string {
    return this.config.name;
  }

  /**
   * Creates a new ContentSource from a configuration object.
   * Normalizes the URL structure internally for consistent access.
   */
  constructor(config: ContentSourceConfig) {
    this.config = config;

    // Normalize URL structure internally for helper methods
    if (typeof config.url === "string") {
      this._url = config.url;
      this._urlsByEnvironment = undefined;
    } else {
      this._urlsByEnvironment = config.url;
      this._url = config.url[config.activeEnvironment];
    }

    if (!this.config.name) {
      this.config.name = "default";
    }
  }

  /**
   * Gets the resolved configuration after applying plugins (caches the result for future calls).
   * @param config The Content Source configuration
   * @returns The resolved configuration
   */
  async applyPlugins(): Promise<ContentSource> {
    // Apply plugins if present
    if (Array.isArray(this.config.plugins)) {
      this.config = await withPlugins(this.config, this.config.plugins);
    }

    return this;
  }

  client<TClient = any>(): TClient | undefined {
    if (!this.config.client) return undefined;
    return this.config.client() as TClient;
  }

  // Public readonly properties (matching ContentSource interface) - using getters for backward compatibility
  getConfig(): ContentSourceConfig {
    return this.config;
  }

  /**
   * Gets the URL for the active environment.
   * @returns The active URL
   */
  getActiveUrl(): Url {
    return this._url;
  }

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
  getUrl(environment?: ContentSourceEnvironment): Url {
    if (environment === undefined) return this.getActiveUrl();
    if (this._urlsByEnvironment) return this._urlsByEnvironment[environment];

    // If only a single URL was provided, return it for any environment
    return this._url;
  }

  /**
   * Gets the admin URL by combining the base URL with the admin path.
   * @param environment Optional environment override
   * @returns The full admin URL
   */
  getAdminUrl(environment?: ContentSourceEnvironment): Url {
    const baseUrl = this.getUrl(environment);
    return `${baseUrl}${this.config.adminPath}` as Url;
  }

  getProjectUrl(environment?: ContentSourceEnvironment): Url {
    const baseUrl = this.getUrl(environment);
    return `${baseUrl}${this.config.projectPath}` as Url;
  }

  /**
   * Gets the content URL by combining the base URL with the content path.
   * @param environment Optional environment override
   * @returns The full content URL
   */
  getAssetsUrl(environment?: ContentSourceEnvironment): Url {
    const baseUrl = this.getUrl(environment);
    return `${baseUrl}${this.config.assetsPath}` as Url;
  }

  getApiUrl(environment?: ContentSourceEnvironment): Url {
    const baseUrl = this.getUrl(environment);
    return `${baseUrl}${this.config.apiPath}` as Url;
  }

  /**
   * Resolves a relative path against the base URL.
   * @param path The path to resolve (e.g., "/api/posts", "wp-json")
   * @param environment Optional environment override
   * @returns The full URL
   */
  resolvePath(path: string, environment?: ContentSourceEnvironment): Url {
    const baseUrl = this.getUrl(environment);
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}` as Url;
  }

  setActiveEnvironment(environment: ContentSourceEnvironment): ContentSource {
    if (typeof this.config.url === "string") {
      throw Error(
        "Cannot set active environment for single URL instance. You must supply an object of URLs for each environment in your Content Source config."
      );
    }

    this.config.activeEnvironment = environment;
    this._url = this.config.url[environment];
    return this;
  }

  /**
   * Gets a meta value by key with optional type casting.
   * @template T The expected meta value type
   * @param key The meta key
   * @returns The meta value or undefined
   */
  getMeta<T = any>(key: string): T | undefined {
    return this.config.meta?.[key] as T | undefined;
  }

  /**
   * Creates a deep clone of this instance.
   * @returns A new ContentSource with the same configuration
   */
  clone(): ContentSource {
    return new ContentSource({
      ...this.config,
      meta: this.config.meta ? { ...this.config.meta } : undefined,
    });
  }
}
