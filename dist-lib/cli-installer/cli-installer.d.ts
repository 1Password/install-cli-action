export type SupportedPlatform = Extract<NodeJS.Platform, "linux" | "darwin" | "win32">;
export declare const archMap: Record<string, string>;
export declare const cliUrlBuilder: Record<SupportedPlatform, (version: string, arch?: string) => string>;
export declare class CliInstaller {
    readonly version: string;
    readonly arch: string;
    constructor(version: string);
    install(url: string): Promise<void>;
    private getArch;
}
