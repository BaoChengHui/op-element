<script setup lang="tsx">
import { type OpFormInstance, useCreateForm } from 'components'
import { ref } from 'vue'

const from = useCreateForm({
  city: '1222',
})

const handlerValidate = () => {
  console.log('valid....')
}

const fromRef = ref<OpFormInstance>()
const handlerValid = () => {
  fromRef.value?.validate()
}

const handlerReset = () => {
  fromRef.value?.resetFields()
}
</script>

<template>
  <div style="padding: 16px;">
    {{ from.model }}
    <OpForm ref="fromRef" :form="from" @validate="handlerValidate">
      <OpField label="姓名" prop="name" required default="3" />
      <OpField label="城市" prop="city" required />
      <OpField label="时间" prop="[start,end]" :component="{ type: 'daterange' }" required />
      <OpArrayField prop="infos">
        <OpField label="手机" prop="0.phone" required />
        <OpField label="时间" prop="0.[start,end]" :component="{ type: 'daterange' }" required />
        <OpField label="手机" prop="1.phone" required />
        <OpField label="时间" prop="1.[start,end]" :component="{ type: 'daterange' }" required />
      </OpArrayField>
    </OpForm>
    <ElButton @click="handlerValid">
      校验
    </ElButton>
    <ElButton @click="handlerReset">
      重置
    </ElButton>
  </div>
</template>

<style>
html ,body{
  height: 100%;
  background: #f2f2f2;
}
</style>
