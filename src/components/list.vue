<template>
	<div id="app-list">
		<!-- 弹框 -->
		<el-popover :value="popoverStatus" width="250" popper-class="right-trans">
			<div class="popover-card">
				<template v-if="searchMode.type === '[SORT]'">
					<el-switch
						v-model="state.sortMode"
						active-text="正序"
						inactive-text="倒序"
					>
					</el-switch>
				</template>
				<el-select
					v-model="state.mode"
					placeholder="请选择检索规则"
					@change="changeMode"
				>
					<el-option label="展示所有数据" :value="-1"> </el-option>
					<el-option
						v-for="item in search"
						:key="item.index"
						:label="
							item.type !== '[SORT]'
								? '在' + labelList[item.index] + '中查找'
								: '以' + labelList[item.index] + '来排序'
						"
						:value="item.index"
					>
					</el-option>
				</el-select>
				<template
					v-if="
						searchMode.type === '[VALUE]' ||
							searchMode.type === '[UNIQUE_VALUE]'
					"
				>
					<el-input
						v-model="state.input"
						:placeholder="
							'请输入' +
								labelList[state.mode] +
								(searchMode.type === '[UNIQUE_VALUE]'
									? ' (全字匹配)'
									: ' (部分匹配)')
						"
					></el-input>
				</template>
				<template v-if="searchMode.type === '[LIST]'">
					<el-select
						v-model="state.input"
						:placeholder="labelList[state.mode] + '检索列表'"
					>
						<el-option
							v-for="item in searchList"
							:key="item.key"
							:label="item.key"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</template>

				<div class="btn-list">
					<el-button
						@click="
							() => {
								state.input = '';
								state.mode = -1;
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
					v-if="useIndex"
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
					v-for="item in labelList"
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
					}
				"
				@size-change="
					(e) => {
						pageSize = e;
					}
				"
				@prev-click="currentPage--"
				@next-click="currentPage++"
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
					}
				"
				@size-change="
					(e) => {
						pageSize = e;
					}
				"
				@prev-click="currentPage--"
				@next-click="currentPage++"
			>
			</el-pagination>
		</div>
	</div>
</template>

<script lang="ts">
/* eslint-disable */
import {
	createComponent,
	ref,
	reactive,
	computed,
	watch,
	onUnmounted,
} from "@vue/composition-api";
import { arrayToJson } from "rexine";
import { getCsvFile } from "../services/fetch";
import { deleteIndex, tryGlobalConfig, isNumberForm } from "../utils/methods";
import { useWindow } from "../utils/useHooks";
import appFooter from "./footer.vue";
import appNav from "./nav.vue";

export default createComponent({
	name: "app-list",
	components: { appNav, appFooter },
	props: {
		popoverStatus: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		const pageSize = ref(10);
		const currentPage = ref(1);
		const useIndex = ref(false);
		const { width } = useWindow();
		const rowConfig = ref([] as any[]);
		const sourceData = ref([] as any[]);
		const labelList = ref([] as string[]);

		const state = reactive({
			mode: -1,
			input: "",
			sortMode: true,
		});

		const searchMode = computed(
			() =>
				search.value.filter((item) => item.index === state.mode)[0] || {
					index: -1,
					type: "[DEFAULT]",
				}
		);

		const search = computed(() => {
			const result: Array<{ index: number; type: string }> = [];
			rowConfig.value.forEach((item, index) => {
				if (item === null || item === 0) {
					return;
				}

				if (typeof item === "string" || typeof item === "number") {
					return result.push({
						index,
						type: item === "[=]" ? "[UNIQUE_VALUE]" : "[VALUE]",
					});
				}

				if (typeof item === "boolean") {
					return result.push({
						index,
						type: "[SORT]",
					});
				}

				if (Array.isArray(item)) {
					return result.push({
						index,
						type: "[LIST]",
					});
				}
			});
			return result;
		});

		const searchList = computed(() => {
			const result: Array<{
				key: string | number;
				value: string | number;
			}> = [];

			if (Array.isArray(rowConfig.value[state.mode])) {
				rowConfig.value[state.mode].forEach((item: any) => {
					if (typeof item === "string" || typeof item === "number") {
						result.push({
							key: item,
							value: item,
						});
					} else if (
						(typeof item[0] === "string" || typeof item[0] === "number") &&
						(typeof item[1] === "string" || typeof item[1] === "number")
					) {
						result.push({
							value: item[0],
							key: item[1],
						});
					}
				});
			}
			return result;
		});
		const tableData = computed(() => {
			return sourceData.value
				.filter((item) => {
					const value = item[labelList.value[searchMode.value.index]];

					if (
						searchMode.value.index === -1 ||
						searchMode.value.type === "[SORT]"
					) {
						return true;
					}

					if (searchMode.value.type === "[VALUE]") {
						return String(value).includes(String(state.input));
					}

					if (
						searchMode.value.type === "[LIST]" ||
						searchMode.value.type === "[UNIQUE_VALUE]"
					) {
						return String(state.input).length === 0
							? true
							: String(value) === String(state.input);
					}

					return false;
				})
				.sort((a, b) => {
					if (searchMode.value.type !== "[SORT]") {
						return 1;
					}
					const A = a[labelList.value[searchMode.value.index]];
					const B = b[labelList.value[searchMode.value.index]];
					return sortMethod(A, B);
				});
		});

		const watchPages = watch(
			[() => state.input],
			() => {
				currentPage.value = 1;
			},
			{
				lazy: true,
			}
		);

		onUnmounted(() => {
			watchPages();
		});

		function sortMethod(a: string | number, b: string | number): number {
			const flag = state.sortMode ? 1 : -1;
			const A = isNumberForm(a) ? Number(a) : a.length;
			const B = isNumberForm(b) ? Number(b) : b.length;
			return flag * (B - A);
		}

		function changeMode() {
			if (searchMode.value.type !== "[SORT]") {
				return (state.input = "");
			}

			if (searchMode.value.type === "[SORT]") {
				return (state.sortMode = rowConfig.value[searchMode.value.index]);
			}
		}

		function dealData(res: string[][]) {
			let slicelen = 2;
			const cutIndex: number[] = [];
			if (tryGlobalConfig(["config", "label"], false)) slicelen--;
			if (tryGlobalConfig(["config", "rowData"], false)) slicelen--;

			rowConfig.value = tryGlobalConfig(
				["config", "rowData"],
				(() => {
					try {
						return res[0].map((v) => eval(v.trim().replace(/\|/g, ",")));
					} catch (e) {
						return [];
					}
				})()
			);

			labelList.value = tryGlobalConfig(
				["config", "label"],
				res[slicelen === 2 ? 1 : 0]
			);

			if (labelList.value[0].includes("[#]")) {
				useIndex.value = true;
				labelList.value[0] = labelList.value[0].replace("[#]", "");
			}

			labelList.value.forEach((item, index) => {
				if (item.includes("[X]")) {
					cutIndex.push(index);
				}
			});
			labelList.value = deleteIndex(labelList.value, cutIndex);
			rowConfig.value = deleteIndex(rowConfig.value, cutIndex);
			sourceData.value = arrayToJson(
				res.map((item) => deleteIndex(item, cutIndex)).slice(slicelen),
				labelList.value
			);
		}

		(function created() {
			(async () => {
				const res = await getCsvFile(
					tryGlobalConfig(["csv"], "./data.csv")
				);
				dealData(res);
			})();
		})();

		return {
			state,
			width,
			search,
			useIndex,
			pageSize,
			labelList,
			tableData,
			rowConfig,
			changeMode,
			searchMode,
			searchList,
			currentPage,
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
