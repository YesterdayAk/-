<template>
  <div class="forbidden"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "forbidden",
});
</script>

<style lang="scss" scoped>
.forbidden {
  background: url("https://res1.qdszgh.cn/laborLive/forbidden.png") no-repeat;
  background-size: 100% 100%;
  min-height: 100vh;
}
</style>
