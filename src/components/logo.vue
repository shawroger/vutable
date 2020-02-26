<template>
	<div id="app-logo">
		<img v-no-drag class="logo" :src="logoUrl" />
	</div>
</template>

<script lang="ts">
import { createComponent } from "@vue/composition-api";
import { logoUrl } from "/utils/config";

export default createComponent({
	name: "app-logo",
	setup() {
		return {
			logoUrl
		};
	}
});
</script>

<style lang="less">
#app-logo {
	display: flex;
	justify-content: center;
	margin: 10px 0px;

	.logo {
		width: 90px;
		height: 110px;
		animation: logoRotate 4s;
	}

	@keyframes logoRotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(720deg);
		}
	}
}
</style>
