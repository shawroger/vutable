import { Ref, ref, onMounted, onUnmounted, toRefs } from "@vue/composition-api";

/*
	useWindow
*/
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

/*
	useStyles
*/
interface UseStyles {
	[key: string]: string;
}
function useStylesAsCreated(styles: string): Ref<UseStyles> {
	let stylesObject: UseStyles = {};

	const toHump = (str: string) =>
		str.replace(/-(\w)/g, (_, val) => val.toUpperCase());
	const stylesArr = styles
		.split(";")
		.map(v => v.replace(/[\r\n]/g, "").replace(/\s+/g, ""))
		.filter(v => v.length > 0)
		.map(v => toHump(v));
	stylesArr.forEach(v => {
		const styleFragment = v.split(":");
		const key = styleFragment[0];
		const val = styleFragment[1];
		stylesObject[key] = val;
	});
	return ref(stylesObject);
}

function useStylesAsChanged(styles: Ref<UseStyles>, newStyles: string): void {
	const newStylesArr = useStylesAsCreated(newStyles).value;
	styles.value = { ...styles.value, ...newStylesArr };
}

export function useStyles(styles: string): Ref<UseStyles>;
export function useStyles(styles: Ref<UseStyles>, newStyles: string): void;
export function useStyles(styles: string | Ref<UseStyles>, newStyles?: string) {
	if (arguments.length === 1) {
		return useStylesAsCreated(styles as string);
	} else {
		return useStylesAsChanged(styles as Ref<UseStyles>, newStyles!);
	}
}

/*
	useKeyup
*/

export function useKeyup(keyCode: number | string, callback?: any) {
	const keyupAction = (e: { keyCode: number; key: string }) => {
		if (e.keyCode === keyCode || e.key === keyCode) {
			if (callback) {
				callback();
			}
		}
	};
	onMounted(() => {
		window.addEventListener("keyup", keyupAction);
	});

	onUnmounted(() => {
		window.removeEventListener("keyup", keyupAction);
	});
}

/*
	useScript 
*/

export function useScript(params: {
	src?: string;
	text?: string;
}): void {
	function loadScriptBySrc(link: string) {
		let script = document.createElement("script");
		script.type = "text/javascript";
		script.src = link;
		document.getElementsByTagName("head")[0].appendChild(script);
	}

	function loadScriptByText(text: string) {
		let script = document.createElement("script");
		script.type = "text/javascript";
		script.text = text;
		document.getElementsByTagName("head")[0].appendChild(script);
	}

	onMounted(() => {
		if(params.src) {
			loadScriptBySrc(params.src);
		}

		if(params.text) {
			loadScriptByText(params.text);
		}
	});
}

export function useCountDown(target: string, useFullDay: boolean = true) {
	let timeHandler: number;
	const targetDate = new Date(target).getTime();

	const monthAddToDay = (month: number) => {
		let result: number = 0;
		const monthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		for (let i = 0; i < month; i++) {
			result += monthDays[i];
		}

		return result;
	};
	const compareDate = () => {
		const today = new Date().getTime();
		const compareTime = new Date(targetDate - today);
		return {
			month: compareTime.getMonth() + 1,
			day: useFullDay
				? monthAddToDay(compareTime.getMonth()) + compareTime.getDate() -1
				: compareTime.getDate(),
			hour: compareTime.getDate(),
			minute: compareTime.getMinutes(),
			second: compareTime.getSeconds()
		};
	};

	const countDown = reactive({
		month: 0,
		day: 0,
		hour: 0,
		minute: 0,
		second: 0
	});

	onMounted(() => {
		timeHandler = setInterval(() => {
			const getCompareDate = compareDate();
			countDown.month = getCompareDate.month;
			countDown.day = getCompareDate.day;
			countDown.hour = getCompareDate.hour;
			countDown.minute = getCompareDate.minute;
			countDown.second = getCompareDate.second;
		});
	});

	onUnmounted(() => {
		clearInterval(timeHandler);
	});

	return {
		...toRefs(countDown)
	};
}
