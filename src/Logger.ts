import chalk from "chalk"

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
    
    /**
     * Prints an error message to stdout. The file and line number can be passed through Logger.GetCallerLocation()
     * @param msg The message to print
     * @param file The origin file name
     * @param line The line number
     */
    public static Error(msg: string, { file, line }: CallerLocation) {
        if (![Verbosity.DEBUG, Verbosity.ERRORS_ONLY, Verbosity.ERRORS_WARNINGS, Verbosity.EVERYTHING].includes(this._verbosity))
            return
        const str = Logger.constructMessage(msg, "ERR", file, line)
        console.log(chalk.redBright(str))
    }

    /**
     * Prints a warning message to stdout. The file and line number can be passed through Logger.GetCallerLocation()
     * @param msg The message to print
     * @param file The origin file name
     * @param line The line number
     */
    public static Warning(msg: string, { file, line }: { file: string, line: number }) {
        if (![Verbosity.DEBUG, Verbosity.ERRORS_WARNINGS, Verbosity.EVERYTHING].includes(this._verbosity))
            return
        const str = Logger.constructMessage(msg, "WARN", file, line)
        console.log(chalk.yellowBright(str))
    }

    /**
     * Prints an info message to stdout. The file and line number can be passed through Logger.GetCallerLocation()
     * @param msg The message to print
     * @param file The origin file name
     * @param line The line number
     */
    public static Info(msg: string, { file, line }: { file: string, line: number }) {
        if (![Verbosity.DEBUG, Verbosity.SILENT, Verbosity.EVERYTHING].includes(this._verbosity))
            return
        const str = Logger.constructMessage(msg, "INFO", file, line)
        console.log(chalk.whiteBright(str))
    }

     /**
     * Prints an error message to stdout. The file and line number can be passed through Logger.GetCallerLocation()
     * @param msg The message to print
     * @param file The origin file name
     * @param line The line number
     */
    public static Debug(msg: string, { file, line }: { file: string, line: number }) {
        if (![Verbosity.DEBUG].includes(this._verbosity))
            return
        const str = Logger.constructMessage(msg, "DEBUG", file, line)
        console.log(chalk.gray(str))
    }

    /**
     * Gets the caller file name and line number
     * @returns The file name and line number of the caller
     */
    public static GetCallerLocation(): { file: string, line: number } {
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