<script setup lang="tsx">
import { useOpForm } from 'components'
import { computed, ref } from 'vue'

const { config } = useOpForm({
  fields: [
    { label: '姓名', prop: 'name' },
    { label: '手机', prop: 'phone' },
    {
      label: '地址',
      prop: 'address',
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
  </div>
</template>

<style>
html ,body{
  height: 100%;
  background: #f2f2f2;
}
</style>
