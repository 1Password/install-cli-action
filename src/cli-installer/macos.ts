import { type Installer, RunnerArch } from "./index";
import * as core from "@actions/core";
import { CliInstaller } from "./cli-installer";

export class MacOSInstaller extends CliInstaller implements Installer {
	private readonly arch: string;
	private readonly version: string;

	constructor(version: string) {
		super();
		this.version = version;
		this.arch = this.getArch();
	}

	async installCli(): Promise<void> {
		const downloadUrl = this.downloadUrl();
		core.info(`Downloading 1Password CLI ${this.version} from ${downloadUrl}`);
		await super.install(downloadUrl);
	}

	private downloadUrl(): string {
		return `https://cache.agilebits.com/dist/1P/op2/pkg/${this.version}/op_darwin_${this.arch}_${this.version}.zip`;
	}

	private getArch(): string {
		switch (process.env.RUNNER_ARCH) {
			case RunnerArch.X64:
				return "amd64";
			case RunnerArch.ARM64:
				return "arm64";
			default:
				throw new Error(
					`Unsupported RUNNER_ARCH value for macOS: ${process.env.RUNNER_ARCH}`,
				);
		}
	}
}
