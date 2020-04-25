import {
	Ref,
	ref,
	onMounted,
	onUnmounted,
	watch,
	reactive,
	computed,
	SetupContext,
} from "@vue/composition-api";
import { arrayToJson } from "rexine";
import { getCsvFile } from "../services/fetch";
import { tryGlobalConfig, remainIndex, isNumberForm } from "./methods";

export function useWindow(): {
	width: Ref<number>;
	height: Ref<number>;
} {
	const width = ref(0);
	const height = ref(0);
	const resizeAction = () => {
		return (() => {
			width.value = document.body.clientWidth;
			height.value = document.body.clientHeight;
		})();
	};
	onMounted(() => {
		width.value = document.body.clientWidth;
		height.value = document.body.clientHeight;
		window.addEventListener("resize", resizeAction);
	});

	onUnmounted(() => {
		window.removeEventListener("resize", resizeAction);
	});

	return { width, height };
}

export function useCsv(ctx: SetupContext) {
	const pageSize = ref(10);
	const currentPage = ref(1);
	const { width } = useWindow();
	const label = ref([] as string[]);
	const originData = ref([] as any[]);

	const root = tryGlobalConfig([], null);
	const onload = tryGlobalConfig(["onload"], null);
	const setLabel = tryGlobalConfig(["label"], null);
	const useIndex = tryGlobalConfig(["index"], false);
	const useCols = tryGlobalConfig(["useCols"], null);
	const onChange = tryGlobalConfig(["onChange"], null);
	const csvFile = tryGlobalConfig(["csv"], "./data.csv");
	const beforeInit = tryGlobalConfig(["beforeInit"], null);

	const searchMode = computed(() => {
		const result: {
			index?: number;
			value: any;
			type: string;
			originIndex: number;
		}[] = [];
		const mode = tryGlobalConfig(["searchMode"], null);

		if (mode === null) {
			return null;
		}
		(mode as any[]).forEach((item, index) => {
			if (item === null) {
				result.push({
					originIndex: index,
					value: null,
					type: "[NULL]",
				});
			} else if (typeof item === "boolean") {
				result.push({
					originIndex: index,
					value: item,
					type: "[SORT]",
				});
			} else if (typeof item === "string") {
				result.push({
					originIndex: index,
					value: item,
					type: item === "[=]" ? "[EQL_VAL]" : "[VAL]",
				});
			} else if (Array.isArray(item)) {
				let value: {
					key: string;
					val: string;
				}[] = [];

				if (item[0].key !== undefined && item[0].val !== undefined) {
					value = item;
				} else {
					(item as string[]).forEach((val) =>
						value.push({
							key: val,
							val,
						})
					);
				}
				result.push({
					originIndex: index,
					value,
					type: "[LIST]",
				});
			} else {
				result.push({
					originIndex: index,
					value: null,
					type: "[UNKNOWN]",
				});
			}
		});

		return remainIndex(result, useCols).map((item, index) => ({
			...item,
			index,
		}));
	});

	const currentType = computed(() => {
		if (searchState.mode === -1 || searchMode.value === null) {
			return "[UNKNOWN]";
		} else {
			return searchMode.value[searchState.mode].type;
		}
	});

	const tableData = computed(() => {
		return originData.value
			.filter((item) => {
				const value = item[label.value[searchState.mode]];

				if (
					searchState.mode === -1 ||
					searchMode.value === null ||
					currentType.value.indexOf("[SORT]") === 0
				) {
					return true;
				}

				if (currentType.value.indexOf("[VAL]") === 0) {
					return String(value).includes(String(searchState.input));
				}

				if (
					currentType.value.indexOf("[LIST]") === 0 ||
					currentType.value.indexOf("[EQL_VAL]") === 0
				) {
					return String(searchState.input).length === 0
						? true
						: String(value) === String(searchState.input);
				}

				return false;
			})
			.sort((a, b) => {
				if (
					searchMode.value === null ||
					currentType.value.indexOf("[SORT]") !== 0
				) {
					return 1;
				}
				const A = a[label.value[searchMode.value[searchState.mode].index]];
				const B = b[label.value[searchMode.value[searchState.mode].index]];
				return sortMethod(A, B);
			});
	});

	const searchState = reactive({
		mode: -1,
		input: "",
		sortMode: true,
	});

	const watchPages = watch(
		[() => searchState.input],
		() => {
			currentPage.value = 1;
			changeHooks();
		},
		{
			lazy: true,
		}
	);

	onUnmounted(() => {
		watchPages();
	});

	function changeMode() {
		changeHooks();
		if (currentType.value.indexOf("[SORT]") !== 0) {
			return (searchState.input = "");
		}

		if (
			currentType.value.indexOf("[SORT]") === 0 &&
			searchMode.value !== null
		) {
			return (searchState.sortMode = searchMode.value[searchState.mode].value);
		}
	}

	function sortMethod(a: string | number, b: string | number): number {
		const flag = searchState.sortMode ? 1 : -1;
		const A = isNumberForm(a) ? Number(a) : a.length;
		const B = isNumberForm(b) ? Number(b) : b.length;
		return flag * (A - B);
	}

	function changeHooks() {
		const $hooks = {
			root,
			width: width.value,
			pageSize: pageSize.value,
			tableData: tableData.value,
			searchMode: searchMode.value,
			originData: originData.value,
			currentType: currentType.value,
			currentPage: currentPage.value,
		};

		root.hooks = $hooks;

		if (onChange !== null) {
			try {
				onChange($hooks);
			} catch (err) {
				throw err;
			}
		}
	}

	function vutableInit(data: string[][]) {
		label.value = setLabel !== null ? setLabel : data[0];
		

		if (useCols !== null && typeof useCols[0] === "number") {
			label.value = remainIndex(label.value, useCols);
		}

		label.value = label.value.map((item) => item.trim());

		originData.value = arrayToJson(
			data
				.map((item) => remainIndex(item, useCols))
				.slice(setLabel !== null ? 0 : 1),
			label.value
		);

		if (root) {
			const $hooks = {
				root,
				width: width.value,
				pageSize: pageSize.value,
				tableData: tableData.value,
				searchMode: searchMode.value,
				originData: originData.value,
				currentType: currentType.value,
				currentPage: currentPage.value,
			};

			root.hooks = $hooks;

			if (onload !== null) {
				try {
					onload(root.hooks);
				} catch (err) {
					throw err;
				}
			}
		}
	}

	(async () => {
		const data = await getCsvFile(csvFile).catch(err => {
			ctx.root.$message.error(`来源 ${csvFile} 加载数据失败`)
		});
		
		if (beforeInit !== null) {
			try {
				beforeInit(data);
			} catch (err) {
				throw err;
			}
		}
		vutableInit(data as string[][]);
	})();

	return {
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

		// functions
		changeMode,
		changeHooks
	};
}
