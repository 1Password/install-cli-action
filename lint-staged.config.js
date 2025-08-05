const lintStagedConfig = {
	// run formatting and linting on all supported file types
	"*.{js,json,md,ts,yaml,yml}": "npm run format:check",
	"*.{js,ts}": ["npm run lint"],
};

export default lintStagedConfig;
