<template>
	<div id="app-nav">
		<el-menu default-active="0" class="el-menu-demo" mode="horizontal">
			<el-menu-item>
				<a href="./" style="text-decoration: none;font-size: 20px">
					{{ title }}
				</a>
			</el-menu-item>

			<el-menu-item
				class="right-menu"
				@click="
					() => {
						$emit('search-click');
					}
				"
				><i class="el-icon-search"></i
			></el-menu-item>
		</el-menu>
	</div>
</template>

<script lang="ts">
import { createComponent, onMounted, ref } from "@vue/composition-api";
import { tryGlobalConfig } from "../utils/methods";
export default createComponent({
	name: "app-nav",
	setup() {
		const title = tryGlobalConfig(["title"], window.document.title);
		return {
			title,
		};
	},
});
</script>

<style scoped>
.logo {
	width: 55px;
	padding-right: 5px;
	margin-right: 5px;
	position: relative;
	top: -8px;
}

.right-menu {
	float: right !important;
}

.icon {
	font-size: 35px;
	position: relative;
	top: 15px;
	color: LightGray;
	right: 5px;
}
</style>
