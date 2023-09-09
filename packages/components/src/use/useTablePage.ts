import { type MaybeRef, computed, shallowRef, unref } from 'vue'
import type { OpFields } from '../op-form'
import type { OpSearchFormProps } from '../op-search-form'
import type { OpTableColumns, OpTableProps } from '../op-table'
import type { ElPaginationProps, FetchPaginData } from '../types'
import type { OpTablePageProps } from '../op-table-page/src/op-table-page.type'

export interface UseTablePageOptions<T> {
  title?: string
  columns: MaybeRef<OpTableColumns>
  searchFields?: MaybeRef<OpFields>
  tableProps?: MaybeRef<OpTableProps>
  searchFormProps?: MaybeRef<OpSearchFormProps>
  paginationProps?: MaybeRef<ElPaginationProps>
  fetch?: FetchPaginData<T>
}

export function useTablePage<T>(options: UseTablePageOptions<T>) {
  const { title, columns, searchFields, tableProps, searchFormProps, paginationProps } = options

  const data = shallowRef<T[]>([])

  const config = computed<OpTablePageProps>(() => {
    return {
      title,
      searchFields: {
        searchFields: unref(searchFields),
        ...unref(searchFormProps),
      },
      tableProps: {
        columns: unref(columns),
        ...unref(tableProps),
        data: unref(data),
      },
      paginationProps: {
        currentPage: 1,
        total: 1,
        pageSize: 10,
      },
    }
  })

  return {
    config,
    data,
  }
}
