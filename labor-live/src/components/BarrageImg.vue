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
          <div class="container" v-for="item in commentList" :key="item.id">
            <div class="container-top" v-if="item.pushType == 0">
              <div class="timeBox">{{ item.createTime }}</div>
              <div class="information">
                <img class="profile" :src="item.avatar" alt="" />
                <span class="adminLabel">管理员</span>
                <span class="name">{{ item.realname }} : </span>
                <div class="messageBox">
                  <!-- <span v-if="item.messageType==0" class="message">{{ item.message }}</span>
                     <div v-if="item.messageType==1" @click="showImg(item.message,1)">
                          <van-image fit="fill" class="imgBox"  :src="item.message" />
                     </div>
                     <div v-if="item.messageType==2" @click="showImg(item.message,2)">
                          <video  class="imgBox"  :src="item.message" />
                     </div> -->
                  <img
                    v-if="
                      item.message.indexOf('.png') != -1 ||
                      item.message.indexOf('.jpeg') != -1 ||
                      item.message.indexOf('.jpg') != -1
                    "
                    :src="item.message"
                    class="imgBox"
                    @click="imagePreview(item.message)"
                    alt=""
                  />
                  <span class="message" v-else>{{ item.message }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  onMounted,
  onUnmounted,
  ref,
  toRefs,
  nextTick,
  watchEffect,
  getCurrentInstance,
} from "vue";
// import { resolve } from "webpack.config";
import * as _ from "lodash";
import { debounce, isScrollBottom, getPhoneType } from "../utils/barrageTool";
import smoothscroll from "smoothscroll-polyfill";
smoothscroll.polyfill(); // 移动端scrollTo behavior: "smooth"动画失效的polyfill
import socket from "@/utils/socket";
import { Base64 } from "js-base64";
import { ImagePreview } from "vant";
import { get } from "@/utils/request";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
export default defineComponent({
  name: "barrageImg",
  props: {
    isExpression: Boolean,
    commentMessage: String,
    movieHeight: Number,
    introduceHeight: Number,
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
      commentList: <any[]>[], //评论列表
      restNums: 0,
      wrapperDom: ref<Nullable>(null),
      listDom: ref<Nullable>(null),
      wrapperHeight: 0,
      isBigScreen: false, //默认iphone不是全面屏
      isBindScrolled: false,
    });
    function getCommentHeight(): any {
      state.commentWrapHeight.height = window.innerHeight - state.expressionHeight + "px";
    }
    function handleTouch(e: any) {
      e._isScroller = true;
      context.emit("inputBlur");
    }
    function showImg(e: any, vType: any) {
      // e._isScroller = true;
      let toImg = { url: e, type: vType };
      context.emit("showImg", toImg);
    }
    //获取父组件输入框传递的值
    function getCommentMessage() {
      // const data = new Array(1).fill("");
      quene(props.commentMessage, "0");
    }
    function imagePreview(message: string) {
      ImagePreview([message]);
    }
    function getPhoto() {
      console.log("send img!");
      quene("base64", "1");
    }
    watchEffect(() => {
      state.isBigScreen = getPhoneType();
      if (props.isExpression && state.isBigScreen) {
        state.expressionHeight =
          props.movieHeight + props.introduceHeight + 10 + props.sendHeight + 35 + 160;
      } else if (props.isExpression && !state.isBigScreen) {
        state.expressionHeight =
          props.movieHeight + props.introduceHeight + 10 + props.sendHeight + 160;
      } else if (!props.isExpression && state.isBigScreen) {
        state.expressionHeight =
          props.movieHeight + props.introduceHeight + 10 + props.sendHeight + 35;
      } else if (!props.isExpression && !state.isBigScreen) {
        state.expressionHeight =
          props.movieHeight + props.introduceHeight + 10 + props.sendHeight;
      }
      window.addEventListener("resize", getCommentHeight());
    });

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
    const quene = _.throttle(
      async (commentMessage: string) => {
        interface Opt {
          message: string;
          pushType: string;
          messageType: string;
        }
        const opt: Opt = {
          message: commentMessage,
          pushType: "0",
          messageType: "0",
        };
        socket.send(opt);
      },
      3000,
      {
        leading: true,
        trailing: false,
      }
    );

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

    //添加评论，如果超过150条就将前50条删除
    function addComment(data: any) {
      if (state.commentList.length >= 150) {
        // state.commentList.splice(0, 50);
      }
      //  console.log(data)
      state.commentList.push(data);
      store.$patch({
        richTxtList: state.commentList,
      });

      nextTick(() => {
        renderComment();
      });
    }
    const store = userStore();
    const { richTxtList } = storeToRefs(store);
    //获取评论信息
    function getCommentInfo() {
      // console.log(JSON.stringify(commentList.value) )
      state.commentList = richTxtList.value;
      scrollBottom();
    }
    //渲染评论
    function renderComment() {
      const listHeight = state.listDom.offsetHeight;
      const diff = props.isExpression
        ? listHeight - state.wrapperHeight + 160
        : listHeight - state.wrapperHeight; //列表高度与容器高度差值
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
      handleTouch,
      showImg,
      getPhoto,
      imagePreview,
      getCommentInfo,
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
    background: #f6f6f6;
    .comment-wrap {
      width: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .content {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 5px 0 0;
        .container {
          width: 95%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 0 5px 0;
          .container-top {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .timeBox {
              margin-top: 16px;
              width: 118px;
              height: 18px;
              font-size: 12px;
              font-family: PingFang SC-中等, PingFang SC;
              font-weight: normal;
              color: #999999;
              line-height: 18px;
            }
            .information {
              background: rgba(0, 0, 0, 0.3);
              border-radius: 6px;
              padding: 10px;
              max-width: calc(100% - 100px);
              .profile {
                width: 26px;
                height: 26px;
                border-radius: 50%;
                vertical-align: middle;
              }
              .adminLabel {
                width: 35px;
                height: 14px;
                background: #ffc700;
                border-radius: 2px 2px 2px 2px;
                opacity: 1;
                font-size: 11px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                color: #ffffff;
                line-height: 10px;
                margin-left: 5px;
              }

              .name {
                font-size: 15px;
                font-family: PingFang SC-粗体, PingFang SC;
                font-weight: normal;
                color: #ffffff;
                margin: 0 0 0 5px;
                vertical-align: middle;
              }
              .messageBox {
                margin-left: 30px;
                .message {
                  font-size: 14px;
                  font-family: PingFang SC-中等, PingFang SC;
                  font-weight: normal;
                  color: #ffffff;
                  vertical-align: middle;
                }
                .imgBox {
                  max-width: 160px;
                  max-height: 160px;
                  overflow-y: hidden;
                  border-radius: 6px 6px 6px 6px;
                  opacity: 1;
                  margin-right: 6px;
                  margin-top: 11px;
                  margin-bottom: 9px;
                }
              }
            }
          }
          .container-bottom {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 20px 0 10px;
            .gift {
              display: flex;
              background: rgba(255, 42, 0, 0.3);
              border-radius: 12px;
              padding: 5px 20px;
              margin: 0 0 5px 0;
              .name,
              .message {
                font-size: 12px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                color: #ff2a00;
                line-height: 12px;
              }
              .give {
                font-size: 12px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                color: #ff2a00;
                line-height: 12px;
                margin: 0 5px;
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
