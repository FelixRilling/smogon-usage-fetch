import { request } from "../http/request";
import { IndividualFormatData } from "../parse/smogon/format";
import { MetagameData, parseMetagamePage } from "../parse/smogon/page/metagame";
import { IndividualTimeframeData } from "../parse/smogon/timeframe";
import { ApiPath, FileType, UrlBuilder } from "../http/UrlBuilder";

/**
 * Loads metagame data for the given timeframe and format.
 *
 * @public
 * @param timeframe Timeframe to load.
 * @param format Format to load.
 * @param customBaseUrl Optional, prefixes the fetched URL with this base URL
 * @return Metagame data.
 */
const fetchMetagame = async (
    timeframe: IndividualTimeframeData,
    format: IndividualFormatData,
    customBaseUrl?: string
): Promise<MetagameData> => {
    const urlBuilder = new UrlBuilder();

    if (customBaseUrl) {
        urlBuilder.setCustomBaseUrl(customBaseUrl);
    }

    const url = urlBuilder
        .setPath(ApiPath.METAGAME)
        .setFileType(FileType.TEXT)
        .setTimeframe(timeframe)
        .setFormat(format)
        .build();
    const response = await request<string>(url, FileType.TEXT);
    return parseMetagamePage(response.data);
};

export { fetchMetagame };
