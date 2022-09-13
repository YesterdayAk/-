<template>
  <div
    class="liveLike"
    :style="{ bottom: goodsHeight ? goodsHeight + 10 + 'px' : '10px' }"
  >
    <!-- <div class="praise_bubble" id="praise_bubble">
      <div class="live_like" @click="addPraise">
        <span class="count" v-if="likeCount">{{ likeCount }}</span>
      </div>
    </div> -->
    <canvas
      id="thumsCanvas"
      width="160"
      height="400"
      style="width: 80px; height: 200px; position: absolute; right: 0; bottom: 40px"
    ></canvas>
    <div class="live_like" @click="thumbsUpAni">
      <span class="count" v-if="!transitionLikeCount && likeCount">{{ likeCount }}</span>
      <span
        class="count"
        style="width: 0.32rem"
        v-if="transitionLikeCount && likeCount"
        >{{ transitionLikeCount }}</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onMounted,
  onUnmounted,
  watch,
} from "vue";
// import "@/sass/liveLike.scss";
import liveLike from "@/utils/liveLike";
import socket from "@/utils/socket";
export default defineComponent({
  name: "liveLike",
  props: {
    goodsHeight: Number,
    liveCount: Number,
  },
  setup(props: any, context: any) {
    const state = reactive({
      likeCount: ref<number>(0),
      transitionLikeCount: "", //点赞数量转换单位
    });
    watch(
      () => props.liveCount,
      (value) => {
        state.likeCount = props.liveCount;
        handleLikeNum(state.likeCount);
      }
    );
    /**
     * css aniimation 动画实现方式
     */
    function addPraise() {
      let praiseBubble = document.getElementById("praise_bubble");
      const b = Math.floor(Math.random() * 6) + 1;
      const bl = Math.floor(Math.random() * 11) + 1; // bl1~bl11
      let d = document.createElement("div");
      state.likeCount++;
      d.className = `bubble b${b} bl${bl}`;
      d.dataset.t = String(Date.now());
      (praiseBubble as any).appendChild(d);

      setTimeout(() => {
        (praiseBubble as any).removeChild(d);
      }, 3000);
    }

    /**
     * canvas 实现方式
     */
    const thumbsUpAni = function () {
      liveLike.start();
      interface Opt {
        pushType: string;
      }
      const opt: Opt = {
        pushType: "9",
      };
      socket.send(opt);
      state.transitionLikeCount = handleLikeNum(state.likeCount);
    };

    //直播点赞数量转换
    function handleLikeNum(num: any) {
      if (num <= 999) {
        num = "";
      } else if (num > 999 && num <= 9999) {
        num = parseInt((num / 1000) as any);
        num = parseInt(num) + "千";
      } else if (num > 9999 && num <= 9999999) {
        num = parseInt((num / 10000) as any);
        num = parseInt(num) + "万";
      } else if (num > 9999999) {
        num = parseInt((num / 10000000) as any);
        num = parseInt(num) + "千万";
      }
      return num;
    }
    onMounted(() => {
      liveLike.loadImages();
      const canvas: any = document.getElementById("thumsCanvas");
      liveLike.context = canvas.getContext("2d");
      liveLike.width = canvas.width;
      liveLike.height = canvas.height;
    });

    return {
      ...toRefs(state),
      addPraise,
      thumbsUpAni,
      handleLikeNum,
    };
  },
});
</script>

<style lang="scss" scoped>
.liveLike {
  position: absolute;
  right: 0;
  bottom: 10px;
  .live_like {
    width: 0.4rem;
    height: 0.4rem;
    background: url("https://res1.qdszgh.cn/%E9%B8%BF%E9%9B%81%E8%9E%8D%E7%9B%B4%E6%92%AD/heart.png")
      no-repeat center;
    background-size: 100% 100%;
    position: absolute;
    right: 20px;
    bottom: 0;
    .count {
      display: inline-block;
      font-size: 13px;
      color: #fff;
      background: linear-gradient(90deg, #fa4454, #eb1d5a);
      position: absolute;
      padding: 0 4px;
      border-radius: 15px;
      left: 50%;
      /* 定位父级的50% */
      transform: translateX(-50%);
      /*自己的50% */
    }
  }
}
</style>
