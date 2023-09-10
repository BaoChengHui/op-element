<script setup lang="tsx">
import { useTablePage } from 'components'

const { config } = useTablePage({
  title: '新的冒险',
  searchFields: [
    { label: 'name', prop: 'name' },
    { label: 'address', prop: 'address' },
    { label: 'phone', prop: 'phone' },
  ],
  searchFormProps: {
    labelWidth: '96px',
  },
  columns: [
    { label: 'name', prop: 'name' },
    { label: 'address', prop: 'address' },
    {
      label: 'phone',
      prop: 'phone',
    },
  ],
  fetch(params) {
    console.log('params', params)
    return Promise.resolve([
      { name: '1', address: '11', phone: '33' },
      { name: '2', address: '11', phone: '33' },
      { name: '3', address: '11', phone: '33' },
      { name: '4', address: '11', phone: '33' },
      { name: '5', address: '11', phone: '33' },
      { name: '6', address: '11', phone: '33' },
      { name: '7', address: '11', phone: '33' },
      { name: '8', address: '11', phone: '33' },
      { name: '9', address: '11', phone: '33' },
      { name: '10', address: '11', phone: '33' },
      { name: '11', address: '11', phone: '33' },
    ])
  },
  nativePaging: true,
})
</script>

<template>
  <div style="height: 100vh;overflow: auto;">
    <OpTablePage v-bind="config" />
  </div>
</template>

<style>
html ,body{
  height: 100%;
  background: #f2f2f2;
}
</style>
