<template>
	<div id="home-main">
		<app-logo></app-logo>
	
	</div>
</template>

<script lang="ts">
import { title } from "/utils/config";
import { createComponent } from "@vue/composition-api";
import appLogo from "../logo.vue";
export default createComponent({
	name: "home-main",
	components: {
		appLogo
	},
	setup() {
		return {
			title
		};
	}
});
</script>

<style lang="less">
#home-main {
	margin-top: 20px;
	display: flex;
	flex-direction: column;
  align-items: center;
  span {
    margin:10px;
  }
	p,
	.el-collapse {
		a {
			text-decoration: none;
			color: orange;
		}
		unicode-bidi: isolate;
		font-variant-numeric: tabular-nums;
		margin: 0 0 15px;
		line-height: 1.618;
		font-size: 18px;
		display: block;
		margin-block-start: 1em;
		margin-block-end: 1em;
		color: grey;
		font-weight: 300;
		font-family: "Roboto", "Helvetica", "Arial", sans-serif;
	}
}
</style>
