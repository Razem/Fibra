import { spawn, ChildProcess } from 'child_process'
import { cpus } from 'os'
import * as path from 'path'
import { getCaller } from './stack'
import { generateImports, Imports } from './imports'

export type Assoc = { [key: string]: any }

let id = 0

export default class Fibra<T, I = any> {
  static cores = cpus().length

  private id: number

  private import?: Imports
  private api: Assoc = {}

  private fileName: string
  private dirName: string

  child: ChildProcess

  constructor(private task: (this: { import: I }, ...args: any[]) => Promise<T>, options: { import?: Imports } = {}) {
    this.id = ++id

    const caller = getCaller()
    this.fileName = `${caller}.fibra${this.id}`
    this.dirName = path.dirname(caller)

    this.import = options.import
  }

  private generateFs() {
    return `var __dirname = ${JSON.stringify(this.dirName)};\n`
        + `var __filename = module.filename = ${JSON.stringify(this.fileName)};\n`
  }

  private generateAux() {
    return `Error.prototype.toJSON = function () { return { message: this.message, name: this.name }; };\n`
  }

  private createProcess(code: string): Promise<T> {
    let resolve: (value: T) => void
    let reject: (error: any) => void
    const promise = new Promise((_resolve, _reject) => {
      resolve = _resolve
      reject = _reject
    })

    let result: T
    let error: any

    const args = ['--eval', code]

    // Support debugging
    const inspect = process.execArgv.find((item) => item.startsWith('--inspect'))
    if (inspect) {
      const [flag, masterPort] = inspect.split('=')
      const port = (+masterPort || 9229) + this.id
      args.unshift(`${flag}=${port}`)

      console.log(`Starting fibra ${this.id} inspector on port ${port}.`)
    }

    this.child = spawn('node', args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
    })

    this.child.on('message', (data) => {
      switch (data.type) {
        case 'exit':
          result = data.result
          error = data.error
          break
      }
    })

    this.child.on('error', (error) => {
      reject(error)
    })

    this.child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve(result)
      }
      else {
        reject(error || new Error(signal))
      }
    })

    return promise
  }

  run(...args: any[]): Promise<T> {
    let code = `'use strict';\n`

    code += this.generateFs()
    code += this.generateAux()

    const context = []

    if (this.import) {
      const imports = generateImports(this.import)
      if (imports) {
        context.push(`import: ${imports}`)
      }
    }

    code += `(${this.task.toString()}).apply({${context.join(', ')}}, ${JSON.stringify(args)})\n`
    code += `.then(\n`
    code += `  function (r) { process.send({ type: 'exit', result: r }); },\n`
    code += `  function (e) { process.send({ type: 'exit', error: e }); process.exit(1); }\n`
    code += `);\n`

    return this.createProcess(code)
  }

  kill() {
    if (this.child) {
      this.child.kill('SIGKILL')
    }
  }
}
