<script setup>
import { ref } from "vue"
import { useGameState } from "../composables/useGameState.js"

const { isLetterLearned, markLetterLearned, addPoints } = useGameState()
const activeLetter = ref(null)
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

const alphabetBank = {
  A:{word:"Apple",emoji:"🍎"},B:{word:"Bear",emoji:"🐻"},C:{word:"Cat",emoji:"🐱"},D:{word:"Dog",emoji:"🐶"},
  E:{word:"Egg",emoji:"🥚"},F:{word:"Fish",emoji:"🐟"},G:{word:"Grape",emoji:"🍇"},H:{word:"Heart",emoji:"❤️"},
  I:{word:"Ice",emoji:"🧊"},J:{word:"Juice",emoji:"🧃"},K:{word:"King",emoji:"👑"},L:{word:"Lion",emoji:"🦁"},
  M:{word:"Moon",emoji:"🌙"},N:{word:"Nose",emoji:"👃"},O:{word:"Orange",emoji:"🍊"},P:{word:"Pig",emoji:"🐷"},
  Q:{word:"Queen",emoji:"👸"},R:{word:"Rain",emoji:"🌧️"},S:{word:"Sun",emoji:"☀️"},T:{word:"Tree",emoji:"🌳"},
  U:{word:"Umbrella",emoji:"☂️"},V:{word:"Van",emoji:"🚐"},W:{word:"Water",emoji:"💧"},X:{word:"Fox",emoji:"🦊"},
  Y:{word:"Yellow",emoji:"💛"},Z:{word:"Zebra",emoji:"🦓"},
}

function speak(w) {
  if (!("speechSynthesis" in window)) return
  const u = new SpeechSynthesisUtterance(w)
  u.lang = "en-US"; u.rate = 0.8; u.pitch = 1.1
  speechSynthesis.cancel(); speechSynthesis.speak(u)
}

function select(letter) {
  activeLetter.value = letter
  const item = alphabetBank[letter]
  speak(item.word)
  if (markLetterLearned(letter)) addPoints(2)
}
</script>

<template>
  <div>
    <div class="alphabet-grid">
      <button v-for="l in letters" :key="l" class="alphabet-btn" :class="{ active: activeLetter === l }" @click="select(l)">{{ l }}</button>
    </div>
    <div class="alphabet-display">
      <template v-if="activeLetter && alphabetBank[activeLetter]">
        <span class="big-emoji">{{ alphabetBank[activeLetter].emoji }}</span>
        <span class="big-word">{{ alphabetBank[activeLetter].word }}</span>
        <span class="big-letter">{{ activeLetter }} is for {{ alphabetBank[activeLetter].word }}</span>
        <button class="speak-btn" @click="speak(alphabetBank[activeLetter].word)">🔊 听发音</button>
      </template>
      <p v-else class="alphabet-placeholder">👆 点击字母开始学习吧！</p>
    </div>
  </div>
</template>
