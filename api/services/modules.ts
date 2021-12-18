import { promise as glob } from 'glob-promise'
import { join } from 'path'

export const getModules = async <T = any>(pattern: string, exports?: string): Promise<T[]> => {
  let files = await glob(pattern)
  files = files.filter((file) => !file.includes('node_modules'))

  const modules = await Promise.all(
    files.map(async (file) => {
      file = join(process.cwd(), file)
      const module = exports ? (await import(file))[exports] : await import(file)

      if (!module) {
        throw new Error(`Cannot get module from ${file} ${exports ?? ''}`)
      }

      return module
    })
  )

  return modules
}

export const getTypes = async () => getModules('./**/types.ts', 'types')
