import * as https from "https";
import * as core from "@actions/core";
import * as cheerio from "cheerio";
import {
	type Installer,
	RunnerOS,
	LinuxInstaller,
	MacOSInstaller,
	WindowsInstaller,
} from "./cli-installer";

export enum VersionType {
	Latest = "latest",
	LatestBeta = "latest-beta",
}

// Returns `true` if the versionType is one of the defined in VersionType enum, otherwise `false`.
const isValidVersionType = (versionType: string): boolean =>
	Object.values(VersionType).some((v) => v === versionType);

// Loads the HTML content from the 1Password CLI product history page.
export const loadHtml = (): Promise<string> => {
	return new Promise((resolve, reject) => {
		https
			.get("https://app-updates.agilebits.com/product_history/CLI2", (res) => {
				let data = "";
				res.on("data", (chunk) => (data += chunk));
				res.on("end", () => {
					core.debug("HTML loaded successfully");
					resolve(data)
				});
			})
			.on("error", (e) => {
				core.error(`Failed to load HTML: ${e.message}`);
				reject();
			});
	});
};

// Returns the latest version of the 1Password CLI based on the specified channel.
export const getLatestVersion = async (channel: VersionType): Promise<string> => {
	core.debug(`Getting ${channel} version`);
	const html = await loadHtml();
	const $ = cheerio.load(html);
	const versions: string[] = [];
	$("h3").each((_, el) => {
		const text = $(el).text().trim();
		const match = text.match(/^([\d.]+(?:-beta\d+)?)/);
		if (match) {
			const version = match[1];
			if (!version) {
				return
			}
			if (
				(channel === VersionType.Latest && !version.includes("-beta")) ||
				(channel === VersionType.LatestBeta && version.includes("-beta"))
			) {
				versions.push(version);
			}
		}
	});

	if (versions.length === 0) {
		core.error(`No ${channel} versions found`);
		throw new Error(`No ${channel} versions found`);
	}

	return versions[0]!;
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
