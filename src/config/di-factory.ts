"use strict";
import { Container } from "typedi";
import MarvelService from "../services/marvel-service";

// const MarvelService = require("../services/marvel-service");

// const Container = require("typedi").Container;

const factory = {
    MarvelService: Container.get(MarvelService),
};

// module.exports = factory;
export default factory;