import * as core from "@actions/core";

import { CliInstaller } from "./cli-installer";
import { VersionResolver } from "./version";

/**
 * Entry point for the GitHub Action.
 */
const run = async (): Promise<void> => {
	try {
		const versionResolver = new VersionResolver(core.getInput("version"));
		await versionResolver.resolve();
		const installer = CliInstaller.create(versionResolver.get());
		await installer.installCli();
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("error:", error);
			core.setFailed(error.message);
		} else {
			console.error("Unknown error:", error);
			core.setFailed("Unknown error occurred");
		}
	}
};
// eslint-disable-next-line
run();
