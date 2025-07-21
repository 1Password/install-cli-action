import * as core from "@actions/core";
import { validateVersion } from "./validate";
import { getLatestVersion } from "./helper";
import { ReleaseChannel } from "./constants";

export class VersionResolver {
	private version: string;

	constructor(version: string) {
		this.validate(version);
		this.version = version;
	}

	get(): string {
		return this.version;
	}

	async resolve(): Promise<void> {
		core.info(`Resolving version: ${this.version}`);
		if (!this.version) {
			core.error("Version is not provided");
			throw new Error("Version is not provided");
		}

		if (
			this.version === ReleaseChannel.Stable ||
			this.version === ReleaseChannel.Beta
		) {
			this.version = await getLatestVersion(this.version);
		}

		// add `v` prefix if not already present
		this.version = this.version.startsWith("v")
			? this.version
			: `v${this.version}`;
	}

	private validate(version: string) {
		core.info(`Validating version number: '${version}'`);
		validateVersion(version);
		core.info(`Version number '${version}' is valid`);
	}
}
