<template>
  <div class="barrage">
    <div class="comment">
      <div
        class="comment-wrap"
        ref="wrapper"
        :style="commentWrapHeight"
        @touchmove="handleTouch"
      >
        <div class="content" ref="list">
          <van-list
            style="width: 95%"
            v-model:loading="loading"
            :finished="finished"
            @load="onLoad"
            :immediate-check="false"
            direction="up"
          >
            <div class="container" v-for="item in commentList" :key="item.id">
              <div class="container-top" v-if="item.pushType == 0">
                <div class="information">
                  <div class="information-left">
                    <img class="profile" :src="item.avatar" alt="" />
                  </div>
                  <div class="information-right">
                    <span class="name">{{ item.realname }}：</span>
                    <img
                      v-if="
                        item.message.indexOf('.png') != -1 ||
                        item.message.indexOf('.jpeg') != -1 ||
                        item.message.indexOf('.jpg') != -1
                      "
                      :src="item.message"
                      @click="imagePreview(item.message)"
                      alt=""
                    />
                    <span class="message" v-else>{{ item.message }}</span>
                  </div>
                </div>
              </div>
              <!-- <div class="container-center" v-if="item.pushType == 3">
              <div class="gift">
                <span class="name">{{ item.realname }}</span>
                <span class="give">送出</span>
                <span class="message">{{ item.name }}*1</span>
              </div>
            </div> -->
              <div
                class="container-bottom"
                v-if="item.pushType == 2 || item.pushType == 4"
              >
                <div class="banned" v-if="item.pushType == 2">
                  <div class="banner_all" v-if="item.chatType == 1">
                    <span class="name">管理员{{ item.realname }}</span>
                    <span class="message">已开启全员禁言</span>
                  </div>
                  <div class="banner_single" v-else>
                    <span class="name">管理员{{ item.realname }}</span>
                    <span class="message">对您开启了禁言</span>
                  </div>
                </div>
                <div class="relieve" v-else>
                  <div class="relieve_all" v-if="item.chatType == 1">
                    <span class="name">管理员{{ item.realname }}</span>
                    <span class="message">已解除全员禁言</span>
                  </div>
                  <div class="relieve_single" v-else>
                    <span class="name">管理员{{ item.realname }}</span>
                    <span class="message">对您解除了禁言</span>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  onMounted,
  onUnmounted,
  ref,
  toRefs,
  nextTick,
  watchEffect,
  watch,
} from "vue";
// import { resolve } from "webpack.config";
import { debounce, isScrollBottom, getPhoneType } from "@/utils/barrageTool";
import * as _ from "lodash";
import smoothscroll from "smoothscroll-polyfill";
smoothscroll.polyfill(); // 移动端scrollTo behavior: "smooth"动画失效的polyfill
import socket from "@/utils/socket";
import { Base64 } from "js-base64";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { ImagePreview, Toast } from "vant";
export default defineComponent({
  name: "barrage",
  props: {
    isExpression: Boolean,
    commentMessage: String,
    movieHeight: Number,
    introduceHeight: Number,
    goodsHeight: Number,
    sendHeight: Number,
  },
  setup(props: any, context: any) {
    const { appContext } = getCurrentInstance() as any;
    const axios = appContext.config.globalProperties.$axios;
    const state = reactive({
      commentWrapHeight: {
        height: "",
      },
      expressionHeight: 0, //表情未显示时评论列表高度为 window.innerHeight - 370,显示时评论列表高度为window.innerHeight - 530
      commentList: ref<any>([]), //评论列表
      hasMore: ref<boolean>(true), //默认有更多数据
      loading: ref<boolean>(false), //默认开启无限滚动
      finished: ref<boolean>(false), //数据加载完成
      pageNo: ref<number>(1),
      pageSize: ref<number>(10),
      restNums: 0,
      wrapperDom: ref<Nullable>(null),
      listDom: ref<Nullable>(null),
      wrapperHeight: 0,
      isBigScreen: false, //默认iphone不是全面屏
      isBindScrolled: false,
      messageType: ref<string>(""),
      screenSizeType: "", //屏幕尺寸类型
    });
    const store = userStore();
    const { commentList, laborApp, isFirstApp, screenSizeType, liveId } = storeToRefs(
      store
    );
    state.screenSizeType = screenSizeType.value;
    function getCommentHeight(): any {
      if (state.screenSizeType == "1") {
        state.commentWrapHeight.height =
          window.innerHeight - state.expressionHeight - props.goodsHeight + "px";
      } else {
        if (props.isExpression) {
          state.commentWrapHeight.height = 233 - 160 - props.goodsHeight + "px";
        } else {
          state.commentWrapHeight.height = 233 - props.goodsHeight + "px";
        }
      }
    }
    function handleTouch(e: any) {
      e._isScroller = true;
      context.emit("inputBlur");
    }
    //获取父组件输入框传递的值
    function getCommentMessage() {
      // const data = new Array(1).fill("");
      quene(props.commentMessage);
    }
    function imagePreview(message: string) {
      ImagePreview([message]);
    }
    watchEffect(() => {
      state.isBigScreen = getPhoneType();
      if (props.isExpression && state.isBigScreen) {
        state.expressionHeight =
          props.movieHeight + props.introduceHeight + 10 + props.sendHeight + 35 + 160;
      } else if (props.isExpression && !state.isBigScreen) {
        state.expressionHeight =
          props.movieHeight + props.introduceHeight + 10 + props.sendHeight + 160;
      } else if (!props.isExpression && state.isBigScreen && !laborApp.value) {
        state.expressionHeight =
          props.movieHeight + props.introduceHeight + 10 + props.sendHeight + 35;
      } else if (!props.isExpression && !state.isBigScreen) {
        state.expressionHeight =
          props.movieHeight + props.introduceHeight + 10 + props.sendHeight;
      } else if (
        !props.isExpression &&
        state.isBigScreen &&
        laborApp.value &&
        isFirstApp.value
      ) {
        //初始进入齐鲁工惠判断
        state.expressionHeight =
          props.movieHeight + props.introduceHeight + 10 + props.sendHeight + 35 - 34;
      } else if (
        !props.isExpression &&
        state.isBigScreen &&
        laborApp.value &&
        !isFirstApp.value
      ) {
        state.expressionHeight =
          props.movieHeight + props.introduceHeight + 10 + props.sendHeight + 35;
      }
      window.addEventListener("resize", getCommentHeight());
    });

    watch(
      () => props.goodsHeight,
      (value) => {
        scrollBottom();
      }
    );

    let wrapper = ref<null | HTMLElement>(null);
    let list = ref<null | HTMLElement>(null);
    function initDom() {
      if (wrapper.value) {
        state.listDom = list;
        state.wrapperHeight = wrapper.value.offsetHeight;
        state.wrapperDom = wrapper;
      }
    }
    function addTimeOut(opt: any) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          addComment(opt);
          resolve("success");
        }, 500);
      });
    }
    //队列添加消息

    async function quene(commentMessage: string) {
      interface Opt {
        message: string;
        pushType: string;
        messageType: string;
      }
      if (
        commentMessage.indexOf(".png") != -1 ||
        commentMessage.indexOf(".png") != -1 ||
        commentMessage.indexOf(".jpg") != -1
      ) {
        state.messageType = "1";
      } else {
        state.messageType = "0";
      }
      const opt: Opt = {
        message: commentMessage,
        pushType: "0",
        messageType: state.messageType,
      };
      Toast.loading({
        duration: 0, // 持续展示 toast
        message: "发送中...",
        forbidClick: true,
      });
      socket.send(opt);
    }

    function addScroll() {
      debounce(listScroll(), 200);
      state.isBindScrolled = true;
    }

    function listScroll(): any {
      const ele = state.wrapperDom;
      const isBottom = isScrollBottom(ele, ele.clientHeight);
      if (isBottom) {
        state.restNums = 0;
      }
    }
    ///滚动到底部
    function scrollBottom() {
      nextTick(() => {
        wrapper.value ? (wrapper.value.scrollTop = wrapper.value.scrollHeight) : "";
      });
    }
    //添加评论
    function addComment(data: any) {
      // if (state.commentList.length >= 150) {
      //   state.commentList.splice(0, 50);
      // }
      state.commentList.push(data);
      Toast.clear();
      store.$patch({
        commentList: state.commentList,
      });
      nextTick(() => {
        renderComment();
      });
    }
    //获取评论信息
    function getCommentInfo() {
      onLoad();
    }

    //获取历史评论信息
    async function getHistoryInfo() {
      state.loading = true; //关闭无限滚动
      await axios
        .get(axios.defaults.baseURL + "/jeecg-boot/live/api/getListNewMessage", {
          params: {
            pageNo: state.pageNo,
            pageSize: state.pageSize,
            liveId: liveId.value,
          },
        })
        .then((res: any) => {
          if (res.data.code == 200) {
            state.commentList.unshift(...res.data.result.records);
            scrollBottom();
            state.loading = false; //开启无限滚动
            if (state.pageNo * state.pageSize >= res.data.result.total) {
              state.hasMore = false;
              return;
            }
            state.pageNo++;
          }
        });
    }

    async function onLoad() {
      if (!state.hasMore) {
        //没有更多数据
        state.loading = true; //关闭无限滚动
        state.finished = true;
        return false;
      }
      await getHistoryInfo();
    }

    //渲染评论
    function renderComment() {
      const listHeight = state.listDom.offsetHeight;
      const diff = props.isExpression
        ? listHeight -
          state.wrapperHeight +
          (state.screenSizeType == "1" ? 160 : 0) +
          props.goodsHeight
        : listHeight - state.wrapperHeight + props.goodsHeight; //列表高度与容器高度差值
      const top = state.wrapperDom.scrollTop; //列表滚动高度
      if (diff - top < state.listDom.lastElementChild.offsetHeight * 1.5) {
        if (diff > 0) {
          if (state.isBindScrolled) {
            state.isBindScrolled = false;
            state.wrapperDom.removeEventListener("scroll", addScroll());
          }
          state.wrapperDom.scrollTo({
            top: diff + 10,
            left: 0,
            behavior: "smooth",
          });
          state.restNums = 0;
        }
      } else {
        ++state.restNums;
        if (!state.isBindScrolled) {
          state.isBindScrolled = true;
          state.wrapperDom.addEventListener("scroll", addScroll());
        }
      }
    }

    onMounted(async () => {
      await initDom();
      await getCommentInfo();
    });
    onUnmounted(() => {
      window.removeEventListener("resize", getCommentHeight());
    });

    return {
      ...toRefs(state),
      initDom,
      wrapper,
      list,
      addTimeOut,
      quene,
      addScroll,
      listScroll,
      scrollBottom,
      addComment,
      renderComment,
      getCommentHeight,
      getCommentMessage,
      imagePreview,
      handleTouch,
      getCommentInfo,
      getHistoryInfo,
      onLoad,
    };
  },
});
</script>

<style lang="scss" scoped>
.barrage {
  width: 100%;
  display: flex;
  justify-content: center;
  .comment {
    width: 100%;
    display: flex;
    justify-content: center;
    // background: #f6f6f6;
    .comment-wrap {
      width: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .content {
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 5px 0 0;
        .container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          .container-top {
            width: 100%;
            display: flex;
            margin: 0 0 10px 0;
            .information {
              display: flex;
              background: rgba(0, 0, 0, 0.3);
              border-radius: 6px;
              padding: 5px;
              word-break: break-all;
              .information-left {
                display: flex;
                .profile {
                  width: 26px;
                  height: 26px;
                  border-radius: 50%;
                  vertical-align: middle;
                }
              }
              .information-right {
                display: flex;
                flex-direction: column;
                margin: 0 0 0 5px;
                .name {
                  font-size: 15px;
                  font-family: PingFang SC-粗体, PingFang SC;
                  font-weight: normal;
                  color: #ffffff;
                  vertical-align: middle;
                }
                img {
                  width: 140px;
                  height: 100px;
                  object-fit: cover;
                  margin: 9px 12px 12px 0;
                  border-radius: 6px;
                }
                .message {
                  font-size: 14px;
                  font-family: PingFang SC-中等, PingFang SC;
                  font-weight: normal;
                  color: #ffffff;
                  vertical-align: middle;
                }
              }
            }
          }
          .container-center {
            display: flex;
            .gift {
              display: flex;
              // background: rgba(255, 42, 0, 0.3);
              background: rgba(0, 0, 0, 0.3);
              border-radius: 12px;
              padding: 5px 20px;
              .name,
              .message {
                font-size: 12px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                // color: #ff2a00;
                color: #fff;
                line-height: 12px;
              }
              .give {
                font-size: 12px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                // color: #ff2a00;
                color: #fff;
                line-height: 12px;
                margin: 0 5px;
              }
            }
          }
          .container-bottom {
            display: flex;
            flex-direction: column;
            align-items: center;
            .banned,
            .relieve {
              display: flex;
              // background: rgba(255, 42, 0, 0.3);
              background: rgba(0, 0, 0, 0.3);
              border-radius: 12px;
              padding: 5px 20px;
              margin: 0 0 10px 0;
              .name,
              .message {
                font-size: 12px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                color: #ff2a00;
                line-height: 12px;
              }
            }
          }
        }
      }
    }
    .comment-wrap::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
