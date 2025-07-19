import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

export class CliInstaller {
	async install(downloadUrl: string): Promise<void> {
		const downloadPath = await tc.downloadTool(downloadUrl);
		const extractedPath = await tc.extractZip(downloadPath);
		core.addPath(extractedPath);
		core.info(`1Password CLI installed at ${extractedPath}`);
	}
}
