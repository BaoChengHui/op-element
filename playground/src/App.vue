<script setup lang="tsx">
import { type OpFields, type OpFormInstance, useCreateForm } from 'components'
import { ref } from 'vue'

const from = useCreateForm({
  city: '1222',
})

const handlerValidate = () => {
  console.log('update.......')
}

const fromRef = ref<OpFormInstance>()
const handlerValid = () => {
  fromRef.value?.validate()
}

const handlerReset = () => {
  fromRef.value?.resetFields()
}

const fields: OpFields = [
  { label: '姓名', prop: 'name' },
  { label: '城市1', prop: 'city' },
  { label: '城市2', prop: 'city1' },
  { label: '城市3', prop: 'city2' },
  // { label: '城市4', prop: 'city3' },
  // { label: '城市5', prop: 'city4' },
  // { label: '城市6', prop: 'city5' },
  // { label: '城市7', prop: 'city6' },
  { label: '时间', prop: '[start,end]', component: { type: 'daterange' } },
]
</script>

<template>
  <div style="padding: 16px;">
    <OpSearchForm :form="from" :fields="fields" label-width="80px" @update="handlerValidate">
      <!-- <OpField label="姓名" prop="name" required default="3" />
      <OpField label="城市" prop="city" required />
      <OpField label="时间" prop="[start,end]" :component="{ type: 'daterange' }" required />
      <OpArrayField prop="infos">
        <OpField label="手机" prop="0.phone" required />
        <OpField label="时间" prop="0.[start,end]" :component="{ type: 'daterange' }" required />
        <OpField label="手机" prop="1.phone" required />
        <OpField label="时间" prop="1.[start,end]" :component="{ type: 'daterange' }" required />
      </OpArrayField> -->
    </OpSearchForm>
    <!-- <ElButton @click="handlerValid">
      校验
    </ElButton>
    <ElButton @click="handlerReset">
      重置
    </ElButton> -->
  </div>
</template>

<style>
html ,body{
  height: 100%;
  background: #f2f2f2;
}
</style>
