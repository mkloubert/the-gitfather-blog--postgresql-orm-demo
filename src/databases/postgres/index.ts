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
    createWithPostgres,
    registerBigIntAsNumber
} from "@egomobile/orm-pg";
import pg from "pg";

// bigint e.g. is returned as string, so we can keep sure to have a number here
registerBigIntAsNumber({
    "pgModule": pg
});

// in this folder we organize the POCOs
import getDefaultEntityConfiguration from "./entities/default";

// `createWithPostgres` is a factory function that creates
// a new PostgreSQL connection with specific configuration
// organized by connection names
export const withPostgres = createWithPostgres({
    "default": {
        "client": () => {
            // this is the default and lets
            // `pg` module load the connection settings from
            // following environment variables:
            //
            // - PGDATABASE
            // - PGHOST
            // - PGPASSWORD
            // - PGPORT
            // - PGSSLMODE
            // - PGUSER
            // - PORT

            return {};
        },
        "clientClass": pg.Client,
        "entities": getDefaultEntityConfiguration,
        "noDbNull": true
    }
});
