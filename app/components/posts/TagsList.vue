<template>
    <div>
        <h3 class="font-semibold mb-3 text-white">{{ title }}</h3>
        <div class="flex flex-wrap gap-2">
            <span v-for="tag in tags" :key="tag"
                class="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 hover:text-white cursor-pointer transition">
                #{{ tag }}
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    title: string
    tags: string[]
}>()
</script>

<style scoped></style>
