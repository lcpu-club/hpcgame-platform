import { Static, Type } from '@sinclair/typebox'

export const pagingSchema = Type.Object({
  page: Type.Integer({ minimum: 1 }),
  perPage: Type.Integer({ minimum: 5, maximum: 50 })
})

export function pagingToOptions(paging: Static<typeof pagingSchema>) {
  const skip = (paging.page - 1) * paging.perPage
  const limit = paging.perPage
  return { skip, limit }
}
