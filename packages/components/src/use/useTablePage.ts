import { type MaybeRefOrGetter, computed, onMounted, ref, shallowRef, toValue, unref, watchEffect } from 'vue'
import type { OpTablePageProps } from '../op-table-page/src/op-table-page.type'
import type { ElPaginationProps, FetchAnything, PaginResult, Recordable, ReturnTypeOfFetch } from '../types'
import type { OpFields } from '../op-form'
import type { OpSearchFormProps } from '../op-search-form'
import type { OpTableColumns, OpTableProps } from '../op-table'
import { isArray } from '../utils'
import { useCreateForm } from './useCreateForm'
import { usePromiseExecuter } from './usePromiseExcuter'

export interface UseTablePageOptions<T, ROW> {
  title?: string
  columns: MaybeRefOrGetter<OpTableColumns<ROW>>
  fetch?: T
  fetchParams?: MaybeRefOrGetter<Recordable>
  searchFields?: MaybeRefOrGetter<OpFields>
  tableProps?: MaybeRefOrGetter<OpTableProps>
  searchFormProps?: MaybeRefOrGetter<OpSearchFormProps>
  paginationProps?: MaybeRefOrGetter<ElPaginationProps>
  immediate?: boolean
  data?: MaybeRefOrGetter<ROW[]>
  nativePaging?: boolean
}

export function useTablePage<
T extends FetchAnything<PaginResult | any[]>, R = ReturnTypeOfFetch<T>, P = Parameters<T>[0], ROW = R extends PaginResult ? R['records'][number] : R extends any[] ? R[number] : any >(options: UseTablePageOptions<T, ROW>) {
  const { title, columns = [], searchFields, tableProps, searchFormProps, paginationProps, immediate = true, fetch, fetchParams = {}, nativePaging = false, data: list = [] } = options

  const paginInfo = ref({
    currentPage: toValue(paginationProps)?.defaultCurrentPage ?? 1,
    pageSize: toValue(paginationProps)?.defaultPageSize ?? 10,
  })
  const total = ref(0)
  const tableData = shallowRef<ROW[]>([])
  const remoteData = shallowRef<ROW[]>([])
  const form = useCreateForm()
  const getFetchParams = () => {
    return {
      ...toValue(paginInfo),
      ...toValue(fetchParams),
      ...form.model,
    }
  }

  const { execute, loading, data } = usePromiseExecuter({ fetch, fetchParams: getFetchParams, immediate: false })

  const fetchData = async (reset: boolean = false) => {
    if (!fetch) {
      return
    }
    if (reset) {
      paginInfo.value.currentPage = 1
    }
    await execute()
    if (isArray(data.value)) {
      remoteData.value = data.value
    }
    else {
      tableData.value = data.value?.records ?? []
      total.value = data.value?.total ?? 0
    }
  }

  watchEffect(() => {
    const listValue = remoteData.value.length ? remoteData.value : toValue(list)
    const length = listValue.length
    if (nativePaging) {
      total.value = length
      const { currentPage, pageSize } = paginInfo.value
      const start = pageSize * (currentPage - 1)

      tableData.value = listValue.slice(start, start + pageSize)
      return
    }

    tableData.value = listValue
  })

  const handlerUpdateCurrentPage = (val: number) => {
    paginInfo.value.currentPage = val
    if (!nativePaging) {
      fetchData()
    }
  }

  const handlerUpdatePageSize = (val: number) => {
    paginInfo.value.pageSize = val
    if (!nativePaging) {
      fetchData(true)
    }
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
        ...toValue(tableProps),
        data: unref(tableData),
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
    fetchData,
    tableData,
  }
}
