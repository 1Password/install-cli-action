import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { CliInstaller, cliUrlBuilder, } from "./cli-installer";
import {} from "./installer";
const execAsync = promisify(exec);
export class MacOsInstaller extends CliInstaller {
    platform = "darwin"; // Node.js platform identifier for macOS
    constructor(version) {
        super(version);
    }
    async installCli() {
        const urlBuilder = cliUrlBuilder[this.platform];
        await this.install(urlBuilder(this.version));
    }
    // @actions/tool-cache package does not support .pkg files, so we need to handle the installation manually
    async install(downloadUrl) {
        console.info(`Downloading 1Password CLI from: ${downloadUrl}`);
        const pkgPath = await tc.downloadTool(downloadUrl);
        const pkgWithExtension = `${pkgPath}.pkg`;
        fs.renameSync(pkgPath, pkgWithExtension);
        const expandDir = "temp-pkg";
        await execAsync(`pkgutil --expand "${pkgWithExtension}" "${expandDir}"`);
        const payloadPath = path.join(expandDir, "op.pkg", "Payload");
        console.info("Installing 1Password CLI");
        const cliPath = await tc.extractTar(payloadPath);
        core.addPath(cliPath);
        fs.rmSync(expandDir, { recursive: true, force: true });
        fs.rmSync(pkgPath, { force: true });
        core.info("1Password CLI installed");
    }
}
