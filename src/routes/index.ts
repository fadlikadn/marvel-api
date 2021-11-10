import express from "express";
import PingController from "../controllers/ping";
import MarvelController from "../controllers/marvel";
import { CharacterIds, CharacterReturn } from "../dto/models/marvel-character";
const status = require('http-status');

const router = express.Router();

router.get("/ping", async (_req, res) => {
    const controller = new PingController();
    const response = await controller.getMessage();
    return res.send(response);
});

router.get("/marvel/characters", async(_req, res) => {
    const controller = new MarvelController();
    const response: CharacterIds = await controller.getCharacters();
    console.log(response.length);
    res.status(status.OK).json(response);
});

router.get("/marvel/characters/:id", async (req, res) => {
    const { id } = req.params;
    const controller = new MarvelController();
    const response: CharacterReturn = await controller.getCharacterById(id);
    res.status(status.OK).json(response);
});

// router.get("/marvel/hash", async(_req, res) => {
//     const controller = new MarvelController();
//     const response = await controller.getHash();
//     return res.send(response);
// });

export default router;