import * as core from "@actions/core";
import semver from "semver";

import {
	type DockerHubTagsResponse,
	ReleaseChannel,
	type VersionResponse,
} from "./constants";

const APP_UPDATES_URL = "https://app-updates.agilebits.com/latest";
const DOCKER_HUB_TAGS_URL =
	"https://hub.docker.com/v2/repositories/1password/op/tags/?page_size=100&ordering=last_updated";

/**
 * Returns the latest version of the 1Password CLI for the given release channel.
 *
 * app-updates.agilebits.com is the canonical source; if it is unavailable, this
 * falls back to the 1password/op Docker Hub image tags.
 */
export const getLatestVersion = async (
	channel: ReleaseChannel,
): Promise<string> => {
	core.info(`Getting ${channel} version number`);
	try {
		return await getLatestVersionFromAppUpdates(channel);
	} catch (error) {
		core.warning(
			`Could not resolve ${channel} version from app-updates.agilebits.com (${String(
				error,
			)}); falling back to Docker Hub`,
		);
		return getLatestVersionFromDockerHub(channel);
	}
};

// Resolves the latest version from the canonical app-updates.agilebits.com feed.
const getLatestVersionFromAppUpdates = async (
	channel: ReleaseChannel,
): Promise<string> => {
	const res = await fetch(APP_UPDATES_URL);
	if (!res.ok) {
		throw new Error(`app-updates.agilebits.com returned status ${res.status}`);
	}

	const json = (await res.json()) as VersionResponse;
	const latestStable = json.CLI2?.release?.version;
	const latestBeta = json.CLI2?.beta?.version;
	const version =
		channel === ReleaseChannel.latestBeta ? latestBeta : latestStable;

	if (!version) {
		throw new Error(`No ${channel} versions found`);
	}

	return version;
};

// Resolves the latest version from the 1password/op Docker Hub image tags.
const getLatestVersionFromDockerHub = async (
	channel: ReleaseChannel,
): Promise<string> => {
	const res = await fetch(DOCKER_HUB_TAGS_URL);
	if (!res.ok) {
		core.error(`Docker Hub returned status ${res.status}`);
		throw new Error(`Docker Hub returned status ${res.status}`);
	}

	const json = (await res.json()) as DockerHubTagsResponse;
	const tags = json.results?.map((result) => result.name) ?? [];

	const isBeta = channel === ReleaseChannel.latestBeta;
	const candidates = tags.filter((tag) =>
		isBeta
			? /^\d+\.\d+\.\d+-beta\.\d+$/.test(tag)
			: /^\d+\.\d+\.\d+$/.test(tag),
	);

	// Beta tags like 2.37.0-beta.01 aren't valid semver so strip it only to sort them,
	// then return the original tag unchanged.
	const version = candidates
		.map((tag) => ({
			tag,
			normalized: tag.replace(/-beta\.0*(\d+)/, "-beta.$1"),
		}))
		.filter(({ normalized }) => semver.valid(normalized))
		.sort((a, b) => semver.rcompare(a.normalized, b.normalized))[0]?.tag;

	if (!version) {
		core.error(`No ${channel} versions found`);
		throw new Error(`No ${channel} versions found`);
	}

	return version;
};
