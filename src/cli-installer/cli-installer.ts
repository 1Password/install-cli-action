import os from "os";

import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

export const archMap: Record<string, string> = {
	ia32: "386",
	x32: "386",
	x86: "386",
	x64: "amd64",
	arm: "arm",
	arm64: "arm64",
};

export class CliInstaller {
	public async install(downloadUrl: string): Promise<void> {
		console.info(`Downloading 1Password CLI from: ${downloadUrl}`);
		const downloadPath = await tc.downloadTool(downloadUrl);
		console.info("Installing 1Password CLI");
		const extractedPath = await tc.extractZip(downloadPath);
		core.addPath(extractedPath);
		core.info("1Password CLI installed");
	}

	// possible values for GitHub hosted runners (process.env.RUNNER_ARCH) can be found here: https://docs.github.com/en/actions/reference/variables-reference#default-environment-variables
	public getArch(): string {
		const arch = archMap[process.env.RUNNER_ARCH?.toLowerCase() || os.arch()];
		if (!arch) {
			throw new Error("Unsupported architecture");
		}

		return arch;
	}
}
