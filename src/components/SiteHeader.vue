<script setup>
defineProps({ currentPage: String })
defineEmits(["navigate"])
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <a href="#" class="logo" @click.prevent="$emit('navigate', 'home')">
        <span class="logo-icon">🏠</span>
        <span class="logo-text">拾一的夏天</span>
      </a>
      <nav class="main-nav">
        <button class="nav-btn" :class="{ active: currentPage === 'home' }" @click="$emit('navigate', 'home')">首页</button>
        <button class="nav-btn" :class="{ active: currentPage === 'moments' }" @click="$emit('navigate', 'moments')"><span class="nav-icon">📸</span> 家庭时光</button>
        <button class="nav-btn" :class="{ active: currentPage === 'games' }" @click="$emit('navigate', 'games')"><span class="nav-icon">🎮</span> 英语乐园</button>
      </nav>
    </div>
  </header>
</template>
