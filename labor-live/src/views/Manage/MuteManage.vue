<template>
  <div>
    <van-nav-bar
      class="title"
      title="禁言管理"
      left-text=""
      left-arrow
      @click-left="onClickLeft"
    >
    </van-nav-bar>
    <form action="/">
      <van-search
        v-model="value"
        shape="round"
        :show-action="value != ''"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
      />
    </form>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        class="pull-box"
      >
        <div style="height: 8px; background: #f5f5f5"></div>

        <van-cell v-for="item in userList" :key="item.key">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <div style="display: flex">
              <div style="position: relative">
                <van-image round width="48px" height="48px" :src="item.userIcon" />
                <img
                  style="
                    width: 13px;
                    height: 14px;
                    position: absolute;
                    bottom: 7px;
                    right: 0;
                  "
                  :src="
                    item.isAdmin == 1
                      ? generalManageSign
                      : item.isAdmin == 2
                      ? superManageSign
                      : ''
                  "
                  alt=""
                />
                <!-- <div class="label-man" >
                  <van-image v-if="item.sex==2" round width="13px" height="14px" :src="require('@/assets/manage/women.png')" />
                  <van-image v-if="item.sex==1" round width="13px" height="14px" :src="require('@/assets/manage/man.png')" />
              
              </div> -->
              </div>

              <div style="margin-left: 12px">
                <div class="fsize14" style="padding-top: 5px">
                  {{ item.fullName }} - {{ item.phone }}
                </div>
                <div class="fsize12" style="margin-top: 12px">
                  {{ item.laborName }}
                </div>
              </div>
            </div>

            <van-button
              v-if="item.isAdmin != 2"
              class="fsize13"
              :class="{
                plain: item.isForbiddenWords == 1,
                color: item.isForbiddenWords == 0,
              }"
              @click="showPopup(item)"
            >
              {{
                item.isAdmin == 1 && item.isForbiddenWords == 0
                  ? "解除管理并禁言"
                  : item.isForbiddenWords == 1
                  ? "解除禁言"
                  : "禁言"
              }}
            </van-button>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>

    <van-popup v-model:show="show" closeable round :style="{ width: '90vw' }">
      <div style="padding-bottom: 23px; text-align: center">
        <div class="pop-title">提示</div>
        <div class="pop-content">{{ currentPeople.label }}</div>
        <!-- <div >
  <van-cell class="menu-box" title="选择要授予的管理员" is-link arrow-direction="down"  />
        </div> -->
        <div>
          <van-button round class="plain" style="width: 134px" @click="hidePopup"
            >取消</van-button
          >
          <van-button
            :loading="buttonLoading"
            :disabled="buttonLoading"
            round
            class="color"
            style="width: 134px; margin-left: 15px"
            @click="updateRole()"
            >确定</van-button
          >
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { ref, reactive, toRefs, onMounted, nextTick, getCurrentInstance } from "vue";
import { Toast } from "vant";
import socket from "@/utils/socket";
import { Base64 } from "js-base64";
import { get, post } from "@/utils/request";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
import superManageSign from "@/assets/super_manage_sign.png";
import generalManageSign from "@/assets/general_manage_sign.png";
export default {
  name: "MuteManage",
  setup() {
    const { appContext } = getCurrentInstance() as any;
    const axios = appContext.config.globalProperties.$axios;
    const store = userStore();
    const { liveId } = storeToRefs(store);
    const state = reactive({
      superManageSign,
      generalManageSign,
      userList: <any[]>[], //评论列表
      liveId: ref(""),
    });
    // state.liveId = "e5f303d9-97ec-6bc0-2fd8-8107ad15fa85";
    state.liveId = liveId.value;
    // const value1 = ref(0);
    const currentPeople = {
      name: "张先生",
      label: "张先生",
      phone: "133",
      userId: "2222",
      action: 1,
    };
    const show = ref(false);
    const value = ref("");
    const hidePopup = () => {
      show.value = false;
    };
    const showPopup = (item: any) => {
      show.value = true;
      // currentPeople.action=item.label;
      currentPeople.userId = item.userId;
      currentPeople.name = item.fullName;

      if (item.isForbiddenWords == 0 && item.isAdmin == 1) {
        currentPeople.action = 1;
        currentPeople.label = "确定解除“" + item.fullName + "”的管理员身份，并禁言吗？";
      } else if (item.isForbiddenWords == 1) {
        currentPeople.action = 2;
        currentPeople.label = "确定解除对“" + item.fullName + "”的禁言吗？";
      } else if (item.isForbiddenWords == 0) {
        currentPeople.action = 3;
        currentPeople.label = "确定对“" + item.fullName + "”禁言吗？";
      }
    };
    const onClickLeft = () => history.back();
    const updateRole = () => {
      buttonLoading.value = true;
      if (currentPeople.action == 1) {
        //'确定解除“'+item.name+'”的管理员身份，并禁言吗？';
        // 接口
        resetMuteAdminRole(currentPeople.userId, "3");
        // websocket------
        //  enableMute(currentPeople.userId, "3");
      } else if (currentPeople.action == 2) {
        //'确定解除对“'+item.name+'”的禁言吗？';
        resetMuteAdminRole(currentPeople.userId, "5");
        // enableMute(currentPeople.userId, "5");
      } else if (currentPeople.action == 3) {
        //'确定对“'+item.name+'”禁言吗？';
        resetMuteAdminRole(currentPeople.userId, "1");
        // enableMute(currentPeople.userId, "1");
      }
    };
    const resetMuteAdminRole = (userId: String, status: String) => {
      console.log(userId + "--" + currentPeople.name);
      let data = {
        liveId: state.liveId,
        sendType: status,
        userId: userId,
      };
      post(axios.defaults.baseURL + "/jeecg-boot/api/liveAdmin/edit", data).then(
        (res: any) => {
          if (res.data.code == 200) {
            buttonLoading.value = false;
            hidePopup();
            refreshing.value = true;
            onRefresh();
          } else if (res.data.code == 500) {
            buttonLoading.value = false;
            // hidePopup();
            Toast(res.data.message);
          }
        }
      );
    };
    const onSearch = (val: String) => {
      let req = {
        pageNo: 1,
        pageSize: 10,
        liveId: state.liveId,
        // laborName: val,
        // phone: val,
        fullName: val,
      };
      state.userList = [];
      loadData(req);
    };
    const onCancel = () => Toast("取消");

    const loading = ref(false);
    const buttonLoading = ref(false);
    const finished = ref(false);
    const refreshing = ref(false);
    const currentPage = ref(0);
    const onLoad = () => {
      if (refreshing.value) {
        state.userList = [];
        currentPage.value = 0;
        refreshing.value = false;
      }
      currentPage.value++;
      let req = {
        pageNo: currentPage.value,
        pageSize: 10,
        liveId: state.liveId,
      };
      loadData(req);
      // enableMute('hello')
    };
    function loadData(req: any) {
      get(axios.defaults.baseURL + "/jeecg-boot/api/liveAdmin/list", req).then(
        (res: any) => {
          if (res.data.code == 200 && res.data.result) {
            let data = res.data.result;

            // data = {
            //   current: 1,
            //   pages: 1,
            //   records: [
            //     {
            //       createBy: "",
            //       createTime: "",
            //       delFlag: 0,
            //       fullName: "测试",
            //       id: "1223",
            //       isAdmin: "1",
            //       isForbiddenWords: "0",
            //       laborName: "青岛工会",
            //       liveId: "1523497318079721473",
            //       phone: "136666",
            //       updateBy: "",
            //       updateTime: "2022-09-09",
            //       userIcon: "https://qlgh.sdgh.org.cn/oss/download/path/mongofs/M00/26/30/CsgjO2EeYmaAfkDKAAOkq_-lWJM860_120x120.jpg",
            //       userId: "56666533",
            //     },
            //     {
            //       createBy: "",
            //       createTime: "",
            //       delFlag: 0,
            //       fullName: "开发",
            //       id: "1228",
            //       isAdmin: "0",
            //       isForbiddenWords: "1",
            //       laborName: "青岛工会",
            //       liveId: "1523497318079721473",
            //       phone: "136666",
            //       updateBy: "",
            //       updateTime: "2022-09-09",
            //       userIcon: "https://qlgh.sdgh.org.cn/oss/download/path/mongofs/M00/26/30/CsgjO2EeYmaAfkDKAAOkq_-lWJM860_120x120.jpg",
            //       userId: "67856666533",
            //     },
            //     {
            //       createBy: "",
            //       createTime: "",
            //       delFlag: 0,
            //       fullName: "正式",
            //       id: "1225399",
            //       isAdmin: "0",
            //       isForbiddenWords: "0",
            //       laborName: "青岛工会",
            //       liveId: "1523497318079721473",
            //       phone: "136666",
            //       updateBy: "",
            //       updateTime: "2022-09-09",
            //       userIcon: "https://qlgh.sdgh.org.cn/oss/download/path/mongofs/M00/26/30/CsgjO2EeYmaAfkDKAAOkq_-lWJM860_120x120.jpg",
            //       userId: "967856666533",
            //     },
            //   ],
            //   size: 0,
            //   total: 0,
            // };

            console.log("luckyList", data);
            let records = data.records;
            if (records.length > 0) {
              for (let i = 0; i < records.length; i++) {
                state.userList.push(records[i]);
              }
            }

            console.log("当前页：" + currentPage.value);
            loading.value = false;
            if (currentPage.value >= data.pages) {
              finished.value = true;
            }
          } else {
            finished.value = true;
            loading.value = false;
          }
        }
      );
    }
    const onRefresh = () => {
      finished.value = false;
      loading.value = true;

      onLoad();
    };

    // resetMuteAdminRole('8888', {mute:1});
    onMounted(async () => {
      // await initDom();
      console.log("onmounted");
      //  socket.init(receiveMessage);
      //
    });
    // 消息接收
    async function receiveMessage(message: any) {
      // const param = JSON.parse(Base64.decode(message.data));
      const param = JSON.parse(message.data);
      // 处理 赋值问题
      const params = JSON.parse(JSON.stringify(param));

      console.log("socket receiver:<<< " + JSON.stringify(params));

      interface Opt {
        id: number;
        avatar: string;
        handlerName: string;
        liveId: string;
        message: string;
        messageType: string;
        pushType: string;
        realname: string;
      }

      const opt: Opt = {
        id: Date.now(),
        avatar: params.avatar,
        handlerName: param.handlerName,
        liveId: param.liveId,
        message: param.message,
        messageType: param.messageType,
        pushType: param.pushType,
        realname: param.realname,
      };
      if (params.pushType == 2) {
        await addTimeOut(opt);
      }
    }
    function addTimeOut(opt: any) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          addUser(opt);
          resolve("success");
        }, 500);
      });
    }
    function addUser(data: any) {
      console.log("socket receiver:<<<" + JSON.stringify(data));
      state.userList.push(data);
      nextTick(() => {
        finished.value = true;
        loading.value = false;
        // renderComment();
      });
    }

    //禁言管理
    async function enableMute(uid: string, type: string) {
      interface Opt {
        liveId: string;
        userId: string;
        sendType: string;
        pushType: string;
      }
      const opt: Opt = {
        liveId: state.liveId,
        userId: uid,
        sendType: type,
        pushType: "2",
      };

      socket.send(opt);
      setTimeout(() => {
        buttonLoading.value = false;
        hidePopup();
        refreshing.value = true;
        onRefresh();
      }, 500);
    }
    return {
      ...toRefs(state),
      receiveMessage,
      addTimeOut,
      addUser,
      enableMute,
      loadData,
      currentPage,
      onClickLeft,
      value,
      onSearch,
      onCancel,
      currentPeople,
      onLoad,
      loading,
      buttonLoading,
      finished,
      onRefresh,
      refreshing,
      show,
      showPopup,
      hidePopup,
      updateRole,
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
</style>
