export enum ReleaseChannel {
	Stable = "latest",
	Beta = "latest-beta",
}

export type VersionResponse = {
	CLI2: {
		release: { version: string };
		beta: { version: string };
	};
}