import Logging from "../log/logging.js";
import EmployeeServiceCrud from "../crud/employee.service.crud.js";
import express from "express"
import bodyParser from "body-parser";


const serviceCrud = new EmployeeServiceCrud()
const employeeRouter = express.Router()

// remember order does not mean for export , So you export first then do some logic later
export default employeeRouter

// setting middle ware
employeeRouter.use(bodyParser.json())
employeeRouter.use(bodyParser.urlencoded({extended: true}))

// Anything wrong on response i set up to throw error
// ************** It's a Bad api. you should use http method to be correct
employeeRouter.get('/reads', async (req, res) => {
    await serviceCrud.retrieveAllEmployees().then((response) => {
        return res
            .status(202)
            .json({
                status: "accepted",
                data: response
            })
    }).catch((error) => {
        Logging.winston.error(error.message)
        throw error
    })
})

employeeRouter.get('/read', async (req, res) => {
    const eid = req.query.eid
    await serviceCrud.retrieveEmployee(eid).then((response) => {
        return res
            .status(202)
            .json({
                status: "accepted",
                data: response
            })
    }).catch((error) => {
        Logging.winston.error(error.message)
        throw error
    })
})

employeeRouter.get('/create', async (req, res) => {
    const employee = {
        eid: 'E003',
        firstname: 'Peter',
        lastname: 'Parkers',
        position: 'Android/IOS Developer',
        active: true,
        salary: 39000.00
    }
    await serviceCrud.addEmployee(employee).then((response) => {
        return res
            .status(201)
            .json({
                status: "create",
                data: response
            })
    }).catch((error) => {
        Logging.winston.error(error.message)
        throw error
    })
})

employeeRouter.get('/create/association', async (req, res) => {
    await serviceCrud.addAssociation(req.query.eid,req.query.aid).then((response) => {
        return res
            .status(201)
            .json({
                status: "create",
                data: response
            })
    }).catch((error) => {
        Logging.winston.error(error.message)
        throw error
    })
})

employeeRouter.get('/delete', async (req, res) => {
    await serviceCrud.removeEmployee(req.query.eid).then((response) => {
        return res
            .status(200)
            .json({
                status: "ok",
                data: response
            })
    }).catch((error) => {
        Logging.winston.error(error.message)
        throw error
    })
})

employeeRouter.get('/update', async (req, res) => {
    const employee = {
        eid: req.query.eid,
        firstname: 'Kevin',
        lastname: 'Owner',
        position: 'Android/IOS Developer',
        active: true,
        salary: 39000.00
    }
    await serviceCrud.editEmployee(employee.eid,employee).then((response) => {
        return res
            .status(202)
            .json({
                status: "accepted",
                data: response
            })
    }).catch((error) => {
        Logging.winston.error(error.message)
        throw error
    })
})