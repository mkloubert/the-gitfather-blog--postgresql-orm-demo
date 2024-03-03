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

import type { IHttpRequest, IHttpResponse, JSONSchema7 } from "@egomobile/http-server";
import { withPostgres } from "../databases/postgres";
import { Log } from "../databases/postgres/entities/default";

// describes `INewLogBody` below
interface INewLogBody {
    message: string;
    type: number;
}

// the schema how a POST body has to look like
export const newLogBodySchema: JSONSchema7 = {
    "type": "object",
    "required": [
        "message",
        "type"
    ],
    "properties": {
        "message": {
            "type": "string",
            "minLength": 1,
            "maxLength": 16383
        },
        "type": {
            "type": "integer"
        }
    }
};

export default async function createNewLog(request: IHttpRequest, response: IHttpResponse) {
    // at this point we now that
    // the data is parsed and valid
    const body = request.body as INewLogBody;

    await withPostgres("default", async (context) => {
        // setup new POCO
        let newLog = new Log();
        newLog.message = JSON.stringify(body.message);
        newLog.type = body.type;

        // INSERT and write instance with
        // updated `id` column back to `newLog`
        newLog = await context.insert(newLog);

        // prepare data for response
        const newLogAsJSON = JSON.stringify(newLog);
        const newLogData = Buffer.from(newLogAsJSON, "utf8");

        // send response with code 201
        response.writeHead(201, {
            "Content-Type": "application/json; charset=UTF-8",
            "Content-Length": newLogData.length
        });
        response.write(newLogData);
    });
}
