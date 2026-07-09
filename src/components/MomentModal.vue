<script setup>
import { ref } from "vue"

const emit = defineEmits(["close", "save"])

const title = ref("")
const date = ref(new Date().toISOString().split("T")[0])
const content = ref("")
const imageData = ref("")

function handleImage(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { alert("照片大小不能超过 5MB"); return }
  const reader = new FileReader()
  reader.onload = () => { imageData.value = reader.result }
  reader.readAsDataURL(file)
}

function submit() {
  if (!title.value.trim()) { alert("请输入标题"); return }
  emit("save", { title: title.value.trim(), date: date.value, content: content.value.trim(), image: imageData.value })
}
</script>

<template>
  <div class="modal-overlay open" @click.self="emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3>记录美好瞬间</h3>
        <button class="modal-close" @click="emit('close')">&times;</button>
      </div>
      <form @submit.prevent="submit">
        <div class="form-group">
          <label>标题</label>
          <input type="text" v-model="title" placeholder="给这一刻起个名字..." maxlength="50" required>
        </div>
        <div class="form-group">
          <label>日期</label>
          <input type="date" v-model="date" required>
        </div>
        <div class="form-group">
          <label>想说点什么...</label>
          <textarea v-model="content" rows="4" placeholder="记录下今天发生的美好事情..." maxlength="500"></textarea>
        </div>
        <div class="form-group">
          <label>照片（可选）</label>
          <input type="file" accept="image/*" @change="handleImage">
          <div class="image-preview" v-if="imageData"><img :src="imageData" alt="预览"></div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="emit('close')">取消</button>
          <button type="submit" class="btn-primary">保存</button>
        </div>
      </form>
    </div>
  </div>
</template>
