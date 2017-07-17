declare global {
  interface ErrorConstructor {
    prepareStackTrace(_: any, stack: any): any
  }
}

export function getStack(): any[] {
  const origPrepareStackTrace = Error.prepareStackTrace
  Error.prepareStackTrace = function (_, stack) {
    return stack
  }

  const err = new Error()
  const stack = <any[]><any>(err.stack)

  Error.prepareStackTrace = origPrepareStackTrace

  stack.shift()

  return stack
}

// getFileName, getEvalOrigin, getScriptNameOrSourceURL
// getLineNumber, getColumnNumber, getPosition
// getFunctionName

export function getCaller(): string {
  const stack = getStack()
  return stack[2].getFileName()
}
