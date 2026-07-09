<script setup>
import { ref } from "vue"
import ScoreBar from "./ScoreBar.vue"
import MatchGame from "./MatchGame.vue"
import AlphabetGame from "./AlphabetGame.vue"
import QuizGame from "./QuizGame.vue"
import RewardPopup from "./RewardPopup.vue"

const currentGame = ref("match")
</script>

<template>
  <section>
    <div class="page-header"><h2>🎮 英语乐园</h2></div>
    <div class="games-tabs">
      <button class="game-tab" :class="{ active: currentGame === 'match' }" @click="currentGame = 'match'">单词配对</button>
      <button class="game-tab" :class="{ active: currentGame === 'alphabet' }" @click="currentGame = 'alphabet'">字母认知</button>
      <button class="game-tab" :class="{ active: currentGame === 'quiz' }" @click="currentGame = 'quiz'">看图识词</button>
    </div>
    <ScoreBar />
    <div class="game-container">
      <MatchGame v-if="currentGame === 'match'" />
      <AlphabetGame v-else-if="currentGame === 'alphabet'" />
      <QuizGame v-else-if="currentGame === 'quiz'" />
    </div>
    <RewardPopup />
  </section>
</template>
