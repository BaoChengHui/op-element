import type { MaybeRefOrGetter } from 'vue'

export type Recordable = Record<string, unknown>
export type Booleanable<Param = any> = boolean | ((...p: Param[]) => boolean)
export type Promisable<T> = T | PromiseLike<T>
export type Arrayable<T> = T | Array<T>
export type FetchAnything<R = any> = (...arg: any[]) => Promise<R>
export type ReturnTypeOfFetch<T = FetchAnything> = T extends FetchAnything ? Awaited< ReturnType<T>> : any
export interface FetchInfo<F, R> {
  fetch?: F
  fetchParams?: MaybeRefOrGetter<R>
}

export interface PaginParams {
  pageNo: number
  pageSize: number
}

export interface PaginResult<T = any> {
  total: number
  records: T[]
}
