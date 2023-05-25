import Logger, { Verbosity } from "./src/Logger";

(() => {
    Logger.SetModule("Logger")
    Logger.SetVerbosity(Verbosity.DEBUG)

    Logger.Info("This is an info message", Logger.GetCallerLocation())
    Logger.Debug("This is a debug message", Logger.GetCallerLocation())
    Logger.Error("This is an error message", Logger.GetCallerLocation())
    Logger.Warning("This is a warning message", Logger.GetCallerLocation())

})()