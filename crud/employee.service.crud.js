import Employee from "../entities/employee.js";
import Address from "../entities/address.js";
import Logging from "../log/logging.js";
import {configClassAndSequelize} from "../config/config.db.js";

// don't forget async&await before query by Sequelize
// we have to get sequelize connect db for Writing Row sql
const configDb = new configClassAndSequelize.configDb
const sequelizeConnect = configDb.sequelizeConnectDB
/*
   *****
   Sequelize provides four types of associations (belongsToMany , hasMany , ...)
   A.hasOne(B); // A HasOne B
   A.belongsTo(B); // A BelongsTo B
   A.hasMany(B); // A HasMany B
   A.belongsToMany(B, { through: 'C' }); // A BelongsToMany B through the junction table C
   *****
   If you are done to set up association
   So , you have to no need to set up it again (talk about this Actor , Movie)
*/

// N:M associations are not supported with hasMany. Use belongsToMany instead
// Should know One to many it does not need relation table
// If you have ?
// So this is not a correct way
// But it will work if you have relation table in one to many
// Use the same way for many to many
/**
 ** correct way i was building
 https://github.com/ttknpde-v/typescript-and-node.js-sequelize-crud-mysql-one-to-many
 https://github.com/ttknpde-v/node.js-sequelize-crud-postgres-one-to-many
 https://github.com/ttknpde-v/node.js-sequelize-crud-mysql-many-to-one-four-tables
 */
Employee.belongsToMany(Address, {
    through: "employees_addresses", // ** through (adv. ผ่าน) ** specify name relation table
    as: "addresses", // mapped to table
    foreignKey: "eid" // specify fk
})
Address.belongsToMany(Employee, {
    through: "employees_addresses", // ** through (adv. ผ่าน) ** specify name relation table
    as: "employees", // mapped to table
    foreignKey: "aid" // specify fk
})

class EmployeeServiceCrud {
    retrieveAllEmployees = async () => { /* reads direct left join */
        return await Employee.findAll({
            include: [
                {
                    model: Address,
                    as: "addresses",
                    attributes: {exclude: ['aid']},
                    // not clear but it works for removing association table (actors_movies)
                    through: {
                        attributes: [],
                    }
                },
            ]
        }) // findAll
    }


    retrieveEmployee = async (eid) => { /* reads direct left join */
        return await Employee.findByPk(eid, {
            include: [
                {
                    model: Address,
                    as: "addresses",
                    attributes: {exclude: ['aid']},
                    // not clear but it works for removing association table (actors_movies)
                    through: {
                        attributes: [],
                    }
                },
            ]
        }) // findByPk
    }


    // As you see anything work (Use the same logic from Many to many)
    addAssociation = async (eid, aid) => {
        return await this.retrieveEmployee(eid).then(async (employee) => {
            return await Address.findByPk(aid).then(async (address) => {
                // *** it's not show add<Your Entity Name>() function you have to know
                return await address.addEmployee(employee).then((response) => {
                    Logging.winston.info(JSON.stringify(response))
                    return true
                }) // addAddress
            }) // findByPf
        }) // retrieveActor
    }
    /*
        Executing (default): SELECT `employees`.`eid`, `employees`.`firstname`, `employees`.`lastname`, `employees`.`position`, `employees`.`active`, `employees`.`salary`, `addresses`.`aid` AS `addresses.aid`, `addresses`.`country` AS `addresses.country`, `addresses`.`city` AS `addresses.city`, `addresses`.`details` AS `addresses.details` FROM `employees` AS `employees` LEFT OUTER JOIN ( `employees_addresses` AS `addresses->employees_addresses` INNER JOIN `addresses` AS `addresses` ON `addresses`.`aid` = `addresses->employees_addresses`.`aid`) ON `employees`.`eid` = `addresses->employees_addresses`.`eid` WHERE `employees`.`eid` = 'E011';
        Executing (default): SELECT `aid`, `country`, `city`, `details` FROM `addresses` AS `addresses` WHERE `addresses`.`aid` = 'A002';
        Executing (default): SELECT `aid`, `eid` FROM `employees_addresses` AS `employees_addresses` WHERE `employees_addresses`.`aid` = 'A002' AND `employees_addresses`.`eid` IN ('E011');
        Executing (default): INSERT INTO `employees_addresses` (`aid`,`eid`) VALUES ('A002','E011');
    */


    addEmployee = async (employee) => {
        return await Employee.create({
            eid: employee.eid,
            firstname: employee.firstname,
            lastname: employee.lastname,
            position: employee.position,
            active: employee.active,
            salary: employee.salary
        }).then((response) => {
            Logging.winston.info(JSON.stringify(response))
            return true
        })
    }


    removeEmployee = async (eid) => {
        return await Employee.findByPk(eid).then(async (employee) => { // first find entity
            /*
                i have to remove relation first then remove entity
                because it(relation table) has a foreign key
            */
            return await sequelizeConnect.query('delete from employees_addresses where eid = :eid', { // second remove relation in aid at all
                replacements: {eid: employee.eid},
                type: configClassAndSequelize.sequelize.QueryTypes.DELETE
            }).then(async () => { // third delete employee
                return await Employee.destroy({
                    where: {eid: employee.eid} // make sure, it exists
                }).then(() => { // done then return true
                    return true
                })
            })
        })
    }
    /*
    Executing (default): SELECT `eid`, `firstname`, `lastname`, `position`, `active`, `salary` FROM `employees` AS `employees` WHERE `employees`.`eid` = 'E000';
    Executing (default): delete from employees_addresses where eid = 'E000'
    Executing (default): DELETE FROM `employees` WHERE `eid` = 'E000'
    */

    editEmployee = async (eid, employee) => {
        return await this.retrieveEmployee(eid).then(async () => {
            // way to use update({values},{where})
            return await Employee.update({
                firstname: employee.firstname,
                lastname: employee.lastname,
                position: employee.position,
                active: employee.active,
                salary: employee.salary
            }, {
                where: {eid: eid}
            }).then(() => {
                return true
            })
        }) // retrieveActor
    }
    /*
    Executing (default): SELECT `employees`.`eid`, `employees`.`firstname`, `employees`.`lastname`, `employees`.`position`, `employees`.`active`, `employees`.`salary`, `addresses`.`aid` AS `addresses.aid`, `addresses`.`country` AS `addresses.country`, `addresses`.`city` AS `addresses.city`, `addresses`.`details` AS `addresses.details` FROM `employees` AS `employees` LEFT OUTER JOIN ( `employees_addresses` AS `addresses->employees_addresses` INNER JOIN `addresses` AS `addresses` ON `addresses`.`aid` = `addresses->employees_addresses`.`aid`) ON `employees`.`eid` = `addresses->employees_addresses`.`eid` WHERE `employees`.`eid` = 'E001';
    Executing (default): UPDATE `employees` SET `firstname`=?,`lastname`=?,`position`=?,`active`=?,`salary`=? WHERE `eid` = ?
    */
}

// Logging.winston.debug(JSON.stringify(await new EmployeeServiceCrud().addAssociation('E011','A002')))
// const employee = {
//     eid: 'E001',
//     firstname: 'LA',
//     lastname: 'Knights',
//     position: 'Spring & Spring Boot Developer',
//     active: false,
//     salary: 37500.00
// }
// Logging.winston.debug(JSON.stringify(await new EmployeeServiceCrud().removeEmployee('E000')))
// Logging.winston.debug(JSON.stringify(await new EmployeeServiceCrud().editEmployee(employee.eid,employee)))

export default EmployeeServiceCrud
