module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ["plugin:vue/essential", "eslint:recommended"],
	parserOptions: {
		parser: "babel-eslint",
	},
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-unused-vars": "off",
		"no-unused-labels": "off",
		"no-mixed-spaces-and-tabs": 0, // disable rule later - just using to fix temp errors
	},
};
