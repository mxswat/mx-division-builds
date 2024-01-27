module.exports = {
	root: true,
	env: {
		node: true,
		es2022: true,
	},
	extends: [
		//"eslint:recommended",
		//"plugin:vue/essential",
		//"plugin:vue/strongly-recommended",
		"plugin:vue/recommended",
	],
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-unused-vars": "off",
		"no-unused-labels": "off",
	},
};
