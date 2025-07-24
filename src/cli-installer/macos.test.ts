import os from "os";

import { cliUrlBuilder, type SupportedPlatform } from "./cli-installer";
import { MacOsInstaller } from "./macos";

describe("MacOsInstaller", () => {
	const version = "1.2.3";

	it("should construct with given version and architecture", () => {
		const installer = new MacOsInstaller(version);
		expect(installer.version).toEqual(version);
		expect(installer.arch).toEqual(os.arch());
	});

	it("should call install with correct URL", async () => {
		const installer = new MacOsInstaller(version);
		const installMock = jest.spyOn(installer, "install").mockResolvedValue();

		await installer.installCli();

		const builder = cliUrlBuilder["darwin" as SupportedPlatform];
		const url = builder(version, installer.arch);
		expect(installMock).toHaveBeenCalledWith(url);
	});
});
