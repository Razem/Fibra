import Fibra from '..'

async function main() {
  const runnable = async (imports: any, i: number) => {
    const { Fibra } = imports

    const date = Date.now()
    while (Date.now() - date < 10000 * i) {}

    debugger
    if (1) throw new Error(Fibra.name)

    return Fibra.name
  }

  const fibras: Fibra<string>[] = []

  for (let i = 1; i <= Fibra.cores; ++i) {
    const fibra = new Fibra<string>(runnable)
    fibra.import({
      path: '*',
      child_process: ['spawn'],
      '..': 'Fibra',
    })

    fibras.push(fibra)

    fibra.run(i).then((res) => console.log('res', i, res), (err) => console.error('err', i, err))
  }

  let time = 1000
  let counter = 50000 / time
  let iter = 0
  const interval = setInterval(function () {
    console.log('test')
    if (++iter === 2) {
      fibras[0].kill()
    }
    if (--counter <= 0) {
      clearInterval(interval)
    }
  }, time)
}

main().catch((err) => console.error(err))
