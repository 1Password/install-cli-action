import * as core from "@actions/core";
import {
	type Installer,
	RunnerOS,
	LinuxInstaller,
	MacOSInstaller,
	WindowsInstaller,
} from "./cli-installer";
import { VersionResolver } from "./version";

async function run(): Promise<void> {
	try {
		const versionResolver = new VersionResolver(core.getInput("version"));
		await versionResolver.resolve();

		let installer: Installer;
		switch (process.env.RUNNER_OS) {
			case RunnerOS.Linux:
				installer = new LinuxInstaller(versionResolver.get());
				break;
			case RunnerOS.MacOS:
				installer = new MacOSInstaller(versionResolver.get());
				break;
			case RunnerOS.Windows:
				installer = new WindowsInstaller(versionResolver.get());
				break;
			default:
				core.setFailed(`Unsupported platform: ${process.env.RUNNER_OS}`);
				return;
		}

		await installer.installCli();
	} catch (error: any) {
		core.setFailed(error.message);
	}
}

run();
