# Fibra

Simple multithreading library for Node.js using child processes.

## Documentation
```
class Fibra<T>
  constructor(fn: (...args: any[]) => Promise<T>)
    * When using import, the first argument of the callback is object containing imported modules
  import(imports: Imports): this
    * '' or 'name' for default import
    * '*' or ['*', 'name'] for wildcard import
    * ['item', ['anotherItem', 'alias'], ['default', 'Module']] otherwise
  run(...args: any[]): Promise<T>
  kill(): void
  static cores: number
    * The amount of CPU cores
```

## Example
```ts
import Fibra from 'fibra'

const fibra = new Fibra<string>(async (imports) => {
  const { joinPath, fs } = imports

  const time = Date.now()
  while (Date.now() - time < 1000) {}

  return 'Hello world' // Shown after 1000 ms
})

fibra.import({
  path: [['join', 'joinPath']],
  fs: '*',
})

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
