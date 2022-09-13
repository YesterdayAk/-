<template>
  <div class="home">
    <div class="headerBox">
      <div class="header">
        <div class="header-top">
          <div class="rank" @click="toHome">
            <img src="@/assets/video/video.png" alt="" />
            <span class="message">视频直播</span>
          </div>
        </div>
        <!-- <div class="header-bottom">
          <div class="photo">
            <img src="@/assets/video/video.png" alt="" />
            <span class="message">直播回看</span>
          </div>
        </div> -->
      </div>
    </div>
    <div class="contentBox">
      <div class="content">
        <div class="content-center">
          <div class="introduce" ref="introduce">
            <div class="introduce-top">
              <div class="stream">
                <div class="stream-status">
                  <img src="@/assets/circle.png" alt="" />
                  <span class="message">直播中</span>
                </div>
                <div class="stream-theme">
                  <span class="title">{{ liveTitle }}</span>
                </div>
              </div>
            </div>
            <div class="introduce-bottom">
              <!-- <div class="introduce-bottom-left">
                <div class="brief">
                  <span class="message">直播简介</span>
                </div>
                <img src="@/assets/arrow-gray-right.png" alt="" />
              </div> -->
              <div class="introduce-bottom-right">
                <div class="browse">
                  <img src="@/assets/browse.png" alt="" />
                  <span class="number">{{ liveBrowse }}</span>
                </div>
                <!-- <div class="like">
                  <img src="@/assets/like.png" alt="" />
                  <span class="number">200</span>
                </div> -->
              </div>
            </div>
          </div>
          <div class="review">
            <BarrageImg
              ref="barrage"
              @inputBlur="inputBlur"
              @showImg="showImg"
              :isExpression="isExpression"
              :commentMessage="message"
              :movieHeight="movieHeight"
              :introduceHeight="introduceHeight"
              :sendHeight="sendHeight"
            ></BarrageImg>
          </div>
        </div>
        <div class="content-bottom" ref="contentBottom">
          <div class="send" ref="send">
            <div class="send-left">
              <input
                ref="refInput"
                class="text"
                type="text"
                name=""
                id=""
                :placeholder="isForbidden ? '非管理员不能发布消息！' : '这里是输入的内容'"
                v-model="message"
                @keyup.enter="sendMessage"
                @focus="onFocus"
                :disabled="isForbidden"
              />
              <!-- <img @click="toggleExpression" src="@/assets/expression.png" alt="" /> -->
            </div>
            <div class="send-center" v-if="message">
              <van-button class="add" @click="sendMessage">发送</van-button>
            </div>
            <div class="send-right" v-else>
              <!-- <div class="gift" @click="getGiftInfo">
                <img src="@/assets/gift.png" alt="" />
              </div> -->
              <!-- <div class="more" @click="getMoreInfo">
                <img src="@/assets/more.png" alt="" />
              </div> -->
              <van-uploader
                class="van-uploader"
                :after-read="afterRead"
                :before-read="beforeRead"
                accept="image/png,image/jpg,image/jpeg"
                :max-count="1"
                :disabled="isForbidden"
              >
                <img src="@/assets/more/photo.png" alt="" style="width: 36px" />
                <span class="message"></span
              ></van-uploader>
            </div>
          </div>
          <div class="expression" v-show="isExpression" @touchmove="handleTouch">
            <Picker
              :data="emojiIndex"
              set="apple"
              :showSearch="false"
              :showPreview="false"
              :showCategories="false"
              @select="addEmoji"
            />
          </div>
        </div>
        <Present
          :movieHeight="movieHeight"
          :showPresent="showPresent"
          @getPresentList="getPresentList"
          @closeGift="closeGift"
        ></Present>

        <van-action-sheet v-model:show="showMore" :round="false">
          <div class="restBox">
            <div class="rest">
              <div class="rest-top">
                <div class="account">
                  <span class="title">剩余：</span>
                  <span class="number">{{ goldCoin }}金币</span>
                </div>
                <span class="close" @click="onClose">关闭</span>
              </div>
              <div class="rest-center">
                <div class="chat">
                  <div class="chat-top">
                    <span class="title">聊天室功能</span>
                  </div>
                  <div class="chat-bottom">
                    <van-uploader
                      class="van-uploader"
                      :after-read="afterRead"
                      :before-read="beforeRead"
                      accept="image/png,image/jpg,image/jpeg"
                      :max-count="1"
                    >
                      <img src="@/assets/more/photo.png" alt="" />
                      <span class="message">发图片</span></van-uploader
                    >
                  </div>
                </div>
                <div class="streaming" v-if="0">
                  <div class="streaming-top">
                    <span class="title">直播间功能</span>
                  </div>
                  <div class="streaming-bottom">
                    <!-- <div class="gold_convert">
                      <img src="@/assets/more/gold_convert.png" alt="" />
                      <span class="message">金币兑换</span>
                    </div> -->
                    <div class="winning_record" @click="getPrizeRecord">
                      <img src="@/assets/more/winning_record.png" alt="" />
                      <span class="message">中奖记录</span>
                    </div>
                    <div class="give_record" @click="getGiveRecord">
                      <img src="@/assets/more/give_record.png" alt="" />
                      <span class="message">赠送记录</span>
                    </div>
                    <div class="share" @click="toShare">
                      <img src="@/assets/more/share.png" alt="" />
                      <span class="message">去分享</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-action-sheet>
      </div>
    </div>
    <van-popup v-model:show="show" closeable round :style="{ width: '95%' }">
      <div>
        <van-image fit="cover" v-if="mediaType == 1" :src="mediaUrl" />
        <video controls autoplay v-if="mediaType == 2" :src="mediaUrl" />
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  nextTick,
  reactive,
  onMounted,
  onUnmounted,
  ref,
  toRefs,
  watch,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { Toast } from "vant";
import BarrageImg from "@/components/BarrageImg.vue";
import Present from "@/components/Present.vue";
import data from "emoji-mart-vue-fast/data/apple.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
import { get, post } from "@/utils/request";
let emojisToShowFilter = function (emoji: any) {
  // check the emoji properties, see the examples of emoji object below
  return true; // return true to include or false to exclude
};
let exclude = [
  "search",
  "recent",
  "people",
  "nature",
  "foods",
  "activity",
  "objects",
  "symbols",
  "flags",
  "custom",
];
let emojiIndex = new EmojiIndex(data, {
  emojisToShowFilter,
  exclude,
});
import profile from "@/assets/profile.png";
import lolly from "@/assets/lolly.png";
import { PresentShowConfig } from "@/types/present";
import { uploadAction } from "@/utils/request";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";

import socket from "@/utils/socket";
export default defineComponent({
  name: "home",
  components: {
    BarrageImg,
    Picker,
    Present,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { appContext } = getCurrentInstance() as any;
    const axios = appContext.config.globalProperties.$axios;
    let state = reactive({
      emojiIndex,
      isExpression: false,
      message: "", //输入框的值
      isForbidden: true, //是否禁用输入框
      chatType: ref<string>(""),
      movieHeight: 0, //视频高度
      introduceHeight: 0, //介绍高度
      sendHeight: 0, //发送高度
      givePresentList: ref<PresentShowConfig[]>([]), //赠送礼物列表
      showAccess: false, //默认不显示滑入
      showPresent: false, //默认不显示礼物窗口
      showMore: false, //默认不显示更多功能
      mediaUrl: "",
      mediaType: 0,
      liveTitle: "", //直播主题
      liveBrowse: "", //直播浏览量
      screenSizeType: "", //屏幕尺寸类型

      // liveId:"1530060216528699393",
      // liveInfo:{}
    });
    let movie = ref<null | HTMLElement>(null);
    let introduce = ref<null | HTMLElement>(null);
    let send = ref<null | HTMLElement>(null);
    let contentBottom = ref<null | HTMLElement>(null);
    const barrage = ref<InstanceType<typeof Barrage>>();
    let refInput = ref<null | HTMLElement>(null);
    document.body.addEventListener(
      "touchmove",
      (e: any) => {
        if (e._isScroller) return;
        e.preventDefault();
      },
      {
        passive: false,
      }
    );
    const elementHeight = () => {
      if (movie.value) {
        state.movieHeight = movie.value.offsetHeight;
      }
      if (introduce.value) {
        state.introduceHeight = introduce.value.offsetHeight;
      }
      if (send.value) {
        state.sendHeight = send.value.offsetHeight;
      }
    };
    function getPresentList() {
      state.givePresentList = [
        {
          id: 1,
          name: "张三",
          message: "棒棒糖",
          count: 1,
          img: profile,
          photo: lolly,
        },
      ];
      state.showAccess = true;
    }
    watch(
      () => state.givePresentList,
      (value) => {
        if (value.length) {
          setTimeout(() => {
            state.showAccess = false;
          }, 2000);
        }
      }
    );
    // getPresentList();
    const getAdminState = () => {
      get(axios.defaults.baseURL + "/jeecg-boot/api/liveAdmin/list", {
        liveId: liveId.value,
      }).then((res: any) => {
        if (res.data.code == 200 && res.data.result) {
          let data = res.data.result;
          let records = data.records;
          if (records.length > 0) {
            for (let i = 0; i < records.length; i++) {
              if (records[i].userId == userId.value && records[i].isAdmin != 0) {
                console.log(records[i].userId);
                state.isForbidden = false;
              }
            }
          }
        }
      });
    };
    //  getUserId();

    const socketUrl = ref(
      "wss://websocket.qdszgh.cn:8443/jeecg-boot/testLiveImageTextWebsocket/"
    );
    const store = userStore();
    const { liveId, userId, liveTitle, liveBrowse, screenSizeType } = storeToRefs(store);
    state.liveTitle = liveTitle.value;
    state.liveBrowse = liveBrowse.value;
    state.screenSizeType = screenSizeType.value;

    getAdminState();

    onMounted(() => {
      elementHeight();
      socket.connectURL = socketUrl.value + liveId.value + "/" + userId.value;
      socket.init(receiveMessage);
    });

    // 消息接收
    async function receiveMessage(message: any) {
      const param = JSON.parse(message.data);
      const params = JSON.parse(JSON.stringify(param));
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

      if (params.pushType == "0") {
        const opt: Opt = {
          id: Date.now(),
          avatar: params.avatar,
          handlerName: params.handlerName,
          liveId: params.liveId,
          message: params.message,
          messageType: params.messageType,
          pushType: params.pushType,
          realname: params.realname,
        };
        await barrage.value?.addTimeOut(opt);
      }
    }

    function getLiveAbout() {
      router.push({
        name: "guide",
      });
    }
    const inputBlur = () => {
      nextTick(() => {
        if (refInput.value) {
          refInput.value.blur();
        }
      });
    };

    const show = ref(false);
    const showImg = (e: any) => {
      nextTick(() => {
        console.log("zoom img" + JSON.stringify(e));
        state.mediaType = e.type;
        state.mediaUrl = e.url;
        show.value = true;
      });
    };

    function onFocus() {
      state.isExpression = false;

      barrage.value?.scrollBottom();

      window.addEventListener("resize", () => {
        if (
          document.activeElement instanceof HTMLElement &&
          document.activeElement.tagName == "INPUT"
        ) {
          //延迟出现是由于有些 Android 手机键盘出现的比较慢

          contentBottom.value ? (contentBottom.value.style.position = "static") : "";

          window.setTimeout(() => {
            document.activeElement.scrollIntoViewIfNeeded();
          }, 100);
        } else {
          contentBottom.value ? (contentBottom.value.style.position = "fixed;") : "";
        }
      });
    }
    function sendMessage() {
      if (state.message) {
        barrage.value?.getCommentMessage();
      } else {
        Toast.fail("请输入内容");
      }
      state.message = "";
    }
    function sendPhoto() {
      barrage.value?.getPhoto();
      state.showMore = false;
    }

    const beforeRead = (file: any) => {
      if (file.type.indexOf("image")) {
        Toast("请上传jpg、jpeg、png格式图片");
        return false;
      }
      return true;
    };
    // 上传图片
    const afterRead = (file: any) => {
      Toast.loading({
        duration: 0, // 持续展示 toast
        message: "发送中...",
        forbidClick: true,
      });
      let formData = new FormData(); //构造一个 FormData，把后台需要发送的参数添加
      formData.append("file", file.file); //接口需要传的参数
      uploadAction(
        axios.defaults.baseURL + "/jeecg-boot/sys/common/upload",
        formData
      ).then((res) => {
        Toast.clear();
        if (res.data.message) {
          console.log(res.data.message);
          barrage.value?.quene(res.data.message);
        } else {
          Toast("发送失败");
        }
      });
    };

    function handleTouch(e: any) {
      e._isScroller = true;
    }
    function toggleExpression() {
      setTimeout(() => {
        state.isExpression = !state.isExpression;
        barrage.value?.scrollBottom();
      }, 100);
    }
    function addEmoji(e: any) {
      state.message += e.native;
    }
    function getGiftInfo() {
      state.showPresent = true;
    }
    function getMoreInfo() {
      state.showMore = true;
    }
    function closeGift() {
      state.showPresent = false;
    }
    function toHome() {
      // router.push("/home");
      if (state.screenSizeType == "1") {
        router.push("/home");
      } else {
        router.push("/live");
      }
    }
    // const store = userStore();
    // const { videoUrl } = storeToRefs(store);
    // console.log(videoUrl.value)
    return {
      ...toRefs(state),
      onFocus,
      sendMessage,
      sendPhoto,
      movie,
      introduce,
      send,
      contentBottom,
      barrage,
      refInput,
      elementHeight,
      getPresentList,
      inputBlur,
      handleTouch,
      toggleExpression,
      addEmoji,
      getGiftInfo,
      getMoreInfo,
      closeGift,
      toHome,
      showImg,
      show,
      getAdminState,
      getLiveAbout,
      afterRead,
      beforeRead,
    };
  },
});
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  background: #eee;
  .headerBox {
    display: flex;
    justify-content: center;
    .header {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 7px 0 0;
      position: absolute;
      top: 72px;
      z-index: 10;
      .header-top {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        .rank {
          width: 80px;
          height: 30px;
          display: flex;
          background: #e4e4e4;
          // background: rgba(0, 0, 0, 0.26);
          border-radius: 41px;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          img {
            width: 13px;
            height: 13px;
          }
          .message {
            font-size: 11px;
            zoom: 1;
            font-family: PingFang SC-中等, PingFang SC;
            font-weight: normal;
            color: #ff2a00;
          }
        }
      }
      .header-bottom {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        .photo {
          display: flex;
          align-items: center;
          width: 80px;
          height: 30px;
          // background: rgba(0, 0, 0, 0.26);
          border-radius: 41px;
          justify-content: center;
          margin-right: 10px;
          margin-top: 10px;
          background: #e4e4e4;
          .text {
            width: 12px;
            height: 12px;
            margin: 0 0 0 9px;
          }
          .message {
            font-size: 11px;
            font-family: PingFang SC-中等, PingFang SC;
            font-weight: normal;
            color: #ff2a00;
            // zoom: 0.9;
            // margin: 0 5px 0 1px;
          }
          img {
            width: 13px;
            height: 13px;
          }
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
      .content-top {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .movie {
          width: 100%;
          // height: 2.23rem;
          height: 0px;
          // background: url("@/assets/bg.png") no-repeat;
          // background-size: 100%;
        }
        .information {
          width: 95%;
          display: flex;
          flex-direction: column;
          position: absolute;
          .container {
            width: 1.95rem;
            display: flex;
            height: 44px;
            background: rgba(255, 42, 0, 0.34);
            border-radius: 230px;
            .profile {
              width: 36px;
              height: 36px;
              margin: 4px 0 4px 5px;
            }
            .info {
              display: flex;
              flex-direction: column;
              .name {
                width: 0.9rem;
                font-size: 15px;
                font-family: PingFang SC-粗体, PingFang SC;
                font-weight: normal;
                color: #ffffff;
                line-height: 13px;
                margin: 8px 0 4px 4px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .message {
                font-size: 12px;
                font-family: PingFang SC-常规, PingFang SC;
                font-weight: normal;
                color: #ffffff;
                line-height: 13px;
                margin: 0 0 0 5px;
              }
            }
            .gift {
              display: flex;
              align-items: flex-end;
              img {
                width: 68px;
                height: 68px;
              }
            }
          }
        }
      }
      .content-center {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #fff;
        .introduce {
          width: 92%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 5px 0;
          .introduce-top {
            width: 100%;
            display: flex;
            .stream {
              display: flex;
              .stream-status {
                display: flex;
                width: 0.58rem;
                height: 0.26rem;
                display: flex;
                align-items: center;
                border-radius: 41px;
                background: #f4f4f4;
                img {
                  width: 10px;
                  height: 10px;
                  margin: 0 3px 0 6px;
                }
                .message {
                  font-size: 0.786em;
                  font-family: PingFang SC-中等, PingFang SC;
                  font-weight: normal;
                  color: #ff2a00;
                  zoom: 0.9;
                }
              }
              .stream-theme {
                width: 2.9rem;
                display: flex;
                align-items: center;
                margin: 0 0 0 5px;
                .title {
                  font-size: 16px;
                  font-family: PingFang SC-中等, PingFang SC;
                  font-weight: normal;
                  color: #323332;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  line-height: 16px;
                }
              }
            }
          }
          .introduce-bottom {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin: 6px 0 0;
            .introduce-bottom-left {
              display: flex;
              .brief {
                display: flex;
                border-bottom: 2px solid #999999;
                padding: 0 0 5px 0;
                .message {
                  font-size: 13px;
                  font-family: PingFang SC-中等, PingFang SC;
                  font-weight: normal;
                  color: #999999;
                  line-height: 13px;
                }
              }
              img {
                width: 6px;
                height: 11px;
                margin: 2px 0 0 7px;
              }
            }
            .introduce-bottom-right {
              display: flex;
              .browse {
                display: flex;
                img {
                  width: 12px;
                  height: 12px;
                }
                .number {
                  font-size: 13px;
                  font-family: PingFang SC-中等, PingFang SC;
                  font-weight: normal;
                  color: #999999;
                  line-height: 13px;
                  margin: 0 0 0 4px;
                }
              }
              .like {
                display: flex;
                margin: 0 0 0 9px;
                img {
                  width: 12px;
                  height: 12px;
                }
                .number {
                  font-size: 13px;
                  font-family: PingFang SC-中等, PingFang SC;
                  font-weight: normal;
                  color: #999999;
                  line-height: 13px;
                  margin: 0 0 0 3px;
                }
              }
            }
          }
        }
        .review {
          width: 100%;
          display: flex;
        }
      }
      .content-bottom {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: fixed;
        bottom: 0;
        .send {
          width: 95%;
          min-height: 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .send-left {
            width: 2.59rem;
            height: 0.4rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff;
            border-radius: 170px;
            .text {
              display: inline-block;
              width: 80%;
              height: 0.3rem;
              margin: 0 0 0 14px;
              border: none;
              font-size: 14px;
              font-family: PingFang SC-中等, PingFang SC;
              font-weight: normal;
              line-height: 14px;
            }
            .text::-webkit-input-placeholder {
              color: #999999;
            }
            img {
              width: 18px;
              height: 18px;
              margin: 0 14px 0 0;
            }
          }
          .send-center {
            display: flex;
            align-items: center;
            .add {
              width: 0.8rem;
              height: 0.36rem;
              background: linear-gradient(270deg, #ff5736 0%, #ff2a00 100%);
              border-radius: 34px;
              font-size: 14px;
              font-family: PingFang SC-中等, PingFang SC;
              font-weight: normal;
              color: #ffffff;
              line-height: 14px;
            }
          }
          .send-right {
            display: flex;
            align-items: center;
            .gift {
              display: flex;
              margin: 0 23px 0 0;
              img {
                width: 26px;
                height: 26px;
              }
            }
            .more {
              display: flex;
              margin: 0 10px 0 0;
              img {
                width: 26px;
                height: 26px;
              }
            }
          }
        }
        .expression {
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;
          ::v-deep .emoji-mart {
            width: 100% !important;
            height: 160px;
            border: none;
            background: #eee;
            .emoji-mart-category-label {
              display: none;
            }
          }
        }
      }
      @supports (bottom: constant(safe-area-inset-bottom)) or
        (bottom: env(safe-area-inset-bottom)) {
        .content-bottom {
          padding-bottom: constant(safe-area-inset-bottom);
          padding-bottom: env(safe-area-inset-bottom);
        }
      }
      .restBox {
        display: flex;
        justify-content: center;
        .rest {
          width: 100%;
          display: flex;
          flex-direction: column;
          .rest-top {
            display: flex;
            justify-content: space-between;
            background: #fff;
            .account {
              display: flex;
              margin: 13px 0 13px 20px;
              .title {
                font-size: 14px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                color: #333333;
                line-height: 21px;
              }
              .number {
                font-size: 14px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                color: #ffb300;
                line-height: 21px;
              }
            }
            .close {
              width: 28px;
              height: 21px;
              font-size: 14px;
              font-family: PingFang SC-中等, PingFang SC;
              font-weight: normal;
              color: #ff2a00;
              line-height: 21px;
              margin: 13px 20px 13px 0;
            }
          }
          .rest-center {
            display: flex;
            flex-direction: column;
            background: #f6f6f6;
            padding: 0 0 28px;
            .chat {
              display: flex;
              flex-direction: column;
              margin: 23px 0 0 20px;
              .chat-top {
                display: flex;
                .title {
                  font-size: 14px;
                  font-family: PingFang SC-粗体, PingFang SC;
                  font-weight: normal;
                  color: #ff2a00;
                  line-height: 10px;
                }
              }
              .chat-bottom {
                display: flex;
                flex-direction: column;
                img {
                  width: 50px;
                  height: 50px;
                  margin: 18px 0 7px;
                }
                .message {
                  font-size: 12px;
                  font-family: PingFang SC-中等, PingFang SC;
                  font-weight: normal;
                  color: #333333;
                  line-height: 12px;
                  margin: 0 0 0 6px;
                }
              }
            }
            .streaming {
              display: flex;
              flex-direction: column;
              margin: 22px 0 0 20px;
              .streaming-top {
                display: flex;
                .title {
                  font-size: 14px;
                  font-family: PingFang SC-粗体, PingFang SC;
                  font-weight: normal;
                  color: #ff2a00;
                  line-height: 10px;
                }
              }
              .streaming-bottom {
                display: flex;
                .gold_convert,
                .winning_record,
                .give_record {
                  display: flex;
                  flex-direction: column;
                  margin: 0 22px 0 0;
                  img {
                    width: 50px;
                    height: 50px;
                    margin: 20px 0 5px;
                  }
                  .message {
                    font-size: 12px;
                    font-family: PingFang SC-中等, PingFang SC;
                    font-weight: normal;
                    color: #333333;
                    line-height: 12px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ::v-deep .van-popup .van-icon {
    color: black;
    font-weight: bold;
  }
}
</style>
