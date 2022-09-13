<template>
  <div class="prizeRecordDetail">
    <div class="contentBox">
      <div class="content">
        <div class="information">
          <div class="information-top">
            <div class="activity">
              <span class="label">活动名称</span>
              <span class="message">{{ prizeInfo.activityTitle }}</span>
            </div>
            <div class="award_type">
              <span class="label">获奖类型</span>
              <span class="message">{{ prizeInfo.prizeType_dictText }}</span>
            </div>
          </div>
          <div class="information-center">
            <div class="winning_state">
              <span class="label">中奖状态</span>
              <span class="message">{{ prizeInfo.activityRecordStatus_dictText }}</span>
            </div>
            <div class="prize">
              <span class="label">奖品名称</span>
              <span class="message">{{ prizeInfo.prizeTitle }}</span>
            </div>
            <div class="winning_time">
              <span class="label">中奖时间</span>
              <span class="message">{{ prizeInfo.createTime }}</span>
            </div>
          </div>
          <div class="information-bottom">
            <div class="award_case">
              <span class="label">发奖情况</span>
              <span class="message">{{ prizeInfo.isGrant_dictText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { rest } from "lodash";
import { defineComponent, ref, getCurrentInstance, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
export default defineComponent({
  setup() {
    const route = useRoute();
    const { appContext } = getCurrentInstance() as any;
    const axios = appContext.config.globalProperties.$axios;
    let prizeInfo = reactive({
      activityTitle: ref<string>(""),
      prizeType_dictText: ref<string>(""),
      activityRecordStatus_dictText: ref<string>(""),
      prizeTitle: ref<string>(""),
      createTime: ref<string>(""),
      isGrant_dictText: ref<string>(""),
    });
    //获取中奖记录详情
    const getPrizeDetail = () => {
      axios
        .get(
          axios.defaults.baseURL +
            "/jeecg-boot/api/activity/activityRecord/getPrizeDetail",
          {
            params: {
              activityRecordId: route.params.id,
            },
          }
        )
        .then((res: any) => {
          if (res.data.code == 200) {
            prizeInfo.activityTitle = res.data.result.activityTitle;
            prizeInfo.prizeType_dictText = res.data.result.prizeType_dictText;
            prizeInfo.activityRecordStatus_dictText =
              res.data.result.activityRecordStatus_dictText;
            prizeInfo.prizeTitle = res.data.result.prizeTitle;
            prizeInfo.createTime = res.data.result.createTime;
            prizeInfo.isGrant_dictText = res.data.result.isGrant_dictText;
          }
        });
    };
    onMounted(() => {
      getPrizeDetail();
    });
    return {
      prizeInfo,
      getPrizeDetail,
    };
  },
});
</script>

<style lang="scss" scoped>
.prizeRecordDetail {
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
        .information-top {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #fff;
          .activity,
          .award_type {
            width: 90%;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #f7f7f7;
            padding: 14px 0 15px;
            .label {
              font-size: 14px;
              font-family: PingFang SC-中等, PingFang SC;
              font-weight: normal;
              color: #2c2c2c;
              line-height: 20px;
            }
            .message {
              font-size: 14px;
              font-family: PingFang SC-中等, PingFang SC;
              font-weight: normal;
              color: #999999;
              line-height: 20px;
            }
          }
        }
        .information-center {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #fff;
          margin: 8px 0 0;
          .winning_state,
          .prize,
          .winning_time {
            width: 90%;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #f7f7f7;
            padding: 14px 0 15px;
            .label {
              font-size: 14px;
              font-family: PingFang SC-中等, PingFang SC;
              font-weight: normal;
              color: #2c2c2c;
              line-height: 20px;
            }
            .message {
              font-size: 14px;
              font-family: PingFang SC-中等, PingFang SC;
              font-weight: normal;
              color: #999999;
              line-height: 20px;
            }
          }
        }
        .information-bottom {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #fff;
          margin: 8px 0 0;
        }
        .award_case {
          width: 90%;
          display: flex;
          justify-content: space-between;
          padding: 14px 0 15px;
          .label {
            font-size: 14px;
            font-family: PingFang SC-中等, PingFang SC;
            font-weight: normal;
            color: #2c2c2c;
            line-height: 20px;
          }
          .message {
            font-size: 14px;
            font-family: PingFang SC-中等, PingFang SC;
            font-weight: normal;
            color: #999999;
            line-height: 20px;
          }
        }
      }
    }
  }
}
</style>
