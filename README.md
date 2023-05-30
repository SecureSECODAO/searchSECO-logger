# searchSECO-logger
This is the logger implementation that the searchSECO miner and submodules use to print to `stdout`.
## Usage
The main feature of the logger is to print statements to the console.
The verbosity of these messages range from least verbose to most: `Info`, `Error`, `Warning` and `Debug`.
As the logger implementation is static, the verbosity and other options are able to be adjusted on the fly. To set the vebosity level, the `Logger.SetVerbosity()` function is used, which accepts values from the `Verbosity` enum.
## Example
```typescript
import Logger, { Verbosity } from './src/Logger'

Logger.SetVerbosity(Verbosity.DEBUG)
Logger.SetModule("test")

// GetCallerLocation gets the file name and line number of the current statement
Logger.Debug("This is a debug message", Logger.GetCallerLocation()) 
// output:
// | test | test.js   14 | [ DEBUG ] This is a debug message

Logger.Error("This is an error message", Logger.GetCallerLocation()) 
// output:
// | test | test.js   19 | [ ERR   ] This is a debug message

Logger.SetVerbosity(Verbosity.SILENT)
Logger.Debug("This is a debug message", Logger.GetCallerLocation()) 
// no output

```
