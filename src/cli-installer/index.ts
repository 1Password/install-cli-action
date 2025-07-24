export { CliInstaller } from "./cli-installer";

export interface Installer {
	installCli(): Promise<void>;
}
