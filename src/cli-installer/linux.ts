import { CliInstaller } from "./cli-installer";
import { type Installer, RunnerArch } from "./index";

export class LinuxInstaller extends CliInstaller implements Installer {
	private readonly arch: string;
	private readonly version: string;

	public constructor(version: string) {
		super();
		this.version = version;
		this.arch = this.getArch();
	}

	public async installCli(): Promise<void> {
		const downloadUrl = this.downloadUrl();
		await super.install(downloadUrl);
	}

	private downloadUrl(): string {
		return `https://cache.agilebits.com/dist/1P/op2/pkg/${this.version}/op_linux_${this.arch}_${this.version}.zip`;
	}

	// return cpu architecture for the current
	private getArch(): string {
		switch (process.env.RUNNER_ARCH) {
			case RunnerArch.X86:
				return "386";
			case RunnerArch.X64:
				return "amd64";
			case RunnerArch.ARM:
				return "arm";
			case RunnerArch.ARM64:
				return "arm64";
			default:
				throw new Error(
					`Unsupported RUNNER_ARCH value for linux: ${process.env.RUNNER_ARCH}`,
				);
		}
	}
}
