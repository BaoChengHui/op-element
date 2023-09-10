import { type MaybeRefOrGetter, computed, onMounted, ref, shallowRef, toValue, watchEffect } from 'vue'
import type { OpFields } from '../op-form'
import type { OpSearchFormProps } from '../op-search-form'
import type { OpTableColumns, OpTableProps } from '../op-table'
import type { ElPaginationProps, PaginResult, Recordable } from '../types'
import type { OpTablePageProps } from '../op-table-page/src/op-table-page.type'
import { isArray } from '../utils'
import { useCreateForm } from './useCreateForm'

export interface UseTablePageOptions<T> {
  title?: string
  columns: MaybeRefOrGetter<OpTableColumns<T>>
  searchFields?: MaybeRefOrGetter<OpFields>
  tableProps?: MaybeRefOrGetter<OpTableProps>
  searchFormProps?: MaybeRefOrGetter<OpSearchFormProps>
  paginationProps?: MaybeRefOrGetter<ElPaginationProps>
  fetch?: (...arg: any[]) => Promise<PaginResult<T>> | Promise< T[]>
  fetchParams?: MaybeRefOrGetter<Recordable>
  immediate?: boolean
  data?: MaybeRefOrGetter<T[]>
  nativePaging?: boolean
}

export function useTablePage<T>(options: UseTablePageOptions<T>) {
  const { title, columns = [], searchFields, tableProps, searchFormProps, paginationProps, immediate = true, fetch, fetchParams = {}, nativePaging = false, data: list = [] } = options

  const data = shallowRef<T[]>([])
  const loading = ref(false)
  const paginInfo = ref({
    currentPage: toValue(paginationProps)?.defaultCurrentPage ?? 1,
    pageSize: toValue(paginationProps)?.defaultPageSize ?? 10,
  })
  const total = ref(0)
  const remoteList = shallowRef<T[]>([])
  const form = useCreateForm()

  const getFetchParams = () => {
    return {
      ...toValue(paginInfo),
      ...toValue(fetchParams),
      ...form.model,
    }
  }

  const fetchData = async (reset: boolean = false) => {
    if (loading.value) {
      return
    }
    if (!fetch) {
      return
    }
    try {
      if (reset) {
        paginInfo.value.currentPage = 1
      }
      loading.value = true
      const res = await fetch(getFetchParams())
      if (isArray(res)) {
        remoteList.value = res
      }
      else {
        data.value = res.records
        total.value = res.total
      }
    }
    finally {
      loading.value = false
    }
  }

  watchEffect(() => {
    const listValue = remoteList.value.length ? remoteList.value : toValue(list)
    const length = listValue.length
    if (length) {
      if (nativePaging) {
        total.value = length
        const { currentPage, pageSize } = paginInfo.value
        const start = pageSize * (currentPage - 1)
        data.value = listValue.slice(start, start + pageSize)
      }
      else {
        data.value = listValue
      }
    }
  })

  const handlerUpdateCurrentPage = (val: number) => {
    paginInfo.value.currentPage = val
    fetchData()
  }

  const handlerUpdatePageSize = (val: number) => {
    paginInfo.value.pageSize = val
    fetchData(true)
  }

  const config = computed<OpTablePageProps>(() => {
    return {
      title,
      searchFormProps: {
        fields: toValue(searchFields),
        form,
        onSearch() {
          fetchData(true)
        },
        ...toValue(searchFormProps),
      },
      tableProps: {
        columns: toValue(columns),
        data: toValue(data),
        ...toValue(tableProps),
      },
      paginationProps: {
        'onUpdate:current-page': handlerUpdateCurrentPage,
        'onUpdate:page-size': handlerUpdatePageSize,
        'disabled': loading.value,
        'background': true,
        'total': total.value,
        'layout': 'total, sizes, prev, pager, next, jumper',
        ...toValue(paginInfo),
        ...toValue(paginationProps),
      },
    }
  })

  onMounted(() => {
    if (immediate) {
      fetchData()
    }
  })

  return {
    config,
    data,
    fetchData,
  }
}
