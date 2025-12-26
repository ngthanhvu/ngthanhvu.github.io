<template>
  <div class="mx-auto max-w-screen-md bg-black flex flex-col p-4">
    <!-- Top: Title + Avatar -->
    <div class="w-full flex items-start justify-between gap-6">
      <h1 class="text-2xl sm:text-4xl font-semibold leading-tight">
        <span class="block text-white">Hello,</span>

        <span class="block text-white">
          this is
          <span class="text-yellow-500 underline underline-offset-4 ml-1">
            {{ text }}
          </span>
        </span>
      </h1>

      <div class="h-24 w-24 flex-shrink-0 rounded-full bg-gray-400 overflow-hidden">
        <img alt="Avatar" class="h-24 w-24 rounded-full object-cover"
          src="https://avatars.githubusercontent.com/u/150665233?v=4" />
      </div>
    </div>

    <!-- Body -->
    <section class="text-gray-200">
      <p class="text-sm italic opacity-60">
        Student / Web Development Intern
      </p>
      <h2 class="mt-5 text-2xl font-semibold text-white">About me</h2>
      <ul class="mt-4 list-disc pl-5 space-y-3 marker:text-gray-500">
        <li>
          Graduated from <a href="https://caodang.fpt.edu.vn/"
            class="text-white underline underline-offset-4 hover:text-yellow-500 transition" target="_blank"
            rel="noopener noreferrer">FPT
            Polytechnic College</a> in 2025
        </li>

        <li>
          Web Development Intern
        </li>

        <li>
          <span class="font-semibold text-white">Computational Skills:</span>
          <ul class="mt-2 list-disc pl-5 space-y-2 marker:text-gray-600">
            <li><span class="text-white">Langs:</span> PHP, JavaScript(TypeScript), Python</li>
            <li><span class="text-white">Front-end:</span> Vue, Nuxt</li>
            <li><span class="text-white">Back-end:</span> Laravel, NestJS, Express</li>
            <li><span class="text-white">Infra:</span> Docker, PostgreSQL, MongoDB, Redis</li>
          </ul>
        </li>

        <li>
          In my spare time, I share interesting topics on my blog written.
        </li>

        <li>
          Feel free to contact me!!
        </li>
      </ul>

      <h2 class="mt-12 text-2xl font-semibold text-white">Find me also</h2>

      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose">
        <a v-for="item in links" :key="item.href" class="inline-flex items-center gap-2 rounded border border-white/15 bg-white/0 px-3 py-2 text-sm text-gray-300
                hover:bg-white/10 hover:text-white transition" :href="item.href" target="_blank"
          rel="noopener noreferrer">
          <Icon :name="item.icon" class="h-8 w-4" />
          <span>{{ item.label }}</span>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "@ngthanhvu Portfolio",
  meta: [
    {
      name: "description",
      content: "Personal portfolio of ngthanvu"
    },
    {
      name: "keywords",
      content: "ngthanhvu"
    },
    {
      property: "og:title",
      content: "@ngthanhvu Portfolio"
    },
    {
      property: "og:description",
      content: "Personal portfolio of ngthanvu"
    },
    {
      property: "og:image",
      content: "https://avatars.githubusercontent.com/u/150665233?v=4"
    },
    {
      property: "og:url",
      content: "https://ngthanhvu.click"
    },
    {
      property: "og:type",
      content: "website"
    },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: 'https://avatars.githubusercontent.com/u/150665233?v=4' }
  ]
})
const links = [
  { href: 'https://github.com/ngthanhvu', icon: 'mdi:github-box', label: 'GitHub' },
  { href: 'https://facebook.com/thanhvu.user', icon: 'mdi:facebook-box', label: 'Facebook' },
  { href: 'https://t.me/vunhomaka', icon: 'mdi:telegram', label: 'Telegram' },
  { href: 'mailto:vunt@ngthanhvu.click', icon: 'mdi:email', label: 'Email' },
]

const words = ['ngthanhvu', 'ngthanhvu', 'ngthanhvu']
const text = ref('')
const index = ref(0)

const typingSpeed = 120
const deletingSpeed = 70
const holdAfterType = 1200
const holdAfterDelete = 500

let timer: number

function startTypewriter() {
  let charIndex = 0
  let isDeleting = false

  const loop = () => {
    const word = words[index.value]

    if (!isDeleting) {
      text.value = word.slice(0, charIndex + 1)
      charIndex++

      if (charIndex === word.length) {
        setTimeout(() => (isDeleting = true), holdAfterType)
      }
    } else {
      text.value = word.slice(0, charIndex - 1)
      charIndex--

      if (charIndex === 0) {
        isDeleting = false
        index.value = (index.value + 1) % words.length
        setTimeout(() => { }, holdAfterDelete)
      }
    }

    timer = window.setTimeout(
      loop,
      isDeleting ? deletingSpeed : typingSpeed
    )
  }

  loop()
}

onMounted(startTypewriter)

onBeforeUnmount(() => clearTimeout(timer))


</script>
