import { CliInstaller } from "./cli-installer";
import type { Installer } from "./installer";
export declare class WindowsInstaller extends CliInstaller implements Installer {
    private readonly platform;
    constructor(version: string);
    installCli(): Promise<void>;
}
