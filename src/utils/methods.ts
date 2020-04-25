export function remainIndex(arr: any[], remainIndex: number[]): any[] {
	if (!remainIndex || remainIndex.length === 0) {
		return arr;
	}
	const result: any[] = [];
	for (let index = 0; index < arr.length; index++) {
		if (remainIndex.includes(index)) {
			result.push(arr[index]);
		}
	}

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

	if (scopeName.length === 0) {
		return result;
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
