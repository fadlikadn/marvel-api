import express, { Application } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import Router from "../../routes";

let server: any;

const start = (options: { port: number }) => {
    return new Promise((resolve: any, reject: any) => {
        if (!options.port) {
            reject(new Error('The server must be started with an available port'));
        }

        const app: Application = express();
        app.use(express.json());
        app.use(morgan("tiny"));
        app.use(express.static("public"));
        app.use((err: any, req: any, res: any, next: any) => {
            reject(new Error(`Something went wrong!, err:${err}`));
            res.status(500).send('Something went wrong!');
        });

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

        server = app.listen(options.port, () => {
            console.log("Server is running on port", options.port);
            resolve(server)
        });
    });
};

const close = (signal: any) => {
    return new Promise((resolve, reject) => {
        console.log(`${signal} received.`);
        console.log('Closing http server.');
        server.close((err: any) => {
            if (err) {
                reject(err);
            }
            console.log('Http server closed.');
            resolve(server);
        });
    });
}

module.exports = Object.assign({}, { start, close });