export declare enum ReleaseChannel {
    Stable = "latest",
    Beta = "latest-beta"
}
export interface VersionResponse {
    CLI2: {
        release: {
            version: string;
        };
        beta: {
            version: string;
        };
    };
}
