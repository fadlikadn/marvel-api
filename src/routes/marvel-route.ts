"use strict";

import express from "express";
const path = require("path");
const status = require("http-status");
import MarvelService from "../services/marvel-service";

const AppError = require("../dto/responses/app-error");

process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "..", "config");

const marvelRouter = express.Router();
const service = new MarvelService();

marvelRouter.get("/characters", async (_, res) => {
    try {
        const response = await service.getCharacters();
        res.status(status.OK).json(response);
    } catch (error) {
        res.status(status.BAD_REQUEST).json(error);
    }
});

marvelRouter.get("/characters/:id", async(req, res) => {
    const { id } = req.params;
    try {
        const response = await service.getCharacterById(id);
        res.status(status.OK).json(response);
    } catch (error) {
        res.status(status.BAD_REQUEST).json(error);
    }
});

export default marvelRouter;