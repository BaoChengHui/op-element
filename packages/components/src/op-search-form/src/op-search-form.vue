<script lang="ts" setup>
import { computed, onMounted, ref, shallowRef } from 'vue'
import { omit } from 'lodash-es'
import type { ShallowRef, StyleValue } from 'vue'
import { useEventListener } from '@vueuse/core'
import { ArrowDownBold } from '@element-plus/icons'
import { type OpFields, OpForm, type OpFormInstance } from '../../op-form'
import { OpField } from '../../op-field'
import { booleanAbleExecuter } from '../../utils'

defineOptions({
  name: 'OpSearchForm',
})

const props = withDefaults(defineProps<{
  fields?: OpFields
  fieldMinWidth?: number
  maxCol?: number
}>(), {
  fields: () => {
    return []
  },
  fieldMinWidth: 320,
  maxCol: 4,
})

const visibleFields = computed(() => {
  return props.fields.filter((item) => {
    const { visible = true } = item
    return booleanAbleExecuter(visible)
  }).map((item) => {
    return omit(item, 'visible')
  })
})

const formRef = shallowRef() as ShallowRef<OpFormInstance>

const calcItemSize = () => {
  const containerWidth = (formRef.value.$el as HTMLDivElement).clientWidth
  const maxCol = Math.floor(containerWidth / props.fieldMinWidth)
  const colNumber = Math.min(maxCol, props.maxCol)
  itemStyle.value = {
    width: `${100 / colNumber}%`,
  }
}
useEventListener('resize', () => {
  calcItemSize()
})

const itemStyle = shallowRef<StyleValue>({})

onMounted(() => {
  calcItemSize()
})
</script>

<template>
  <OpForm ref="formRef" class="op-search-form">
    <div v-for="(item, index) in visibleFields" :key="`${index}.${item.prop}`" class="search-item" :style="itemStyle">
      <OpField v-bind="item" />
    </div>
    <div class="search-item-handler">
      <ElButton>重置</ElButton>
      <ElButton type="primary">
        查询
      </ElButton>
      <ElButton :icon="ArrowDownBold" type="text" />
    </div>
  </OpForm>
</template>

<style lang="less">
.op-search-form{
  display: flex;
  flex-wrap: wrap;
  .search-item{
  }
  .search-item-handler{
    text-align: right;
    margin-left: auto;
  }
}
</style>
