export declare class VersionResolver {
    private version;
    constructor(version: string);
    get(): string;
    resolve(): Promise<void>;
    private validate;
    private isReleaseChannel;
}
