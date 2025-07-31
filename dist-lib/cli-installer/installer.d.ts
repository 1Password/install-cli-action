export interface Installer {
    installCli(): Promise<void>;
}
export declare const newCliInstaller: (version: string) => Installer;
