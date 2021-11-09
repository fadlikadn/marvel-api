import { Get, Route } from "tsoa";
const md5 = require("md5");
import path from "path";
import axios from "axios";
import CharacterDataWrapper, { MarvelResponse } from "../src/dto/models/marvel-character";

process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "../src/", "config");
const config = require("config");
const marvelConfig = config.get("marvelConfig");

@Route("marvel")
export default class MarvelController {
    @Get("/characters")
    public async getCharacters(): Promise<CharacterDataWrapper> {
        const hash = md5(`${marvelConfig.ts}${marvelConfig.privateKey}${marvelConfig.publicKey}`);
        const url = `${marvelConfig.url}characters?apikey=${marvelConfig.publicKey}&hash=${hash}&ts=${marvelConfig.ts}`;
        try {
            const { data } = await axios.get(url);
            return data;
        } catch (err) {
            console.log(err);
            const errResult: CharacterDataWrapper = {
                code: 500,
            };
            return errResult;
        }
    }

    @Get("/characters/{id}")
    public async getCharacterById(id: string): Promise<CharacterDataWrapper> {
        const hash = md5(`${marvelConfig.ts}${marvelConfig.privateKey}${marvelConfig.publicKey}`);
        const url = `${marvelConfig.url}characters/${id}?apikey=${marvelConfig.publicKey}&hash=${hash}&ts=${marvelConfig.ts}`;
        try {
            const { data } = await axios.get(url);
            return data;
        } catch (err) {
            console.log(err);
            const errResult: CharacterDataWrapper = {
                code: 500,
            };
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