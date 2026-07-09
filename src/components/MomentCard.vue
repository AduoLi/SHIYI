<script setup>
const props = defineProps({ moment: Object })
const emit = defineEmits(["remove", "view"])

function fmtDate(d) {
  if (!d) return ""
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return dt.getFullYear() + "年" + String(dt.getMonth()+1).padStart(2,"0") + "月" + String(dt.getDate()).padStart(2,"0") + "日"
}
</script>

<template>
  <div class="moment-card">
    <img v-if="moment.image" class="moment-image" :src="moment.image" :alt="moment.title" loading="lazy">
    <div class="moment-body" @click="emit('view')">
      <div class="moment-date">{{ fmtDate(moment.date) }}</div>
      <div class="moment-title">{{ moment.title }}</div>
      <div v-if="moment.content" class="moment-content">{{ moment.content }}</div>
    </div>
    <div class="moment-actions">
      <button class="btn-icon" title="查看详情" @click.stop="emit('view')">👁️</button>
      <button class="btn-icon danger" title="删除" @click.stop="emit('remove', moment.id)">🗑️</button>
    </div>
  </div>
</template>
