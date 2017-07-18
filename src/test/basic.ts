import Fibra from '..'

export default async function () {
  const a = new Fibra(async function () {
    return 1
  })

  console.log(await a.run())

  const b = new Fibra(async function () {
    throw new Error('error')
  })

  try {
    await b.run()
  }
  catch (err) {
    console.error(err)
  }
}
