import type { AllowedComponentProps, VNodeProps } from 'vue'

export type RecordAble = Record<string, unknown>

export type BooleanAble<Param = any> = boolean | ((...p: Param[]) => boolean)

export type PickComponentProps<T extends abstract new (...args: any) => any, P = InstanceType<T>['$props']> = {
  -readonly [K in keyof Omit<P, keyof VNodeProps | keyof AllowedComponentProps>]: P[K]
}

export type Promisable<T> = T | PromiseLike<T>
