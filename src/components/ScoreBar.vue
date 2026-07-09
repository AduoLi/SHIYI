<script setup>
import { useGameState } from "../composables/useGameState.js"
const { totalPoints, earnedBadges, nextReward, currentLevel, progress, tiers } = useGameState()
</script>

<template>
  <div class="score-bar">
    <div class="score-info">
      <span class="score-level">{{ currentLevel ? currentLevel.emoji + " " + currentLevel.name : "🌱 初学小芽" }}</span>
      <span class="score-points">⭐ {{ totalPoints }} 分</span>
    </div>
    <div class="progress-track" :class="{ complete: !nextReward }">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      <span class="progress-label">
        <template v-if="nextReward">距离 {{ nextReward.emoji }}{{ nextReward.name }} 还需 {{ nextReward.threshold - totalPoints }} 分</template>
        <template v-else>🎉 已解锁全部奖励！</template>
      </span>
    </div>
    <div v-if="earnedBadges.length" class="badge-row">
      <span v-for="name in earnedBadges" :key="name" class="badge"
        :style="{ background: (tiers.find(t => t.name === name)?.color || '#eee') + '20', borderColor: tiers.find(t => t.name === name)?.color || '#eee' }"
        :title="name">{{ tiers.find(t => t.name === name)?.emoji }}</span>
    </div>
  </div>
</template>
