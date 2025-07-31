import * as core from "@actions/core";
import { ReleaseChannel } from "./constants";
import { getLatestVersion } from "./helper";
import { validateVersion } from "./validate";
export class VersionResolver {
    version;
    constructor(version) {
        this.validate(version);
        this.version = version;
    }
    get() {
        return this.version;
    }
    async resolve() {
        core.info(`Resolving version: ${this.version}`);
        if (!this.version) {
            core.error("Version is not provided");
            throw new Error("Version is not provided");
        }
        if (this.isReleaseChannel(this.version)) {
            this.version = await getLatestVersion(this.version);
        }
        // add `v` prefix if not already present
        this.version = this.version.startsWith("v")
            ? this.version
            : `v${this.version}`;
    }
    validate(version) {
        core.info(`Validating version number: '${version}'`);
        validateVersion(version);
        core.info(`Version number '${version}' is valid`);
    }
    isReleaseChannel(value) {
        return Object.values(ReleaseChannel).includes(value);
    }
}
