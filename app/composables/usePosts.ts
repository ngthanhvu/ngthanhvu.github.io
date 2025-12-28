export interface Post {
    id: number
    title: string
    slug: string
    description: string
    date: string
    category: string
    image?: string
    content?: string
}

export const usePosts = () => {
    const posts = ref<Post[]>([
        {
            id: 1,
            title: 'Getting Started with Nuxt 3',
            slug: 'getting-started-with-nuxt-3',
            description: 'A comprehensive guide to building your first Nuxt 3 application with Tailwind CSS and TypeScript.',
            date: '2023-10-15',
            category: 'Development',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
            content: `
# Getting Started with Nuxt 3

Nuxt 3 is a powerful framework built on top of Vue 3. It provides a great developer experience and many built-in features.

## Installation

You can create a new Nuxt project using nuxi:

\`\`\`bash
npx nuxi@latest init my-app
\`\`\`

## Features

- **Auto-imports**: Nuxt automatically imports helper functions, composables, and Vue APIs.
- **File-based routing**: Pages are automatically generated based on the file structure.
- **Server-side rendering**: Improved SEO and initial load performance.
      `
        },
        {
            id: 2,
            title: 'The Power of Composables',
            slug: 'the-power-of-composables',
            description: 'Understanding how to organize and reuse logic in Vue 3 using the Composition API.',
            date: '2023-11-20',
            category: 'Vue.js',
            image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2031&auto=format&fit=crop',
            content: `
# The Power of Composables

Composables are reusable stateful logic functions. They allow you to encapsulate and share code across components.

## Basic Example

Here is a simple useCounter composable:

\`\`\`ts
export const useCounter = () => {
  const count = ref(0)
  const increment = () => count.value++
  
  return { count, increment }
}
\`\`\`
      `
        },
        {
            id: 3,
            title: 'Designing with Tailwind CSS',
            slug: 'designing-with-tailwind-css',
            description: 'Tips and tricks for creating beautiful, responsive user interfaces efficiently.',
            date: '2023-12-05',
            category: 'Design',
            image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2055&auto=format&fit=crop',
            content: `
# Designing with Tailwind CSS

Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML.

## Utility Classes

Instead of writing custom CSS, you use classes like \`flex\`, \`pt-4\`, \`text-center\`, and \`rotate-90\`.

## Responsive Design

Tailwind makes it easy to build responsive designs using prefixes like \`md:\`, \`lg:\`, and \`xl:\`.
      `
        },
        {
            id: 4,
            title: 'Understanding TypeScript',
            slug: 'understanding-typescript',
            description: 'Why you should use TypeScript in your next project and how it improves code quality.',
            date: '2024-01-10',
            category: 'TypeScript',
            image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop',
            content: `
# Understanding TypeScript

TypeScript adds static typing to JavaScript. This helps catch errors early and improves code maintainability.

## Interfaces

Interfaces define the structure of an object:

\`\`\`ts
interface User {
  id: number;
  name: string;
}
\`\`\`
      `
        },
        {
            id: 5,
            title: 'State Management with Pinia',
            slug: 'state-management-with-pinia',
            description: 'Managing global state in Vue applications using the official state management library.',
            date: '2024-02-15',
            category: 'Vue.js',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
            content: `
# State Management with Pinia

Pinia is the modern state management library for Vue. It is intuitive, type-safe, and modular.

## Stores

Stores contain state, getters, and actions.

\`\`\`ts
export const useStore = defineStore('main', {
  state: () => ({ counter: 0 }),
  actions: {
    increment() {
      this.counter++
    }
  }
})
\`\`\`
      `
        },
        {
            id: 6,
            title: 'Optimizing Web Performance',
            slug: 'optimizing-web-performance',
            description: 'Techniques to speed up your website, improve Core Web Vitals, and enhance user experience.',
            date: '2024-03-01',
            category: 'Performance',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
            content: `
# Optimizing Web Performance

Performance is crucial for user retention and SEO.

## Tips

1. **Optimize Images**: Use modern formats like WebP.
2. **Lazy Loading**: Defer loading of off-screen content.
3. **Minimize JavaScript**: Reduce bundle size.
      `
        },
        {
            id: 7,
            title: 'Exploring AI Tools',
            slug: 'exploring-ai-tools',
            description: 'A look into the latest AI tools for developers and how they can boost productivity.',
            date: '2024-04-12',
            category: 'Technology',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
            content: `
# Exploring AI Tools

AI tools are transforming how we write code.

## Copilot

GitHub Copilot suggests code as you type.

## ChatGPT

ChatGPT can answer questions, explain code, and generate snippets.
        `
        }
    ])

    const getPosts = () => {
        return posts.value
    }

    const getPost = (slug: string) => {
        return posts.value.find(p => p.slug === slug)
    }

    return {
        posts,
        getPosts,
        getPost
    }
}
