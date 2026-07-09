<script setup>
import { ref } from "vue"
import { useMoments } from "../composables/useMoments.js"
import MomentCard from "./MomentCard.vue"
import MomentModal from "./MomentModal.vue"
import MomentDetail from "./MomentDetail.vue"

const { moments, add, remove } = useMoments()
const showModal = ref(false)
const detailMoment = ref(null)

function handleAdd(moment) { add(moment); showModal.value = false }
</script>

<template>
  <section>
    <div class="page-header">
      <h2>📸 家庭时光</h2>
      <button class="btn-primary" @click="showModal = true"><span>+</span> 记录瞬间</button>
    </div>
    <div v-if="moments.length === 0" class="empty-hint">还没有任何记录，点击「记录瞬间」开始吧 ✨</div>
    <div v-else class="moments-timeline">
      <MomentCard v-for="m in moments" :key="m.id" :moment="m" @remove="remove" @view="detailMoment = m" />
    </div>
    <MomentModal v-if="showModal" @close="showModal = false" @save="handleAdd" />
    <MomentDetail v-if="detailMoment" :moment="detailMoment" @close="detailMoment = null" />
  </section>
</template>
