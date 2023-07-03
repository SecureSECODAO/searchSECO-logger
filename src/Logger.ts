import chalk from "chalk"
import fs from 'fs'

function now(): string {
    const date = new Date();
    const aaaa_str = date.getUTCFullYear().toString();
    const gg = date.getUTCDate();
    const mm = (date.getUTCMonth() + 1);

    let gg_str = gg.toString()
    let mm_str = mm.toString()

    if (gg < 10)
        gg_str = "0" + gg_str;

    if (mm < 10)
        mm_str = "0" + mm_str;

    const cur_day = aaaa_str + "-" + mm_str + "-" + gg_str;

    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()
    const seconds = date.getUTCSeconds();

    let hours_str = hours.toString()
    let minutes_str = minutes.toString()
    let seconds_str = seconds.toString()

    if (hours < 10)
        hours_str = "0" + hours_str;

    if (minutes < 10)
        minutes_str = "0" + minutes_str;

    if (seconds < 10)
        seconds_str = "0" + seconds_str;

    return cur_day + " " + hours_str + ":" + minutes_str + ":" + seconds_str;

}

//  (1 = Silent, 2 = Errors Only, 3 = Warnings & Errors, 4 = Everything, 5 = Debug)
export enum Verbosity {
    SILENT = 1,
    ERRORS_ONLY,
    ERRORS_WARNINGS,
    EVERYTHING,
    DEBUG
}

type CallerLocation = {
    line: number,
    file: string
}

export default class Logger {
    private static _verbosity: Verbosity
    private static _module: string
    private static _logFile = './.log'
    private static _stream: fs.WriteStream | undefined

    /**
     * Setter for the verbosity
     * @param verbosity The verbosity to switch to
     */
    public static SetVerbosity(verbosity: Verbosity): void {
        this._verbosity = verbosity
    }

    /**
     * Getter for the verbosity
     * @returns The current verbosity of the logger
     */
    public static GetVerbosity(): Verbosity {
        return this._verbosity
    }

    /**
     * Setter for the module name
     * @param module The target module
     */
    public static SetModule(module: string) {
        this._module = module
    }

    /**
     * Helper function for construction a formatted message.
     * @param msg The message to be displayed
     * @param type The type of message
     * @param file The origin file name
     * @param line The line number
     * @returns A formatted string
     */
    private static constructMessage(msg: string, type: string, file: string, line: number): string {
        const moduleString = `${this._module}`.padEnd(12, ' ')
        const lineString = `${`${file.split(/\\|\//).pop()}`.padEnd(25-line.toString().length)} ${line}`
        const typeString = `${type}`.padEnd(5, ' ')
        return `| ${moduleString} | ${lineString} | [ ${typeString} ] ${msg}`
    }

    private static writeToFile(msg: string): void {
        if (!this._stream)
            this._stream = fs.createWriteStream(this._logFile, { flags: 'a' })

        this._stream.cork()
        this._stream.write(`${now()} | ${msg}\n`)
        process.nextTick(() => this._stream.uncork())
    }

    /**
     * Prints an error message to stdout. The file and line number can be passed through Logger.GetCallerLocation()
     * @param msg The message to print
     * @param file The origin file name
     * @param line The line number
     */
    public static Error(msg: string, { file, line }: CallerLocation, logToFile = false) {
        if (![Verbosity.DEBUG, Verbosity.ERRORS_ONLY, Verbosity.ERRORS_WARNINGS, Verbosity.EVERYTHING].includes(this._verbosity))
            return
        const str = Logger.constructMessage(msg, "ERR", file, line)
        console.log(chalk.redBright(str))
        if (logToFile) this.writeToFile(msg)
    }

    /**
     * Prints a warning message to stdout. The file and line number can be passed through Logger.GetCallerLocation()
     * @param msg The message to print
     * @param file The origin file name
     * @param line The line number
     */
    public static Warning(msg: string, { file, line }: CallerLocation, logToFile = false) {
        if (![Verbosity.DEBUG, Verbosity.ERRORS_WARNINGS, Verbosity.EVERYTHING].includes(this._verbosity))
            return
        const str = Logger.constructMessage(msg, "WARN", file, line)
        console.log(chalk.yellowBright(str))
        if (logToFile) this.writeToFile(msg)
    }

    /**
     * Prints an info message to stdout. The file and line number can be passed through Logger.GetCallerLocation()
     * @param msg The message to print
     * @param file The origin file name
     * @param line The line number
     */
    public static Info(msg: string, { file, line }: CallerLocation, logToFile = false) {
        if (![Verbosity.DEBUG, Verbosity.SILENT, Verbosity.EVERYTHING].includes(this._verbosity))
            return
        const str = Logger.constructMessage(msg, "INFO", file, line)
        console.log(chalk.whiteBright(str))
        if (logToFile) this.writeToFile(msg)
    }

     /**
     * Prints an error message to stdout. The file and line number can be passed through Logger.GetCallerLocation()
     * @param msg The message to print
     * @param file The origin file name
     * @param line The line number
     */
    public static Debug(msg: string, { file, line }: CallerLocation, logToFile = false) {
        if (![Verbosity.DEBUG].includes(this._verbosity))
            return
        const str = Logger.constructMessage(msg, "DEBUG", file, line)
        console.log(chalk.gray(str))
        if (logToFile) this.writeToFile(msg)
    }

    /**
     * Gets the caller file name and line number
     * @returns The file name and line number of the caller
     */
    public static GetCallerLocation(): CallerLocation {
        let line = -1
        let file = ''
        const _prepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = (_, stack) => {
          line = stack[1].getLineNumber() || -1;
          file = stack[1].getFileName() || ''
        };
        const e = new Error();
        e.stack;
        Error.prepareStackTrace = _prepareStackTrace;
    
        return { file, line };
    }
}