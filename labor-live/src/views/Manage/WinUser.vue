<template>
  <div>
    <van-nav-bar
      class="title"
      title="中奖名单"
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

        <van-cell v-for="item in userList" :key="item.id">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div style="display: flex">
              <div style="position: relative">
                <van-image
                  round
                  width="48px"
                  height="48px"
                  :src="item.avatar"
                />
              </div>

              <div style="margin-left: 12px">
                <div class="fsize14" style="padding-top: 5px">
                  {{ item.realname }}
                </div>
                <!-- <div class="fsize12" style="margin-top: 12px">
                  {{ item.from }}
                </div> -->
              </div>
            </div>

            <van-button
            v-if="0"
              class="fsize13"
              :class="{
                ofcolor0: item.label == 0,
                ofcolor1: item.label == 1,
                ofcolor2: item.label == 2,
                ofcolor3: item.label == 3,
              }"
            >
              {{
                item.label == 0
                  ? "特等奖"
                  : item.label == 1
                  ? "一等奖"
                  : item.label == 2
                  ? "二等奖"
                  : "三等奖"
              }}
            </van-button>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { ref,getCurrentInstance} from "vue";
import { useRoute } from "vue-router";
import { get, post } from "@/utils/request";
export default {
  name: "WinUser",
  setup() {
     const { appContext } = getCurrentInstance() as any;
    const axios = appContext.config.globalProperties.$axios;
    const onClickLeft = () => history.back();
    const userList = ref([]);
    const loading = ref(false);
    const finished = ref(false);
    const refreshing = ref(false);
    const currentPage = ref(0);
    const route = useRoute()
    const onLoad = () => {
      if (refreshing.value) {
        userList.value = [];
        currentPage.value = 0;
        refreshing.value = false;
      }
      currentPage.value++;
      console.log('goodBagId：'+route.params.id)
      let req={
        // 'pageNo':currentPage.value,
        // 'pageSize':10,
        'goodBagId':route.params.id
      }
      get(axios.defaults.baseURL +'/jeecg-boot/goodBag/api/goodBagWinPrizeList',req).then(res=>{
         if (res.data.code == 200 && res.data.result) {
          let data = res.data.result;
          console.log("luckyList", data);
          let records = data;
          if (records.length > 0) {
            for (let i = 0; i < records.length; i++) {
              userList.value.push(records[i]);
            }
          }

          console.log("当前页：" + currentPage);
          loading.value = false;
          // if (state.currentPage >= data.pages) {
            finished.value = true;
          // }
        } else {
          finished.value = true;
          loading.value = false;
        }
        })
     
    };
    const onRefresh = () => {
      finished.value = false;
      loading.value = true;
      onLoad();
    };
    return {
      currentPage,
      onClickLeft,
      userList,
      onLoad,
      loading,
      finished,
      onRefresh,
      refreshing,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pull-box {
  height: calc(100vh - 100px);
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
  padding-top: 23px;
  font-size: 20px;
  color: #f92c1a;
  line-height: 20px;
}
.pop-content {
  padding-top: 26px;
  padding-bottom: 34px;
  color: #333333;
  line-height: 30px;
  margin-left: 30px;
  margin-right: 30px;
  text-align: left;
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
.ofcolor1 {
  color: #ffb200;
  border: 1px solid #ffb200;
}
.ofcolor2 {
  color: #a0acbc;
  border: 1px solid #a0acbc;
}
.ofcolor3 {
  color: #c7a88b;
  border: 1px solid #c7a88b;
}
.ofcolor0 {
  /* background:#333333; */
  color: #333333;
  /* color:white; */
  border: 1px solid #333333;
}
</style>
