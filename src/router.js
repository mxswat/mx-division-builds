import VueRouter from "vue-router";
import InventoryGUI from "./components/InventoryGUI";

// const inventoryGUI = {
//     template:
// }

const router = new VueRouter({
	routes: [
		{
			path: "/",
			name: "home",
			component: InventoryGUI,
		},
		{
			path: "/:encodedBuild",
			name: "homeId",
			component: InventoryGUI,
			props: true,
		},
	],
});
export default router;
