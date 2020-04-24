import axios, { AxiosResponse } from "axios";
import { csvToArray } from "rexine";

export async function getCsvFile(fileAddress: string) {
	const res = await axios.get(fileAddress);
	return csvToArray(res.data);
}

