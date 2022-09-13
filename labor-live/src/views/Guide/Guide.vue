<template>
  <div class="guide">
    <div class="headerBox">
      <div class="header">
        <div class="banner" ref="banner">
          <img :src="liveInfo.cover" alt="" />
        </div>
      </div>
    </div>
    <div class="introduceBox">
      <div class="introduce">
        <div class="information" ref="information">
          <div class="information-top">
            <div class="stream">
              <div class="stream-theme">
                <span class="title">{{ liveInfo.name }}</span>
              </div>
            </div>
          </div>
          <div class="information-bottom">
            <div class="info">
              <div class="browse">
                <img src="@/assets/browse.png" alt="" />
                <span class="number">{{ liveInfo.viewPersonTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="contentBox">
      <div class="content">
        <div
          class="content-top"
          :style="{ height: describeHeight }"
          @touchmove="handleTouch"
        >
          <span class="message" v-html="liveInfo.introduce"></span>
        </div>
        <div class="content-bottom">
          <div class="operation" ref="operation">
            <div class="operation-top">
              <van-button v-if="subscribeState" class="subscribe">已订阅</van-button>
              <van-button v-else class="subscribe" @click="getSubscribeInfo"
                >订阅直播</van-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  onMounted,
  ref,
  toRefs,
} from "vue";
import { getPhoneType } from "@/utils/barrageTool";
import { stringify } from "querystring";
import { Toast } from "vant";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  name: "guide",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { appContext } = getCurrentInstance() as any;
    const axios = appContext.config.globalProperties.$axios;
    const store = userStore();
    const { liveId } = storeToRefs(store);
    let state = reactive({
      bannerHeight: 0, //海报高度
      informationHeight: 0, //信息高度
      operationHeight: 0, //操作高度
      describeHeight: "", //直播描述高度
      isBigScreen: false, //默认iphone不是全面屏
      liveInfo: {
        cover: ref<string>(""),
        name: ref<string>(""),
        viewPersonTime: ref<string>(""),
        introduce: ref<string>(""),
      },
      subscribeState: ref<Boolean>(false), //默认未订阅直播
    });
    let banner = ref<null | HTMLElement>(null);
    let information = ref<null | HTMLElement>(null);
    let operation = ref<null | HTMLElement>(null);
    const elementHeight = () => {
      if (banner.value) {
        state.bannerHeight = banner.value.offsetHeight;
      }
      if (information.value) {
        state.informationHeight = information.value.offsetHeight;
      }
      if (operation.value) {
        state.operationHeight = operation.value.offsetHeight;
      }

      state.isBigScreen = getPhoneType();
      if (state.isBigScreen) {
        state.describeHeight =
          window.innerHeight -
          state.bannerHeight -
          state.informationHeight -
          state.operationHeight -
          44 -
          35 +
          "px";
      } else {
        state.describeHeight =
          window.innerHeight -
          state.bannerHeight -
          state.informationHeight -
          state.operationHeight -
          44 +
          "px";
      }
    };
    //获取直播信息
    function getLiveInfo() {
      axios
        .get(axios.defaults.baseURL + "/jeecg-boot/live/api/getLive", {
          params: {
            liveId: liveId.value,
          },
        })
        .then((res: any) => {
          if (res.data.code == 200) {
            state.liveInfo = {
              cover: res.data.result.cover,
              name: res.data.result.name,
              viewPersonTime: res.data.result.viewPersonTime,
              introduce: res.data.result.introduce,
            };
          }
        });
    }
    //获取当前是否已订阅直播
    function getSubscribeState() {
      axios
        .get(axios.defaults.baseURL + "/jeecg-boot/live/api/getMySubscribeLiveFlag", {
          params: {
            liveId: liveId.value,
          },
        })
        .then((res: any) => {
          if (res.data.code == 200) {
            state.subscribeState = res.data.result;
          }
        });
    }
    //订阅直播
    function getSubscribeInfo() {
      axios
        .get(axios.defaults.baseURL + "/jeecg-boot/live/api/liveSubscribe", {
          params: {
            liveId: liveId.value,
          },
        })
        .then((res: any) => {
          if (res.data.code == 200) {
            state.subscribeState = true;
            Toast("直播订阅成功，开播将通过短信通知");
          } else {
            Toast("解锁全部功能，请登录“齐鲁工惠app”观看直播");
          }
        });
    }
    function handleTouch(e: any) {
      e._isScroller = true;
    }
    onMounted(async () => {
      await elementHeight();
      await getLiveInfo();
      await getSubscribeState();
    });
    return {
      ...toRefs(state),
      banner,
      information,
      operation,
      elementHeight,
      getLiveInfo,
      getSubscribeState,
      getSubscribeInfo,
      handleTouch,
    };
  },
});
</script>

<style lang="scss" scoped>
.guide {
  min-height: 100vh;
  background: #f6f6f6;
  .headerBox {
    display: flex;
    justify-content: center;
    .header {
      width: 100%;
      display: flex;
      justify-content: center;
      .banner {
        width: 100%;
        height: 2.23rem;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
  .introduceBox {
    display: flex;
    justify-content: center;
    .introduce {
      width: 100%;
      display: flex;
      justify-content: center;
      background: #fff;
      .information {
        width: 92%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 5px 0;
        .information-top {
          width: 100%;
          display: flex;
          margin: 6px 0 0;
          .stream {
            display: flex;
            .stream-theme {
              width: 2.9rem;
              display: flex;
              align-items: center;
              margin: 0px 0 0 5px;
              .title {
                font-size: 16px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                color: #323332;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 16px;
              }
            }
          }
        }
        .information-bottom {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin: 11px 0 6px;
          .info {
            display: flex;
            .browse {
              display: flex;
              img {
                width: 12px;
                height: 12px;
              }
              .number {
                font-size: 13px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                color: #999999;
                line-height: 13px;
                margin: 0 0 0 4px;
              }
            }
          }
        }
      }
    }
  }
  .contentBox {
    display: flex;
    justify-content: center;
    .content {
      width: 90%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .content-top {
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 10px 0 13px;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .message {
          font-size: 15px;
          font-family: PingFang SC-中等, PingFang SC;
          font-weight: normal;
          color: #323332;
          line-height: 25px;
        }
      }
      .content-top::-webkit-scrollbar {
        display: none;
      }
      .content-bottom {
        width: 100%;
        display: flex;
        justify-content: center;
        position: fixed;
        bottom: 0;
        .operation {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          .operation-top {
            width: 100%;
            display: flex;
            justify-content: center;
            margin: 16px 0;
            .subscribe {
              width: 2.85rem;
              height: 0.44rem;
              background: linear-gradient(270deg, #ff5736 0%, #ff2a00 100%);
              border-radius: 22px;
              font-size: 14px;
              font-family: PingFang SC-中等, PingFang SC;
              font-weight: normal;
              color: #ffffff;
              line-height: 25px;
            }
          }
        }
      }
      @supports (bottom: constant(safe-area-inset-bottom)) or
        (bottom: env(safe-area-inset-bottom)) {
        .content-bottom {
          padding-bottom: constant(safe-area-inset-bottom);
          padding-bottom: env(safe-area-inset-bottom);
        }
      }
    }
  }
}
</style>
