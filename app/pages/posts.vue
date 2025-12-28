<template>
  <div class="mx-auto max-w-5xl bg-black text-white p-4 gap-8 grid grid-cols-1 md:grid-cols-4 min-h-screen">
    <SidebarPost />

    <main class="md:col-span-3">
      <ul class="flex flex-col gap-6">
        <template v-for="post in paginatedPosts" :key="post.id">
          <NuxtLink :to="`/p/${post.slug}`" class="no-underline block">
            <li
              class="w-full flex flex-col border border-gray-800 rounded-lg hover:border-blue-500 transition cursor-pointer group overflow-hidden bg-gray-900/50 hover:bg-gray-900 duration-300">
              <div v-if="post.image" class="w-full h-48 overflow-hidden bg-gray-800">
                <img :alt="post.title" loading="lazy" :src="post.image"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              </div>
              <div class="flex-1 p-5 flex flex-col">
                <div class="text-sm text-blue-400 mb-3 flex items-center gap-1">
                  <span>{{ post.date }}</span>
                  <span class="text-gray-600">·</span>
                  <span class="text-gray-400">{{ post.category || '笔记' }}</span>
                </div>
                <h3 class="text-white group-hover:text-blue-300 transition font-semibold text-lg mb-3 leading-snug">
                  {{ post.title }}
                </h3>
                <p class="text-gray-400 text-sm leading-relaxed line-clamp-2">{{ post.description }}</p>
              </div>
            </li>
          </NuxtLink>
        </template>
      </ul>
      <div class="mt-4 flex flex-row justify-between">
        <button @click="previousPage" :disabled="currentPage === 1"
          class="px-4 py-2 border border-gray-700 rounded text-gray-400 hover:text-white hover:border-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed">
          <Icon name="mdi:chevron-left" class="w-4 h-4" />
          Prev
        </button>
        <span class="my-auto">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="px-4 py-2 border border-gray-700 rounded text-gray-400 hover:text-white hover:border-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed">
          Next
          <Icon name="mdi:chevron-right" class="w-4 h-4" />
        </button>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'default',
})
useHead({
  title: '@ngthanhvu Posts',
  meta: [
    { name: 'description', content: 'Personal blog of ngthanhvu' },
    { name: 'keywords', content: 'ngthanhvu' }
  ],
  link: [{ rel: 'icon', type: 'image/png', href: 'https://avatars.githubusercontent.com/u/150665233?v=4' }]
})



const { getPosts } = usePosts()
const posts = getPosts()

const postsPerPage = 6

const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(posts.length / postsPerPage))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return posts.slice(start, end)
})

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>

<style scoped></style>