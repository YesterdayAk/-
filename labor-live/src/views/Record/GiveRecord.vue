<template>
  <div class="giveRecord">
    <div class="contentBox">
      <div class="content">
        <div
          class="information"
          :style="{ height: equipmentHeight }"
          @touchmove="handleTouch"
        >
          <div class="container" v-for="item in giveRecord" :key="item.id">
            <div class="container-left">
              <div class="info">
                <span class="give">赠送</span>
                <span class="message">{{ item.giftName }}</span>
                <span class="to">-</span>
                <span class="title">{{ item.liveName }}</span>
              </div>
              <div class="date">
                <span class="time">{{ item.createTime }}</span>
              </div>
            </div>
            <div class="container-right" v-if="item.amount">
              <span class="number">-{{ item.amount }}金币</span>
              <!-- <span class="operator">-</span> -->
            </div>
          </div>
          <van-empty v-if="!giveRecord.length" description="暂无数据" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, ref } from "vue";
import { GiveListConfig } from "@/types/present";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
export default defineComponent({
  name: "giveRecord",
  setup() {
    const { appContext } = getCurrentInstance() as any;
    const axios = appContext.config.globalProperties.$axios;
    const store = userStore();
    const { liveId } = storeToRefs(store);
    const giveRecord = ref<GiveListConfig[]>([]);
    const equipmentHeight = ref<string>(""); //设备高度
    const getGiveRecord = () => {
      axios
        .get(axios.defaults.baseURL + "/jeecg-boot/user/api/getMygivingGiftList", {
          params: {
            liveId: liveId.value,
          },
        })
        .then((res: any) => {
          if (res.data.code == 200) {
            interface Opt {
              id: number;
              giftName: string;
              liveName: string;
              amount: number;
              createTime: string;
            }
            res.data.result.forEach((item: any) => {
              const opt: Opt = {
                id: Date.now(),
                giftName: item.giftName,
                liveName: item.liveName,
                amount: item.amount,
                createTime: item.createTime,
              };
              giveRecord.value.push(opt);
            });
          }
        });
    };

    const elementHeight = () => {
      equipmentHeight.value = window.innerHeight + "px";
    };
    function handleTouch(e: any) {
      e._isScroller = true;
    }
    onMounted(async () => {
      await getGiveRecord();
      await elementHeight();
    });
    return {
      giveRecord,
      equipmentHeight,
      getGiveRecord,
      elementHeight,
      handleTouch,
    };
  },
});
</script>

<style lang="scss" scoped>
.giveRecord {
  min-height: 100vh;
  background: #f6f6f6;
  .contentBox {
    display: flex;
    justify-content: center;
    .content {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 5px 0 0;
      .information {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .container {
          width: 100%;
          display: flex;
          justify-content: space-between;
          background: #fff;
          border-bottom: 1px solid #f6f7f6;
          padding: 10px 0;
          .container-left {
            display: flex;
            flex-direction: column;
            margin: 0 0 0 16px;
            .info {
              display: flex;
              .give,
              .to {
                font-size: 15px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                color: #333333;
                line-height: 14px;
              }
              .message {
                font-size: 15px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                color: #ff2a00;
                line-height: 14px;
              }
              .title {
                width: 1.82rem;
                font-size: 15px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                color: #333333;
                line-height: 14px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
            .date {
              display: flex;
              margin: 7px 0 0;
              .time {
                font-size: 12px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                color: #999999;
                line-height: 14px;
              }
            }
          }
          .container-right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin: 0 16px 0 0;
            .number {
              font-size: 14px;
              font-family: PingFang SC-中等, PingFang SC;
              font-weight: normal;
              color: #ff2a00;
              line-height: 14px;
            }
            .operator {
              font-size: 12px;
              font-family: PingFang SC-中等, PingFang SC;
              font-weight: normal;
              color: #999999;
              line-height: 12px;
              margin: 8px 0 0;
            }
          }
        }
      }
      .information::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
::v-deep .van-nav-bar__content {
  height: 0.53rem;
}
::v-deep .van-nav-bar__title {
  font-size: 17px;
  font-family: PingFang SC-中等, PingFang SC;
  font-weight: normal;
  color: #000000;
  line-height: 17px;
}
</style>
