import type { ELDialogProps, PickComponentProps } from '../../types'
import type opDialogVue from './op-dialog.vue'

export type OpDialogProps = PickComponentProps<typeof opDialogVue> & ELDialogProps
