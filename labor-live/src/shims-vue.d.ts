declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'smoothscroll-polyfill'

declare module 'emoji-mart-vue-fast/src'

declare type Nullable = T | null

declare module 'vue3-video-play';