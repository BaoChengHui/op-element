export type PickComponentProps<T extends abstract new (...args: any) => any, P = InstanceType<T>['$props']> = {
  -readonly [K in keyof P]: P[K]
}
