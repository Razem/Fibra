import Fibra from '..'

async function main() {
  const runnable = async (imports: any, i: number) => {
    const { Fibra } = imports

    const date = Date.now()
    while (Date.now() - date < 10000 * i) {}

    if (1) throw new Error(Fibra.name)

    return Fibra.name
  }

  for (let i = 1; i <= Fibra.cores; ++i) {
    var fibra = new Fibra<string>(runnable)

    fibra.import({
      path: '*',
      child_process: ['spawn'],
      '..': 'Fibra',
    })

    fibra.run(i).then((res) => console.log(res + i), (err) => console.error(err))
  }

  let time = 1000
  let counter = 50000 / time
  const interval = setInterval(function () {
    console.log('test')
    if (--counter <= 0) {
      clearInterval(interval)
    }
  }, time)
}

main().catch((err) => console.error(err))
