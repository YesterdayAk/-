<template>
  <div class="receiveAddress" @touchmove="handleTouch">
    <div class="contentBox">
      <div class="content">
        <div class="information">
          <span class="title">请填写收货地址</span>
          <van-form class="user_form" @submit="onSubmit">
            <div class="user_name">
              <span class="label">姓名</span>
              <van-field
                v-model="userName"
                name="userName"
                placeholder="姓名"
                :rules="[{ required: true, message: '请填写姓名' }]"
              />
            </div>
            <div class="user_phone">
              <span class="label">手机号</span>
              <van-field
                v-model="userPhone"
                name="userPhone"
                placeholder="手机号"
                :rules="[
                  {
                    validator: validatorPhonenumber,
                    required: true,
                    message: '请填写正确的手机号',
                  },
                ]"
              />
            </div>
            <div class="user_site">
              <span class="label">收货地址</span>
              <van-field
                class="address"
                v-model="userAddress"
                name="userAddress"
                readonly
                placeholder="地区"
                @click="showArea = true"
                :rules="[{ required: true, message: '请选择地区' }]"
              />
              <van-popup v-model:show="showArea" position="bottom">
                <van-area
                  :area-list="areaList"
                  @confirm="onConfirm"
                  @cancel="showArea = false"
                />
              </van-popup>
              <van-field
                class="street"
                v-model="userStreet"
                name="userStreet"
                placeholder="详细街道"
                :rules="[{ required: true, message: '请填写详细街道' }]"
              />
            </div>
            <van-button class="save" block native-type="submit">保存</van-button>
          </van-form>
        </div>
      </div>
    </div>
    <div class="introduceBox">
      <div class="introduce">
        <div class="caption">
          <span class="title">说明</span>
        </div>
        <div class="container" v-for="item in introduceList" :key="item.id">
          <span class="message">{{ item.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, reactive, onMounted } from "vue";
import { areaList } from "@vant/area-data";
import { IntroduceListConfig } from "@/types/introduce";
import { Toast } from "vant";
export default defineComponent({
  name: "receiveAddress",
  setup() {
    const { appContext } = getCurrentInstance() as any;
    const axios = appContext.config.globalProperties.$axios;
    const userName = ref("");
    const userPhone = ref("");
    const userAddress = ref("");
    const showArea = ref(false);
    const userStreet = ref("");
    let introduceList = reactive<IntroduceListConfig[]>([]);
    // 手机号码校验
    const validatorPhonenumber = (val: any) => {
      return /(^[1][3,4,5,7,8,9][0-9]{9}$)/.test(val);
    };
    const onConfirm = (areaValues: any) => {
      showArea.value = false;
      userAddress.value = areaValues
        .filter((item: any) => !!item)
        .map((item: any) => item.name)
        .join("/");
    };
    const onSubmit = (values: any) => {
      console.log("submit", values);
      axios
        .post(axios.defaults.baseURL + "/jeecg-boot/api/user/updateUserAddress", {
          addressName: userName.value,
          addressPhone: userPhone.value,
          addressProvincesCity: userAddress.value,
          addressDetail: userStreet.value,
        })
        .then((res: any) => {
          if (res.data.code == 200) {
            Toast.success("保存地址成功");
          }
        });
    };
    const getAddressInfo = () => {
      axios
        .get(axios.defaults.baseURL + "/jeecg-boot/api/user/getUserByToken")
        .then((res: any) => {
          if (res.data.code == 200) {
            userName.value = res.data.result.addressName;
            userPhone.value = res.data.result.addressPhone;
            userAddress.value = res.data.result.addressProvincesCity;
            userStreet.value = res.data.result.addressDetail;
          }
        });
    };
    const getIntroduceInfo = () => {
      introduceList = [
        {
          id: 1,
          message: "1.收货地址仅用于实物奖品发奖使用。",
        },
        {
          id: 2,
          message:
            "2.中奖后，主办方将于直播活动结束后的10个工作日内进行公示发奖，请耐心等待。",
        },
        { id: 3, message: "3.直播结束之前，您可随时维护您的收货地址，保存即生效。" },
      ];
    };
    getIntroduceInfo();
    onMounted(async () => {
      await getAddressInfo();
    });
    const handleTouch = (e: any) => {
      e._isScroller = true;
    };
    return {
      userName,
      userPhone,
      userAddress,
      showArea,
      areaList,
      userStreet,
      introduceList,
      validatorPhonenumber,
      onConfirm,
      onSubmit,
      getAddressInfo,
      getIntroduceInfo,
      handleTouch,
    };
  },
});
</script>

<style lang="scss" scoped>
.receiveAddress {
  background: url("@/assets/lottery/receive_address_bg.png") no-repeat;
  background-size: 100% 100%;
  min-height: 100vh;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .contentBox {
    display: flex;
    justify-content: center;
    .content {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 39px 0 0;
      .information {
        width: 92%;
        display: flex;
        flex-direction: column;
        align-items: center;
        display: flex;
        background: rgba(106, 6, 160, 0.9);
        border: 1px solid #ddb6f4;
        border-radius: 16px;
        .title {
          font-size: 18px;
          font-family: PingFang SC-中等, PingFang SC;
          font-weight: normal;
          color: #ffffff;
          line-height: 14px;
          margin: 20px 0 24px;
        }
        .user_form {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          .user_name,
          .user_phone,
          .user_site {
            width: 90%;
            display: flex;
            flex-direction: column;
            margin: 0 0 15px;
            .label {
              font-size: 14px;
              font-family: PingFang SC-中等, PingFang SC;
              font-weight: normal;
              color: #ffffff;
              line-height: 14px;
              margin: 0 0 10px;
            }
          }
          .save {
            width: 1.63rem;
            height: 0.48rem;
            background: linear-gradient(180deg, #ff7358 0%, #ff2a00 100%);
            font-size: 16px;
            font-family: PingFang SC-中等, PingFang SC;
            font-weight: normal;
            color: #ffffff;
            line-height: 16px;
            border-color: #ff7358;
            border-radius: 30px;
            margin: 10px 0 20px;
          }
        }
      }
    }
  }
  .introduceBox {
    display: flex;
    justify-content: center;
    .introduce {
      width: 88%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .caption {
        width: 100%;
        display: flex;
        margin: 30px 0 10px;
        .title {
          font-size: 14px;
          font-family: PingFang SC-粗体, PingFang SC;
          font-weight: normal;
          color: #ffffff;
          line-height: 14px;
        }
      }
      .container {
        width: 100%;
        display: flex;
        flex-direction: column;
        .message {
          font-size: 14px;
          font-family: PingFang SC-中等, PingFang SC;
          font-weight: normal;
          color: #ffffff;
          line-height: 26px;
        }
      }
    }
  }
}
.van-field {
  border-radius: 8px;
  background: rgba(182, 131, 207, 0.9);
}
::v-deep .van-field__control {
  font-size: 15px;
  font-family: PingFang SC-中等, PingFang SC;
  font-weight: normal;
  color: #fefffe;
  line-height: 14px;
}
::v-deep .van-field__control::-webkit-input-placeholder {
  font-size: 14px;
  font-family: PingFang SC-中等, PingFang SC;
  font-weight: normal;
  color: #dfb2ff;
  line-height: 14px;
}
.address {
  border-radius: 8px 8px 0 0;
}
.street {
  border-radius: 0 0 8px 8px;
}
</style>
