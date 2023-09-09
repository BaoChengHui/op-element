<script lang="ts" setup>
import { computed, onMounted, ref, shallowRef } from 'vue'
import { omit } from 'lodash-es'
import type { ShallowRef, StyleValue } from 'vue'
import { useEventListener } from '@vueuse/core'
import { ArrowDownBold, ArrowUpBold } from '@element-plus/icons'
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
  resetText?: string
  searchText?: string
}>(), {
  fields: () => {
    return []
  },
  fieldMinWidth: 320,
  maxCol: 4,
})

const emit = defineEmits(['reset', 'search'])

const visibleFields = computed(() => {
  return props.fields.filter((item) => {
    const { visible = true } = item
    return booleanAbleExecuter(visible)
  }).map((item) => {
    return omit(item, 'visible')
  })
})

const formRef = shallowRef() as ShallowRef<OpFormInstance>
const isCollapse = ref(false)
const showCollapse = ref(false)
const hideStartIndex = ref(-1)
const itemStyle = shallowRef<StyleValue>({})

const calcItemSize = () => {
  const containerWidth = (formRef.value.$el as HTMLDivElement).clientWidth
  const maxCol = Math.floor(containerWidth / props.fieldMinWidth)
  const colNum = Math.min(maxCol, props.maxCol)
  const curRowNum = Math.ceil((visibleFields.value.length + 1) / colNum)
  hideStartIndex.value = colNum * 2 - 1
  if (curRowNum > 2) {
    showCollapse.value = true
    isCollapse.value = true
  }
  else {
    showCollapse.value = false
    isCollapse.value = false
  }
  itemStyle.value = {
    width: `${100 / colNum}%`,
  }
}

const fieldIsHide = (index: number) => {
  if (!isCollapse.value) {
    return true
  }
  if (index >= hideStartIndex.value) {
    return false
  }
  return true
}

useEventListener('resize', () => {
  calcItemSize()
})

const handlerCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handlerReset = () => {
  emit('reset')
}

const handlerSearch = () => {
  emit('search')
}

onMounted(() => {
  calcItemSize()
})
</script>

<template>
  <OpForm ref="formRef" class="op-search-form">
    <div v-for="(item, index) in visibleFields" v-show="fieldIsHide(index)" :key="`${index}.${item.prop}`" class="search-item" :style="itemStyle">
      <OpField v-bind="item" />
    </div>
    <div class="search-item-handler">
      <ElButton @click="handlerReset">
        重置
      </ElButton>
      <ElButton type="primary" @click="handlerSearch">
        查询
      </ElButton>
      <ElButton v-if="showCollapse" :icon="isCollapse ? ArrowDownBold : ArrowUpBold" link @click="handlerCollapse" />
    </div>
  </OpForm>
</template>

<style lang="less">
.op-search-form{
  display: flex;
  flex-wrap: wrap;
  .search-item{
    flex-shrink: 0;
  }
  .search-item-handler{
    text-align: right;
    margin-left: auto;
  }
}
</style>
