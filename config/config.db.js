import {info} from "./info.db.js";
import sequelize from 'sequelize' // if you use it to connect mysql have to install mysql2 package manually
import Logging from "../log/logging.js";

// Logging.winston.info(`${info.database} , ${info.username} , ${info.password}`)
class ConfigDb {
    get sequelizeConnectDB() {
        return new sequelize(
            info.database,
            info.username,
            info.password,
            {
                /* set different port */
                dialect : 'mysql' ,
                host: info.host,
                port: info.port,
                pool : {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            }
        ) // ended new sequelize()
    }
}

/*
check to config. it was gonna good or bad
new ConfigDb().sequelizeConnectDB.authenticate().then(() => {
    Logging.winston.info('connected successfully!!')
}).catch((error) => {
    Logging.winston.debug('failed connect!!')
    throw error
})
*/

export const configClassAndSequelize = {
    sequelize : sequelize ,
    configDb : ConfigDb
}