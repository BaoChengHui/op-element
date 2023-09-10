import type { OpSearchForm } from '..'
import type { OpFormProps } from '../../op-form'
import type { PickComponentProps } from '../../types'

export type OpSearchFormProps = PickComponentProps<typeof OpSearchForm> & OpFormProps
