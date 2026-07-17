import { ReleaseChannel } from "./constants";
import { FALLBACK_VERSIONS } from "./fallback-versions";
import { getLatestVersion } from "./helper";

const appUpdatesResponse = {
	CLI2: {
		release: { version: "2.31.0" },
		beta: { version: "2.32.0-beta.01" },
	},
};

const dockerHubResponse = {
	results: [
		{ name: "latest" },
		{ name: "2" },
		{ name: "2-beta" },
		{ name: "2.35.0" },
		{ name: "2.34.1" },
		{ name: "2.37.0-beta.01" },
		{ name: "2.37.0-beta.02" },
		{ name: "2.36.0-beta.03" },
	],
};

const okResponse = (json: unknown): Response =>
	({
		ok: true,
		status: 200,
		json: async () => json,
	}) as Response;

describe("getLatestVersion", () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it("should return latest stable version from app-updates", async () => {
		jest
			.spyOn(global, "fetch")
			.mockResolvedValueOnce(okResponse(appUpdatesResponse));

		const version = await getLatestVersion(ReleaseChannel.latest);
		expect(version).toBe("2.31.0");
	});

	it("should return latest beta version from app-updates", async () => {
		jest
			.spyOn(global, "fetch")
			.mockResolvedValueOnce(okResponse(appUpdatesResponse));

		const version = await getLatestVersion(ReleaseChannel.latestBeta);
		expect(version).toBe("2.32.0-beta.01");
	});

	it("should fall back to Docker Hub for stable when app-updates is down", async () => {
		jest
			.spyOn(global, "fetch")
			.mockResolvedValueOnce({ ok: false, status: 503 } as Response)
			.mockResolvedValueOnce(okResponse(dockerHubResponse));

		const version = await getLatestVersion(ReleaseChannel.latest);
		expect(version).toBe("2.35.0");
	});

	it("should fall back to Docker Hub for beta when app-updates is down", async () => {
		jest
			.spyOn(global, "fetch")
			.mockResolvedValueOnce({ ok: false, status: 503 } as Response)
			.mockResolvedValueOnce(okResponse(dockerHubResponse));

		const version = await getLatestVersion(ReleaseChannel.latestBeta);
		expect(version).toBe("2.37.0-beta.02");
	});

	it("should fall back to Docker Hub when app-updates rejects", async () => {
		jest
			.spyOn(global, "fetch")
			.mockRejectedValueOnce(new Error("network error"))
			.mockResolvedValueOnce(okResponse(dockerHubResponse));

		const version = await getLatestVersion(ReleaseChannel.latest);
		expect(version).toBe("2.35.0");
	});

	it("should fall back to Docker Hub when app-updates returns no version", async () => {
		jest
			.spyOn(global, "fetch")
			.mockResolvedValueOnce(okResponse({}))
			.mockResolvedValueOnce(okResponse(dockerHubResponse));

		const version = await getLatestVersion(ReleaseChannel.latest);
		expect(version).toBe("2.35.0");
	});

	it("should use the baked-in version when both app-updates and Docker Hub are unavailable", async () => {
		jest
			.spyOn(global, "fetch")
			.mockResolvedValueOnce({ ok: false, status: 503 } as Response)
			.mockResolvedValueOnce({ ok: false, status: 503 } as Response);

		const version = await getLatestVersion(ReleaseChannel.latest);
		expect(version).toBe(FALLBACK_VERSIONS.latest);
	});

	it("should use the baked-in version when Docker Hub has no matching versions", async () => {
		jest
			.spyOn(global, "fetch")
			.mockResolvedValueOnce({ ok: false, status: 503 } as Response)
			.mockResolvedValueOnce(okResponse({ results: [{ name: "latest" }] }));

		const version = await getLatestVersion(ReleaseChannel.latestBeta);
		expect(version).toBe(FALLBACK_VERSIONS["latest-beta"]);
	});
});
