"use strict";

const MarvelService = require("../services/marvel-service");

const Container = require("typedi").Container;

const factory = {
    MarvelService: Container.get(MarvelService),
};

export default factory;