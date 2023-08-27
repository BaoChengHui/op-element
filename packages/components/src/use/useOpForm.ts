import { type MaybeRef, computed, unref } from 'vue'
import type { OpFields, OpFormProps } from '../op-form'

export interface UseOpFormOptions {
  fields?: MaybeRef<OpFields>
  formProps?: MaybeRef<OpFormProps>
  onSubmit?: any
}

export function useOpForm(options: UseOpFormOptions) {
  const { fields, onSubmit, formProps = {} } = options

  const config = computed(() => {
    return {
      fields: unref(fields),
      ...unref(formProps),
    }
  })

  return {
    config,
  }
}
