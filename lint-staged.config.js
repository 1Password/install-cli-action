const lintStagedConfig = {
	// run formatting and linting on all supported file types
	"*.{js,json,md,ts,yaml,yml}": "npm run format:write",
	"*.{js,ts}": ["npm run lint:fix"],
};

export default lintStagedConfig;
