<script setup>
import { useToast } from "../composables/useToast.js"
const { toastMsg, toastType } = useToast()
</script>

<template>
  <div class="toast" :class="{ show: toastMsg, success: toastType === 'success', error: toastType === 'error' }">{{ toastMsg }}</div>
</template>
