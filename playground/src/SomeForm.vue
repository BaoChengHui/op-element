<script lang="ts" setup>
import { OpArrayField, OpField, OpForm } from 'components'
</script>

<template>
  <OpForm>
    <OpArrayField prop="arr">
      <OpField label="name" prop="0.name" required />
      <OpField label="address" prop="0.address" required />
    </OpArrayField>
  </OpForm>
</template>
