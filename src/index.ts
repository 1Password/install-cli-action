import * as core from "@actions/core";

import {
	type Installer,
	LinuxInstaller,
	MacOsInstaller,
	RunnerOS,
	WindowsInstaller,
} from "./cli-installer";
import { VersionResolver } from "./version";

/**
 * Entry point for the GitHub Action.
 */
const run = async (): Promise<void> => {
	try {
		const versionResolver = new VersionResolver(core.getInput("version"));
		await versionResolver.resolve();

		let installer: Installer;
		switch (process.env.RUNNER_OS) {
			case RunnerOS.Linux:
				installer = new LinuxInstaller(versionResolver.get());
				break;
			case RunnerOS.MacOS:
				installer = new MacOsInstaller(versionResolver.get());
				break;
			case RunnerOS.Windows:
				installer = new WindowsInstaller(versionResolver.get());
				break;
			default:
				core.setFailed(`Unsupported platform: ${process.env.RUNNER_OS}`);
				return;
		}

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
