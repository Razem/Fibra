# Fibra

Simple multithreading library for Node.js using child processes.

## Installation
```
npm install --save fibra
```

## Documentation
```
class Fibra<T, I = any>
  constructor(task: (this: { import: I }, ...args: any[]) => Promise<T>, options?: { import?: Imports })
  run(...args: any[]): Promise<T>
  kill(): void
  static cores: number
    * The amount of CPU cores

interface Imports
  * key: module name
  * value:
    * '' or 'name' for default import
    * '*' or ['*', 'name'] for wildcard import
    * ['item', ['anotherItem', 'alias'], ['default', 'Module']] otherwise
```

## Example
```ts
import Fibra from 'fibra'
import * as fs from 'fs'
import { join as joinPath } from 'path'

const api = {
  add(a: number, b: number) {
    return a + b
  }
}

const fibra = new Fibra<string, { fs: typeof fs, joinPath: typeof joinPath }, typeof api>(
  async function (a: number, b: number) {
    const { joinPath, fs } = this.import
    const { add } = this.api

    console.log(typeof joinPath === 'function') // Should be true
    console.log(typeof fs === 'object') // Should be true

    console.log(await add(a, b)) // Should be 7

    const time = Date.now()
    while (Date.now() - time < 1000) {}

    return 'Hello world' // Shown after 1000 ms
  },
  {
    import: {
      path: [['join', 'joinPath']],
      fs: '*',
    },
    api
  }
)

setTimeout(() => {
  console.log('Non-blocking') // Shown after 500 ms
}, 500)

fibra.run(2, 5).then((res) => console.log(res))
```

## Todo
- Mutexes - locking shared resources

## Known issues
- Source maps do not work for the code inside a thread
