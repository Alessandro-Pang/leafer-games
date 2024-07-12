module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		"plugin:vue/vue3-essential",
		"airbnb-base",
		"airbnb-typescript/base",
	],
	overrides: [],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: ['./tsconfig.app.json', './tsconfig.node.json'],
	},
	plugins: [
		"vue",
		"@typescript-eslint"
	],
	rules: {
		indent: [
			"error",
			2
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		quotes: [
			"error",
			"single"
		],
		semi: [
			"error",
			"always"
		]
	}
}
