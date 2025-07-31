import { CliInstaller, cliUrlBuilder, } from "./cli-installer";
export class WindowsInstaller extends CliInstaller {
    platform = "win32"; // Node.js platform identifier for Windows
    constructor(version) {
        super(version);
    }
    async installCli() {
        const urlBuilder = cliUrlBuilder[this.platform];
        await super.install(urlBuilder(this.version, this.arch));
    }
}
