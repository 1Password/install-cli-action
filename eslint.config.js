import config from "@1password/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		ignores: [
			"coverage/",
			"dist/",
			"node_modules/",
			"eslint.config.js",
			"jest.config.js",
			"lint-staged.config.js",
			"tsconfig.json",
		],
	},
	{
		languageOptions: {
			parserOptions: {
				project: "./tsconfig.json",
			},
		},
	},
	...config,
]);
