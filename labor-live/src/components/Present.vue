<template>
  <div
    class="present animate__animated animate__fadeInUp"
    :style="presentWindowHeight"
    v-if="showPresent"
  >
    <div class="contentBox">
      <div class="content">
        <div class="content-top">
          <span class="title">赠送主播一个小礼物吧~</span>
          <span class="close" @click="onClose">关闭</span>
        </div>
        <div class="content-center" @touchmove="handleTouch" :style="presentListHeight">
          <div class="information">
            <div class="container" v-for="item in presentList" :key="item.id">
              <div class="gift" @click="getActiveInfo(item.id)">
                <div :class="['gift-top', item.id == active ? 'active' : '']">
                  <img :src="item.icon" alt="" />
                  <span class="title" v-show="item.id != active">{{ item.name }}</span>
                  <span class="price">{{ item.coin }}金币</span>
                </div>
                <div class="gift-bottom" v-show="item.id == active">
                  <van-button class="give" @click="givePresent(item.id, item.coin)"
                    >赠送</van-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-bottom">
          <div class="info">
            <span class="title">剩余：</span>
            <span class="number">{{ goldCoin }}金币</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  toRefs,
  onMounted,
  onUnmounted,
  watch,
} from "vue";
import { PresentListConfig } from "@/types/present";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
import socket from "@/utils/socket";
import { Toast } from "vant";
import * as _ from "lodash";
export default defineComponent({
  name: "present",
  props: {
    movieHeight: Number,
    showPresent: Boolean,
    equipmentHeight: Number,
  },
  setup(props: any, context: any) {
    const { appContext } = getCurrentInstance() as any;
    const axios = appContext.config.globalProperties.$axios;
    const store = userStore();
    const { laborApp } = storeToRefs(store);
    const state = reactive({
      presentWindowHeight: {
        height: "",
      },
      presentListHeight: {
        height: "",
      },
      presentList: ref<PresentListConfig[]>([]), //礼物列表
      active: ref(""), //默认没有选择礼物
      goldCoin: ref<number>(0),
      laborApp: true, //齐鲁工惠app环境
    });
    /**
     * 礼物窗口、列表高度
     */
    function getPresentHeight(): any {
      state.presentWindowHeight.height = props.equipmentHeight - props.movieHeight + "px";
      state.presentListHeight.height =
        props.equipmentHeight - props.movieHeight - 47 - 51 + "px";
    }
    watch(
      () => props.showPresent,
      (value) => {
        window.addEventListener("resize", getPresentHeight());
      }
    );
    /**
     * 礼物信息
     */
    function getPresentInfo() {
      axios.get(axios.defaults.baseURL + "/jeecg-boot/gift/api/list").then((res: any) => {
        if (res.data.code == 200) {
          state.presentList = res.data.result;
        }
      });
    }
    getPresentInfo();
    //获取我最新的金币
    function getMyCoin() {
      axios
        .get(axios.defaults.baseURL + "/jeecg-boot/user/api/getMyGoldCoin")
        .then((res: any) => {
          if (res.data.code == 200) {
            if (res.data.result) {
              state.goldCoin = res.data.result;
            }
          }
        });
    }
    function getActiveInfo(sort: any) {
      state.active = sort;
    }
    function handleTouch(e: any) {
      e._isScroller = true;
    }
    function onClose() {
      state.active = "";
      context.emit("closeGift");
    }

    const givePresent = _.throttle(
      (id: string, coin: number) => {
        state.laborApp = laborApp.value;
        if (state.laborApp) {
          if (coin > state.goldCoin) {
            Toast({
              message: "金币不足！",
              className: "fail",
            });
            return false;
          }
          interface Opt {
            giftId: string;
            pushType: string;
          }
          const opt: Opt = {
            giftId: id,
            pushType: "3",
          };
          socket.send(opt);
          onClose();
          Toast({
            message: "赠送成功！",
            className: "success",
          });
        } else {
          Toast("解锁全部功能，请登录“齐鲁工惠app”观看直播");
        }
      },
      3000,
      {
        leading: true,
        trailing: false,
      }
    );

    onUnmounted(() => {
      window.removeEventListener("resize", getPresentHeight());
    });
    return {
      ...toRefs(state),
      getPresentHeight,
      getPresentInfo,
      getMyCoin,
      getActiveInfo,
      handleTouch,
      onClose,
      givePresent,
    };
  },
});
</script>

<style lang="scss" scoped>
.present {
  width: 100%;
  display: flex;
  animation-duration: 0.5s;
  .contentBox {
    width: 100%;
    display: flex;
    justify-content: center;
    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      background: #f6f6f6;

      .content-top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        background: #fff;
        .title {
          font-size: 12px;
          font-family: PingFang SC-中等, PingFang SC;
          font-weight: normal;
          color: #ffb300;
          line-height: 21px;
          margin: 13px 0 13px 10px;
        }
        .close {
          font-size: 14px;
          font-family: PingFang SC-中等, PingFang SC;
          font-weight: normal;
          color: #ff2a00;
          line-height: 21px;
          margin: 13px 19px 13px 0;
        }
      }
      .content-center {
        width: 100%;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .information {
          display: flex;
          flex-wrap: wrap;
          margin: 5px 0 0;
          .container {
            display: flex;
            margin: 0 0 10px 11px;
            .gift {
              width: 0.8rem;
              height: 1.13rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              .gift-top {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                border-bottom: none;
                border-radius: 8px 8px 0 0;
                img {
                  width: 68px;
                  height: 68px;
                  margin: 6px 0 0;
                }
                .title {
                  font-size: 13px;
                  font-family: PingFang SC-粗体, PingFang SC;
                  font-weight: normal;
                  color: #ff2a00;
                  line-height: 10px;
                  margin: 6px 0;
                }
                .price {
                  font-size: 10px;
                  zoom: 0.8;
                  font-family: PingFang SC-中等, PingFang SC;
                  font-weight: normal;
                  color: #ffb300;
                  line-height: 13px;
                  margin: 1px 0;
                }
                &.active {
                  border: 1px solid #ff2a00;
                  background: #fff;
                }
              }
              .gift-bottom {
                display: flex;
                .give {
                  width: 0.8rem;
                  height: 0.24rem;
                  background: #ff2a00;
                  border-radius: 0 0 8px 8px;
                  font-size: 13px;
                  font-family: PingFang SC-粗体, PingFang SC;
                  font-weight: normal;
                  color: #ffffff;
                  line-height: 13px;
                  border: 1px solid #ff2a00;
                }
              }
            }
          }
        }
      }
      .content-center::-webkit-scrollbar {
        display: none;
      }
      .content-bottom {
        width: 100%;
        display: flex;
        position: fixed;
        left: 0;
        bottom: 0;
        .info {
          width: 100%;
          display: flex;
          padding: 15px 0;
          background: #fff;
          .title {
            font-size: 15px;
            font-family: PingFang SC-粗体, PingFang SC;
            font-weight: normal;
            color: #323332;
            line-height: 21px;
            margin: 0 0 0 10px;
          }
          .number {
            font-size: 15px;
            font-family: PingFang SC-粗体, PingFang SC;
            font-weight: normal;
            color: #ffb300;
            line-height: 21px;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.fail .van-toast__text {
  font-size: 14px;
  font-family: PingFang SC-中等, PingFang SC;
  font-weight: normal;
  color: #ff2a00;
  line-height: 13px;
}
.success .van-toast__text {
  font-size: 14px;
  font-family: PingFang SC-中等, PingFang SC;
  font-weight: normal;
  color: #ffdd00;
  line-height: 13px;
}
</style>
