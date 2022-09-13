<template>
  <div class="content">
    <van-nav-bar
      class="title"
      title="福袋管理"
      left-text=""
      left-arrow
      @click-left="onClickLeft"
    >
    </van-nav-bar>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        class="pull-box"
      >
        <div style="height: 8px; background: #f5f5f5"></div>
        <van-cell v-for="item in luckyList" :key="item.id">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <div style="display: flex">
              <div style="margin-left: 12px">
                <div class="fsize14" style="padding-top: 5px">
                  拼手气福袋
                  <div
                    class="fuda-label"
                    :class="{
                      blue: item.status == 0,
                      green: item.status == 1,
                      red: item.status == 2,
                    }"
                  >
                    {{
                      item.status == 0 ? "未启用" : item.status == 1 ? "进行中" : "已结束"
                    }}
                    <span
                      style="color: #999999"
                      v-if="item.status == 1 && countDown(item.bagDrawPrizeTimeLong) > 0"
                    >
                      <!-- {{leftTimeLabel}} -->
                      <van-count-down
                        format="mm:ss"
                        @finish="onFinish"
                        :time="countDown(item.bagDrawPrizeTimeLong)"
                        style="display: inline-block"
                      />
                    </span>
                  </div>
                </div>
                <div class="fsize12 overtext" style="margin-top: 12px">
                  {{ item.goldCoin }}金币*{{ item.winPrizeQuantity }}个，计时{{
                    item.countDownLabel
                  }}
                </div>
                <!-- <div
                  class="fuda-label red bottom-line"
                  @click="showPopup(item)"
                  v-if="item.pushType == 0"
                >
                  奖项设置
                </div> -->
              </div>
            </div>

            <van-button
              class="fsize13 plain"
              :class="{
                color: item.status == 0,
              }"
              :loading="item.id == activeId"
              @click="start(item)"
            >
              {{
                item.status == 0
                  ? "启用"
                  : item.status == 1
                  ? "查看参与名单"
                  : "查看中奖名单"
              }}
            </van-button>
          </div>
        </van-cell>
        <!-- <div style="height: 35px; background: #f5f5f5"></div> -->
        <van-cell v-for="item in prizeList" :key="item.id">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <div style="display: flex">
              <div style="margin-left: 12px">
                <div class="fsize14" style="padding-top: 5px">
                  幸运抽奖
                  <div
                    class="fuda-label"
                    :class="{
                      blue: item.prizeSumSurplus == 0,
                      green: item.prizeSumSurplus == 1,
                      red: item.prizeSumSurplus == 2,
                    }"
                  >
                    {{
                      item.activityState == 0
                        ? "未启用"
                        : item.activityState == 1
                        ? "进行中"
                        : item.activityState == 2
                        ? "已结束"
                        : "已关闭"
                    }}
                  </div>
                </div>
                <div class="fsize12" style="margin-top: 12px">
                  <div class="overtext">奖品数量：{{ item.drawNumber }}个</div>
                  <div
                    class="fuda-label red bottom-line"
                    @click="showPopup(item.prizeList)"
                  >
                    奖项设置
                  </div>
                </div>
              </div>
            </div>

            <van-button
              class="fsize13"
              :class="{
                plain: item.prizeSumSurplus > 0,
                color: item.prizeSumSurplus == 0,
              }"
              :loading="item.id == activeId"
              @click="start(item)"
            >
              {{ item.prizeSumSurplus == 0 ? "启用" : "查看中奖名单" }}
            </van-button>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>

    <van-popup v-model:show="show" closeable round :style="{ width: '90vw' }">
      <div
        style="
          padding-bottom: 23px;
          text-align: center;
          padding-left: 20px;
          padding-right: 20px;
        "
      >
        <div class="pop-title">奖项设置</div>
        <div
          class="pop-content fsize14"
          style="display: flex; justify-content: space-around"
        >
          <div style="display: inline-block; padding-right: 20px">奖项名称</div>
          <div style="display: inline-block; padding-right: 20px">奖品数量</div>
          奖品内容
        </div>
        <div class="fsize14">
          <div v-for="stem in offerList" :key="stem.key">
            <div
              style="display: flex"
              class="ofcolor1"
              :class="{
                ofcolor0: stem.prizeType == 0,
                ofcolor2: stem.prizeType == 2,
                ofcolor1: stem.prizeType == 1,
                ofcolor3: stem.prizeType == 3,
              }"
            >
              <div class="listfront">{{ stem.prizeType_dictText }}</div>
              <div class="listfront">{{ stem.prizeSum }}</div>
              <div class="listfront">{{ stem.prizeTitle }}</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import {
  ref,
  reactive,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  toRefs,
} from "vue";
import { useRouter } from "vue-router";
import { get, post } from "@/utils/request";
import socket from "@/utils/socket";
import { Base64 } from "js-base64";
import { Toast } from "vant";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
export default defineComponent({
  name: "luckyManage",
  setup(props: any, context: any) {
    const { appContext } = getCurrentInstance() as any;
    const axios = appContext.config.globalProperties.$axios;
    const store = userStore();
    const { liveId } = storeToRefs(store);
    const state = reactive({
      luckyList: <any[]>[], //福袋列表
      offerList: <any[]>[], //奖项列表
      prizeList: <any[]>[], //幸运抽奖列表
      activeId: ref(""),
      currentPage: ref(0),
      sizePage: ref(10),
      totalPage: ref(0),
      show: false,
      leftTime: ref(0),
      leftTimeLabel: ref(""),
      liveId: ref(""),
    });
    // state.liveId = "e5f303d9-97ec-6bc0-2fd8-8107ad15fa85";

    state.liveId = liveId.value;
    const showPopup = (item: any) => {
      state.show = true;
      getPrizeList(item);
    };
    const getPrizeList = (item: any) => {
      console.log("奖项设置：" + item);
      state.offerList = [];
      state.offerList = item;
    };
    const onClickLeft = () => history.back();

    const loading = ref(false);
    const finished = ref(false);
    const refreshing = ref(false);

    const router = useRouter();
    //const route = useRoute()
    const start = (item: any) => {
      if (item.status == 0) {
        state.activeId = item.id;
        enableGoodBag(item.id, item.liveId);
        // socketEnableBag(item.liveId,item.liveGoodBagId);
      } else if (item.status == 2) {
        router.push("/winUser/" + item.id);
      } else if (item.status == 1) {
        router.push("/joinUser/" + item.id);
      }
    };
    const enableGoodBag = (id: String, vid: String) => {
      let pdata = { goodBagId: id, liveId: vid };
      console.log("启用福袋" + JSON.stringify(pdata));
      get(axios.defaults.baseURL + "/jeecg-boot/goodBag/api/enableGoodBag", pdata).then(
        (res: any) => {
          if (res.data.code == 200 || res.data.code == 500) {
            setTimeout(() => {
              state.activeId = "";
              refreshing.value = true;
              onRefresh();
              Toast(res.data.message);
            }, 500);
          }
        }
      );
    };

    function loadPrize() {
      let req = {
        pageNo: state.currentPage,
        pageSize: 10,
        liveId: state.liveId,
      };
      get(
        axios.defaults.baseURL + "/jeecg-boot/LiveActivity/liveActivity/list",
        req
      ).then((res: any) => {
        if (res.data.code == 200 && res.data.result) {
          let data = res.data.result;
          console.log("prizeList", data);
          let records = data.records;
          if (records.length > 0) {
            for (let i = 0; i < records.length; i++) {
              state.prizeList.push(records[i]);
            }
          }

          console.log("当前页：" + state.currentPage);
          loading.value = false;
          if (state.currentPage >= data.pages) {
            finished.value = true;
          }
        } else {
          finished.value = true;
          loading.value = false;
        }
      });
    }
    function loadGoodBag() {
      //  state.currentPage=1
      let req = {
        pageNo: state.currentPage,
        pageSize: 10,
        liveId: state.liveId,
      };
      //  /jeecg-boot/goodBag/api/ongoingGoodBag
      get(axios.defaults.baseURL + "/jeecg-boot/goodBag/api/goodBagList", req).then(
        (res: any) => {
          if (res.data.code == 200 && res.data.result) {
            let data = res.data.result;
            console.log("luckyList", data);
            let records = data;
            if (records.length > 0) {
              for (let i = 0; i < records.length; i++) {
                state.luckyList.push(records[i]);
              }
            }

            console.log("当前页：" + state.currentPage);
            loading.value = false;
            // if (state.currentPage >= data.pages) {
            finished.value = true;
            // }
          } else {
            finished.value = true;
            loading.value = false;
          }
        }
      );
    }
    const onLoad = () => {
      if (refreshing.value) {
        state.luckyList = [];
        state.prizeList = [];
        state.currentPage = 0;
        refreshing.value = false;
      }
      state.currentPage++;
      loadGoodBag();
      //  loadPrize();
      //  socketEnableBag(
      //   "1523497318079721473",
      //   "1529729222772678658"
      // );
    };
    const onFinish = () => {
      setTimeout(() => {
        state.activeId = "";
        refreshing.value = true;
        onRefresh();
      }, 200);
    };
    const onRefresh = () => {
      finished.value = false;
      loading.value = true;

      onLoad();
    };

    //websocket 推送---
    onMounted(async () => {
      // socket.init(receiveMessage);
    });
    // 消息接收
    async function receiveMessage(message: any) {
      // const param = JSON.parse(Base64.decode(message.data));
      const param = JSON.parse(message.data);
      // 处理 赋值问题
      const params = JSON.parse(JSON.stringify(param));
      //  console.log('消息接收'+JSON.stringify(message.data))

      interface Opt {
        id: number;
        liveId: string;
        message: string;
        countDownLabel: string;
        countDownLong: number;
        countDownString: string;
        enableFlag: number;
        goldCoin: number;
        winPrizeQuantity: number;
      }

      const opt: Opt = {
        id: param.id,
        goldCoin: params.goldCoin,
        winPrizeQuantity: param.winPrizeQuantity,
        liveId: param.liveId,
        message: param.message,
        countDownString: param.countDownString,
        countDownLong: param.countDownLong,
        countDownLabel: param.countDownLabel,
        enableFlag: param.enableFlag,
      };
      // if(params.pushType==1){
      // let timestamp=Math.round(new Date().getTime());
      // console.log(params.countDownLong+"--当前时间：-"+(1653823167055-timestamp))

      await addTimeOut(params);
      // }
    }
    function addTimeOut(opt: any) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          addGoodBag(opt);
          resolve("success");
        }, 500);
      });
    }
    function addGoodBag(data: any) {
      // if (state.luckyList.length >= 150) {
      //   state.luckyList.splice(0, 50);
      // }
      // state.luckyList = [];
      // data.enableFlag=1
      // data.countDownString='10:00';
      // data.countDownLong=60000;
      // state.leftTime=data.countDownLong;
      state.luckyList.push(data);
      nextTick(() => {
        finished.value = true;
        loading.value = false;
        //  console.log(data.liveGoodBagId);

        // let timeINt=setInterval(()=>{
        //       state.leftTime=state.leftTime - 1000
        //       state.leftTimeLabel=countDown(state.leftTime/1000) ;
        //       if(state.leftTime==0){
        //              clearInterval(timeINt)
        //       }
        //    },1000)

        //renderComment();
      });
    }
    function addZero(i: Number) {
      return i < 10 ? "0" + i : i + "";
    }
    function countDown(lt: any) {
      // let m:any = lt / 60 % 60;
      //  let s:any = lt % 60;
      // return addZero(parseInt(m))+':'+addZero(parseInt(s));

      let timestamp = Math.round(new Date().getTime());
      let st = lt - timestamp;
      console.log(new Date(lt).toLocaleString() + "结束时间：" + st);
      if (st < 0) {
        st = 0;
      }
      console.log("n结束时间：" + st);
      return st;
    }
    //队列添加消息

    async function socketEnableBag(lId: string, bagId: string) {
      interface Opt {
        liveGoodBagId: string;
        liveId: string;
        pushType: string;

        sendMessageType: string;
      }
      const opt: Opt = {
        liveId: lId,
        liveGoodBagId: bagId,
        pushType: "1",
        sendMessageType: "1",
      };
      await socket.send(opt);
    }

    //-------------

    return {
      ...toRefs(state),
      enableGoodBag,
      socketEnableBag,
      onClickLeft,
      onLoad,
      loading,
      finished,
      refreshing,
      onRefresh,
      showPopup,
      start,
      router,
      getPrizeList,
      loadPrize,
      loadGoodBag,
      addGoodBag,
      countDown,
      addZero,
      onFinish,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pull-box {
  height: calc(100vh - 45px);
  border: 0px solid green;
  overflow-y: scroll;
}

.plain {
  color: #f64000;
  border: 1px solid #ff2a00;
}

.color {
  background: linear-gradient(270deg, #ff5736 0%, #ff2a00 100%);
  color: #ffffff;
}

.color1 {
  background: linear-gradient(270deg, #ff5736 0%, #ff2a00 100%);
  color: #ffffff;
}

.color0 {
  display: none;
  border: 0;
}

.title {
  font-size: 17px;
  font-weight: normal;
  color: #000000;
  line-height: 17px;
}

.main {
  font-family: PingFang SC-中等, PingFang SC;
}

::v-deep .van-nav-bar__content .van-icon {
  color: black;
}

::v-deep .van-popup .van-icon {
  color: black;
  font-weight: bold;
}

.fsize14 {
  color: #333333;
  font-size: 14px;
  line-height: 16px;
}

.fsize12 {
  font-size: 12px;
  color: #666666;
  line-height: 12px;
}

.fsize13 {
  font-size: 13px;
  line-height: 13px;
  height: 30px;
  border-radius: 1.4rem;
}

.pop-title {
  padding-top: 40px;
  font-size: 20px;
  color: #f92c1a;
  line-height: 20px;
}

.pop-content {
  padding-top: 30px;
  padding-bottom: 14px;
  color: #333333;
  line-height: 10px;
}

.label-man {
  position: absolute;
  left: 30px;
  bottom: 7px;
  border: 0px solid red;
  width: 13px;
  height: 14px;
  overflow: hidden;
}

.menu-box {
  background: #f8f8f8;
  border-radius: 8px;

  font-size: 14px;
}

.fuda-label {
  display: inline-block;
  font-size: 13px;
  line-height: 13px;
  margin-left: 14px;
}

.bottom-line {
  border-bottom: 1px solid #ff2a00;
}

.blue {
  color: #3f86ff;
}

.green {
  color: #5dd34a;
}

.red {
  color: #ff2a00;
}

.ofcolor1 {
  color: #ffb200;
}

.ofcolor2 {
  color: #a0acbc;
}

.ofcolor3 {
  color: #c7a88b;
}

.ofcolor0 {
  color: #333333;
}

.listfront {
  display: inline-block;
  padding-right: 20px;
  padding-bottom: 10px;
  font-size: 14px;
  width: 3.3rem;
}

.overtext {
  display: inline-block;
  max-width: 200px;
  /* border: 1px solid green; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
