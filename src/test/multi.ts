import Fibra, { Task } from '..'

export default async function() {
  type I = { Fibra: typeof Fibra }
  const api = {
    a: 10
  }
  const task: Task<string, I, typeof api> = async function (i: number) {
    const { Fibra } = this.import

    const date = Date.now()
    while (Date.now() - date < 10e3 * i) {}

    debugger
    if (1) throw new Error(Fibra.name)

    return Fibra.name
  }

  const fibras: Fibra<string, I, typeof api>[] = []
  const promises: Promise<any>[] = []

  for (let i = 1; i <= Fibra.cores; ++i) {
    const fibra = new Fibra<string, I, typeof api>(
      task,
      {
        import: {
          path: '*',
          child_process: ['spawn'],
          '..': 'Fibra',
        },
        api
      }
    )

    fibras.push(fibra)

    promises.push(fibra.run(i).then((res) => console.log('res', i, res), (err) => console.error('err', i, err)))
  }

  let time = 1e3
  let counter = 30e3 / time
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

  await Promise.all(promises)
}
