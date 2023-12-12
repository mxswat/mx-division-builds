import Vue from "vue";
import VueI18n from "vue-i18n";
import getBrowserLocale from "@/utils/i18n/get-browser-locale";
import { supportedLocalesInclude } from "./utils/i18n/supported-locales";
import {
	getChoiceIndex,
	setDefaultChoiceIndexGet,
} from "./utils/i18n/choice-index-for-plural";
import dateTimeFormats from "@/locales/date-time-formats";
import numberFormats from "@/locales/number-formats";
import EventBus from "@/EventBus";

Vue.use(VueI18n);

// function loadLocaleMessages() {
//   const locales = require.context(
//     "./locales",
//     true,
//     /[A-Za-z0-9-_,\s]+\.json$/i
//   )
//   const messages = {}
//   locales.keys().forEach(key => {
//     const matched = key.match(/([A-Za-z0-9-_]+)\./i)
//     if (matched && matched.length > 1) {
//       const locale = matched[1]
//       messages[locale] = locales(key)
//     }
//   })
//   return messages
// }

function getStartingLocale() {
	const browserLocale = getBrowserLocale({ countryCodeOnly: true });

	if (supportedLocalesInclude(browserLocale)) {
		return browserLocale;
	} else {
		return process.env.VUE_APP_I18N_LOCALE || "en";
	}
}

setDefaultChoiceIndexGet(VueI18n.prototype.getChoiceIndex);

VueI18n.prototype.getChoiceIndex = getChoiceIndex;

const startingLocale = getStartingLocale();

const i18n = new VueI18n({
	locale: startingLocale,
	fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
	messages: {},
	// messages: loadLocaleMessages()
	dateTimeFormats,
	numberFormats,
});

const loadedLanguages = [];

export function loadLocaleMessagesAsync(locale) {
	EventBus.$emit("i18n-load-start");

	if (loadedLanguages.length > 0 && i18n.locale === locale) {
		EventBus.$emit("i18n-load-complete");
		return Promise.resolve(locale);
	}

	// If the language was already loaded
	if (loadedLanguages.includes(locale)) {
		i18n.locale = locale;
		EventBus.$emit("i18n-load-complete");
		return Promise.resolve(locale);
	}

	// If the language hasn't been loaded yet
	return import(
		/* webpackChunkName: "locale-[request]" */ `@/locales/${locale}.json`
	).then((messages) => {
		i18n.setLocaleMessage(locale, messages.default);

		loadedLanguages.push(locale);

		i18n.locale = locale;

		EventBus.$emit("i18n-load-complete");
		return Promise.resolve(locale);
	});
}

export default i18n;
