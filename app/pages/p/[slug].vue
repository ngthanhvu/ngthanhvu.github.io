<template>
  <div class="mx-auto max-w-5xl bg-black text-white p-4 gap-8 grid grid-cols-1 md:grid-cols-4 min-h-screen">
    <SidebarPost />

    <main class="md:col-span-3">
      <div v-if="post">
        <!-- Cover image -->
        <div v-if="image" class="w-full overflow-hidden rounded-lg relative z-10">
          <img :src="image" :alt="title" class="w-full h-64 md:h-80 object-cover rounded-lg" />
        </div>

        <!-- Overlapping meta card -->
        <div
          class="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 -mt-12 mb-8 shadow-2xl relative z-20">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div class="min-w-0 flex-1">
              <h1 class="text-2xl md:text-3xl font-bold mb-3 leading-tight text-white">{{ title }}</h1>
              <p class="text-gray-300 text-sm leading-relaxed">{{ description }}</p>
            </div>
            <div class="text-xs text-gray-400 whitespace-nowrap">
              <div>{{ date }}</div>
              <div class="text-gray-500">{{ category }}</div>
            </div>
          </div>
        </div>

        <!-- Content card -->
        <article class="prose prose-invert max-w-none bg-gray-900/50 p-6 rounded-lg border border-gray-800">
          <MDC :value="post?.content ?? ''" tag="article" />
        </article>
      </div>

      <div v-else class="text-gray-400">Post not found.</div>
    </main>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const slug = String(route.params.slug || '')
const { getPost } = usePosts()
const post = computed(() => getPost(slug))

// Create computed properties for template
const title = computed(() => post.value?.title || 'Post')
const description = computed(() => post.value?.description || '')
const date = computed(() => post.value?.date || '')
const category = computed(() => post.value?.category || '笔记')
const image = computed(() => post.value?.image || '')

useHead(() => ({ title: title.value }))
</script>

<style scoped>
.prose img {
  max-width: 100%;
  border-radius: 0.5rem;
}

.prose h1,
.prose h2,
.prose h3 {
  color: #fff;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.prose h1 {
  font-size: 2rem;
}

.prose h2 {
  font-size: 1.5rem;
}

.prose h3 {
  font-size: 1.25rem;
}

.prose p {
  color: #d1d5db;
  line-height: 1.75;
  margin-bottom: 1rem;
}

.prose a {
  color: #60a5fa;
  text-decoration: underline;
}

.prose a:hover {
  color: #93c5fd;
}

.prose ul,
.prose ol {
  color: #d1d5db;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose code {
  background: #1f2937;
  color: #f3f4f6;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
}

.prose pre {
  background: #111827;
  color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.prose blockquote {
  border-left: 4px solid #60a5fa;
  padding-left: 1rem;
  color: #9ca3af;
  font-style: italic;
}
</style>
