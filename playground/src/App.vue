<script setup lang="tsx">
import { FormDialog, useFormDialog } from 'components'
import { reactive, ref } from 'vue'
import SomeForm from './SomeForm.vue'

const { config, callCreate, callModify } = useFormDialog<{
  name: string
  address: string
}>({
  title: '个人信息模板',
  // fields: [
  //   { label: '姓名', prop: 'name', required: true },
  //   { label: '地址', prop: 'address', required: true },
  //   { label: '时间', prop: '[start,end]', required: true, component: { type: 'daterange' } },
  // ],
  onSubmit(params) {
    console.log('params', params)
  },
  onSuccess() {
    console.log('success')
  },
})

const handlerCall = () => {
  callModify({
    name: '111',
    address: '222',
    arr: [{
      name: '333',
      address: '333',
      start: '2023-08-01',
      end: '2023-08-31',
    }],
  })
}

// const formDialog = FormDialog<{
//   name: string
//   address: string
// }>({
//   title: '个人信息',
//   onSubmit(params) {
//     console.log('params', params)
//   },
//   formComponent: SomeForm,
// })

// const handlerModify = () => {
//   formDialog.modify({ name: '111', address: '222' }).then(() => {
//   }).catch(() => {
//   })
// }

// const handlerOpen = () => {
//   /// callCreate()
//   formDialog.create().then(() => {
//   }).catch(() => {
//   })
// }

// const formDialog2 = FormDialog<{
//   name: string
//   address: string
// }>({
//   title: '个人信息2',
//   fields: [
//     { label: '姓名2', prop: 'name', required: true },
//     { label: '地址2', prop: 'address', required: true },
//   ],
// })

// const handlerOpen2 = () => {
//   formDialog2.create()
// }

// formDialog.callCreate()
</script>

<template>
  <div style="padding: 16px;">
    <OpFormDialog v-bind="config" :form-component="SomeForm" />
    <ElButton @click="handlerCall">
      打开模板弹窗
    </ElButton>
    <ElButton @click="callCreate">
      新增
    </ElButton>
    <!-- <ElButton @click="handlerOpen">
      打开
    </ElButton>
    <ElButton @click="handlerModify">
      修改
    </ElButton>
    <ElButton @click="handlerOpen2">
      打开弹窗2
    </ElButton> -->
  </div>
</template>

<style>
html ,body{
  height: 100%;
  background: #f2f2f2;
}
</style>
