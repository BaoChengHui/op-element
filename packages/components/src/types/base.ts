export type Recordable = Record<string, unknown>
export type Booleanable<Param = any> = boolean | ((...p: Param[]) => boolean)
export type Promisable<T> = T | PromiseLike<T>
export type Arrayable<T> = T | Array<T>
export type PickComponentProps<T extends abstract new (...args: any) => any, P = InstanceType<T>['$props']> = {
  -readonly [K in keyof P]: P[K]
}
export interface PaginParams {
  pageNo: number
  pageSize: number
}

export interface PaginResult<T = any> {
  total: number
  records: T[]
}
