import type { OpDialogProps } from '../../op-dialog'
import type { PickComponentProps } from '../../types'
import type opFormDialog from './op-form-dialog.vue'

export type OpFormDialogInstance = InstanceType<typeof opFormDialog>
export type OpFormDialogProps = PickComponentProps<typeof opFormDialog> & OpDialogProps
