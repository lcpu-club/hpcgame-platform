import { type Static, Type } from '@sinclair/typebox'

export const pagingSchema = Type.Object({
  page: Type.Integer({ minimum: 1 }),
  perPage: Type.Integer({ minimum: 5, maximum: 50 })
})

export function pagingToOptions(paging: Static<typeof pagingSchema>) {
  const skip = (paging.page - 1) * paging.perPage
  const limit = paging.perPage
  return { skip, limit }
}

export const unsafePagingSchema = Type.Intersect([
  pagingSchema,
  Type.Object({
    sort: Type.Any()
  })
])

export function unsafePagingToOptions(
  paging: Static<typeof unsafePagingSchema>
) {
  const skip = (paging.page - 1) * paging.perPage
  const limit = paging.perPage
  const sort = paging.sort
  return { skip, limit, sort }
}
