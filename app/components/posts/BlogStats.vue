<template>
    <div>
        <h3 class="text-sm text-gray-400 mb-3">{{ title }}</h3>

        <div class="flex flex-wrap -mx-2">
            <div v-for="stat in stats" :key="stat.id" class="px-2 w-1/2 sm:w-1/4 text-center mb-3">
                <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ stat.label }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
interface Stat {
    id: number
    value: string | number
    label: string
}

defineProps<{
    title: string
    stats: Stat[]
}>()
</script>

<style scoped></style>
