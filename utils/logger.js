// IMPORT SECTION
const { format, loggers, transports } = require('winston')
require('winston-daily-rotate-file')
const fs = require('fs')
const moment = require('moment')
const httpContext = require('express-http-context')

// DECLARATION SECTION
const env = process.env.NODE_ENV || 'development'
const genericLogDir = 'logs'
const genericLoggerName = 'generic-logger'

// 1) Create the log directory if it does not exist
if (!fs.existsSync(genericLogDir)) {
    fs.mkdirSync(genericLogDir)
}

// 3) Define function to format timestamp as required
const tsFormat = () => {
    return moment().format('YYYY-MM-DD hh:mm:ss:SSS').trim()
}

// 4) Define function to insert unique request ID into log
const insertRequestId = format((info, opts) => {
    info.reqId = httpContext.get('reqId')
    return info
})

// 5) Define printer function to print with specific format
const printerFunction = (info) => {
    const requestId = (info.reqId) ? info.reqId : ''
    return `${info.level} ${info.timestamp} [${requestId}][${info.label}]: ${info.message}`
}

/**
 * 6) Create Logger objects
 * - Capture log on both console as well as log file which will rotate on daily bases
 */
const genericLoggerObject = {

    // Change level if in dev environment versus production
    level: env === 'production' ? 'info' : 'debug',

    // Capture file name from where logger is called and timestamp
    format: format.combine(
        insertRequestId(),
        format.label({
            label: 'generic'
        }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.splat(),
        format.simple(),
        format.json()
    ),

    // Transports log on console.
    transports: [

        new transports.Console({
            format: format.combine(format.colorize(), format.printf(printerFunction))
        }),

        new transports.DailyRotateFile({
            filename: `${genericLogDir}/Rk-Blogs-%DATE%.log`,
            datePattern: 'YYYY-MM-DD', // datePattern will replace the Date placeholder in the name
            maxSize: '5m', // max size is 5 MB and then the file will rotate
            maxFiles: '21d', // max retention period os 21 days
            format: format.combine(
                format.timestamp({
                    format: tsFormat // Optional for choosing your own timestamp format.
                }),
                format.json()
            )
        })
    ]
}

// 7) Add generic logger
const genericLogger = loggers.add(genericLoggerName, genericLoggerObject)

module.exports = genericLogger
