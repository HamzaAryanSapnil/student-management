/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import { config } from "./app/config/env";
// import config from "./config";
// import { seedAdmin } from "./seeds/seedAdmin";






let server: Server;


const startServer = async () => {
    try {
        server = app.listen(config.PORT, () => {
          console.log(
            `🚀 Student management - Server is running on http://localhost:${config.PORT}`,
          );
        });

    } catch (error) {
        console.log(error);
    }
}

(async () => {
    await startServer()
})()

process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})


process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejecttion detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

