<script setup lang="tsx">
import { FormDialog, useFormDialog } from 'components'
import { reactive, ref } from 'vue'
import SomeForm from './SomeForm.vue'

const { config, callCreate, callModify } = useFormDialog<{
  name: string
  address: string
}>({
  title: '个人信息模板',
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

const formDialog = FormDialog<{
  name: string
  address: string
}>({
  title: '个人信息',
  onSubmit(params) {
    console.log('params', params)
  },
  formComponent: SomeForm,
})

const handlerModify = () => {
  formDialog.modify({ name: '111', address: '222' }).then(() => {
  }).catch(() => {
  })
}

const handlerOpen = () => {
  /// callCreate()
  formDialog.create().then(() => {
  }).catch(() => {
  })
}

const formDialog2 = FormDialog<{
  name: string
  address: string
}>({
  title: '个人信息2',
  fields: [
    { label: '姓名2', prop: 'name', required: true },
    { label: '地址2', prop: 'address', required: true },
  ],
})

const handlerOpen2 = () => {
  formDialog2.create()
}

// formDialog.callCreate()
</script>

<template>
  <div style="padding: 16px;">
    <OpFormDialog v-bind="config" />
    <ElButton @click="callCreate">
      打开模板弹窗
    </ElButton>
    <ElButton @click="handlerOpen">
      打开
    </ElButton>
    <ElButton @click="handlerModify">
      修改
    </ElButton>
    <ElButton @click="handlerOpen2">
      打开弹窗2
    </ElButton>
  </div>
</template>

<style>
html ,body{
  height: 100%;
  background: #f2f2f2;
}
</style>
