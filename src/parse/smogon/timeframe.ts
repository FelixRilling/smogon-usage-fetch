import { arrMergingCollect } from "../../util/collectionUtil";

const TIMEFRAME_DELIMITER = "-";

const TIMEFRAME_ELEMENTS = 2;

const TIMEFRAME_INDEX_YEAR = 0;
const TIMEFRAME_INDEX_MONTH = 1;

interface ITimeframesData {
    combined: ICombinedTimeframeData[];
    full: ITimeframeData[];
}

interface ICombinedTimeframeData {
    year: string;
    months: string[];
}

interface ITimeframeData {
    year: string;
    month: string;
}

/**
 * Determines the data stored in a timeframe line.
 *
 * @private
 * @param timeframeLine Timeframe line to check.
 * @return Object containing year and months.
 */
const splitTimeframeLineData = (timeframeLine: string): ITimeframeData => {
    const split = timeframeLine.split(TIMEFRAME_DELIMITER);

    if (split.length !== TIMEFRAME_ELEMENTS) {
        throw new Error(
            `Not a valid timeframe: '${timeframeLine}', expecting exactly ${TIMEFRAME_ELEMENTS} sub-elements but got ${
                split.length
            }.`
        );
    }
    return {
        year: split[TIMEFRAME_INDEX_YEAR],
        month: split[TIMEFRAME_INDEX_MONTH]
    };
};

/**
 * Joins the sub-elements of a timeframe back together.
 *
 * @private
 * @param timeframe Timeframe to use.
 * @return Joined timeframe.
 */
const joinTimeframeLineData = (timeframe: ITimeframeData): string =>
    [timeframe.year, timeframe.month].join(TIMEFRAME_DELIMITER);

/**
 * Creates a merged list from a full list of timeframes.
 *
 * @public
 * @param timeframes Timeframe data to use.
 * @return List of combined timeframes.
 */
const createCombinedTimeframes = (
    timeframes: ITimeframeData[]
): ICombinedTimeframeData[] =>
    arrMergingCollect<ITimeframeData, ICombinedTimeframeData>(
        timeframes,
        timeframe => timeframe.year,
        ({ year }) => {
            return { year, months: [] };
        },
        ({ year, month }, combinedElement) => {
            if (!combinedElement.months.includes(month)) {
                combinedElement.months.push(month);
            }
        }
    );

/**
 * Maps a list of timeframe lines to a full and a combined timeframe list.
 *
 * @private
 * @param timeframeLines Timeframe lines to use.
 * @return Object containing full and combined timeframes.
 */
const mapTimeframes = (timeframeLines: string[]): ITimeframesData => {
    const full = timeframeLines.map(splitTimeframeLineData);
    const combined = createCombinedTimeframes(full);
    return { combined, full };
};

export {
    splitTimeframeLineData,
    joinTimeframeLineData,
    mapTimeframes,
    createCombinedTimeframes,
    ITimeframesData,
    ICombinedTimeframeData,
    ITimeframeData
};
