<script setup>
import { ref } from "vue"
import { useGameState } from "../composables/useGameState.js"
import { useToast } from "../composables/useToast.js"
import Celebration from "./Celebration.vue"

const { addPoints } = useGameState()
const { show: toast } = useToast()

const wordBank = [
  { word:"cat",emoji:"🐱" },{ word:"dog",emoji:"🐶" },{ word:"fish",emoji:"🐟" },{ word:"bird",emoji:"🐦" },
  { word:"bear",emoji:"🐻" },{ word:"lion",emoji:"🦁" },{ word:"apple",emoji:"🍎" },{ word:"banana",emoji:"🍌" },
  { word:"orange",emoji:"🍊" },{ word:"grape",emoji:"🍇" },{ word:"sun",emoji:"☀️" },{ word:"moon",emoji:"🌙" },
  { word:"star",emoji:"⭐" },{ word:"flower",emoji:"🌸" },{ word:"tree",emoji:"🌳" },{ word:"car",emoji:"🚗" },
]

const item = ref({})
const options = ref([])
const answered = ref(false)
const correctIdx = ref(-1)
const showCelebration = ref(false)

function init() {
  const pool = [...wordBank].sort(() => Math.random() - 0.5)
  item.value = pool[0]
  const opts = new Set([pool[0].word])
  for (const w of pool.slice(1)) { if (opts.size >= 3) break; opts.add(w.word) }
  options.value = [...opts].sort(() => Math.random() - 0.5)
  answered.value = false
  correctIdx.value = -1
  showCelebration.value = false
}
init()

function speak(w) {
  if (!("speechSynthesis" in window)) return
  const u = new SpeechSynthesisUtterance(w)
  u.lang = "en-US"; u.rate = 0.8; u.pitch = 1.1
  speechSynthesis.cancel(); speechSynthesis.speak(u)
}

function answer(word, idx) {
  if (answered.value) return
  answered.value = true
  if (word === item.value.word) {
    correctIdx.value = idx
    speak(word)
    addPoints(10)
    showCelebration.value = true
    toast("答对啦！真聪明！🌟", "success")
  } else {
    correctIdx.value = options.value.indexOf(item.value.word)
  }
}
</script>

<template>
  <div>
    <Celebration v-if="showCelebration" />
    <div class="quiz-area">
      <span class="quiz-emoji">{{ item.emoji }}</span>
      <p class="quiz-question">这是什么？点击正确的英文单词吧！</p>
      <div class="quiz-options">
        <button v-for="(w, i) in options" :key="w" class="quiz-option"
          :class="{ correct: answered && i === correctIdx, wrong: answered && i !== correctIdx && w === item.word === false && i !== correctIdx }"
          @click="answer(w, i)">{{ w }}</button>
      </div>
      <button v-if="answered" class="btn-next" @click="init">👉 下一题</button>
    </div>
  </div>
</template>
