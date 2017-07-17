import Fibra from '..'

export default async function () {
  const fibra = new Fibra(
    async function (a) {
      const { array, syncFn, asyncFn, asyncFnError } = this.api

      console.log('length', await array.length)

      const arr = await array
      for (const item of arr) {
        console.log('sync item', item)
      }
      for (let i = 0; i < await arr.length; ++i) {
        console.log('async item', await arr[i])
      }

      console.log('sync fn', await syncFn(a, 10))

      console.log('async fn', await asyncFn())

      try {
        await asyncFnError()
      }
      catch (err) {
        console.error('async fn error', err)
      }

      console.log('DONE')
    },
    {
      api: {
        array: [1, 2, 3],
        syncFn: function (a: number, b: number) {
          return a + b
        },
        asyncFn: function () {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve('success')
            }, 500)
          })
        },
        asyncFnError: function () {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              reject('fail')
            }, 500)
          })
        }
      }
    }
  )

  await fibra.run(1)
}
