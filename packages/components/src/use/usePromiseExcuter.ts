import { ref, shallowRef, toValue } from 'vue'
import type { FetchAnything, FetchInfo, ReturnTypeOfFetch } from '../types'

export interface UsePromiseExecuterOptions<T, P> extends FetchInfo<T, P> {
  immediate?: boolean
}

export function usePromiseExecuter<T extends FetchAnything, R = ReturnTypeOfFetch<T>, P = Parameters<T>[0]>(options: UsePromiseExecuterOptions<T, P>) {
  const { fetch, fetchParams } = options
  const loading = ref(false)
  const data = shallowRef<R>()
  const execute = async () => {
    if (!fetch) {
      return
    }
    if (loading.value) {
      return
    }
    try {
      const res = await fetch(toValue(fetchParams))
      data.value = res
    }
    finally {
      loading.value = false
    }
  }
  return {
    execute,
    data,
    loading,
  }
}

// const fetchInfo = (data: { name: string }) => {
//   return Promise.resolve({
//     value: 111,
//     label: 222,
//   })
// }

// const { data } = usePromiseExecuter({ fetch: fetchInfo })
