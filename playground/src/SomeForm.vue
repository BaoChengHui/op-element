<script lang="ts" setup>
import { OpArrayField, OpField, OpForm } from 'components'
import type { Recordable } from 'components/src/types'
import { ref } from 'vue'
</script>

<template>
  <OpForm>
    <!-- <OpArrayField prop="arr">
      <OpField label="name" prop="0.name" required />
      <OpField label="address" prop="0.address" required />
    </OpArrayField> -->
    <OpField label="base-name" prop="name" required />
    <OpField label="basde-address" prop="address" required />
    <div>数组</div>
    <OpArrayField prop="arr">
      <OpField label="name" prop="0.name" required :component="{ type: 'input', props: { clearable: true } }" />
      <OpField label="address" prop="0.address" required />
      <OpField label="time" prop="0.[start,end]" :component="{ type: 'daterange' }" required />
    </OpArrayField>
  </OpForm>
</template>
