<template>
	<div id="app-table">
		<!-- 弹框 -->

		<el-popover :value="popoverStatus" width="250" popper-class="right-trans">
			<div class="popover-card">
				<template v-if="currentType === '[SORT]'">
					<el-switch
						v-model="searchState.sortMode"
						active-text="正序"
						inactive-text="倒序"
					>
					</el-switch>
				</template>
				<el-select
					v-model="searchState.mode"
					placeholder="请选择检索规则"
					@change="changeMode"
				>
					<el-option label="展示所有数据" :value="-1"> </el-option>
					<el-option
						v-for="item in searchMode
							? searchMode.filter((item) => item.value !== null)
							: []"
						:key="item.index"
						:label="
							item.type !== '[SORT]'
								? '在' + label[item.index] + '中查找'
								: '以' + label[item.index] + '来排序'
						"
						:value="item.index"
					>
					</el-option>
				</el-select>
				<template v-if="currentType === '[VAL]' || currentType === '[EQL_VAL]'">
					<el-input
						v-model="searchState.input"
						:placeholder="
							'请输入' +
								label[searchState.mode] +
								(currentType === '[EQL_VAL]' ? ' (全字匹配)' : ' (部分匹配)')
						"
					></el-input>
				</template>
				<template v-if="currentType === '[LIST]'">
					<el-select
						v-model="searchState.input"
						:placeholder="label[searchState.mode] + '检索列表'"
					>
						<el-option
							v-for="item in searchMode[searchState.mode].value"
							:key="item.key"
							:label="item.key"
							:value="item.val"
						>
						</el-option>
					</el-select>
				</template>

				<div class="btn-list">
					<el-button
						@click="
							() => {
								searchState.input = '';
								searchState.mode = -1;
							}
						"
						>重置</el-button
					>
					<el-button
						@click="
							() => {
								$emit('search-close');
							}
						"
						>关闭</el-button
					>
				</div>
			</div>
		</el-popover>

		<!-- 表格主体 -->

		<div class="table-list">
			<el-table
				:data="
					tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
				"
				style="width: 100%"
			>
				<el-table-column
					v-if="useIndex && tableData.length > 0"
					type="index"
					label="#"
					align="center"
					width="60"
					:index="(e) => e + (currentPage - 1) * pageSize + 1"
				>
				</el-table-column>

				<el-table-column
					:key="item"
					:prop="item"
					:label="item"
					align="center"
					v-for="item in label"
				></el-table-column>
			</el-table>
		</div>

		<!-- 分页 -->
		<div class="page-pagination">
			<el-pagination
				ref="pagination"
				v-if="width > 768"
				:current-page="currentPage"
				@current-change="
					(e) => {
						currentPage = e;
						changeHooks();
					}
				"
				@size-change="
					(e) => {
						pageSize = e;
						changeHooks();
					}
				"
				@prev-click="
					() => {
						currentPage--;
						changeHooks();
					}
				"
				@next-click="
					() => {
						currentPage++;
						changeHooks();
					}
				"
				:page-sizes="[5, 10, 20, 50, 100]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="tableData.length"
			>
			</el-pagination>

			<el-pagination
				v-else
				:current-page="currentPage"
				layout="prev, pager, next"
				:total="tableData.length"
				@current-change="
					(e) => {
						currentPage = e;
						changeHooks();
					}
				"
				@size-change="
					(e) => {
						pageSize = e;
						changeHooks();
					}
				"
				@prev-click="
					() => {
						currentPage--;
						changeHooks();
					}
				"
				@next-click="
					() => {
						currentPage++;
						changeHooks();
					}
				"
			>
			</el-pagination>
		</div>
	</div>
</template>

<script lang="ts">
import { createComponent } from "@vue/composition-api";
import { useCsv } from "../utils/useHooks";
import appFooter from "./footer.vue";
import appNav from "./nav.vue";

export default createComponent({
	name: "app-table",
	components: { appNav, appFooter },
	props: {
		popoverStatus: {
			type: Boolean,
			default: false,
		},
	},
	setup(_props, ctx) {
		const {
			root,
			width,
			label,
			csvFile,
			pageSize,
			useIndex,
			tableData,
			originData,
			searchMode,
			currentType,
			searchState,
			currentPage,
			changeMode,
			changeHooks,
		} = useCsv(ctx);

		return {
			width,
			label,
			csvFile,
			pageSize,
			useIndex,
			tableData,
			searchMode,
			currentType,
			searchState,
			currentPage,
			changeMode,
			changeHooks,
		};
	},
});
</script>

<style>
.right-trans {
	right: 10px;
}
</style>

<style lang="less" scoped>
.popover-card {
	margin-top: 5px;
	display: flex;
	flex-direction: column;
	align-items: center;
	.el-switch {
		margin: 10px 0px;
	}
	.el-input,
	.el-select {
		width: 95% !important;
		margin: 5px 5px !important;
	}
	.btn-list {
		width: 95%;
		margin: 5px 5px;
		display: flex;
		justify-content: space-between;
	}
}
.page-pagination {
	display: flex;
	justify-content: center;
	margin-top: 25px;
}
</style>
