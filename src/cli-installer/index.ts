export { LinuxInstaller } from "./linux";
export { MacOsInstaller } from "./macos";
export { WindowsInstaller } from "./windows";

export interface Installer {
	installCli(): Promise<void>;
}

/* eslint-disable @typescript-eslint/naming-convention */
// Defines the architecture of the runner executing the job.
// Look `RUNNER_ARCH` for possible values (https://docs.github.com/en/actions/reference/variables-reference).
export enum RunnerArch {
	X64 = "X64",
	X86 = "X86",
	ARM = "ARM",
	ARM64 = "ARM64",
}

// RunnerOS defines the operating system of the runner executing the job.
// Look `RUNNER_OS` for possible values (https://docs.github.com/en/actions/reference/variables-reference).
export enum RunnerOS {
	Linux = "Linux",
	MacOS = "macOS",
	Windows = "Windows",
}
/* eslint-enable @typescript-eslint/naming-convention */
