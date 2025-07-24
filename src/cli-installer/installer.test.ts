import os from "os";

import { newCliInstaller } from "./installer";
import { LinuxInstaller } from "./linux";
import { MacOsInstaller } from "./macos";
import { WindowsInstaller } from "./windows";

jest.mock("os");
jest.mock("./linux");
jest.mock("./macos");
jest.mock("./windows");

describe("newCliInstaller", () => {
	const version = "1.0.0";

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should return LinuxInstaller for linux platform", () => {
		(os.platform as jest.Mock).mockReturnValue("linux");
		const installer = newCliInstaller(version);
		expect(installer).toBeInstanceOf(LinuxInstaller);
	});

	it("should return MacOsInstaller for darwin platform", () => {
		(os.platform as jest.Mock).mockReturnValue("darwin");
		const installer = newCliInstaller(version);
		expect(installer).toBeInstanceOf(MacOsInstaller);
	});

	it("should return WindowsInstaller for win32 platform", () => {
		(os.platform as jest.Mock).mockReturnValue("win32");
		const installer = newCliInstaller(version);
		expect(installer).toBeInstanceOf(WindowsInstaller);
	});

	it("should throw error for unsupported platform", () => {
		(os.platform as jest.Mock).mockReturnValue("sunos");
		expect(() => newCliInstaller(version)).toThrow(
			"Unsupported platform: sunos",
		);
	});
});
