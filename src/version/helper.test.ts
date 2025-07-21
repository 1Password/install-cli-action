import { getLatestVersion } from "./helper";
import * as helper from "./helper";
import { ReleaseChannel } from "./constants";

describe("getLatestVersion", () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("returns latest stable version", async () => {
		jest.spyOn(helper, "loadHtml").mockResolvedValue(`
      <html><body>
        <article><h3> 2.31.1 </h3><span>build number and release date</span></article>
        <article><h3> 2.32.1 </h3><span>build number and release date</span></article>
        <article><h3> 2.33.2 </h3><span>build number and release date</span></article>
        <article><h3>2.33.1 </h3><span>build number and release date</span></article>
      </body></html>
    `);
		const version = await getLatestVersion(ReleaseChannel.Stable);
		expect(version).toBe("2.33.2");
	});

	it("returns latest beta version", async () => {
		jest.spyOn(helper, "loadHtml").mockResolvedValue(`
      <html><body>
        <article class="beta"><h3> 1.32.0-beta.01 <span>build number and release date</span></h3></article>
        <article class="beta"><h3>2.32.0-beta.01 <span>build number and release date</span></h3></article>
        <article class="beta"><h3>3.32.0-beta.02<span>build number and release date</span></h3></article>
        <article class="beta"><h3>3.32.0-beta.01 <span>build number and release date</span></h3></article>
      </body></html>
    `);
		const version = await getLatestVersion(ReleaseChannel.Beta);
		expect(version).toBe("3.32.0-beta.02");
	});

	it("throws error when no versions found", async () => {
		jest.spyOn(helper, "loadHtml").mockResolvedValue("<html></html>");
		await expect(getLatestVersion(ReleaseChannel.Stable)).rejects.toThrow(
			`No ${ReleaseChannel.Stable} versions found`,
		);
	});

	it("throws error when HTML is invalid", async () => {
		jest
			.spyOn(helper, "loadHtml")
			.mockResolvedValue("<html><article></article></html>");
		await expect(getLatestVersion(ReleaseChannel.Stable)).rejects.toThrow(
			`No ${ReleaseChannel.Stable} versions found`,
		);
	});

	it("calls loadHtml once", async () => {
		const spy = jest.spyOn(helper, "loadHtml").mockResolvedValue(`
      <article><h3>2.31.1</h3></article>
    `);
		await getLatestVersion(ReleaseChannel.Stable);
		expect(spy).toHaveBeenCalledTimes(1);
	});
});
