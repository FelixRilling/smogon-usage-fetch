import fetch from "node-fetch";
import { URL_STATS } from "../constants";
import { parseList } from "../parse/list";
import { isFile, removeExtension } from "../util/strUtil";
import { checkStatus, urlJoin } from "../util/httpUtil";

/**
 * Loads a list of all available formats for a given timeframe.
 *
 * @return List of format names.
 */
const fetchFormats = async (timeframe: string): Promise<string[]> =>
    fetch(urlJoin(URL_STATS, timeframe))
        .then(checkStatus)
        .then(res => res.text())
        .then(html =>
            parseList(html)
                .filter(isFile)
                .map(removeExtension)
        );

export { fetchFormats };