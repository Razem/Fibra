import Fibra from '..'
import * as fs from 'fs'
import { join as joinPath } from 'path'

export default async function () {
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

  return fibra.run(2, 5)
}
