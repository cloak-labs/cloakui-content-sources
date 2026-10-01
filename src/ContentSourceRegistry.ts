import { ContentSource } from "./ContentSource.js";
import type { ContentSourceConfig } from "./types.js";

/**
 * Singleton registry that manages multiple Content sources and provides a centralized API for
 * registration, retrieval, and configuration.
 */
export class ContentSourceRegistry {
  private static instance: ContentSourceRegistry;
  private sources: Map<string, ContentSource> = new Map();
  private defaultSourceName: string | null = null;

  private constructor() {
    // Private constructor to enforce singleton
  }

  /**
   * Gets the singleton instance of the registry.
   * @returns The singleton ContentSourceRegistry instance
   */
  private static getInstance(): ContentSourceRegistry {
    if (!ContentSourceRegistry.instance) {
      ContentSourceRegistry.instance = new ContentSourceRegistry();
    }
    return ContentSourceRegistry.instance;
  }

  /**
   * Registers a ContentSource class instance.
   * @param source The ContentSource class instance to register
   */
  static register(source: ContentSource): void {
    const registry = ContentSourceRegistry.getInstance();
    const name = source.name;
    registry.sources.set(name, source);

    // The first registered source becomes the default source
    if (registry.defaultSourceName === null) {
      registry.defaultSourceName = name;
    }
  }

  /**
   * Registers multiple ContentSource classes at once.
   * @param sources Array of ContentSource class instances to register
   */
  static registerMultiple(sources: ContentSource[]): void {
    sources.forEach((source) => {
      ContentSourceRegistry.register(source);
    });
  }

  /**
   * Registers a ContentSource from a config object.
   * Builds the source (i.e. applies plugins) before registering it.
   * @param config The ContentSourceConfig object to build the source from
   * @returns The built and registered Content Source
   */
  static async registerFromConfig(
    config: ContentSourceConfig,
  ): Promise<ContentSource> {
    const source = new ContentSource(config);
    await source.applyPlugins();
    ContentSourceRegistry.register(source);
    return source;
  }

  /**
   * Registers multiple Content Sources from an array of config objects.
   * @param configs Array of ContentSourceConfig objects to build the sources from
   * @returns Array of built and registered ContentSource class instances
   */
  static async registerMultipleFromConfig(
    configs: ContentSourceConfig[],
  ): Promise<ContentSource[]> {
    const sources = await Promise.all(
      configs.map((config) => ContentSourceRegistry.registerFromConfig(config)),
    );
    return sources;
  }

  /**
   * Gets a ContentSource by name.
   * @param name Optional source name. If not provided, returns the default source.
   * @returns The ContentSource class instance
   * @throws Error if the source is not found
   */
  static get(name?: string): ContentSource {
    const registry = ContentSourceRegistry.getInstance();
    const sourceName = name || registry.defaultSourceName;

    if (!sourceName) {
      throw new Error(
        "No default Content Source found. This likely means you haven't registered one yet.",
      );
    }

    const source = registry.sources.get(sourceName);

    if (!source) {
      throw new Error(
        `Content Source "${sourceName}" not found. Available sources: ${Array.from(
          registry.sources.keys(),
        ).join(", ")}`,
      );
    }

    return source;
  }

  /**
   * Gets all registered Content Sources.
   * @returns Array of all ContentSource class instances
   */
  static getAll(): ContentSource[] {
    const registry = ContentSourceRegistry.getInstance();
    return Array.from(registry.sources.values());
  }

  /**
   * Gets the default Content Source.
   * @returns The default ContentSource class instance
   * @throws Error if no default source is set
   */
  static getDefault(): ContentSource {
    return ContentSourceRegistry.get();
  }

  /**
   * Sets the default Content Source by name.
   * @param name The name of the source to set as default
   * @throws Error if the source doesn't exist
   */
  static setDefault(name: string): void {
    const registry = ContentSourceRegistry.getInstance();
    if (!registry.sources.has(name)) {
      throw new Error(`Content Source "${name}" not found`);
    }
    registry.defaultSourceName = name;
  }

  /**
   * Checks if a Content Source with the given name exists.
   * @param name The source name to check
   * @returns True if the source exists
   */
  static has(name: string): boolean {
    const registry = ContentSourceRegistry.getInstance();
    return registry.sources.has(name);
  }

  /**
   * Clears all registered Content Sources.
   */
  static clear(): void {
    const registry = ContentSourceRegistry.getInstance();
    registry.sources.clear();
    registry.defaultSourceName = null;
  }

  /**
   * Converts the registry to an array of ContentSourceConfig objects.
   * @returns An array of ContentSourceConfig objects
   */
  static toConfig(): ContentSourceConfig[] {
    return ContentSourceRegistry.getAll().map((source) => source.getConfig());
  }

  /**
   * Validates the current configuration.
   * @throws Error if validation fails
   */
  // validate(): void {
  //   if (!this.sources || this.sources.size === 0) {
  //     throw new Error("At least one Content Source must be configured");
  //   }
  // }
}
