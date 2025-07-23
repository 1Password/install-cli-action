export { LinuxInstaller } from "./linux";
export { MacOsInstaller } from "./macos";
export { WindowsInstaller } from "./windows";

export interface Installer {
	installCli(): Promise<void>;
}

/* eslint-disable @typescript-eslint/naming-convention */
// RunnerOS defines the operating system of the runner executing the job.
// Look `RUNNER_OS` for possible values (https://docs.github.com/en/actions/reference/variables-reference).
export enum RunnerOS {
	Linux = "Linux",
	MacOS = "macOS",
	Windows = "Windows",
}
/* eslint-enable @typescript-eslint/naming-convention */
