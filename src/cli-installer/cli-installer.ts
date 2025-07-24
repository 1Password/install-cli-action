import os from "os";

import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

import { type Installer } from "./index";
import { LinuxInstaller } from "./linux";
import { MacOsInstaller } from "./macos";
import { WindowsInstaller } from "./windows";

export type SupportedPlatform = Extract<
	NodeJS.Platform,
	"linux" | "darwin" | "win32"
>;

// maps OS architecture names to 1Password CLI installer architecture names
const archMap: Record<string, string> = {
	ia32: "386",
	x64: "amd64",
	arm: "arm",
	arm64: "arm64",
};

export const cliUrlBuilder: Record<
	SupportedPlatform,
	(version: string, arch?: string) => string
> = {
	linux: (version, arch) =>
		`https://cache.agilebits.com/dist/1P/op2/pkg/${version}/op_linux_${arch}_${version}.zip`,
	darwin: (version) =>
		`https://cache.agilebits.com/dist/1P/op2/pkg/${version}/op_apple_universal_${version}.pkg`,
	win32: (version, arch) =>
		`https://cache.agilebits.com/dist/1P/op2/pkg/${version}/op_windows_${arch}_${version}_.zip`,
};

export class CliInstaller {
	protected readonly version: string;
	protected readonly arch: string;

	public constructor(version: string) {
		this.version = version;
		this.arch = this.getArch();
	}

	public static create(version: string): Installer {
		const platform = os.platform();
		switch (platform) {
			case "linux":
				return new LinuxInstaller(version);
			case "darwin":
				return new MacOsInstaller(version);
			case "win32":
				return new WindowsInstaller(version);
			default:
				throw new Error(`Unsupported platform: ${platform}`);
		}
	}

	public async install(url: string): Promise<void> {
		console.info(`Downloading 1Password CLI from: ${url}`);
		const downloadPath = await tc.downloadTool(url);
		console.info("Installing 1Password CLI");
		const extractedPath = await tc.extractZip(downloadPath);
		core.addPath(extractedPath);
		core.info("1Password CLI installed");
	}

	private getArch(): string {
		const arch = archMap[os.arch()];
		if (!arch) {
			throw new Error("Unsupported architecture");
		}

		return arch;
	}
}
