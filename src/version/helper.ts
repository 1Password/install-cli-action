import * as https from "https";
import * as core from "@actions/core";
import * as cheerio from "cheerio";
import semver from "semver";
import { ReleaseChannel } from "./constants";

// Loads the HTML content from the 1Password CLI product history page.
export const loadHtml = (): Promise<string> => {
	return new Promise((resolve, reject) => {
		https
			.get("https://app-updates.agilebits.com/product_history/CLI2", (res) => {
				let data = "";
				res.on("data", (chunk) => (data += chunk));
				res.on("end", () => {
					core.debug("HTML loaded successfully");
					resolve(data);
				});
			})
			.on("error", (e) => {
				core.error(`Failed to load HTML: ${e.message}`);
				reject();
			});
	});
};

// Finds and returns an array of version strings from the HTML content based on the provided query.
// Version stored in the first <h3> element of each article element.
const findVersions = ($: cheerio.CheerioAPI, query: string): string[] => {
	const versions: string[] = [];
	$(query).each((_, article) => {
		const h3 = $(article).find("h3").first();
		const version = h3
			.contents()
			.filter((_, el) => el.type === "text") // select only text nodes
			.text()
			.trim();
		if (version) {
			versions.push(version);
		}
	});
	return versions;
};

export const normalizeBetaForSemver = (version: string): string =>
	version.replace(/-beta\.0*(\d+)/, "-beta.$1");

// Returns the latest version of the 1Password CLI based on the specified channel.
export const getLatestVersion = async (
	versionType: ReleaseChannel,
): Promise<string> => {
	core.debug(`Getting ${versionType} version`);
	const html = await loadHtml();
	const $ = cheerio.load(html);
	const versions =
		versionType === ReleaseChannel.Beta
			? findVersions($, "article.beta")
			: findVersions($, "article");

	if (versions.length === 0) {
		core.error(`No ${versionType} versions found`);
		throw new Error(`No ${versionType} versions found`);
	}

	// Sort versions in descending order
	versions.sort((a: string, b: string): number => {
		const aNorm = new semver.SemVer(normalizeBetaForSemver(a));
		const bNorm = new semver.SemVer(normalizeBetaForSemver(b));
		return semver.rcompare(aNorm, bNorm);
	});

	return versions[0]!;
};
