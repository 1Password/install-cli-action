import os from "os";

import {
	CliInstaller,
	cliUrlBuilder,
	type SupportedPlatform,
} from "./cli-installer";
import { LinuxInstaller } from "./linux";

describe("LinuxInstaller", () => {
	const version = "1.2.3";

	it("should construct with given version and architecture", () => {
		const installer = new LinuxInstaller(version);
		expect(installer.version).toEqual(version);
		expect(installer.arch).toEqual(os.arch());
	});

	it("should call install with correct URL", async () => {
		const installer = new LinuxInstaller(version);
		const installMock = jest
			.spyOn(CliInstaller.prototype, "install")
			.mockResolvedValue();

		await installer.installCli();

		const builder = cliUrlBuilder["linux" as SupportedPlatform];
		const url = builder(version, installer.arch);
		expect(installMock).toHaveBeenCalledWith(url);
	});
});
