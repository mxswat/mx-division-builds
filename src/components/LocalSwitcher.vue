<template>
	<div class="locale-switcher">
		<select :value="$i18n.locale" @change.prevent="changeLocale">
			<option
				:value="locale.code"
				v-for="locale in locales"
				:key="locale.code"
				>{{ locale.name }}</option
			>
		</select>
	</div>
</template>

<script>
	import { getSupportedLocales } from "../utils/i18n/supported-locales";

	export default {
		data: () => ({ locales: getSupportedLocales() }),
		methods: {
			changeLocale(e) {
				const locale = e.target.value;

				this.$router.push(`/${locale}`);
			},
		},
	};
</script>
