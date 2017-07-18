import Fibra from '..'

export default async function () {
  const api = {
    array: [1, 2, 3],
    syncFn(a: number, b: number) {
      return a + b
    },
    asyncFn() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('success')
        }, 500)
      })
    },
    asyncFnError() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('fail')
        }, 500)
      })
    },
    deep: {
      a: {
        b: {
          c: true,
          d() {
            return true
          }
        }
      }
    }
  }

  const fibra = new Fibra(
    async function (a: number) {
      const { array, syncFn, asyncFn, asyncFnError, deep } = this.api

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

      console.log(
        'deep',
        (await deep).a.b.c
          && (await deep.a).b.c
          && (await deep.a.b).c
          && (await deep.a.b.c)
          && !(await deep).a.b.d
          && (await deep.a.b.d())
      )

      return 'done'
    },
    {
      api
    }
  )

  return fibra.run(1)
}
