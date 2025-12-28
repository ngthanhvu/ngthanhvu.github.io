<template>
    <div class="space-y-2 border-gray-800">
        <a v-for="link in links" :key="link.id" :href="link.url" target="_blank" rel="noopener noreferrer"
            class="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm">
            <Icon :name="link.icon" class="w-4 h-4" />
            {{ link.label }}
        </a>
    </div>
</template>

<script lang="ts" setup>
interface SocialLink {
    id: number
    icon: string
    label: string
    url: string
}

defineProps<{
    links: SocialLink[]
}>()
</script>

<style scoped></style>
