<script setup>
import { ref, onMounted, onUnmounted } from "vue"
const confetti = ref([])
const emojis = ["🎉","⭐","🌟","💫","✨","🎊","💖","🌈"]

onMounted(() => {
  for (let i = 0; i < 20; i++) {
    confetti.value.push({
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100 + "%",
      top: -(Math.random() * 20 + 5) + "%",
      duration: (Math.random() * 1.5 + 1.5) + "s",
      delay: Math.random() * 0.8 + "s",
    })
  }
})
</script>

<template>
  <div class="celebration">
    <span v-for="(c, i) in confetti" :key="i" class="confetti"
      :style="{ left: c.left, top: c.top, animationDuration: c.duration, animationDelay: c.delay }">{{ c.emoji }}</span>
  </div>
</template>
