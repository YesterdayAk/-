<template>
  <div class="rank">
    <div class="headerBox">
      <div class="header">
        <div class="banner" ref="banner">
          <img src="@/assets/rank/banner.png" alt="" />
        </div>
      </div>
    </div>
    <div class="contentBox">
      <div class="content">
        <div class="menu" ref="menu">
          <div class="information">
            <div class="watch" @click="getWatchRank">
              <span :class="['title', active == 1 ? 'active' : '']">邀请观看榜</span>
              <div class="line" v-if="active == 1"></div>
            </div>
            <div class="give" @click="getGiveRank">
              <span :class="['title', active == 2 ? 'active' : '']">赠送榜</span>
              <div class="line" v-if="active == 2"></div>
            </div>
          </div>
        </div>

        <div class="table_header">
          <div class="table_header_left">
            <span class="ranking">排名</span>
            <span class="name">姓名</span>
          </div>
          <div class="table_header_right">
            <span v-if="active == 1" class="give_amount">邀请人数</span>
            <span v-else class="give_amount">赠送额度</span>
          </div>
        </div>
        <div
          class="table_content"
          @touchmove="handleTouch"
          :style="{ height: tableContentHeight }"
        >
          <div
            :class="['container', (index + 1) % 2 == 0 ? 'active' : '']"
            v-for="(item, index) in rankList"
          >
            <div class="information">
              <div class="information-left">
                <div class="sequence">
                  <img v-if="index == 0" src="@/assets/rank/gold.png" alt="" />
                  <img v-else-if="index == 1" src="@/assets/rank/silver.png" alt="" />
                  <img v-else-if="index == 2" src="@/assets/rank/copper.png" alt="" />
                  <span v-else class="sort">{{ index < 10 ? "0" + index : index }}</span>
                </div>
                <div class="info">
                  <img :src="item.avatar ? item.avatar : '@/assets/profile.png'" alt="" />
                  <span
                    class="user_name"
                    :style="
                      index == 0
                        ? 'color:#ffb200'
                        : index == 1
                        ? 'color:#A0ACBC'
                        : index == 2
                        ? 'color:#C7A88B'
                        : ''
                    "
                    >{{ item.realname }}</span
                  >
                  <span
                    class="to"
                    :style="
                      index == 0
                        ? 'color:#ffb200'
                        : index == 1
                        ? 'color:#A0ACBC'
                        : index == 2
                        ? 'color:#C7A88B'
                        : ''
                    "
                    >-</span
                  >
                  <span
                    class="phone_number"
                    :style="
                      index == 0
                        ? 'color:#ffb200'
                        : index == 1
                        ? 'color:#A0ACBC'
                        : index == 2
                        ? 'color:#C7A88B'
                        : ''
                    "
                    >{{ item.phone }}</span
                  >
                </div>
              </div>
              <div class="information-right">
                <div class="amount">
                  <span
                    class="number"
                    :style="
                      index == 0
                        ? 'color:#ffb200'
                        : index == 1
                        ? 'color:#A0ACBC'
                        : index == 2
                        ? 'color:#C7A88B'
                        : ''
                    "
                    >{{ item.count }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <van-empty v-if="!rankList.length" description="暂无数据" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  ref,
  reactive,
  toRefs,
  onMounted,
} from "vue";
import { RankListConfig } from "@/types/rank";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
export default defineComponent({
  name: "rank",
  setup() {
    const { appContext } = getCurrentInstance() as any;
    const axios = appContext.config.globalProperties.$axios;
    const store = userStore();
    const { liveId } = storeToRefs(store);
    const active = ref(1);
    let state = reactive({
      bannerHeight: 0, //海报高度
      menuHeight: 0, //菜单栏高度
      isBigScreen: false, //默认iphone不是全面屏
      tableContentHeight: "", //表格内容高度
      rankList: ref<RankListConfig[]>([]),
    });
    let banner = ref<null | HTMLElement>(null);
    let menu = ref<null | HTMLElement>(null);
    const elementHeight = () => {
      if (banner.value) {
        state.bannerHeight = banner.value.offsetHeight;
      }
      if (menu.value) {
        state.menuHeight = menu.value.offsetHeight;
      }

      state.tableContentHeight =
        window.innerHeight - state.bannerHeight - state.menuHeight - 40 + 25 + "px";
    };
    function handleTouch(e: any) {
      e._isScroller = true;
    }
    onMounted(() => {
      elementHeight();
    });
    //获取邀请观看榜
    const getWatchRank = () => {
      active.value = 1;
      axios
        .get(axios.defaults.baseURL + "/jeecg-boot/rank/api/inviteRankList", {
          params: {
            liveId: liveId.value,
          },
        })
        .then((res: any) => {
          if (res.data.code == 200) {
            state.rankList = res.data.result;
          }
        });
    };
    getWatchRank();
    //获取赠送礼物榜
    const getGiveRank = () => {
      active.value = 2;
      axios
        .get(axios.defaults.baseURL + "/jeecg-boot/rank/api/giftList", {
          params: {
            liveId: liveId.value,
          },
        })
        .then((res: any) => {
          if (res.data.code == 200) {
            state.rankList = res.data.result;
          }
        });
    };
    return {
      active,
      ...toRefs(state),
      banner,
      menu,
      elementHeight,
      handleTouch,
      getWatchRank,
      getGiveRank,
    };
  },
});
</script>

<style lang="scss" scoped>
.rank {
  min-height: 100vh;
  .headerBox {
    display: flex;
    justify-content: center;
    .header {
      width: 100%;
      display: flex;
      .banner {
        display: flex;
        height: 1.84rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .contentBox {
    display: flex;
    justify-content: center;
    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #fff;
      height: 5.64rem;
      border-radius: 26px 26px 0 0;
      margin: -25px 0 0;
      .menu {
        width: 100%;
        display: flex;
        justify-content: center;
        border-bottom: 1px solid #f6f6f6;
        .information {
          width: 60%;
          display: flex;
          justify-content: space-between;
          .watch,
          .give {
            display: flex;
            flex-direction: column;
            align-items: center;
            .title {
              font-size: 15px;
              font-family: PingFang SC-特粗, PingFang SC;
              font-weight: normal;
              color: #333333;
              line-height: 14px;
              margin: 21px 0 0;
              &.active {
                color: #ff2a00;
              }
            }
            .line {
              width: 0.24rem;
              height: 0.04rem;
              background: #ff2a00;
              border-radius: 2px;
              margin: 6px 0 9px;
            }
          }
        }
      }
      .table_header {
        width: 90%;
        display: flex;
        justify-content: space-between;
        .table_header_left {
          display: flex;
          .ranking {
            font-size: 14px;
            font-family: PingFang SC-粗体, PingFang SC;
            font-weight: normal;
            color: #323332;
            line-height: 14px;
            margin: 14px 0 12px;
          }
          .name {
            font-size: 14px;
            font-family: PingFang SC-粗体, PingFang SC;
            font-weight: normal;
            color: #323332;
            line-height: 14px;
            margin: 14px 0 12px 32px;
          }
        }
        .table_header_right {
          display: flex;
          .give_amount {
            font-size: 14px;
            font-family: PingFang SC-粗体, PingFang SC;
            font-weight: normal;
            color: #323332;
            line-height: 14px;
            margin: 14px 0 12px;
          }
        }
      }
      .table_content {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .container {
          width: 100%;
          display: flex;
          justify-content: center;
          background: #fafafa;
          &.active {
            background: #fff;
          }
          .information {
            width: 90%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 13px 0;
            .information-left {
              display: flex;
              .sequence {
                display: flex;
                img {
                  width: 30px;
                  height: 24px;
                }
                .sort {
                  width: 0.3rem;
                  height: 0.24rem;
                  text-align: center;
                  line-height: 24px;
                }
              }
              .info {
                display: flex;
                align-items: center;
                margin: 0 0 0 30px;
                img {
                  width: 22px;
                  height: 22px;
                  border-radius: 50%;
                  margin: 0 8px 0 0;
                }
                .user_name,
                .to,
                .phone_number {
                  font-size: 14px;
                  font-family: PingFang SC-中等, PingFang SC;
                  font-weight: normal;
                  color: #333333;
                  line-height: 14px;
                }
              }
            }
            .information-right {
              display: flex;
              .amount {
                width: 0.55rem;
                display: flex;
                .number {
                  font-size: 18px;
                  font-family: PingFang SC-粗体, PingFang SC;
                  font-weight: normal;
                  color: #333333;
                  line-height: 14px;
                }
              }
            }
          }
        }
      }
      .table_content::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>
