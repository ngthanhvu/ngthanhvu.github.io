<template>
    <div class="text-center">
        <div class="h-32 w-32 mx-auto rounded-full overflow-hidden bg-gray-800 mb-4 ring-2 ring-gray-700">
            <img :alt="profile.name" class="h-32 w-32 rounded-full object-cover" :src="profile.avatar" />
        </div>
        <h1 class="text-xl font-bold">{{ profile.title }}</h1>
        <p class="text-gray-400 text-sm mt-1">{{ profile.name }}</p>
        <p class="text-gray-500 text-xs mt-1">{{ profile.bio }}</p>
    </div>
</template>

<script lang="ts" setup>
interface Profile {
    avatar: string
    title: string
    name: string
    bio: string
}

defineProps<{
    profile: Profile
}>()
</script>

<style scoped></style>
