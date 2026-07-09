import { ref, computed } from "vue"

const POINTS_KEY = "qqjy_points"
const BADGES_KEY = "qqjy_badges"
const LETTERS_KEY = "qqjy_learned_letters"

const REWARD_TIERS = [
  { threshold: 50,  name: "学习小星星", emoji: "⭐", color: "#FFD166" },
  { threshold: 100, name: "闪亮之星",   emoji: "🌟", color: "#FFD166" },
  { threshold: 200, name: "学习小达人", emoji: "🏆", color: "#06D6A0" },
  { threshold: 500, name: "英语小天才", emoji: "👑", color: "#B8A9E8" },
  { threshold: 1000,name: "英语大师",   emoji: "🎓", color: "#6CB4EE" },
]

const totalPoints = ref(0)
const earnedBadges = ref([])
const learnedLetters = ref(new Set())
const showReward = ref(null)

export function useGameState() {
  function load() {
    try {
      totalPoints.value = parseInt(localStorage.getItem(POINTS_KEY)) || 0
      earnedBadges.value = JSON.parse(localStorage.getItem(BADGES_KEY)) || []
      learnedLetters.value = new Set(JSON.parse(localStorage.getItem(LETTERS_KEY)) || [])
    } catch {
      totalPoints.value = 0
      earnedBadges.value = []
      learnedLetters.value = new Set()
    }
  }

  function save() {
    localStorage.setItem(POINTS_KEY, totalPoints.value.toString())
    localStorage.setItem(BADGES_KEY, JSON.stringify(earnedBadges.value))
    localStorage.setItem(LETTERS_KEY, JSON.stringify([...learnedLetters.value]))
  }

  function addPoints(n) {
    const prev = totalPoints.value
    totalPoints.value += n
    save()
    for (const tier of REWARD_TIERS) {
      if (prev < tier.threshold && totalPoints.value >= tier.threshold && !earnedBadges.value.includes(tier.name)) {
        earnedBadges.value.push(tier.name)
        save()
        showReward.value = tier
        break
      }
    }
  }

  function closeReward() { showReward.value = null }

  const nextReward = computed(() => {
    for (const tier of REWARD_TIERS) {
      if (totalPoints.value < tier.threshold && !earnedBadges.value.includes(tier.name)) return tier
    }
    return null
  })

  const currentLevel = computed(() => {
    let level = null
    for (const tier of REWARD_TIERS) {
      if (totalPoints.value >= tier.threshold) level = tier
    }
    return level
  })

  const progress = computed(() => {
    const nr = nextReward.value
    return nr ? Math.min(100, Math.round((totalPoints.value / nr.threshold) * 100)) : 100
  })

  function isLetterLearned(letter) { return learnedLetters.value.has(letter) }
  function markLetterLearned(letter) {
    if (!learnedLetters.value.has(letter)) {
      learnedLetters.value.add(letter)
      save()
      return true
    }
    return false
  }

  load()

  return {
    totalPoints, earnedBadges, learnedLetters, showReward,
    nextReward, currentLevel, progress,
    addPoints, closeReward, isLetterLearned, markLetterLearned,
    tiers: REWARD_TIERS
  }
}
