<script lang="ts" setup>
import { ElPagination } from 'element-plus'
import { computed, useSlots } from 'vue'
import { isEmpty } from '../../utils'
import { OpSearchForm } from '../../op-search-form'
import { OpTable, type OpTableProps } from '../../op-table'
import type { OpSearchFormProps } from '../../op-search-form'
import type { ElPaginationProps } from '../../types'

defineOptions({
  name: 'OpTablePage',
})

const props = withDefaults(defineProps<{
  title?: string
  tableProps?: OpTableProps
  searchFormProps?: OpSearchFormProps
  paginationProps?: ElPaginationProps
}>(), {
  tableProps: () => ({}),
  searchFormProps: () => ({}),
  paginationProps: () => ({}),
})

const hasSearch = computed(() => {
  return !isEmpty(props.searchFormProps.fields?.length)
})
const slots = useSlots()
const showSearch = computed(() => {
  return hasSearch.value || slots.search
})
</script>

<template>
  <div class="op-table-page">
    <div v-if="title" class="op-table-page-title">
      {{ title }}
    </div>
    <div v-if="showSearch" class="op-table-page-search">
      <slot name="search">
        <OpSearchForm v-if="hasSearch" v-bind="searchFormProps" />
      </slot>
    </div>
    <div class="op-table-page-action">
      <slot name="actions" />
    </div>
    <div class="op-table-page-body">
      <OpTable v-bind="tableProps" />
    </div>
    <div v-if="paginationProps.total" class="op-table-page-paging">
      <ElPagination v-bind="paginationProps" />
    </div>
  </div>
</template>
