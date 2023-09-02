<script lang="ts" setup>
import { ElButton, ElDialog, ElScrollbar } from 'element-plus'
import { isNumber } from 'lodash-es'
import type { ComponentPublicInstance } from 'vue'
import { onMounted, ref } from 'vue'
import { isString } from '../../utils'

defineOptions({
  name: 'OpDialog',
})

const props = withDefaults(defineProps<{
  /**
   * number时需小于100 值为50，这弹窗整个高度为页面高度的50%
   * string 需要为有效的高度设置,设置的为滚动内容的高度
   * @example 80 | '200px'
   */
  maxHeight?: string | number
  showConfirmButton?: boolean
  showCancelButton?: boolean
  confirmButtonDisabled?: boolean
  confirmButtonLoading?: boolean
  confirmButtonText?: string
  cancelButtonDisabled?: boolean
  cancelButtonLoading?: boolean
  cancelButtonText?: string
}>(), {
  showCancelButton: true,
  showConfirmButton: true,
  maxHeight: 80,
  confirmButtonText: '确定',
  cancelButtonText: '取消',
})

const scrollBarRef = ref<ComponentPublicInstance>()

const initHeight = () => {
  if (isString(props.maxHeight)) {
    maxHeight.value = props.maxHeight
  }
}
onMounted(() => {
  initHeight()
})
const maxHeight = ref('')
const handlerOpened = () => {
  if (!isNumber(props.maxHeight)) {
    return
  }
  const dialogEl = (scrollBarRef.value!.$el as HTMLElement).parentNode?.parentNode
  if (!dialogEl) {
    return
  }
  const headerEl = dialogEl.querySelector('.el-dialog__header')
  const bodyEl = dialogEl.querySelector('.el-dialog__body')
  const footerEl = dialogEl.querySelector('.el-dialog__footer')
  if (headerEl && bodyEl && footerEl) {
    const winHeight = document.documentElement.clientHeight
    const bodyElStyle = getComputedStyle(bodyEl)
    maxHeight.value = `${(winHeight * props.maxHeight / 100)
         - headerEl.clientHeight
         - footerEl.clientHeight
         - Number.parseFloat(bodyElStyle.paddingTop)
         - Number.parseFloat(bodyElStyle.paddingBottom) - 10
         - Number.parseFloat(getComputedStyle(dialogEl as HTMLElement).marginBottom)
          }px`
  }
}
</script>

<template>
  <ElDialog :close-on-click-modal="false" @open="handlerOpened">
    <ElScrollbar ref="scrollBarRef" :max-height="maxHeight">
      <slot />
    </ElScrollbar>
    <template #footer>
      <slot name="footer">
        <ElButton
          v-if="showCancelButton"
          :loading="cancelButtonLoading"
          :disabled="confirmButtonLoading"
        >
          {{ cancelButtonText }}
        </ElButton>
        <ElButton
          v-if="showConfirmButton" type="primary"
          :loading="confirmButtonLoading"
          :disabled="confirmButtonDisabled"
        >
          {{ confirmButtonText }}
        </ElButton>
      </slot>
    </template>
  </ElDialog>
</template>
