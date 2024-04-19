import {createLogger, format, transports} from 'winston'
import path from 'path'
class Logging {
    static get winston() {
        return createLogger({
            level: 'silly',
            format: format.combine(
                // get current file for output with logging
                format.label({ label: path.basename(process.argv[1]) }),
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.printf(format => `${format.timestamp} ${format.level} [${format.label}] : ${format.message}`)
            ),
            transports: [
                new transports.Console // get logging to console
            ]
        })
    }
}

export default Logging // when import it calls the name's class Like, import Logging from "./log/logging.js";