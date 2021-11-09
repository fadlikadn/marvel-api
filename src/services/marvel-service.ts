"use strict";

const _ = require("lodash");
import path from "path";
import axios from "axios";
import { Get, Route } from "tsoa";
import AppError from "../dto/responses/app-error";

const CustomResponse = require("./../dto/responses/response");

process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "..", "config");
const config = require("config");
const marvelConfig = config.get("marvelConfig");

const marvelServiceUrl = marvelConfig.url;
axios.defaults.baseURL = `${marvelServiceUrl}v1/public`;

@Route("characters")
class MarvelService {
    constructor() {}

    /**
     * Get character by id
     * @param id 
     * @returns 
     */
    @Get("/{id}")
    public async getCharacterById(id: string) {
        try {
            const { data } = await axios.get(`/characters/${id}`);
            if (data.error) {
                return Promise.reject(data.error);
            }
            return data;
        } catch (error: any) {
            console.error(error.response.data.message || JSON.stringify(error.response.data));
            throw new AppError(error.response.data.message || error.response.data.errorMessage || error.response.data);
        }
    }

    /**
     * Get characters list
     */
     @Get("/")
    public async getCharacters() {
        try {
            const { data } = await axios.get(`/characters`);
            if (data.error) {
                return Promise.reject(data.error);
            }
            return data;
        } catch (error: any) {
            console.error(error.message || error);
            throw error.message || error;
        }
    }
}

export default MarvelService;
// module.exports = MarvelService;