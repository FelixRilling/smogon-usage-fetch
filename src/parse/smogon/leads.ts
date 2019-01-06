import { removeTrailing } from "../../util/strUtil";
import { getGroupMatchAsNumber } from "../../util/regexUtil";
import {
    HeaderPrettyName,
    ISmogonTableData,
    parseSmogonTable,
    PERCENTAGE_UNIT,
    tableLayout
} from "./table";

const LEADS_TOTAL_REGEX = /Total leads: (\d+)/;

const LEADS_TABLE_LAYOUT: tableLayout = [
    { name: HeaderPrettyName.RANK, converter: str => Number(str) },
    { name: HeaderPrettyName.POKEMON, converter: str => str },
    {
        name: HeaderPrettyName.USAGE_PERCENTAGE,
        converter: str => Number(removeTrailing(str, PERCENTAGE_UNIT))
    },
    { name: HeaderPrettyName.USAGE_RAW, converter: str => Number(str) },
    {
        name: HeaderPrettyName.USAGE_RAW_PERCENTAGE,
        converter: str => Number(removeTrailing(str, PERCENTAGE_UNIT))
    }
];

interface ILeadsPageData {
    total: number;
    data: ISmogonTableData;
}

/**
 * Parses a smogon leads page.
 *
 * @param page Page to parse.
 * @return parsed page.
 */
const parseLeadsPage = (page: string): ILeadsPageData => {
    const rows = page.split("\n");
    const totalRow = rows[0];
    const tableRows = rows.slice(1);

    return {
        total: getGroupMatchAsNumber(totalRow, LEADS_TOTAL_REGEX, 1),
        data: parseSmogonTable(tableRows.join("\n"), LEADS_TABLE_LAYOUT)
    };
};

export { parseLeadsPage, ILeadsPageData };