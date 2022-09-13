<template>
  <video-player
    v-if="showPushStream"
    class="video-player vjs-theme-forest"
    crossorigin="anonymous"
    playsinline
    liveui
    :sources="([videoSource] as any)"
    :html5="{
      vhs: {
        // https://github.com/videojs/http-streaming#options
        overrideNative: !isSafari,
        maxPlaylistRetries: Infinity,
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false,
    }"
    @mounted="handleMounted"
  />

  <video-player
    v-else
    class="video-player vjs-big-play-centered"
    :src="videoSrc"
    loop
    crossorigin="anonymous"
    playsinline
    @mounted="handleMounted"
  />
</template>

<script lang="ts">
import { defineComponent, shallowRef, onUnmounted } from "vue";
import videojs, { VideoJsPlayer } from "video.js";
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";
export default defineComponent({
  name: "vue-hls-player-example",
  props: {
    showPushStream: {
      type: Boolean,
      default: false,
    },
    videoSource: {
      type: Object,
      default: {},
    },
    videoSrc: {
      type: String,
      default: "",
    },
  },
  components: {
    VideoPlayer,
  },
  setup() {
    const player = shallowRef<VideoJsPlayer>();
    const start = () => {
      if (player.value) {
        player.value.play();
      }
    };
    const handleMounted = (payload: any) => {
      player.value = payload.player;
      console.log("HLS Live player mounted", payload);
    };

    onUnmounted(() => {
      if (player.value) {
        player.value.dispose();
      }
    });
    // const handleReady = () => {
    //   const { vhs } = player.value?.tech() as any;
    //   vhs.xhr.beforeRequest = (options: any) => {
    //     return options;
    //   };
    // };
    return {
      isSafari: videojs.browser.IS_SAFARI,
      start,
      handleMounted,
      // handleReady,
    };
  },
});
</script>

<style lang="scss" scoped>
.video-player {
  width: 100%;
  height: 100vh;
}
::v-deep .vjs-tech {
  object-fit: cover;
}
</style>
