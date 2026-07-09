<script setup>
defineProps({ moment: Object })
defineEmits(["close"])

function fmtDate(d) {
  if (!d) return ""
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return dt.getFullYear() + "年" + String(dt.getMonth()+1).padStart(2,"0") + "月" + String(dt.getDate()).padStart(2,"0") + "日"
}
</script>

<template>
  <div class="moment-detail-overlay open" @click.self="$emit('close')">
    <div class="moment-detail">
      <button class="detail-close" @click="$emit('close')">&times;</button>
      <img v-if="moment.image" :src="moment.image" :alt="moment.title">
      <div class="detail-body">
        <div class="detail-date">{{ fmtDate(moment.date) }}</div>
        <div class="detail-title">{{ moment.title }}</div>
        <div v-if="moment.content" class="detail-content">{{ moment.content }}</div>
      </div>
    </div>
  </div>
</template>
