<script setup>
import { ref } from "vue"
import SiteHeader from "./components/SiteHeader.vue"
import HomePage from "./components/HomePage.vue"
import MomentsPage from "./components/MomentsPage.vue"
import GamesPage from "./components/GamesPage.vue"
import ToastMessage from "./components/ToastMessage.vue"

const currentPage = ref("home")

function navigate(page) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: "smooth" })
}
</script>

<template>
  <SiteHeader :currentPage="currentPage" @navigate="navigate" />
  <main id="app-main">
    <HomePage v-if="currentPage === 'home'" @navigate="navigate" />
    <MomentsPage v-else-if="currentPage === 'moments'" />
    <GamesPage v-else-if="currentPage === 'games'" />
  </main>
  <ToastMessage />
  <footer class="site-footer">
    <p>拾一的夏天 — 陪伴是最长情的告白 💛</p>
  </footer>
</template>
