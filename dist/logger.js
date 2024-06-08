"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.severities = exports.Severities = void 0;
const chalk_1 = __importDefault(require("chalk"));
var Severities;
(function (Severities) {
    Severities[Severities["TRACE"] = 0] = "TRACE";
    Severities[Severities["DEBUG"] = 1] = "DEBUG";
    Severities[Severities["INFO"] = 2] = "INFO";
    Severities[Severities["WARN"] = 3] = "WARN";
    Severities[Severities["ERROR"] = 4] = "ERROR";
    Severities[Severities["FATAL"] = 5] = "FATAL";
})(Severities || (exports.Severities = Severities = {}));
exports.severities = [
    chalk_1.default.bgBlue.white('[trace]'),
    chalk_1.default.bgBlue.white('[debug]'),
    chalk_1.default.blue('[info]'),
    chalk_1.default.yellow('[warn]'),
    chalk_1.default.red('[error]'),
    chalk_1.default.bgRed('[fatal]')
];
class Logger {
    constructor(log_level) {
        this._log_level = log_level;
    }
    log(severity, ...args) {
        if (severity < this._log_level)
            return;
        process.stdout.write(`${exports.severities[severity]} [${new Date(Date.now()).toISOString()}] `);
        console.log(args);
    }
    trace(...args) { this.log(0, args); }
    debug(...args) { this.log(1, args); }
    info(...args) { this.log(2, args); }
    warn(...args) { this.log(3, args); }
    error(...args) { this.log(4, args); }
    fatal(...args) { this.log(5, args); }
}
exports.default = Logger;
