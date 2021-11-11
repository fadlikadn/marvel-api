import express from "express";
import MarvelController from "../controllers/marvel";
import { CharacterReturn } from "../dto/models/marvel-character";
const status = require('http-status');

const router = express.Router();

router.get("/marvel/characters", async(_req, res) => {
    const controller = new MarvelController();
    const response: Array<number> = await controller.getCharacters();
    console.log(response.length);
    res.status(status.OK).json(response);
});

router.get("/marvel/characters/:id", async (req, res) => {
    const { id } = req.params;
    const controller = new MarvelController();
    const response: CharacterReturn = await controller.getCharacterById(id);
    res.status(status.OK).json(response);
});

export default router;