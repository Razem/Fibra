import * as readline from 'readline'
import * as fs from 'fs'

function run(test: string) {
  let main: () => Promise<any>
  try {
    main = require(`./${test}`).default
  }
  catch (err) {
    console.error(`[ERROR] Test ${test} does not exist!`)
    return
  }

  console.log(`[TEST ${test} START]`)

  return main()
    .then((res) => console.log(`[TEST ${test} SUCCESS]`, res))
    .catch((err) => console.error(`[TEST ${test} FAIL]`, err))
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('Test: ', (test) => {
  if (test) {
    run(test)
  }
  else {
    (async function () {
      const dir = fs.readdirSync('./dist/test')

      for (const file of dir) {
        if (file.endsWith('.js') && file !== 'index.js') {
          await run(file.replace(/\.js$/, ''))
        }
      }
    })()
  }

  rl.question('', () => {
    rl.close()
  })
})
