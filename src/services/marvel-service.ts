import path from "path";
import axios from "axios";
import CharacterDataWrapper from "../dto/models/marvel-character";
import { Service } from "typedi";

const md5 = require("md5");
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "..", "config");
const config = require("config");
const marvelConfig = config.get("marvelConfig");

const hash = md5(`${marvelConfig.ts}${marvelConfig.privateKey}${marvelConfig.publicKey}`);

@Service()
class MarvelService {
    constructor() {}

    async getCharacters(limit: number, offset: number, ifNoneMatch?: string): Promise<CharacterDataWrapper> {
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
            console.log(wrapper.code);
            
            return wrapper;
        } catch (error) {
            throw error;
        }
    }

    async getCharacterById(id: string): Promise<CharacterDataWrapper> {
        const url = `${marvelConfig.url}characters/${id}?apikey=${marvelConfig.publicKey}&hash=${hash}&ts=${marvelConfig.ts}`;
        const { data } = await axios.get(url);

        const wrapper: CharacterDataWrapper = data;
        const etag = await global.MarvelCache.getAsync("etag");
        console.log(etag);
        await global.MarvelCache.setAsync(`${wrapper.etag}_${id}`, JSON.stringify(wrapper));

        return wrapper;
    }
}

// module.exports = MarvelService;
export default MarvelService;