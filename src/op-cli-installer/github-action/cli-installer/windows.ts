import * as path from "path";

import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

import {
	CliInstaller,
	cliUrlBuilder,
	type SupportedPlatform,
} from "./cli-installer";
import type { Installer } from "./installer";
import { verifyAuthenticodeSignature } from "./windows-signature";

/** Installs the 1Password CLI on Windows runners. */
export class WindowsInstaller extends CliInstaller implements Installer {
	private readonly platform: SupportedPlatform = "win32"; // Node.js platform identifier for Windows

	/** Downloads, verifies, and installs the CLI for the configured version. */
	public async installCli(): Promise<void> {
		const urlBuilder = cliUrlBuilder[this.platform];
		await this.install(urlBuilder(this.version, this.arch));
	}

	/** Downloads the zip, verifies op.exe's Authenticode signature, then adds it to PATH. */
	public override async install(url: string): Promise<void> {
		console.info(`Downloading 1Password CLI from: ${url}`);
		const downloadPath = await tc.downloadTool(url);
		console.info("Installing 1Password CLI");
		const extractedPath = await tc.extractZip(downloadPath);

		core.info("Verifying 1Password CLI signature");
		await verifyAuthenticodeSignature(path.join(extractedPath, "op.exe"));
		core.info("1Password CLI signature verified");

		core.addPath(extractedPath);
		core.info("1Password CLI installed");
	}
}
