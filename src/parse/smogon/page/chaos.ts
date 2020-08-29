import { toMap, toMapBy } from "lightdash";

/**
 * @private
 */
interface RawPokemon {
    Moves: {
        [key: string]: number;
    };
    "Checks and Counters": {
        [key: string]: [number, number, number];
    };
    Abilities: { [key: string]: number };
    Teammates: { [key: string]: number };
    usage: number;
    Items: { [key: string]: number };
    "Raw count": number;
    Spreads: { [key: string]: number };
    Happiness: { [key: string]: number };
    "Viability Ceiling": [number, number, number, number];
}

/**
 * @private
 */
interface RawChaos {
    info: {
        "team type": null;
        cutoff: number;
        "cutoff deviation": number;
        metagame: string;
        "number of battles": number;
    };
    data: {
        [key: string]: RawPokemon;
    };
}

/**
 * @public
 */
interface Spread {
    nature: string;
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
}

/**
 * @public
 */
interface Pokemon {
    usage: number;
    rawCount: number;
    moves: Map<string, number>;
    abilities: Map<string, number>;
    items: Map<string, number>;
    spreads: Map<Spread, number>;
    happiness: Map<number, number>;
    teammates: Map<string, number>;
    checksAndCounters: Map<string, [number, number, number]>;
    viabilityCeiling: [number, number, number, number];
}

/**
 * @public
 */
interface Chaos {
    info: {
        teamType: null;
        cutoff: number;
        cutoffDeviation: number;
        metagame: string;
        numberOfBattles: number;
    };
    data: Map<string, Pokemon>;
}

/**
 * @private
 */
const mapSpread = (spreadKey: string): Spread => {
    const [nature, hp, atk, def, spa, spd, spe] = spreadKey.split("/");
    return {
        nature,
        hp: Number(hp),
        atk: Number(atk),
        def: Number(def),
        spa: Number(spa),
        spd: Number(spd),
        spe: Number(spe),
    };
};

/**
 * @private
 */
const mapPokemonData = (rawPokemonData: RawPokemon): Pokemon => {
    return {
        usage: rawPokemonData.usage,
        rawCount: rawPokemonData["Raw count"],
        moves: toMap(rawPokemonData.Moves),
        abilities: toMap(rawPokemonData.Abilities),
        items: toMap(rawPokemonData.Items),
        spreads: toMapBy(
            rawPokemonData.Spreads,
            (key) => mapSpread(key),
            (_key, val) => val
        ),
        happiness: toMapBy(
            rawPokemonData.Spreads,
            (key) => Number(key),
            (_key, val) => val
        ),
        teammates: toMap(rawPokemonData.Teammates),
        checksAndCounters: toMap(rawPokemonData["Checks and Counters"]),
        viabilityCeiling: rawPokemonData["Viability Ceiling"],
    };
};

/**
 * @private
 */
const mapChaosData = (rawChaosData: RawChaos): Chaos => {
    return {
        info: {
            teamType: rawChaosData.info["team type"],
            cutoff: rawChaosData.info.cutoff,
            cutoffDeviation: rawChaosData.info["cutoff deviation"],
            metagame: rawChaosData.info.metagame,
            numberOfBattles: rawChaosData.info["number of battles"],
        },
        data: toMapBy(
            rawChaosData.data,
            (key) => key,
            (_key, val) => mapPokemonData(val)
        ),
    };
};

export { Spread, Chaos, Pokemon, RawChaos, mapChaosData };
