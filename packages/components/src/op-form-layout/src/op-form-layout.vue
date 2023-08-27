<script lang="ts" setup>
import { ElRow } from 'element-plus'
import type { ElColProps } from '../../types'
import { useChildren } from '../../use'
import { formLayoutKey } from '../../context'

defineOptions({
  name: 'OpFormLayout',
})

const props = withDefaults(defineProps<{
  layout: number | ElColProps
}>(), {
  layout: 12,
})

const { linkChildren } = useChildren(formLayoutKey)

linkChildren({ layout: props.layout })
</script>

<template>
  <ElRow :gutter="20">
    <slot />
  </ElRow>
</template>
