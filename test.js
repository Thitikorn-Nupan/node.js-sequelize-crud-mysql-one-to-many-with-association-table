import Logging from "./log/logging.js";
import employeeRouter from "./router/employee.router.js";
import express from "express";

const application = express()

application.use('/employee',employeeRouter)
application.listen(3000,(error) => {
    if (error) throw error
    else Logging.winston.info('you are on port 3000')
})