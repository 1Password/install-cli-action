import { CliInstaller, cliUrlBuilder, } from "./cli-installer";
export class LinuxInstaller extends CliInstaller {
    platform = "linux"; // Node.js platform identifier for Linux
    constructor(version) {
        super(version);
    }
    async installCli() {
        const urlBuilder = cliUrlBuilder[this.platform];
        await super.install(urlBuilder(this.version, this.arch));
    }
}
