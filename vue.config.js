// vue.config.js
module.exports = {
	pluginOptions: {
		i18n: {
			locale: "en",
			fallbackLocale: "en",
			localeDir: "locales",
			enableInSFC: false,
		},
	},
	runtimeCompiler: true,
	publicPath: process.env.BASE_URL,
};
// TODO https://medium.com/hceverything/how-to-show-your-app-version-from-package-json-in-your-vue-application-11e882b97d8c
