import path from "path";
import dotenv from 'dotenv'
// config the environment file
// dotenv.config({ path : path.resolve('../info/.env') , debug: true }) // for testing actor.routers.js
dotenv.config({ path : path.resolve('../node-js-crud-mysql-one-to-many-has-relation-table/info/.env') , debug: true }) // for testing test.js
export const info = {
    database : process.env.SQLL_DATABASE,
    username : process.env.SQLL_USERNAME,
    password : process.env.SQLL_PASSWORD,
    host : process.env.SQLL_HOST,
    port : process.env.SQLL_PORT
}