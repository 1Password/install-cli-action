import * as https from "https";
import * as core from "@actions/core";
import {
	type Installer,
	RunnerOS,
	LinuxInstaller,
	MacOSInstaller,
	WindowsInstaller,
} from "./cli-installer";

enum VersionType {
	Latest = "latest",
	LatestBeta = "latest-beta",
}

// Returns `true` if the versionType is one of the defined in VersionType enum, otherwise `false`.
const isValidVersionType = (versionType: string): boolean =>
	Object.values(VersionType).some((v) => v === versionType);

// Returns the latest version of the 1Password CLI based on the specified channel.
const getLatestVersion = (channel: VersionType): Promise<string> => {
	const CLI_URL = "https://app-updates.agilebits.com/product_history/CLI2";
	return new Promise((resolve, reject) => {
		https
			.get(CLI_URL, (res) => {
				let data = "";
				res.on("data", (chunk) => (data += chunk));
				res.on("end", () => {
					// Use regex to find all <h3>...</h3> with optional whitespace
					const matches = [
						...data.matchAll(/<h3[^>]*>\s*v?([\d.]+(?:-beta\d+)?)\s*<\/h3>/g),
					];
					const versions = matches
						.map((match) => match[1]?.trim())
						.filter((ver) => {
							if (channel === VersionType.Latest) {
								return !ver?.includes("-beta");
							} else if (channel === VersionType.LatestBeta) {
								return ver?.includes("-beta");
							}
							return false;
						});
					if (versions.length === 0) {
						return reject(new Error("No CLI versions found."));
					}
					resolve(`v${versions[0]}`);
				});
			})
			.on("error", reject);
	});
};

async function run(): Promise<void> {
	try {
		const versionType = core.getInput("version") as VersionType;
		// validate the version input. Should be one of the VersionTypes.
		if (isValidVersionType(versionType)) {
			core.setFailed(
				`Invalid version input: ${versionType}. Valid options are: ${Object.values(VersionType).join(", ")}. Defaulting to 'latest'.`,
			);
			return;
		}

		const version = await getLatestVersion(versionType);
		let installer: Installer;
		switch (process.env.RUNNER_OS) {
			case RunnerOS.Linux:
				installer = new LinuxInstaller(version);
				break;
			case RunnerOS.MacOS:
				installer = new MacOSInstaller(version);
				break;
			case RunnerOS.Windows:
				installer = new WindowsInstaller(version);
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
