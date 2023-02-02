function newFeatureGlow(id) {
	const button = document.getElementById(id);

	button.classList.add("new-feature-glow");

	const clickEventListenerFnc = button.addEventListener("click", () => {
		button.classList.remove("new-feature-glow");
		button.removeEventListener("click", clickEventListenerFnc);
	});
}

export default newFeatureGlow;
