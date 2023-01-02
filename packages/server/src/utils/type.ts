import { Type } from '@sinclair/typebox'

export function StringEnum<T extends string[]>(values: readonly [...T]) {
  return Type.Unsafe<T[number]>({ type: 'string', enum: values })
}
