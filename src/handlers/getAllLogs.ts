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

export default async function getAllLogs(request: IHttpRequest, response: IHttpResponse) {
    await withPostgres("default", async (context) => {
        // load all rows from `logs` table
        // and map them with new `Log` instances
        const allLogs = await context.find(Log);

        // prepare data for response
        const allLogsAsJSON = JSON.stringify(allLogs);
        const allLogsData = Buffer.from(allLogsAsJSON, "utf8");

        // send response with code 200
        response.writeHead(200, {
            "Content-Type": "application/json; charset=UTF-8",
            "Content-Length": allLogsData.length
        });
        response.write(allLogsData);
    });
}
