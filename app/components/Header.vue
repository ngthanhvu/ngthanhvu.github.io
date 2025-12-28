<template>
  <header class="sticky top-0 z-50 bg-black border-b border-gray-800 transition-colors duration-300">
    <div class="max-w-5xl mx-auto px-4 py-1 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <!-- Logo bên trái -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="flex items-center gap-2">
            <span class="text-xl font-bold text-white">@ngthanhvu</span>
          </NuxtLink>
        </div>

        <!-- Navigation ở giữa -->
        <nav class="hidden md:flex gap-8 absolute left-1/2 -translate-x-1/2">
          <NuxtLink to="/" class="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200"
            active-class="text-white font-semibold">
            Home
          </NuxtLink>
          <NuxtLink to="/posts"
            class="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200"
            active-class="text-white font-semibold">
            Posts
          </NuxtLink>
          <NuxtLink to="/links"
            class="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200"
            active-class="text-white font-semibold">
            Links
          </NuxtLink>
        </nav>

        <!-- Right: pill theme switcher -->
        <div class="flex items-center gap-4">
          <div
            class="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1 shadow-sm backdrop-blur"
            role="group" aria-label="Theme">
            <button type="button" class="grid h-7 w-10 mr-2 place-items-center rounded-full transition"
              :class="segBtnClass(preference === 'light')" @click="setPreference('light')" aria-label="Light"
              title="Light">
              <Icon name="solar:sun-2-linear" class="h-5 w-5" />
            </button>

            <button type="button" class="grid h-7 w-10 mr-2 place-items-center rounded-full transition"
              :class="segBtnClass(preference === 'system')" @click="setPreference('system')" aria-label="System"
              title="System">
              <Icon name="solar:monitor-linear" class="h-5 w-5" />
            </button>

            <button type="button" class="grid h-7 w-10 mr-2 place-items-center rounded-full transition"
              :class="segBtnClass(preference === 'dark')" @click="setPreference('dark')" aria-label="Dark" title="Dark">
              <Icon name="solar:moon-linear" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

// cái người dùng chọn: 'system' | 'light' | 'dark'
const preference = computed(() => (colorMode.preference || 'system') as 'system' | 'light' | 'dark')

function setPreference(v: 'system' | 'light' | 'dark') {
  colorMode.preference = v
}

function segBtnClass(active: boolean) {
  return active
    ? 'bg-white/15 text-white'
    : 'text-white/60 hover:text-white hover:bg-white/10'
}
</script>
