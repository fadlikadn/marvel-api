import { Get, Route } from "tsoa";
import CharacterDataWrapper, { CharacterIds, CharacterReturn, extractCharacterIds, toCharacterReturn } from "../dto/models/marvel-character";
import { getCharacters, getCharacterById } from "../services/marvel-services";

@Route("marvel")
export default class MarvelController {
    @Get("/characters")
    public async getCharacters(): Promise<CharacterIds> {
        let storedIds: CharacterIds = [];
        const limit = 100;
        let offset = 0;
        let start: boolean = true;
        let url = "";

        while (start)  {
            try {
                console.log(url);
                console.log(offset, limit);
                const data: CharacterDataWrapper = await getCharacters(limit, offset);
                const ids = extractCharacterIds(data);
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
    }

    @Get("/characters/{id}")
    public async getCharacterById(id: string): Promise<CharacterReturn> {
        try {
            const data: CharacterDataWrapper = await getCharacterById(id);
            const convertedData = toCharacterReturn(data);
            return convertedData;
        } catch (err) {
            console.log(err);
            const errResult: CharacterReturn = {};
            return errResult;
        }
    }

    // @Get("/hash")
    // public async getHash(): Promise<MarvelResponse> {
    //     const hash: string = md5(`abcde${marvelConfig.privateKey}${marvelConfig.publicKey}`);
    //     return {
    //         message: hash,
    //     };
    // }
}