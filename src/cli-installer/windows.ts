import { CliInstaller } from "./cli-installer";
import type { Installer } from "./index";

export class WindowsInstaller extends CliInstaller implements Installer {
	private readonly arch: string;
	private readonly version: string;

	public constructor(version: string) {
		super();
		this.version = version;
		this.arch = super.getArch();
	}

	public async installCli(): Promise<void> {
		const downloadUrl = this.downloadUrl();
		await super.install(downloadUrl);
	}

	private downloadUrl(): string {
		return `https://cache.agilebits.com/dist/1P/op2/pkg/${this.version}/op_windows_${this.arch}_${this.version}.zip`;
	}
}
