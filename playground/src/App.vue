<script setup lang="tsx">
import type { OpTableColumn } from 'op-element'
import { ref } from 'vue'

const columns: OpTableColumn[] = [
  { label: '序号', type: 'index', width: 60 },
  { type: 'selection', width: 60 },
  {
    type: 'expand',
    width: 60,
    renderCell(data) {
      return <div>12222</div>
    },
  },
  {
    label: '姓名',
    prop: 'username',
    slot: 'usename',
    headerSlot: 'usenameHeader',
    renderCell({ row, $index, column }) {
      return <div>{row.username}{$index}</div>
    },
    renderHeader(data) {
      return <div>11111</div>
    },
  },
  { label: '手机', prop: 'phone' },
]
const data = ref(
  [{
    username: 'bch',
    phone: '185455141455',
  }, {
    username: 'bch2',
    phone: '185455141455',
  }],
)
</script>

<template>
  <div style="padding: 16px;">
    <OpTable
      :columns="columns"
      :data="data" height="300px" :class="1111" class-name="aaaa" :current-row-key="123" :fit="true"
    />
  </div>
</template>

<style>
html ,body{
  height: 100%;
  background: #f2f2f2;
}
</style>
