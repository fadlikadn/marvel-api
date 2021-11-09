"use strict";

import "reflect-metadata";
import express, { Application } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import Router from "../routes";

const server = require("./server/server");

const path = require("path");
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "config");
const config = require("config");
const serverConfig = config.get("serverConfig");

const port = process.env.PORT || serverConfig.port;

process.on('uncaughtException', err => {
    console.error('Unhandled Exception', err);
});
  
process.on('uncaughtRejection', (err, promise) => {
    console.error('Unhandled Rejection', err);
});

const app: Application = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: "/swagger.json",
        }
    })
);

app.use(Router);
app.listen(port, () => {
    console.log("Server is running on port", port);
});