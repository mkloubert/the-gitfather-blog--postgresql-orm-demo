/* eslint-disable unicorn/filename-case */
/* eslint-disable jsdoc/require-param */

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

import type { MigrationAction } from "@egomobile/orm-pg";

const logTable = "logs";

/**
 * Function to UP-grade the database.
 */
export const up: MigrationAction = async (adapter, context, debug) => {
    // adapter => https://egomobile.github.io/node-orm-pg/classes/PostgreSQLDataAdapter.html
    // context => https://egomobile.github.io/node-orm/interfaces/IDataContext.html
    // debug => https://egomobile.github.io/node-orm-pg/modules.html#DebugAction

    await adapter.query(`
CREATE TABLE public.${logTable}
(
    "id" bigserial NOT NULL,
    "uuid" uuid DEFAULT uuid_in(md5(random()::text || random()::text)::cstring) NOT NULL,
    "message" json,
    "time" timestamp with time zone DEFAULT now() NOT NULL,
    "type" smallint
)
WITH (
    OIDS = FALSE
);
`);
};

/**
 * Function to DOWN-grade the database.
 */
export const down: MigrationAction = async (adapter, context, debug) => {
    // adapter => https://egomobile.github.io/node-orm-pg/classes/PostgreSQLDataAdapter.html
    // context => https://egomobile.github.io/node-orm/interfaces/IDataContext.html
    // debug => https://egomobile.github.io/node-orm-pg/modules.html#DebugAction

    await adapter.query(`DROP TABLE public.${logTable};`);
};
