import { ref, readonly } from "vue"

const toastMsg = ref("")
const toastType = ref("")
let toastTimer = null

export function useToast() {
  function show(msg, type = "") {
    toastMsg.value = msg
    toastType.value = type
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => { toastMsg.value = "" }, 2500)
  }

  return { toastMsg: readonly(toastMsg), toastType: readonly(toastType), show }
}
