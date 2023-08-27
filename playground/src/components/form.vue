<script setup lang="tsx">
import type { OpFormInstance } from 'op-element'
import { ref } from 'vue'

const model = ref({
  name: '',
  arr: [{
    name: '',
    startTime: '',
    endTime: '',
    newCode: '1',
    newName: '上海',
  }],
  cityCode: '1',
  cityName: '上海',
})

const formRef = ref<OpFormInstance>()

const handlerV = () => {
  formRef.value?.validate()
}

const handlerReset = () => {
  formRef.value?.resetFields()
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const newNumbers = numbers.splice(2, 1, 2 - 1)[0]
numbers[2] = newNumbers

console.log('numbers', numbers)
console.log('newNumbers', newNumbers)
</script>

<template>
  <div style="padding: 16px;">
    <OpForm ref="formRef" v-model="model" inline>
      <div>
        数组
      </div>
      <OpArrayField v-slot="{ field }" prop="arr">
        <template v-for="(item, index) in field.get()" :key="index">
          <OpField label="name" :prop="`${index}.name`" required />
          <OpField label="daterange" :prop="`${index}.[startTime,endTime]`" :component="{ type: 'daterange' }" required />
          <!-- <OpField
          label="objValue" prop="0.{cityCode:newCode,cityName:newName}"
          required
          :component="{
            type: 'select',
            props: {
              options: [
                { label: '上海', value: { cityCode: '1', cityName: '上海' } },
                { label: '浙江', value: { cityCode: '2', cityName: '浙江' } },
              ],
              valueKey: 'cityCode',
            },
          }"
        /> -->
          <ElButton @click="field.moveUp(index)">
            上移
          </ElButton>
          <ElButton @click="field.moveDown(index)">
            下移
          </ElButton>
          <ElButton @click="field.remove(index)">
            删除
          </ElButton>
        </template>
        <ElButton @click="field.add({})">
          添加
        </ElButton>
      </OpArrayField>
      <div>普通</div>
      <OpField label="name" prop="name" required />
      <OpField label="daterange" prop="[startTime,endTime]" :component="{ type: 'daterange' }" :default-value="['2023-09-01', '2023-09-17']" required />
      <OpField
        label="objValue" prop="{cityCode,cityName}"
        required
        :component="{
          type: 'select',
          props: {
            options: [
              { label: '上海', value: { cityCode: '1', cityName: '上海' } },
              { label: '浙江', value: { cityCode: '2', cityName: '浙江' } },
            ],
            valueKey: 'cityCode',
          },
        }"
      />
    </OpForm>

    <ElButton type="primary" @click="handlerV">
      表单校验
    </ElButton>
    <ElButton type="primary" @click="handlerReset">
      重置表单
    </ElButton>
  </div>
</template>

<style>
html ,body{
  height: 100%;
  background: #f2f2f2;
}
</style>
