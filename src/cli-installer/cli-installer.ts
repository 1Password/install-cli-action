import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

export class CliInstaller {
	public async install(downloadUrl: string): Promise<void> {
		console.info(`Downloading 1Password CLI from: ${downloadUrl}`);
		const downloadPath = await tc.downloadTool(downloadUrl);
		console.info("Installing 1Password CLI");
		const extractedPath = await tc.extractZip(downloadPath);
		core.addPath(extractedPath);
		core.info("1Password CLI installed");
	}
}
