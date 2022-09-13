<template>
  <div class="remind">
    <!-- {{ count }}
    <button @click="onObjClick">修改所有状态 ($patch+ 对象)</button>
    <button @click="onFuncClick">修改所有状态 ($patch+ 函数)</button>
    <div>{{ doubleCount }}</div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
export default defineComponent({
  name: "remind",
  setup() {
    const store = userStore();
    const { count, doubleCount } = storeToRefs(store);

    //$patch + 对象
    const onObjClick = () => {
      store.$patch({
        count: store.count + 1,
      });
    };

    //$patch + 函数
    const onFuncClick = () => {
      store.$patch((state) => {
        state.count = state.count + 1;
      });
    };

    return {
      store,
      onObjClick,
      onFuncClick,
      count,
      doubleCount,
    };
  },
});
</script>

<style lang="scss" scoped>
.remind {
  background: url("https://res1.qdszgh.cn/laborLive/remind.png") no-repeat;
  background-size: 100% 100%;
  min-height: 100vh;
}
</style>
