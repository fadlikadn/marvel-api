import { Get, Route } from "tsoa";
import path from "path";
import axios from "axios";
import CharacterDataWrapper, { CharacterIds, CharacterReturn, extractCharacterIds, MarvelResponse, toCharacterReturn } from "../src/dto/models/marvel-character";

const md5 = require("md5");
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "../src/", "config");
const config = require("config");
const marvelConfig = config.get("marvelConfig");

@Route("marvel")
export default class MarvelController {
    @Get("/characters")
    public async getCharacters(): Promise<CharacterIds> {
        const hash = md5(`${marvelConfig.ts}${marvelConfig.privateKey}${marvelConfig.publicKey}`);
        let storedIds: CharacterIds = [];
        const limit = 100;
        let offset = 0;
        let start: boolean = true;
        let url = "";

        while (start)  {
            url = `${marvelConfig.url}characters?apikey=${marvelConfig.publicKey}&hash=${hash}&ts=${marvelConfig.ts}&limit=${limit}&offset=${offset}`;
            try {
                console.log(url);
                console.log(offset, limit);
                const { data } = await axios.get(url);
                const ids = extractCharacterIds(data as CharacterDataWrapper);
                console.log(ids.length);
                storedIds = [
                    ...storedIds,
                    ...ids,
                ];
                offset += ids.length;
                if (ids.length < 100) {
                    start = false;
                }
            } catch (err) {
                console.log(err);
                start = false;
            }
        }

        return storedIds;

        // try {
        //     const { data } = await axios.get(url);
        //     const ids = extractCharacterIds(data as CharacterDataWrapper);
        //     return ids;
        // } catch (err) {
        //     console.log(err);
        //     const errResult: CharacterIds = [];
        //     return errResult;
        // }
    }

    @Get("/characters/{id}")
    public async getCharacterById(id: string): Promise<CharacterReturn> {
        const hash = md5(`${marvelConfig.ts}${marvelConfig.privateKey}${marvelConfig.publicKey}`);
        const url = `${marvelConfig.url}characters/${id}?apikey=${marvelConfig.publicKey}&hash=${hash}&ts=${marvelConfig.ts}`;
        try {
            const { data } = await axios.get(url);
            const convertedData = toCharacterReturn(data as CharacterDataWrapper);
            return convertedData;
        } catch (err) {
            console.log(err);
            const errResult: CharacterReturn = {};
            return errResult;
        }
    }

    @Get("/hash")
    public async getHash(): Promise<MarvelResponse> {
        const hash: string = md5(`abcde${marvelConfig.privateKey}${marvelConfig.publicKey}`);
        return {
            message: hash,
        };
    }
}