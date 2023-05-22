import chalk from "chalk"

//  (1 = Silent, 2 = Errors Only, 3 = Warnings & Errors, 4 = Everything, 5 = Debug)
export enum Verbosity {
    SILENT = 1,
    ERRORS_ONLY,
    ERRORS_WARNINGS,
    EVERYTHING,
    DEBUG
}

export default class Logger {
    private static _verbosity: Verbosity
    private static _module: string
    public static SetVerbosity(verbosity: Verbosity): void {
        this._verbosity = verbosity
    }
    public static SetModule(module: string) {
        this._module = module
    }

    private static constructMessage(msg: string, type: string, file: string, line: number): string {
        let moduleString = `| ${this._module}`
        let typeString = `[ ${type}`
        for (let i = 0; i < 12 - this._module.length; i++)
            moduleString += ' '
        for (let i = 0; i < 5 - type.length; i++)
            typeString += ' '
        moduleString += ' |'
        typeString += ' ]'
        return `${moduleString} ${file.split('\\').pop()} : ${line} | ${typeString} ${msg}`
    }

    public static Error(msg: string, { file, line }: { file: string, line: number }) {
        if (![Verbosity.DEBUG, Verbosity.ERRORS_ONLY, Verbosity.ERRORS_WARNINGS, Verbosity.EVERYTHING].includes(this._verbosity))
            return
        const str = Logger.constructMessage(msg, "ERR", file, line)
        console.log(chalk.redBright(str))
    }

    public static Warning(msg: string, { file, line }: { file: string, line: number }) {
        if (![Verbosity.DEBUG, Verbosity.ERRORS_WARNINGS, Verbosity.EVERYTHING].includes(this._verbosity))
            return
        const str = Logger.constructMessage(msg, "WARN", file, line)
        console.log(chalk.yellowBright(str))
    }

    public static Info(msg: string, { file, line }: { file: string, line: number }) {
        const str = Logger.constructMessage(msg, "INFO", file, line)
        console.log(chalk.whiteBright(str))
    }

    public static Debug(msg: string, { file, line }: { file: string, line: number }) {
        if (![Verbosity.DEBUG].includes(this._verbosity))
            return
        const str = Logger.constructMessage(msg, "DEBUG", file, line)
        console.log(chalk.gray(str))
    }

    public static GetCallerLocation(): { file: string, line: number } {
        let line: number = -1
        let file: string = ''
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