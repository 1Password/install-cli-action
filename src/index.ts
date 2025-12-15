import * as core from "@actions/core";

import { installCliOnGithubActionRunner } from "./op-cli-installer";

/**
 * Entry point for the GitHub Action.
 */
const run = async (): Promise<void> => {
	try {
		await installCliOnGithubActionRunner();
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("error:", error);
			core.setFailed(error.message);
		} else {
			console.error("Unknown error:", error);
			core.setFailed("Unknown error occurred");
		}
	}
};
// eslint-disable-next-line
run();
