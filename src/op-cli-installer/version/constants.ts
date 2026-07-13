export enum ReleaseChannel {
	latest = "latest",
	latestBeta = "latest-beta",
}

export interface VersionResponse {
	CLI2?: {
		release?: { version?: string };
		beta?: { version?: string };
	};
}

// As above, results is optional since the Docker Hub response is untrusted JSON.
export interface DockerHubTagsResponse {
	results?: { name: string }[];
}
