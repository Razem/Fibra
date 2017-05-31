export type ImportSubItem = string | [string, string]
export type ImportItem = string | ImportSubItem[]
export interface Imports {
  [key: string]: ImportItem
}

export function generateImports(imports: Imports) {
  const res = []

  for (const module in imports) {
    const require = `require(${JSON.stringify(module)})`
    const def = imports[module]

    if (typeof def === 'string') {
      if (def === '*') {
        res.push(`${module}: ${require}`)
      }
      else {
        res.push(`${def || module}: ${require}.default`)
      }
    }
    else if (def instanceof Array) {
      if (def[0] === '*') {
        res.push(`${def[1]}: ${require}`)
      }
      else {
        for (const item of def) {
          if (item instanceof Array) {
            res.push(`${item[1]}: ${require}[${JSON.stringify(item[0])}]`)
          }
          else {
            res.push(`${item}: ${require}[${JSON.stringify(item)}]`)
          }
        }
      }
    }
  }

  return `{ ${res.join(', ')} }`
}
