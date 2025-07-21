import { promisify } from "util";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { CliInstaller } from "./cli-installer";
import { type Installer } from "./index";

const execAsync = promisify(exec);

export class MacOSInstaller extends CliInstaller implements Installer {
	private readonly version: string;

	constructor(version: string) {
		super();
		this.version = version;
	}

	async installCli(): Promise<void> {
		const downloadUrl = this.downloadUrl();
		core.info(`Downloading 1Password CLI ${this.version} from ${downloadUrl}`);
		await this.install(downloadUrl);
	}

	private downloadUrl(): string {
		return `https://cache.agilebits.com/dist/1P/op2/pkg/${this.version}/op_apple_universal_${this.version}.pkg`;
	}

	// @actions/tool-cache package does not support .pkg files, so we need to handle the installation manually
	override async install(downloadUrl: string): Promise<void> {
		console.info(`Downloading 1Password CLI from: ${downloadUrl}`);
		const pkgPath = await tc.downloadTool(downloadUrl);
		const pkgWithExtension = `${pkgPath}.pkg`;
		fs.renameSync(pkgPath, pkgWithExtension);

		const expandDir = "temp-pkg"
		await execAsync(`pkgutil --expand "${pkgWithExtension}" "${expandDir}"`);
		const payloadPath = path.join(expandDir, "op.pkg", "Payload");
		console.info("Installing 1Password CLI");
		const cliPath = await tc.extractTar(payloadPath)
		core.addPath(cliPath);

		fs.rmSync(expandDir, { recursive: true, force: true });
		fs.rmSync(pkgPath, { force: true });

		core.info("1Password CLI installed");
	}
}
