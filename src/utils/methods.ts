export function deleteIndex(arr: any[], cutIndex: number[]): any[] {
	const result: any[] = [];
	arr.forEach((item, index) => {
		if (!cutIndex.includes(index)) {
			result.push(item);
		}
	});

	return result;
}

export function tryGlobalConfig(
	scopeName: string[],
	defaultValue: any,
	callback?: (...args: any[]) => any
) {
	let result: any = (window as any).$vutable;
	if (result === undefined) {
		return defaultValue;
	}
	for (let name of scopeName) {
		if (result[name] !== undefined) {
			result = result[name];
		} else {
			return defaultValue;
		}
	}
	if (callback) {
		callback();
	}
	return result;
}

export const isNumberForm = (value: string | number): value is number =>
	typeof value === "number" ? true : /^[0-9]+.?[0-9]*$/.test(value);
