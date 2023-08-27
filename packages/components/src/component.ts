import type { Plugin } from 'vue'
import { OpTable } from './op-table'
import { OpField } from './op-field'
import { OpSelect } from './op-select'
import { OpForm } from './op-form'
import { OpArrayField } from './op-array-field'

export default [
  OpTable,
  OpField,
  OpSelect,
  OpForm,
  OpArrayField,
] as Plugin[]
