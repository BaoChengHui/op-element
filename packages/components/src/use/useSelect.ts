import { type MaybeRefOrGetter, computed, ref, shallowRef, toValue, unref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { FetchAnything, Recordable, ReturnTypeOfFetch } from '../types'
import type { OpSelectOption, OpSelectProps } from '../op-select'
import { isArray } from '../utils'
import { usePromiseExecuter } from './usePromiseExcuter'

export interface UseSelectOptions<T, Option> {
  immediate?: boolean
  fetch?: T
  fetchParams?: MaybeRefOrGetter<Recordable>
  remote?: boolean
  /**
   * @default 'keyword'
   */
  remoteKeyword?: string
  selectProps?: MaybeRefOrGetter<Omit<OpSelectProps, 'options'>>
  /**
   * @default label
   */
  labelKey?: string
  /**
   * @default value
   */
  valueKey?: string
  formatter?: (data: Option[]) => OpSelectOption[]
}

export function useSelect<T extends FetchAnything<any[]>, R = ReturnTypeOfFetch<T>, Option = R extends any[] ? R[number] : any >(options: UseSelectOptions<T, Option>) {
  const { immediate = true, fetch, fetchParams, remote = false, remoteKeyword = 'keyword', labelKey = 'label', valueKey = 'value', selectProps, formatter } = options

  const selectOptions = shallowRef<OpSelectOption[]>([])
  const remoteParams = ref<Recordable>({})
  const getFetchParams = () => {
    if (remote) {
      return {
        ...toValue(fetchParams),
        ...remoteParams.value,
      }
    }
    return toValue(fetchParams)
  }

  const formatterOptions = (data: any[]) => {
    if (formatter) {
      return formatter(data)
    }
    return data.map((item) => {
      return {
        ...item,
        label: item[labelKey],
        value: item[valueKey],
      }
    })
  }

  const { data, loading, execute } = usePromiseExecuter({
    fetch,
    fetchParams: getFetchParams,
    immediate: false,
  })

  const fetchData = async () => {
    if (!fetch) {
      return
    }
    await execute()
    if (isArray(data.value)) {
      selectOptions.value = formatterOptions(data.value)
    }
    else {
      console.warn('111')
    }
  }

  const remoteMethod = useDebounceFn((val: string) => {
    remoteParams.value[remoteKeyword] = val
    fetchData()
  }, 300)

  const config = computed(() => {
    const res = remote
      ? {
          remote,
          remoteMethod,
        }
      : {}

    return {
      ...res,
      options: unref(selectOptions),
      ...toValue(selectProps),
    } as OpSelectProps
  })

  if (immediate && !remote) {
    fetchData()
  }

  return {
    loading,
    config,
  }
}
