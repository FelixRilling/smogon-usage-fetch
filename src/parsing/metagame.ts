import { isBlank } from "lightdash";
import { getMatchGroup } from "./util/regex";
import { convertFrequency } from "./util/frequency";
import type { Metagame } from "../model/metagame";

/**
 * Converts a line in the format "foo 12%" to a pair of name and frequency.
 *
 * @internal
 * @param str String to use.
 * @param paddingRegex Optional regex to use for padding checking.
 * @return Frequency pair.
 */
const convertFrequencyPair = (
	str: string,
	paddingRegex = /(\s+)\d/
): [string, number] => {
	const padding = getMatchGroup(str, paddingRegex, 0);
	const splitStr = str.split(padding);

	const name = splitStr[0].trim();
	const frequency = convertFrequency(splitStr[1]);
	return [name, frequency];
};

/**
 * @internal
 */
const STALLINESS_MEAN_REGEX = / Stalliness \(mean: (-?[\d.]+)/;

/**
 * @internal
 */
const STALLINESS_ONE_REGEX = / one # = {2}(-?[\d.]+%)/;

/**
 * Parses a smogon metagame page.
 *
 * @internal
 * @param page Page to parse.
 * @return parsed page.
 */
export const metagameFromString = (page: string): Metagame => {
	const rows = page.split("\n");
	const separatorIndex = rows.findIndex(isBlank);

	if (separatorIndex === -1) {
		throw new Error("Could not parse Metagame page.");
	}

	const styleRows = rows.slice(0, separatorIndex);
	const stallinessMeanRow = rows[separatorIndex + 1];
	const stallinessOneRow = rows[rows.length - 2];

	return {
		style: new Map<string, number>(
			styleRows.map((row) => convertFrequencyPair(row, /(\.+\s*)\d/))
		),
		stalliness: {
			mean: Number(
				getMatchGroup(stallinessMeanRow, STALLINESS_MEAN_REGEX, 1)
			),
			one: convertFrequency(
				getMatchGroup(stallinessOneRow, STALLINESS_ONE_REGEX, 1)
			),
		},
	};
};
