<template>
  <div class="lottery" @touchmove="handleTouch" :style="lotteryHeight">
    <div class="contentBox">
      <div class="content">
        <div class="content-top">
          <div class="address" @click="getAddressInfo">
            <span class="receive">收货</span>
            <span class="site">地址</span>
          </div>
        </div>
        <div class="content-center">
          <div class="sign">
            <img src="@/assets/lottery/sign.png" alt="" />
          </div>
        </div>
        <div class="content-bottom">
          <LuckyWheel
            ref="myLucky"
            width="277px"
            height="277px"
            :prizes="lotteryInfo.prizeList"
            :blocks="blocks"
            :buttons="buttons"
            @start="startCallback"
            @end="endCallback"
          />
        </div>
      </div>
    </div>
    <div class="introduceBox">
      <div class="introduce">
        <div class="introduce-top">
          <div class="label">
            <span class="title">抽奖活动说明</span>
          </div>
        </div>
        <div class="introduce-center">
          <div class="activity">
            <div class="information">
              <span class="name">活动名称：{{ lotteryInfo.activityTitle }}</span>
              <span class="time" v-if="lotteryInfo.activityStartTime"
                >活动时间：{{ lotteryInfo.activityStartTime.split(" ")[0] }}-{{
                  lotteryInfo.activityEndTime.split(" ")[0]
                }}</span
              >
              <span class="join_count">每人参与次数：{{ lotteryInfo.drawNumber }}</span>
              <span class="award_count"
                >可获奖次数：{{ lotteryInfo.winPrizeNumber }}</span
              >
              <div class="rule">
                <span class="message" v-html="lotteryInfo.activityDetails"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-dialog class="remind_dialog" v-model:show="showPrize" :showConfirmButton="false">
      <div class="remind">
        <span class="title">{{ prizeRemind }}</span>
        <span class="message">{{ prizeInfo }}</span>
        <van-button class="confirm" @click="showPrize = false">确认</van-button>
      </div>
    </van-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance, onMounted, reactive, onUnmounted } from "vue";
import { LotteryListConfig } from "@/types/introduce";
import { useRouter, useRoute } from "vue-router";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { Toast } from "vant";
const store = userStore();
const { liveId } = storeToRefs(store);
const lotteryHeight = reactive({
  height: "",
});
function handleTouch(e: any) {
  e._isScroller = true;
}
function getLotteryHeight(): any {
  lotteryHeight.height = window.innerHeight + "px";
}
window.addEventListener("resize", getLotteryHeight());
const router = useRouter();
const route = useRoute();
function getAddressInfo() {
  router.push({
    name: "receiveAddress",
  });
}
const myLucky = ref<null | HTMLElement>(null);
const { appContext } = getCurrentInstance() as any;
const axios = appContext.config.globalProperties.$axios;
let lotteryInfo = reactive({
  activityTitle: ref<string>(""), //活动名称
  activityStartTime: ref<string>(""), //活动开始时间
  activityEndTime: ref<string>(""), //活动结束时间
  drawNumber: ref<number>(0), //每人参与参数
  winPrizeNumber: ref<number>(0), //可获奖次数
  activityDetails: ref<string>(""), //活动规则
  prizeList: ref<LotteryListConfig[]>([]), //转盘列表
});
const showPrize = ref(false);
const prizeRemind = ref("");
const prizeInfo = ref("");
const currentIndex = ref(0);
const blocks = [
  {
    padding: "12px",
    imgs: [
      {
        src: "https://res1.qdszgh.cn/laborLive/round.png",
        width: "100%",
        height: "100%",
      },
    ],
  },
];

const buttons = [
  {
    radius: "45%",
    imgs: [
      {
        src: "https://res1.qdszgh.cn/laborLive/begin.png",
        width: "100%",
        top: "-130%",
      },
    ],
  },
];
function startCallback() {
  axios
    .post(axios.defaults.baseURL + "/jeecg-boot/api/activity/activityRecord/chou", {
      activityId: Number(route.query.activityId),
      liveId: liveId.value,
    })
    .then((res: any) => {
      if (res.data.code == 200) {
        (myLucky.value as any).play();
        lotteryInfo.prizeList.forEach((item, index) => {
          if (res.data.result == item.prizeId) {
            currentIndex.value = index;
          }
        });
        setTimeout(() => {
          (myLucky.value as any).stop(currentIndex.value);
        }, 3000);
      } else {
        Toast.fail(res.data.message);
      }
    });
}

function endCallback(prize: any) {
  if (prize.prizeId) {
    prizeRemind.value = "恭喜中奖！";
    prizeInfo.value = "恭喜您，获得" + prize.prizeTitle;
  } else {
    prizeRemind.value = "未中奖！";
    prizeInfo.value = "很遗憾，您未中奖！";
  }
  showPrize.value = true;
}
//获取转盘活动信息
function getLotteryInfo() {
  axios
    .get(
      axios.defaults.baseURL +
        "/jeecg-boot/api/activity/" +
        Number(route.query.activityId)
    )
    .then((res: any) => {
      if (res.data.code == 200) {
        lotteryInfo.activityTitle = res.data.result.activityTitle;
        lotteryInfo.activityStartTime = res.data.result.activityStartTime;
        lotteryInfo.activityEndTime = res.data.result.activityEndTime;
        lotteryInfo.drawNumber = res.data.result.drawNumber;
        lotteryInfo.winPrizeNumber = res.data.result.winPrizeNumber;
        lotteryInfo.activityDetails = res.data.result.activityDetails;
        if (res.data.result.prizeList.length == 1) {
          const count = ref<number>(0);
          res.data.result.prizeList.forEach((item: any, index: number) => {
            let timer: any = null;
            timer = setInterval(() => {
              if (count.value < 3) {
                lotteryInfo.prizeList.push(
                  {
                    prizeTitle: item.prizeTitle,
                    prizeId: item.prizeId,
                    fonts: [
                      {
                        text: item.prizeTitle,
                        top: "30%",
                        fontColor: "#FF2A00",
                        fontSize: "16px",
                      },
                    ],
                    background: "#fff58b",
                  },
                  {
                    prizeTitle: "谢谢参与",
                    prizeId: 0,
                    fonts: [
                      {
                        text: "谢谢参与",
                        top: "30%",
                        fontColor: "#FF2A00",
                        fontSize: "16px",
                      },
                    ],
                    background: "#fed320",
                  }
                );
                count.value++;
              } else {
                clearInterval(timer);
              }
            }, 10);
          });
        } else if (res.data.result.prizeList.length == 2) {
          const count = ref<number>(0);
          let timer: any = null;
          timer = setInterval(() => {
            if (count.value < 2) {
              res.data.result.prizeList.forEach((item: any, index: number) => {
                lotteryInfo.prizeList.push({
                  prizeTitle: item.prizeTitle,
                  prizeId: item.prizeId,
                  fonts: [
                    {
                      text: item.prizeTitle,
                      top: "30%",
                      fontColor: "#FF2A00",
                      fontSize: "16px",
                    },
                  ],
                  background: index % 2 == 0 ? "#fff58b" : "#fed320",
                });
                if (index % 2 == 1) {
                  lotteryInfo.prizeList.push({
                    prizeTitle: "谢谢参与",
                    prizeId: 0,
                    fonts: [
                      {
                        text: "谢谢参与",
                        top: "30%",
                        fontColor: "#FF2A00",
                        fontSize: "16px",
                      },
                    ],
                    background: "#fff58b",
                  });
                }
                count.value++;
              });
            } else {
              clearInterval(timer);
            }
          }, 10);
        } else if (res.data.result.prizeList.length == 3) {
          res.data.result.prizeList.forEach((item: any, index: number) => {
            lotteryInfo.prizeList.push({
              prizeTitle: item.prizeTitle,
              prizeId: item.prizeId,
              fonts: [
                {
                  text: item.prizeTitle,
                  top: "30%",
                  fontColor: "#FF2A00",
                  fontSize: "16px",
                },
              ],
              background: "#fff58b",
            });
            lotteryInfo.prizeList.push({
              prizeTitle: "谢谢参与",
              prizeId: 0,
              fonts: [
                {
                  text: "谢谢参与",
                  top: "30%",
                  fontColor: "#FF2A00",
                  fontSize: "16px",
                },
              ],
              background: "#fed320",
            });
          });
        } else if (res.data.result.prizeList.length == 4) {
          res.data.result.prizeList.forEach((item: any, index: number) => {
            lotteryInfo.prizeList.push({
              prizeTitle: item.prizeTitle,
              prizeId: item.prizeId,
              fonts: [
                {
                  text: item.prizeTitle,
                  top: "30%",
                  fontColor: "#FF2A00",
                  fontSize: "16px",
                },
              ],
              background: index % 2 == 0 ? "#fff58b" : "#fed320",
            });
            if (index % 2 == 1) {
              lotteryInfo.prizeList.push({
                prizeTitle: "谢谢参与",
                prizeId: 0,
                fonts: [
                  {
                    text: "谢谢参与",
                    top: "30%",
                    fontColor: "#FF2A00",
                    fontSize: "16px",
                  },
                ],
                background: "#fff58b",
              });
            }
          });
        } else if (res.data.result.prizeList.length == 5) {
          res.data.result.prizeList.forEach((item: any, index: number) => {
            lotteryInfo.prizeList.push({
              prizeTitle: item.prizeTitle,
              prizeId: item.prizeId,
              fonts: [
                {
                  text: item.prizeTitle,
                  top: "30%",
                  fontColor: "#FF2A00",
                  fontSize: "16px",
                },
              ],
              background: index % 2 == 0 ? "#fff58b" : "#fed320",
            });
          });
          lotteryInfo.prizeList.push({
            prizeTitle: "谢谢参与",
            prizeId: 0,
            fonts: [
              {
                text: "谢谢参与",
                top: "30%",
                fontColor: "#FF2A00",
                fontSize: "16px",
              },
            ],
            background: "#fff58b",
          });
        } else if (res.data.result.prizeList.length > 5) {
          res.data.result.prizeList.forEach((item: any, index: number) => {
            lotteryInfo.prizeList.push({
              prizeTitle: item.prizeTitle,
              prizeId: item.prizeId,
              fonts: [
                {
                  text: item.prizeTitle,
                  top: "30%",
                  fontColor: "#FF2A00",
                  fontSize: "16px",
                },
              ],
              background: index % 2 == 0 ? "#fff58b" : "#fed320",
            });
          });
        }
      }
    });
}
onMounted(() => {
  getLotteryInfo();
});

onUnmounted(() => {
  window.removeEventListener("resize", getLotteryHeight());
});
</script>

<style lang="scss" scoped>
.lottery {
  background: url("@/assets/lottery/bg.png") no-repeat;
  background-size: 100% 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .contentBox {
    display: flex;
    justify-content: center;
    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .content-top {
        width: 90%;
        display: flex;
        justify-content: flex-end;
        .address {
          width: 0.48rem;
          height: 0.45rem;
          background: #ff2a00;
          border-radius: 0px 0px 30px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .receive {
            font-size: 13px;
            font-family: PingFang SC-中等, PingFang SC;
            font-weight: normal;
            color: #fefffe;
            line-height: 18px;
            margin: 2px 0 0;
          }
          .site {
            font-size: 13px;
            font-family: PingFang SC-中等, PingFang SC;
            font-weight: normal;
            color: #fefffe;
            line-height: 18px;
          }
        }
      }
      .content-center {
        width: 100%;
        display: flex;
        justify-content: center;
        .sign {
          width: 2.77rem;
          height: 1.11rem;
          display: flex;
          img {
            width: 100%;
            height: 100%;
          }
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
      flex-direction: column;
      align-items: center;
      margin: 24px 0 0;
      .introduce-top {
        display: flex;
        justify-content: center;
        .label {
          width: 2.38rem;
          height: 0.4rem;
          background: url("@/assets/lottery/label.png") no-repeat;
          background-size: 100% 100%;
          display: flex;
          justify-content: center;
          .title {
            font-size: 20px;
            font-family: PingFang SC-粗体, PingFang SC;
            font-weight: normal;
            color: #ffffff;
            line-height: 20px;
            margin: 6px 0 0;
          }
        }
      }
      .introduce-center {
        width: 100%;
        display: flex;
        justify-content: center;
        .activity {
          width: 90%;
          display: flex;
          justify-content: center;
          background: #6807a2;
          border-radius: 16px;
          border: 1px solid #ddb6f4;
          margin: 13px 0 35px;
          .information {
            width: 90%;
            display: flex;
            flex-direction: column;
            margin: 19px 0 20px;
            .name,
            .time,
            .join_count,
            .award_count {
              font-size: 14px;
              font-family: PingFang SC-中等, PingFang SC;
              font-weight: normal;
              color: #fefffe;
              line-height: 26px;
            }
            .rule {
              display: flex;
              .message {
                font-size: 14px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                color: #fefffe;
                line-height: 26px;
              }
            }
          }
        }
      }
    }
  }
  .remind_dialog {
    display: flex;
    .remind {
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        font-size: 20px;
        font-family: PingFang SC-粗体, PingFang SC;
        font-weight: normal;
        color: #ff2a00;
        line-height: 20px;
        margin: 43px 0 0;
      }
      .message {
        font-size: 16px;
        font-family: PingFang SC-中等, PingFang SC;
        font-weight: normal;
        color: #333333;
        line-height: 18px;
        margin: 30px 0;
      }
      .confirm {
        width: 1.62rem;
        height: 0.48rem;
        background: linear-gradient(180deg, #ff5736 0%, #ff2a00 100%);
        border-radius: 24px;
        font-size: 16px;
        font-family: PingFang SC-中等, PingFang SC;
        font-weight: normal;
        color: #ffffff;
        line-height: 16px;
        margin: 0 0 44px;
      }
    }
  }
}
</style>
