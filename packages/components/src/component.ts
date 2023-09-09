import type { Plugin } from 'vue'
import { OpTable } from './op-table'
import { OpField } from './op-field'
import { OpSelect } from './op-select'
import { OpForm } from './op-form'
import { OpArrayField } from './op-array-field'
import { OpFormLayout } from './op-form-layout'
import { OpDialog } from './op-dialog'
import { OpFormDialog } from './op-form-dialog'
import { OpSearchForm } from './op-search-form'
import { OpTablePage } from './op-table-page'

export default [
  OpTable,
  OpField,
  OpSelect,
  OpForm,
  OpArrayField,
  OpFormLayout,
  OpDialog,
  OpFormDialog,
  OpSearchForm,
  OpTablePage,
] as Plugin[]
