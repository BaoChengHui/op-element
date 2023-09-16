<script setup lang="tsx">
import { useSelect } from 'components'
import { ref } from 'vue'

const list = ref([
  { label2: '111', value2: '1' },
  { label2: '222', value2: '2' },
  { label2: '333', value2: '3' },
  { label2: '444', value2: '4' },
  { label2: '555', value2: '5' },
  { label2: '666', value2: '6' },
])
const fetchData = (data: { keyword: string }) => {
  return Promise.resolve(list.value.filter(item => item.label2.includes(data.keyword)))
}

const { config } = useSelect({
  // fetch: fetchData,
  // remote: true,
  formatter(data) {
    return data.map((item) => {
      return {
        label: item.label2,
        value: item.value2,
      }
    })
  },
  selectProps: {
    filterable: true,
    remoteShowSuffix: true,
  },
  options: list,
})

const value = ref()
</script>

<template>
  <div style="height: 100vh;overflow: auto;padding: 40px;">
    <OpField v-model="value" :component="{ type: 'select', props: config }" />
  </div>
</template>

<style>
html ,body{
  height: 100%;
  background: #f2f2f2;
}
</style>
