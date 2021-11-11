"use strict"

import { AxiosError } from "axios";
import { Get, Route } from "tsoa";
import CharacterDataWrapper, { CharacterIds, CharacterReturn } from "../dto/models/marvel-character";
import { extractCharacterIds, toCharacterReturn } from "../helpers/helpers";
import { getCharacters, getCharacterById } from "../services/marvel-services";

@Route("marvel")
export default class MarvelController {
    @Get("/characters")
    public async getCharacters(): Promise<Array<number>> {
        let storedIds: CharacterIds = [];
        const limit = 100;
        let offset = 0;
        let start: boolean = true;
        let url = "";
        let data: CharacterDataWrapper = {};
        let cache: boolean = false;
        let cachedData: string;
        let currentEtag: string = "";

        currentEtag = await global.MarvelCache.getAsync(`etag|${offset}|${limit}`);
        console.log("etag", currentEtag);
        
        if (currentEtag && currentEtag !== "") {
            try {
                // first call
                data = await getCharacters(limit, offset, currentEtag);
            } catch(err) {
                if ((err as AxiosError).response?.status === 304) {
                    cache = true;
                } else {
                    cache = false;
                }
            }
            
        } else {
            try {
                data = await getCharacters(limit, offset);
                await global.MarvelCache.setAsync(`etag|${offset}|${limit}`, data.etag);
            } catch(err) {
                if ((err as AxiosError).response?.status === 304) {
                    cache = true;
                } else {
                    cache = false;
                }
            }
        }
        
        console.log("currentEtag", currentEtag);
        console.log("result etag", data.etag);
        console.log("cache", cache);

        while (start)  {
            try {
                const cachedDataName = `${offset}|${limit}`;
                console.log(url);
                console.log(offset, limit);
                
                if (cache) {
                    // get from cache
                    cachedData = await global.MarvelCache.getAsync(cachedDataName);
                    data = JSON.parse(cachedData);
                } else {
                    // get from api call
                    data = await getCharacters(limit, offset);
                }
                
                const ids = extractCharacterIds(data);
                console.log(ids);
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

        // return storedIds;
        return storedIds.map(({ id }) => id || 0);
    }

    @Get("/characters/{id}")
    public async getCharacterById(id: string): Promise<CharacterReturn> {
        let ping = await global.MarvelCache.getAsync("ping");
        console.log(ping);
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
}