<script setup lang="tsx">
import { type OpFormInstance, useOpForm } from 'components'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref } from 'vue'

const asyncInit = (): Promise<{ name: string; phone: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: '111',
        phone: '222',
      })
    }, 1000)
  })
}
const { config, handlerSubmit, submitLoading, resetFields } = useOpForm<{
  name: string
  phone: string
  address: string
}>({
  fields: [
    { label: '姓名', prop: 'name', required: true, defaultValue: '5555' },
    { label: '手机', prop: 'phone', required: true, defaultValue: '5555' },
    {
      label: '地址',
      prop: 'address',
      defaultValue: '5555',
    },
  ],
  formProps: {
    layout: 8,
    inline: true,
  },
})
</script>

<template>
  <div style="padding: 16px;">
    <OpForm v-bind="config" />
    <ElButton @click="resetFields()">
      重置表单
    </ElButton>
    <ElButton :loading="submitLoading" @click="handlerSubmit">
      提交
    </ElButton>
  </div>
</template>

<style>
html ,body{
  height: 100%;
  background: #f2f2f2;
}
</style>
