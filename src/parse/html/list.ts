import * as cheerio from "cheerio";

/**
 * @private
 */
const PARENT_DIRECTORY_LINK = "../";

/**
 * @private
 */
const DIRECTORY_LINK_SELECTOR = "pre a";

/**
 * Parses a list of links from the default apache2 directory listing.
 *
 * @private
 * @param html Html of the directory list.
 * @return List of page entries
 */
const parseApacheDirectoryListing = (html: string): string[] => {
    const $ = cheerio.load(html);

    const links = $(DIRECTORY_LINK_SELECTOR)
        .map((_i, el) => $(el).text()) // Only use link text
        .get() as string[];
    return links.filter((text) => text !== PARENT_DIRECTORY_LINK); // Filter out link to parent directory;
};

export { parseApacheDirectoryListing };