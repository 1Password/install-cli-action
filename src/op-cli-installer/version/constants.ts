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

export interface DockerHubTagsResponse {
	results?: { name: string }[];
}
