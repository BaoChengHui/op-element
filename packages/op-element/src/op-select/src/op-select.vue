<script lang="ts" setup>
import { ElOption, ElSelect } from 'element-plus'
import { computed } from 'vue'
import type { OpSelectGroup, OpSelectOption } from './op-select.type'

defineOptions({
  name: 'OpSelect',
})

const props = defineProps<{
  options: OpSelectOption[] | OpSelectGroup[]
}>()

const isGroup = computed(() => {
  return props.options.length > 0 && !!props.options[0].options
})
</script>

<template>
  <ElSelect>
    <template v-if="isGroup">
      <ElOptionGroup v-for="g in (options as OpSelectGroup[])" :key="g.label" :label="g.label">
        <ElOption v-for="item in g.options" :key="item.value.toString()" :label="item.label" :value="item.value" />
      </ElOptionGroup>
    </template>
    <template v-else>
      <ElOption v-for="item in (options as OpSelectOption[])" :key="item.value.toString()" :label="item.label" :value="item.value" />
    </template>
  </ElSelect>
</template>
