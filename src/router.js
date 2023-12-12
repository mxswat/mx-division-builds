import VueRouter from "vue-router";
import InventoryGUI from "./components/InventoryGUI";

// localization
import i18n, { loadLocaleMessagesAsync } from "@/i18n";
import {
	setDocumentDirectionPerLocale,
	setDocumentLang,
	setDocumentTitle,
} from "@/utils/i18n/document";
const { locale } = i18n;

// console.log(`locale:`, locale);

const routes = [
	{
		path: "/",
		name: "home",
		component: InventoryGUI,
	},
	{
		path: "/:encodedBuild",
		name: "homeIdNoLocale",
		redirect: "/:encodedBuild/:locale",
	},
	{
		path: "/:encodedBuild/:locale",
		name: "homeId",
		component: InventoryGUI,
		props: true,
	},
];

const router = new VueRouter({
	// mode: "history",
	// base: process.env.BASE_URL,
	routes,
});

router.beforeEach((to, from, next) => {
	console.log(`to:`, to);
	console.log(`from:`, from);
	if (to.params.locale === from.params.locale) {
		next();
		return;
	}

	const { locale } = to.params;

	loadLocaleMessagesAsync(locale).then(() => {
		setDocumentLang(locale);

		setDocumentDirectionPerLocale(locale);

		setDocumentTitle(i18n.t("app.title"));
	});

	next();
});

export default router;
