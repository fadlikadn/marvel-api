import path from "path";
import axios from "axios";
import CharacterDataWrapper from "../dto/models/marvel-character";
const md5 = require("md5");
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "..", "config");
const config = require("config");
const marvelConfig = config.get("marvelConfig");

const hash = md5(`${marvelConfig.ts}${marvelConfig.privateKey}${marvelConfig.publicKey}`);

export const getCharacters = async (limit: number, offset: number, ifNoneMatch?: string) => {
    const url = `${marvelConfig.url}characters?apikey=${marvelConfig.publicKey}&hash=${hash}&ts=${marvelConfig.ts}&limit=${limit}&offset=${offset}`;

    let customHeaders = {};

    if (ifNoneMatch) {
        customHeaders = {
            "If-None-Match": ifNoneMatch
        };
    }

    try {
        const { data } = await axios.get(url, {
            headers: customHeaders,
        });
        const wrapper: CharacterDataWrapper = data;
        if (wrapper.code !== 304) {
            await global.MarvelCache.setAsync(`${offset}|${limit}`, JSON.stringify(wrapper));
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

export const getCharacterById = async (id: string) => {
    const url = `${marvelConfig.url}characters/${id}?apikey=${marvelConfig.publicKey}&hash=${hash}&ts=${marvelConfig.ts}`;
    const { data } = await axios.get(url);

    const wrapper: CharacterDataWrapper = data;
    const etag = await global.MarvelCache.getAsync("etag");
    console.log(etag);
    await global.MarvelCache.setAsync(`${wrapper.etag}_${id}`, JSON.stringify(wrapper));

    return data;
}
