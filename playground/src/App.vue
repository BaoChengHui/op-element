<script setup lang="tsx">
import { useFormDialog } from 'components'
import { reactive, ref } from 'vue'

const { config, callCreate, callModify } = useFormDialog<{
  name: string
  address: string
}>({
  title: '个人信息',
  fields: [
    { label: '姓名', prop: 'name', required: true },
    { label: '地址', prop: 'address', required: true },
  ],
  onSubmit(params) {
    console.log('params', params)
  },
  onSuccess() {
    console.log('success')
  },
})

const handlerModify = () => {
  callModify({
    name: '1111',
    address: '2222',
    other: '222',
  })
}
</script>

<template>
  <div style="padding: 16px;">
    <OpFormDialog v-bind="config" />
    <ElButton @click="callCreate">
      打开
    </ElButton>
    <ElButton @click="handlerModify">
      修改
    </ElButton>
  </div>
</template>

<style>
html ,body{
  height: 100%;
  background: #f2f2f2;
}
</style>
