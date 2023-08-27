import type { Plugin } from 'vue'
import { OpTable } from './op-table'
import { OpField } from './op-field'
import { OpSelect } from './op-select'
import { OpForm } from './op-form'
import { OpArrayField } from './op-array-field'
import { OpFormLayout } from './op-form-layout'

export default [
  OpTable,
  OpField,
  OpSelect,
  OpForm,
  OpArrayField,
  OpFormLayout,
] as Plugin[]
