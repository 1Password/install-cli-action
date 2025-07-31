import * as core from "@actions/core";
import { ReleaseChannel } from "./constants";
// Returns the latest version of the 1Password CLI based on the specified channel.
export const getLatestVersion = async (channel) => {
    core.info(`Getting ${channel} version number`);
    const res = await fetch("https://app-updates.agilebits.com/latest");
    const json = (await res.json());
    const latestStable = json?.CLI2?.release?.version;
    const latestBeta = json?.CLI2?.beta?.version;
    const version = channel === ReleaseChannel.Beta ? latestBeta : latestStable;
    if (!version) {
        core.error(`No ${channel} versions found`);
        throw new Error(`No ${channel} versions found`);
    }
    return version;
};
