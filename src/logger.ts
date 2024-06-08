import chalk from "chalk"

export enum Severities {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    FATAL = 5
}

export const severities = [
    chalk.bgBlue.white('[trace]'), 
    chalk.bgBlue.white('[debug]'), 
    chalk.blue('[info]'), 
    chalk.yellow('[warn]'), 
    chalk.red('[error]'), 
    chalk.bgRed('[fatal]')
]

export default class Logger {
    private _log_level: number
    constructor(log_level: number | Severities) {
        this._log_level = log_level
    }
    
    log(severity: number, ...args: any[]) {
        if (severity < this._log_level) return;
        process.stdout.write(`${severities[severity]} [${new Date(Date.now()).toISOString()}] `)
        console.log(args)
    }

    trace(...args: any[]) { this.log(0, args) }
    debug(...args: any[]) { this.log(1, args) }
    info(...args: any[]) { this.log(2, args) }
    warn(...args: any[]) { this.log(3, args) }
    error(...args: any[]) { this.log(4, args) }
    fatal(...args: any[]) { this.log(5, args) }
}