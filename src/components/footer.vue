<template>
	<div class="app-footer" v-if="showFooter === true">
		<p>
			Powered by
			<a href="https://github.com/shawroger/vutable" target="_blank">Vutable</a>
		</p>
	</div>
</template>

<script lang="ts">
import { tryGlobalConfig } from "../utils/methods";
import { createComponent } from "@vue/composition-api";
export default createComponent({
	name: "app-footer",
	setup() {
		const showFooter = tryGlobalConfig(["footer"], true);
		return {
			showFooter
		};
	},
});
</script>

<style lang="less" scoped>
.app-footer {
	padding: 12px 0px 5px 0px;
	p {
		font-size: 15px;
		text-align: center;
		color: #c0c4cc;
		a {
			text-decoration: none;
			color: lightgrey;
		}
	}
}
</style>
