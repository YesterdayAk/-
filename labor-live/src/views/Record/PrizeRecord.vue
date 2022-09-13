<template>
  <div class="prizeRecord">
    <div class="contentBox">
      <div class="content">
        <div
          class="information"
          :style="{ height: equipmentHeight }"
          @touchmove="handleTouch"
        >
          <div
            class="container"
            v-for="item in prizeRecord"
            :key="item.activityRecordId"
            @click="getPrizeDetail(item.activityRecordId)"
          >
            <div class="container-left">
              <div class="caption">
                <span class="title">{{ item.activityTitle }}</span>
              </div>
              <div class="info">
                <div class="award">
                  <span class="message">{{ item.prizeType }}</span>
                </div>
                <span class="time">{{ item.createTime }}</span>
              </div>
            </div>
            <div class="container-right">
              <img src="@/assets/record/arrow-right.png" alt="" />
            </div>
          </div>
          <van-empty v-if="!prizeRecord.length" description="暂无数据" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { PrizeListConfig } from "@/types/introduce";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
export default defineComponent({
  name: "prizeRecord",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { appContext } = getCurrentInstance() as any;
    const axios = appContext.config.globalProperties.$axios;
    const store = userStore();
    const { liveId } = storeToRefs(store);
    const prizeRecord = ref<PrizeListConfig[]>([]);
    const equipmentHeight = ref<string>(""); //设备高度
    //获取转盘中奖记录
    const getTurnplateRecord = () => {
      axios
        .get(axios.defaults.baseURL + "/jeecg-boot/api/activity/activityRecord/list", {
          params: {
            liveId: liveId.value,
          },
        })
        .then((res: any) => {
          if (res.data.code == 200) {
            prizeRecord.value = res.data.result;
          }
        });
    };
    function getPrizeDetail(activityRecordId: number) {
      router.push("/prizeRecordDetail/" + activityRecordId);
    }

    const elementHeight = () => {
      equipmentHeight.value = window.innerHeight + "px";
    };
    function handleTouch(e: any) {
      e._isScroller = true;
    }
    onMounted(async () => {
      await getTurnplateRecord();
      await elementHeight();
    });
    return {
      prizeRecord,
      equipmentHeight,
      getTurnplateRecord,
      getPrizeDetail,
      elementHeight,
      handleTouch,
    };
  },
});
</script>

<style lang="scss" scoped>
.prizeRecord {
  min-height: 100vh;
  background: #f6f6f6;
  .contentBox {
    display: flex;
    justify-content: center;
    .content {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 8px 0 0;
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
          align-items: center;
          background: #fff;
          border-bottom: 1px solid #f7f7f7;
          padding: 7px 0;
          .container-left {
            display: flex;
            flex-direction: column;
            margin: 0 0 0 20px;
            .caption {
              display: flex;
              .title {
                width: 3.13rem;
                font-size: 14px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                color: #323332;
                line-height: 20px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
            .info {
              display: flex;
              align-items: center;
              .award {
                width: 0.45rem;
                height: 0.18rem;
                background: linear-gradient(270deg, #ff5736 0%, #ff2a00 100%);
                border-radius: 37px;
                display: flex;
                justify-content: center;
                align-items: center;
                .message {
                  font-size: 12px;
                  font-family: PingFang SC-中等, PingFang SC;
                  font-weight: normal;
                  color: #ffffff;
                  line-height: 12px;
                }
              }
              .time {
                font-size: 14px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                color: #999999;
                line-height: 14px;
                margin: 0 0 0 8px;
              }
            }
          }
          .container-right {
            display: flex;
            margin: 0 20px 0 0;
            img {
              width: 8px;
              height: 14px;
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
</style>
