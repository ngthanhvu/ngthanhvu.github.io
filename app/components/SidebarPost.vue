<template>
  <aside class="md:col-span-1">
    <div class="sticky top-24 space-y-6">
      <!-- Profile Card -->
      <ProfileCard :profile="profileData" />

      <!-- Social Links -->
      <SocialLinks :links="socialLinks" />

      <!-- Hot Tags -->
      <TagsList title="Tag" :tags="hotTags" />

      <!-- Blog Stats -->
      <BlogStats title="Statistical" :stats="blogStats" />
    </div>
  </aside>
</template>

<script lang="ts" setup>
import ProfileCard from '~/components/posts/ProfileCard.vue';
import SocialLinks from '~/components/posts/SocialLinks.vue';
import TagsList from '~/components/posts/TagsList.vue';
import BlogStats from '~/components/posts/BlogStats.vue';

const profileData = {
  avatar: 'https://avatars.githubusercontent.com/u/150665233?v=4',
  title: "@ngthanhvu",
  name: 'vux',
  bio: 'Student / Web Development Intern'
}

const socialLinks = [
  {
    id: 1,
    icon: 'mdi:github',
    label: '@ngthanhvu',
    url: 'https://github.com'
  },
  {
    id: 2,
    icon: 'mdi:email',
    label: '@ngthanhvu@ngthanhvu.click',
    url: 'mailto:chralpha@nya.one'
  },
  {
    id: 3,
    icon: 'mdi:send',
    label: '@vunhomaka',
    url: '#'
  }
]

const hotTags = ['Android', 'Hexo', 'GitHub', '前端', 'lazyload', '优化', 'Magisk', 'Pixel', '自建', 'Cloudflare']

const blogStats = [
  {
    id: 1,
    value: 70,
    label: 'Post'
  },
  {
    id: 2,
    value: 117,
    label: '粉丝'
  },
  {
    id: 3,
    value: 6,
    label: '分类'
  },
  {
    id: 4,
    value: '61.8',
    label: '方字'
  }
]
</script>

<style scoped></style>