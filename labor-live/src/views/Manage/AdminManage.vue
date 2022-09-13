<template>
  <div>
    <van-nav-bar
      class="title"
      title="管理员"
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
        <van-cell v-for="item in userList" :key="item.id">
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
                  <van-image
                   v-if="0"
                    round
                    width="13px"
                    height="14px"
                    :src="require('@/assets/manage/women.png')"
                  />
                  <van-image
                    v-if="1"
                    round
                    width="13px"
                    height="14px"
                    :src="require('@/assets/manage/man.png')"
                  />
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
              v-if="isAdmin == '2'"
              class="fsize13"
              :class="{
                color: item.isAdmin == 0,
                plain: item.isAdmin == 1 || item.isAdmin == 2,
              }"
              :loading="activeId == item.userId && item.isAdmin == 0"
              @click="showPopup(item)"
            >
              {{
                item.isAdmin == 0
                  ? "设为管理员"
                  : item.isAdmin == 1
                  ? "解除管理员"
                  : "转让管理员"
              }}
            </van-button>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>

    <van-popup v-model:show="show" closeable round :style="{ width: '90vw' }">
      <div style="padding-bottom: 23px; text-align: center">
        <div class="pop-title">提示</div>
        <div class="pop-content">{{ currentPeople.name }}</div>
        <div v-if="currentPeople.label == 2" style="margin-bottom: 24px">
          <div class="menu-box" @click="showMenu()" style="height: 34px">
            <!-- <span v-if="!menuVisible"></span> -->
            <span>{{ toPeople.name }}</span>
          </div>
          <div
            class="menu-box"
            style="padding: 0; max-height: 20vh; overflow-y: scroll"
            v-if="menuVisible"
          >
            <van-cell v-for="item in userList" :key="item.id" @click="pickMenu(item)">
              <span
                v-if="item.isAdmin == 1 && item.userId != activeId"
                :class="{ activemenu: toPeople.id == item.userId }"
                >{{ item.fullName }}</span
              >
            </van-cell>
          </div>
        </div>
        <div style="margin-top: 20px">
          <van-button
            v-if="currentPeople.label == 1"
            round
            class="plain"
            style="width: 134px; line-height: 13px; height: 48px"
            @click="hidePopup"
            >取消</van-button
          >
          <van-button
            v-if="currentPeople.label == 1"
            :loading="buttonLoading"
            round
            class="color"
            style="width: 134px; margin-left: 15px; line-height: 13px; height: 48px"
            @click="updateRole()"
            >确认解除</van-button
          >
          <van-button
            v-if="currentPeople.label == 2"
            :loading="buttonLoading"
            round
            class="color"
            style="width: 160px; line-height: 13px; height: 48px"
            @click="updateRole()"
            >确认转让</van-button
          >
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { ref, reactive, toRefs, getCurrentInstance } from "vue";
import { Toast } from "vant";
import { get, post } from "@/utils/request";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
import superManageSign from "@/assets/super_manage_sign.png";
import generalManageSign from "@/assets/general_manage_sign.png";
export default {
  name: "AdminManage",
  setup() {
    const { appContext } = getCurrentInstance() as any;
    const axios = appContext.config.globalProperties.$axios;
    const store = userStore();
    const { liveId, isAdmin } = storeToRefs(store);
    const state = reactive({
      superManageSign,
      generalManageSign,
      userList: <any[]>[], //用户列表
      show: false,
      menuVisible: false,
      // buttonLoading: false,
      // activeId:  ref(""),
      value: ref(null),
      currentPage: ref(0),
      sizePage: ref(10),
      totalPage: ref(0),
      liveId: ref(""),
      isAdmin: ref<string>(""),
      userId: ref(""),
    });
    // state.liveId = "e5f303d9-97ec-6bc0-2fd8-8107ad15fa85";

    state.liveId = liveId.value;
    state.isAdmin = isAdmin.value;
    // const show = ref(false);
    // const menuVisible = ref(false);
    const showMenu = () => {
      state.menuVisible = true;
    };
    const toPeople = {
      id: "",
      name: "选择要授予的管理员",
      phone: "",
      label: null,
    };
    const pickMenu = (item: any) => {
      toPeople.id = item.userId;
      toPeople.name = item.fullName;
      toPeople.label = item.label;
      console.log(toPeople);
      state.menuVisible = false;
    };
    const currentPeople = { id: "", name: "张先生", phone: "133", label: 0 };
    const hidePopup = () => {
      state.show = false;
    };
    const showPopup = (item: any) => {
      state.menuVisible = false;
      toPeople.id = "";
      toPeople.name = "选择要授予的管理员";
      state.liveId = item.liveId;
      activeId.value = item.userId;
      console.log("activeId:" + "--" + activeId.value);
      // console.log("topeopleId:" + "---");
      console.log(toPeople);
      if (item.isAdmin == 0) {
        resetAdminRole(item.userId, "8");
        return;
      } else {
        currentPeople.label = item.isAdmin;
        if (currentPeople.label == 1) {
          currentPeople.name =
            "即将解除“" + item.fullName + "”的管理员身份，请谨慎操作！";
        } else if (currentPeople.label == 2) {
          currentPeople.name = "转让行为不可撤销，请谨慎操作！";
        }
        state.show = true;
      }
    };
    const onClickLeft = () => history.back();
    // const value = ref("");
    // const onSearch = (val:String) => Toast(val);
    const onCancel = () => Toast("取消");

    const loading = ref(false);
    const finished = ref(false);
    const refreshing = ref(false);
    const buttonLoading = ref(false);
    const activeId = ref("");
    // const currentPage = ref(0);
    // 1-禁言；2-解除管理员；3-解除管理员并禁言；4-转让管理员；5-解除禁言；6-全员禁言;7-取消全员禁言
    const convertAdminRole = (fromId: String, toId: String) => {
      console.log(fromId + "-->" + toId);
      // resetAdminRole(fromId, "4");
      if (toId) {
        resetAdminRole(toId, "4");
      } else {
        resetAdminRole(fromId, "4");
      }
    };
    const resetAdminRole = (userId: String, status: String) => {
      console.log(userId + "---" + status);
      let data = {
        liveId: state.liveId,
        sendType: status,
        userId: userId,
      };
      post(axios.defaults.baseURL + "/jeecg-boot/api/liveAdmin/edit", data).then(
        (res: any) => {
          if (res.data.code == 200) {
            Toast(res.data.message);
            activeId.value = "";
            buttonLoading.value = false;
            hidePopup();
            refreshing.value = true;
            state.isAdmin = isAdmin.value;
            onRefresh();
          } else if (res.data.code == 500) {
            buttonLoading.value = false;
            hidePopup();
            Toast(res.data.message);
          }
        }
      );
    };
    const updateRole = () => {
      buttonLoading.value = true;
      if (currentPeople.label == 1) {
        // '即将解除的管理员身份，请谨慎操作！';
        resetAdminRole(activeId.value, "2");
      } else if (currentPeople.label == 2) {
        // '转让行为不可撤销，请谨慎操作！';
        toPeople.label = null;
        convertAdminRole(activeId.value, toPeople.id);
      }
    };

    const onSearch = (val: String) => {
      // Toast(val);
      state.userList = [];
      let req = {
        pageNo: 1,
        pageSize: 10,
        liveId: state.liveId,
        // laborName: val,
        // phone: val,
        fullName: val,
      };
      loadData(req);
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
            //       id: "223",
            //       isAdmin: "0",
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
            //       id: "1223",
            //       isAdmin: "1",
            //       isForbiddenWords: "0",
            //       laborName: "青岛工会",
            //       liveId: "1523497318079721473",
            //       phone: "136666",
            //       updateBy: "",
            //       updateTime: "2022-09-09",
            //       userIcon: "https://qlgh.sdgh.org.cn/oss/download/path/mongofs/M00/26/30/CsgjO2EeYmaAfkDKAAOkq_-lWJM860_120x120.jpg",
            //       userId: "67856666533",
            //     },
            //   ],
            //   size: 0,
            //   total: 0,
            // };

            console.log("userList", data);
            let records = data.records;
            if (records.length > 0) {
              for (let i = 0; i < records.length; i++) {
                state.userList.push(records[i]);
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
        }
      );
    }
    const onLoad = () => {
      if (refreshing.value) {
        state.userList = [];
        state.currentPage = 0;
        refreshing.value = false;
      }

      state.currentPage++;
      let req = {
        pageNo: state.currentPage,
        pageSize: 10,
        liveId: state.liveId,
      };
      loadData(req);
    };
    const onRefresh = () => {
      finished.value = false;
      loading.value = true;
      onLoad();
    };

    const getUserId = () => {
      get(axios.defaults.baseURL + "/jeecg-boot/api/user/getUserByToken").then(
        (res: any) => {
          if (res.data.code == 200 && res.data.result) {
            let data = res.data.result;
            console.log("userInfo", data);
            state.userId = data.id;
          }
        }
      );
    };
    getUserId();
    return {
      ...toRefs(state),
      onClickLeft,
      onSearch,
      onCancel,
      onLoad,
      loading,
      finished,
      onRefresh,
      refreshing,
      showPopup,
      currentPeople,
      pickMenu,
      showMenu,
      toPeople,
      hidePopup,
      updateRole,
      loadData,
      activeId,
      buttonLoading,
      getUserId,
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
::v-deep .van-button {
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
  padding-bottom: 14px;
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
  margin-left: 30px;
  margin-right: 30px;
  text-align: left;
  font-size: 14px;
  padding: 10px;
}
.activemenu {
  color: #f92c1a;
}
</style>
