import { ReleaseChannel } from "./constants";
import { getLatestVersion } from "./helper";

describe("getLatestVersion", () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it("should return latest stable version", async () => {
		const mockResponse = {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			CLI2: {
				release: { version: "2.31.0" },
				beta: { version: "2.32.0-beta.01" },
			},
		};

		jest.spyOn(global, "fetch").mockResolvedValueOnce({
			// eslint-disable-next-line @typescript-eslint/require-await
			json: async () => mockResponse,
		} as Response);

		const version = await getLatestVersion(ReleaseChannel.Stable);
		expect(version).toBe("2.31.0");
	});

	it("should return latest beta version", async () => {
		const mockResponse = {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			CLI2: {
				release: { version: "2.31.0" },
				beta: { version: "2.32.0-beta.01" },
			},
		};

		jest.spyOn(global, "fetch").mockResolvedValueOnce({
			// eslint-disable-next-line @typescript-eslint/require-await
			json: async () => mockResponse,
		} as Response);

		const version = await getLatestVersion(ReleaseChannel.Beta);
		expect(version).toBe("2.32.0-beta.01");
	});

	it("should throw if no CLI2 field", async () => {
		jest.spyOn(global, "fetch").mockResolvedValueOnce({
			// eslint-disable-next-line @typescript-eslint/require-await
			json: async () => ({}),
		} as Response);

		await expect(getLatestVersion(ReleaseChannel.Stable)).rejects.toThrow(
			`No ${ReleaseChannel.Stable} versions found`,
		);
	});

	it("should throw if no stable version found", async () => {
		const mockResponse = {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			CLI2: {
				beta: { version: "2.32.0-beta.01" },
			},
		};

		jest.spyOn(global, "fetch").mockResolvedValueOnce({
			// eslint-disable-next-line @typescript-eslint/require-await
			json: async () => mockResponse,
		} as Response);

		await expect(getLatestVersion(ReleaseChannel.Stable)).rejects.toThrow(
			`No ${ReleaseChannel.Stable} versions found`,
		);
	});

	it("should throw if no beta version found", async () => {
		const mockResponse = {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			CLI2: {
				release: { version: "2.32.0" },
			},
		};

		jest.spyOn(global, "fetch").mockResolvedValueOnce({
			// eslint-disable-next-line @typescript-eslint/require-await
			json: async () => mockResponse,
		} as Response);

		await expect(getLatestVersion(ReleaseChannel.Beta)).rejects.toThrow(
			`No ${ReleaseChannel.Beta} versions found`,
		);
	});
});
