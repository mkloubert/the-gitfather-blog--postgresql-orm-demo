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

import type { IHttpRequest, IHttpResponse } from "@egomobile/http-server";
import { withPostgres } from "../databases/postgres";
import { Log } from "../databases/postgres/entities/default";

export default async function getLogById(request: IHttpRequest, response: IHttpResponse) {
    // get URL parameter `:log_id`
    const logID = request.params!.log_id.toLowerCase().trim();

    await withPostgres("default", async (context) => {
        // search for row in `logs` table with `uuid` from `logID`
        // and try to map it with a new `Log` instance
        const logEntry = await context.findOne(Log, {
            "where": "uuid = $1",
            "params": [logID]
        });

        if (logEntry) {
            // found

            // prepare data for response
            const logEntryAsJSON = JSON.stringify(logEntry);
            const logEntryData = Buffer.from(logEntryAsJSON, "utf8");

            // send OK response
            response.writeHead(200, {
                "Content-Type": "application/json; charset=UTF-8",
                "Content-Length": logEntryData.length
            });
            response.write(logEntryData);
        }
        else {
            // not found

            // send error response 404 - Not Found
            response.writeHead(404, {
                "Content-Type": "text/plain; charset=UTF-8",
                "Content-Length": 0
            });
        }
    });
}
