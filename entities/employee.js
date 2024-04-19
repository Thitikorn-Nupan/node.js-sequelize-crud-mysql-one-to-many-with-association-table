import {configClassAndSequelize} from "../config/config.db.js";
const { DataTypes} = configClassAndSequelize.sequelize
const ConfigDB = new configClassAndSequelize.configDb // init/create object ConfigDB class then store to variable
const Employee = ConfigDB.sequelizeConnectDB.define(
    'employees' , {
        eid : {
            type : DataTypes.STRING ,
            primaryKey : true
        } ,
        firstname : {
            type : DataTypes.STRING,
        },
        lastname : {
            type : DataTypes.STRING,
        },
        position : {
            type : DataTypes.STRING,
        },
        active : {
            type : DataTypes.BOOLEAN,
        },
        salary : {
            type : DataTypes.FLOAT,
        }
    }
    ,
    {
        // freeze name table not using *s on name
        freezeTableName: true ,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
        // If don't want createdAt
        createdAt: false,
        // If don't want updatedAt
        updatedAt: false
    }
)

export default Employee