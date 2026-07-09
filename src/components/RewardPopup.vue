<script setup>
import { useGameState } from "../composables/useGameState.js"
import Celebration from "./Celebration.vue"

const { showReward, totalPoints, closeReward } = useGameState()
</script>

<template>
  <div v-if="showReward" class="reward-overlay" @click.self="closeReward">
    <div class="reward-popup">
      <div class="reward-badge-large">{{ showReward.emoji }}</div>
      <h2>恭喜获得新奖励！</h2>
      <p class="reward-name">{{ showReward.name }}</p>
      <p class="reward-desc">你已经积累了 <strong>{{ totalPoints }} 分</strong>，继续加油！</p>
      <button class="btn-primary reward-close" @click="closeReward">太棒了！</button>
    </div>
    <Celebration />
  </div>
</template>
