import { MultiFormatData } from "../parse/smogon/format";
import { TimeframeData } from "../parse/smogon/timeframe";
/**
 * Loads a list of all available formats for a given timeframe.
 *
 * @public
 * @param timeframe Timeframe to load.
 * @param useMonotype Optional, If monotype formats should be loaded instead of "normal" formats, defaults to false.
 * @param customBaseUrl Optional, prefixes the fetched URL with this base URL
 * @return List of formats.
 */
declare const fetchFormats: (timeframe: TimeframeData, useMonotype?: boolean, customBaseUrl?: string | undefined) => Promise<MultiFormatData>;
export { fetchFormats };
//# sourceMappingURL=formats.d.ts.map