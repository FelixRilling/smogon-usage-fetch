import { getMatchGroup } from "./util/regex";
import { convertFrequency } from "./util/frequency";
import { parseMarkdownTable } from "./table";
import type { Usage, Usages } from "../model/usages";

/**
 * Extracts usage data from Markdown table.
 *
 * @internal
 * @param table Markdown table.
 * @return Usage data items.
 */
const parseUsageTable = (table: string): Usage[] =>
	parseMarkdownTable(table, 7).rows.map((row) => {
		return {
			rank: Number(row[0]),
			pokemon: row[1],
			usagePercentage: convertFrequency(row[2]),
			raw: Number(row[3]),
			rawPercentage: convertFrequency(row[4]),
			real: Number(row[5]),
			realPercentage: convertFrequency(row[6]),
		};
	});

/**
 * @internal
 */
const USAGE_TOTAL_REGEX = /Total battles: (-?\d+)/;

/**
 * @internal
 */
const USAGE_WEIGHT_REGEX = /Avg\. weight\/team: (-?[\d.]+)/;

/**
 * Parses a smogon usage page.
 *
 * @internal
 * @param page Page to parse.
 * @return parsed page.
 */
export const usageFromString = (page: string): Usages => {
	const rows = page.split("\n");
	const totalRow = rows[0];
	const weightRow = rows[1];
	const table = rows.slice(2).join("\n");

	return {
		total: Number(getMatchGroup(totalRow, USAGE_TOTAL_REGEX, 1)),
		weight: Number(getMatchGroup(weightRow, USAGE_WEIGHT_REGEX, 1)),
		data: parseUsageTable(table),
	};
};
