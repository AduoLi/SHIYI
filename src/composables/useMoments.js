import { ref, reactive, computed, readonly } from "vue"

const MOMENTS_KEY = "qqjy_moments"
const moments = ref([])

export function useMoments() {
  function load() {
    try {
      const raw = localStorage.getItem(MOMENTS_KEY)
      moments.value = raw ? JSON.parse(raw) : []
    } catch { moments.value = [] }
    moments.value.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  function save() {
    localStorage.setItem(MOMENTS_KEY, JSON.stringify(moments.value))
  }

  function add(moment) {
    moment.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    moment.createdAt = new Date().toISOString()
    moments.value.unshift(moment)
    save()
  }

  function remove(id) {
    moments.value = moments.value.filter(m => m.id !== id)
    save()
  }

  load()

  return { moments: readonly(moments), add, remove, reload: load }
}
