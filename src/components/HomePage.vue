<script setup>
defineEmits(["navigate"])
</script>

<template>
  <section>
    <div class="hero">
      <div class="hero-content">
        <h1>记录每一个<span class="highlight">成长瞬间</span></h1>
        <p class="hero-sub">珍藏家庭美好回忆，陪孩子在游戏中爱上英语</p>
        <div class="hero-actions">
          <button class="btn-primary" @click="$emit('navigate', 'moments')"><span>📸</span> 记录时光</button>
          <button class="btn-secondary" @click="$emit('navigate', 'games')"><span>🎮</span> 开始学习</button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="floating-emoji emoji-1">👨‍👩‍👧</div>
        <div class="floating-emoji emoji-2">🌈</div>
        <div class="floating-emoji emoji-3">📚</div>
        <div class="floating-emoji emoji-4">⭐</div>
        <div class="floating-emoji emoji-5">🎨</div>
        <div class="floating-emoji emoji-6">🌟</div>
      </div>
    </div>
    <div class="features">
      <div class="feature-card" @click="$emit('navigate', 'moments')">
        <div class="feature-icon">📸</div>
        <h3>家庭时光</h3>
        <p>用文字和照片记录孩子成长的每一个珍贵瞬间</p>
      </div>
      <div class="feature-card" @click="$emit('navigate', 'games')">
        <div class="feature-icon">🎮</div>
        <h3>英语乐园</h3>
        <p>单词配对、字母认知、看图识词，在游戏中轻松启蒙英语</p>
      </div>
    </div>
  </section>
</template>
