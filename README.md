# Fibra

Simple multithreading library for Node.js using child processes.

## Installation
```
npm install --save fibra
```

## Documentation
```
class Fibra<T, I = any>
  constructor(fn: (this: { import: I }, ...args: any[]) => Promise<T>, options?: { import?: Imports })
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

const fibra = new Fibra<string, { fs: typeof fs, joinPath: typeof joinPath }>(
  async function () {
    const { joinPath, fs } = this.import

    const time = Date.now()
    while (Date.now() - time < 1000) {}

    return 'Hello world' // Shown after 1000 ms
  },
  {
    import: {
      path: [['join', 'joinPath']],
      fs: '*',
    }
  }
)

setTimeout(() => {
  console.log('Non-blocking') // Shown after 500 ms
}, 500)

fibra.run().then((res) => console.log(res))
```

## TODO
- API calls based on messages
- Mutexes - locking shared resources

## Known issues
- Source maps do not work for the code inside a thread
