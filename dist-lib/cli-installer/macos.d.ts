import { CliInstaller } from "./cli-installer";
import { type Installer } from "./installer";
export declare class MacOsInstaller extends CliInstaller implements Installer {
    private readonly platform;
    constructor(version: string);
    installCli(): Promise<void>;
    install(downloadUrl: string): Promise<void>;
}
