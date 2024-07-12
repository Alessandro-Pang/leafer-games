module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		"airbnb-base",
		"airbnb-typescript/base",
		'plugin:vue/vue3-recommended',
	],
	overrides: [],
	parser: "vue-eslint-parser",
	parserOptions: {
		parser: "@typescript-eslint/parser",
		ecmaVersion: "latest",
		sourceType: "module",
		project: ['./tsconfig.app.json', './tsconfig.node.json'],
		extraFileExtensions: [".vue"]
	},
	plugins: [
		"vue",
		"@typescript-eslint"
	],
	rules: {
		"linebreak-style": ["error", "unix"],
		'no-plusplus': ['error', {allowForLoopAfterthoughts: true}],
		'class-methods-use-this': 'off',
		'no-continue': 'off',
		'import/extensions': [
			'off',
			'always',
			{ js: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
		],
		"import/no-extraneous-dependencies":[
			"error",
			{
				"devDependencies":["vite.config.ts"]
			}
		],
		indent: ["error", 2],
		quotes: ["error", "single"],
		semi: ["error", "always"],

		// @see https://eslint.vuejs.org/
		'vue/html-self-closing': 'off',
		"vue/multi-word-component-names": ["error", {
			ignores: ["index"]
		}],
		'vue/first-attribute-linebreak': [
			'error',
			{
				singleline: 'ignore',
				multiline: 'below',
			},
		],
		'vue/max-attributes-per-line': [
			'error',
			{
				singleline: {max: 10},
				multiline: {max: 1},
			},
		],
		'vue/html-indent': [
			'error',
			2,
			{
				attribute: 1,
				baseIndent: 1,
				closeBracket: 0,
				alignAttributesVertically: true,
				ignores: [],
			},
		],
		'vue/singleline-html-element-content-newline': [
			'error',
			{
				ignoreWhenNoAttributes: true,
				ignoreWhenEmpty: true,
				ignores: ['button', 'a', 'p'],
			},
		],
	},
}
