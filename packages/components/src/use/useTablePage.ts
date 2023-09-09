import type { OpFields } from '../op-form'
import type { OpSearchFormProps } from '../op-search-form'
import type { OpTableColumn, OpTableColumns, OpTableProps } from '../op-table'
import type { ElPaginationProps } from '../types'

export interface UseTablePageOptions {
  title?: string
  columns: OpTableColumns
  searchFields?: OpFields
  tableProps?: OpTableProps
  searchFormProps?: OpSearchFormProps
  paginationProps?: ElPaginationProps
}

export function useTablePage(options: UseTablePageOptions) {

}
