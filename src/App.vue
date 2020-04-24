<template>
	<div id="app">
		<app-nav @search-click="searchClick"></app-nav>
		<app-list
			@search-close="searchClose"
			:popoverStatus="popoverStatus"
		></app-list>
		<app-footer></app-footer>
	</div>
</template>

<script lang="ts">
import { createComponent, ref } from "@vue/composition-api";

import appNav from "./components/nav.vue";
import appList from "./components/list.vue";
import appFooter from "./components/footer.vue";

export default createComponent({
	name: "app",
	components: { appNav, appList, appFooter },
	setup() {
		const popoverStatus = ref(false);

		function searchClose() {
			popoverStatus.value = false;
		}
		function searchClick() {
			popoverStatus.value = !popoverStatus.value;
		}

		return {
			popoverStatus,
			searchClick,
			searchClose,
		};
	},
});
</script>

