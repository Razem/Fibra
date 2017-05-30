declare global {
  interface ErrorConstructor {
    prepareStackTrace(_: any, stack: any): any
  }
}

export function getStack(): any[] {
  var origPrepareStackTrace = Error.prepareStackTrace
  Error.prepareStackTrace = function (_, stack) {
    return stack
  }

  var err = new Error()
  var stack = <any>(err.stack)

  Error.prepareStackTrace = origPrepareStackTrace

  stack.shift()

  return stack
}

// getFileName, getEvalOrigin, getScriptNameOrSourceURL
// getLineNumber, getColumnNumber, getPosition
// getFunctionName

export function getCaller(): string {
  var stack = getStack()
  return stack[2].getFileName()
}
