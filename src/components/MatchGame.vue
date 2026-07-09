<script setup>
import { ref } from "vue"
import { useGameState } from "../composables/useGameState.js"
import { useToast } from "../composables/useToast.js"
import Celebration from "./Celebration.vue"

const { addPoints } = useGameState()
const { show: toast } = useToast()

const wordBank = [
  { word: "cat", emoji: "🐱" },{ word: "dog", emoji: "🐶" },{ word: "fish", emoji: "🐟" },{ word: "bird", emoji: "🐦" },
  { word: "bear", emoji: "🐻" },{ word: "lion", emoji: "🦁" },{ word: "apple", emoji: "🍎" },{ word: "banana", emoji: "🍌" },
  { word: "orange", emoji: "🍊" },{ word: "grape", emoji: "🍇" },{ word: "sun", emoji: "☀️" },{ word: "moon", emoji: "🌙" },
  { word: "star", emoji: "⭐" },{ word: "heart", emoji: "❤️" },{ word: "flower", emoji: "🌸" },{ word: "tree", emoji: "🌳" },
  { word: "car", emoji: "🚗" },{ word: "book", emoji: "📖" },{ word: "cake", emoji: "🎂" },{ word: "ball", emoji: "⚽" },
]

const cards = ref([])
const selected = ref(null)
const matched = ref(new Set())
const showCelebration = ref(false)

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function initRound() {
  const round = shuffle(wordBank).slice(0, 6)
  const emojiCards = round.map((item, i) => ({ type: "emoji", ...item, pairId: i }))
  const wordCards = round.map((item, i) => ({ type: "word", ...item, pairId: i }))
  cards.value = shuffle([...emojiCards, ...wordCards]).map((c, idx) => ({ ...c, idx, uid: c.pairId + "-" + c.type + "-" + idx }))
  selected.value = null
  matched.value = new Set()
  showCelebration.value = false
}
initRound()

function speak(w) {
  if (!("speechSynthesis" in window)) return
  const u = new SpeechSynthesisUtterance(w)
  u.lang = "en-US"; u.rate = 0.8; u.pitch = 1.1
  speechSynthesis.cancel(); speechSynthesis.speak(u)
}

function clickCard(card) {
  if (matched.value.has(card.uid)) return
  if (!selected.value) { selected.value = card; return }
  if (selected.value.uid === card.uid) { selected.value = null; return }
  const s = selected.value
  selected.value = null
  if (s.pairId === card.pairId && s.type !== card.type) {
    matched.value = new Set([...matched.value, s.uid, card.uid])
    speak(card.word)
    addPoints(10)
    if (matched.value.size === 12) { showCelebration.value = true; toast("太棒了！全部配对成功！🎉", "success") }
  }
}
</script>

<template>
  <div>
    <Celebration v-if="showCelebration" />
    <div class="match-area">
      <div v-for="card in cards" :key="card.uid" class="match-card"
        :class="{ selected: selected?.uid === card.uid, matched: matched.has(card.uid) }"
        @click="clickCard(card)">
        <span v-if="card.type === 'emoji'" class="match-emoji">{{ card.emoji }}</span>
        <span v-else class="match-word">{{ card.word }}</span>
      </div>
    </div>
    <button class="btn-next" style="display:block;margin:0 auto" @click="initRound">🔄 换一批</button>
  </div>
</template>
