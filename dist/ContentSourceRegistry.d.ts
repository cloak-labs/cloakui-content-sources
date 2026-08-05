import { ContentSource } from "./ContentSource.js";
import type { ContentSourceConfig } from "./types.js";
/**
 * Singleton registry that manages multiple Content sources and provides a centralized API for
 * registration, retrieval, and configuration.
 */
export declare class ContentSourceRegistry {
    private static instance;
    private sources;
    private defaultSourceName;
    private constructor();
    /**
     * Gets the singleton instance of the registry.
     * @returns The singleton ContentSourceRegistry instance
     */
    private static getInstance;
    /**
     * Registers a ContentSource class instance.
     * @param source The ContentSource class instance to register
     */
    static register(source: ContentSource): void;
    /**
     * Registers multiple ContentSource classes at once.
     * @param sources Array of ContentSource class instances to register
     */
    static registerMultiple(sources: ContentSource[]): void;
    /**
     * Registers a ContentSource from a config object.
     * Builds the source (i.e. applies plugins) before registering it.
     * @param config The ContentSourceConfig object to build the source from
     * @returns The built and registered Content Source
     */
    static registerFromConfig(config: ContentSourceConfig): Promise<ContentSource>;
    /**
     * Registers multiple Content Sources from an array of config objects.
     * @param configs Array of ContentSourceConfig objects to build the sources from
     * @returns Array of built and registered ContentSource class instances
     */
    static registerMultipleFromConfig(configs: ContentSourceConfig[]): Promise<ContentSource[]>;
    /**
     * Gets a ContentSource by name.
     * @param name Optional source name. If not provided, returns the default source.
     * @returns The ContentSource class instance
     * @throws Error if the source is not found
     */
    static get(name?: string): ContentSource;
    /**
     * Gets all registered Content Sources.
     * @returns Array of all ContentSource class instances
     */
    static getAll(): ContentSource[];
    /**
     * Gets the default Content Source.
     * @returns The default ContentSource class instance
     * @throws Error if no default source is set
     */
    static getDefault(): ContentSource;
    /**
     * Sets the default Content Source by name.
     * @param name The name of the source to set as default
     * @throws Error if the source doesn't exist
     */
    static setDefault(name: string): void;
    /**
     * Checks if a Content Source with the given name exists.
     * @param name The source name to check
     * @returns True if the source exists
     */
    static has(name: string): boolean;
    /**
     * Clears all registered Content Sources.
     */
    static clear(): void;
    /**
     * Converts the registry to an array of ContentSourceConfig objects.
     * @returns An array of ContentSourceConfig objects
     */
    static toConfig(): ContentSourceConfig[];
}
//# sourceMappingURL=ContentSourceRegistry.d.ts.map