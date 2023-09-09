<script setup lang="tsx">
import { type OpFields, type OpFormInstance, useCreateForm } from 'components'
import { ref } from 'vue'
</script>

<template>
  <div style="height: 100vh;overflow: auto;">
    <OpTablePage />
  </div>
</template>

<style>
html ,body{
  height: 100%;
  background: #f2f2f2;
}
</style>
