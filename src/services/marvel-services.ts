import path from "path";
import axios from "axios";
import CharacterDataWrapper from "../dto/models/marvel-character";
const md5 = require("md5");
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "..", "config");
const config = require("config");
const marvelConfig = config.get("marvelConfig");
const redisConfig = config.get("redisConfig");

const hash = md5(`${marvelConfig.ts}${marvelConfig.privateKey}${marvelConfig.publicKey}`);

export const getCharacters = async (limit: number, offset: number) => {
    const url = `${marvelConfig.url}characters?apikey=${marvelConfig.publicKey}&hash=${hash}&ts=${marvelConfig.ts}&limit=${limit}&offset=${offset}`;
    const { data } = await axios.get(url);
    return data;
}

export const getCharacterById = async (id: string) => {
    const url = `${marvelConfig.url}characters/${id}?apikey=${marvelConfig.publicKey}&hash=${hash}&ts=${marvelConfig.ts}`;
    const { data } = await axios.get(url);
    return data;
}
