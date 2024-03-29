// MIT License
//
// Copyright (c) 2024 Marcel Joachim Kloubert (https://marcel.coffee)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import {
    createServer,
    json,
    params,
    validateAjv
} from "@egomobile/http-server";
import cors from "cors";

// we organize handlers into `./handlers` subfolder
import createNewLog, { newLogBodySchema } from "./handlers/createNewLog";
import getAllLogs from "./handlers/getAllLogs";
import getLogById from "./handlers/getLogById";

async function main() {
    const app = createServer();

    // setup global middleware
    app.use(async (request, response, next) => {
        console.log(`[REQUEST:${request.method}]`, new Date(), request.url);

        next();
    });

    // setup routes
    {
        // a GET endpoint with a
        // route specific middleware
        app.get(
            "/api/v1/logs",
            [cors()],
            getAllLogs
        );

        // a route with a parameter
        // we need the `params()` here to explicitly
        // define, that we want to support routes
        app.get(
            params("/api/v1/logs/:log_id"),
            getLogById
        );

        // create a new log entry
        // as described by JSON schema
        // in `newLogBodySchema`
        app.post(
            "/api/v1/logs",
            [json(), validateAjv(newLogBodySchema)],
            createNewLog
        );
    }

    // start the server
    await app.listen(process.env.PORT);
    console.log("App now running on port", app.port);
}

main().catch(console.error);
