<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <div class="flex-grow bg-black">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import Header from '~/components/Header.vue';
import Footer from '~/components/Footer.vue';
</script>

<style></style>