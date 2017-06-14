import Fibra from '..'

const t = new Fibra(async function () {
  return 1
})

async function main() {
  type I = { Fibra: typeof Fibra }

  const fibras: Fibra<string, I>[] = []

  for (let i = 1; i <= Fibra.cores; ++i) {
    const fibra = new Fibra<string, I>(
      async function (i: number) {
        const { Fibra } = this.import

        const date = Date.now()
        while (Date.now() - date < 10000 * i) {}

        debugger
        if (1) throw new Error(Fibra.name)

        return Fibra.name
      },
      {
        import: {
          path: '*',
          child_process: ['spawn'],
          '..': 'Fibra',
        }
      }
    )

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
