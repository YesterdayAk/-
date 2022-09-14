<template>
  <div class="live">
    <div class="headerBox">
      <div class="header">
        <div class="header-top">
          <div class="stream">
            <div class="stream-status">
              <img
                src="https://res1.qdszgh.cn/%E9%B8%BF%E9%9B%81%E8%9E%8D%E7%9B%B4%E6%92%AD/circle.png"
                alt=""
              />
              <span class="message">直播中</span>
            </div>
            <div class="stream-theme">
              <span class="title">{{ liveTitle }}</span>
            </div>
          </div>
          <div class="rank" @click="getRankInfo">
            <img src="@/assets/trophy.png" alt="" />
            <span class="message">排行榜</span>
          </div>
        </div>
        <div class="header-center">
          <div class="introduce-bottom">
            <div class="introduce-bottom-left" @click="switchLiveInfo">
              <div class="brief_normal" v-if="!isDescribe">
                <span class="message">直播简介</span>
              </div>
              <div class="brief_active" v-else>
                <span class="message">回到聊天</span>
              </div>
              <img
                v-if="!isDescribe"
                style="width: 6px; height: 11px"
                src="@/assets/arrow-white-right.png"
                alt=""
              />
              <img
                v-else
                style="width: 6px; height: 11px"
                src="@/assets/arrow-gray-left.png"
                alt=""
              />
            </div>
            <div class="introduce-bottom-right">
              <div class="browse" v-if="liveBrowse">
                <img
                  src="https://res1.qdszgh.cn/%E9%B8%BF%E9%9B%81%E8%9E%8D%E7%9B%B4%E6%92%AD/browse.png"
                  alt=""
                />
                <span class="number">{{ liveBrowse }}</span>
              </div>
              <div class="like" v-if="liveCount">
                <img
                  src="https://res1.qdszgh.cn/%E9%B8%BF%E9%9B%81%E8%9E%8D%E7%9B%B4%E6%92%AD/like.png"
                  alt=""
                />
                <span class="number">{{ liveCount }}</span>
              </div>
            </div>
          </div>
          <div class="photo" v-if="showPlive" @click="getPliveInfo">
            <img class="text" src="@/assets/text.png" alt="" />
            <span class="message">图文直播</span>
            <img src="@/assets/arrow-white-right.png" alt="" />
          </div>
        </div>

        <div class="header-bottom">
          <van-count-down style="opacity: 0" :time="warmTime" @finish="warmFinish" />
        </div>
      </div>
    </div>
    <div class="contentBox">
      <div class="content">
        <div class="content-top">
          <div class="movie" ref="movie">
            <img
              v-if="!liveStatus"
              src="https://res1.qdszgh.cn/%E9%B8%BF%E9%9B%81%E8%9E%8D%E7%9B%B4%E6%92%AD/vertical_leave.png"
              alt=""
            />
            <VideoPlayer
              v-else
              ref="video"
              :showPushStream="showPushStream"
              :videoSource="videoSource"
              :videoSrc="videoSrc"
            ></VideoPlayer>
          </div>
          <div class="information" :style="{ bottom: 233 + sendHeight + 23 + 'px' }">
            <div
              :class="[
                'container',
                'animate__animated',
                showAccess ? 'animate__fadeInRight' : 'animate__fadeOutLeft',
              ]"
              v-for="item in givePresentList"
              :key="item.id"
            >
              <img class="profile" :src="item.avatar" alt="" />
              <div class="info">
                <span class="name">{{ item.realname }}：</span>
                <span class="message">送{{ item.name }} *1</span>
              </div>
              <div class="gift">
                <img :src="item.icon" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div class="content-center" v-if="!showPresent">
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
              <div class="introduce-bottom-left" @click="switchLiveInfo">
                <div class="brief_normal" v-if="!isDescribe">
                  <span class="message">直播简介</span>
                </div>
                <div class="brief_active" v-else>
                  <span class="message">回到聊天</span>
                </div>
                <img v-if="!isDescribe" src="@/assets/arrow-gray-right.png" alt="" />
                <img v-else src="@/assets/arrow-gray-left.png" alt="" />
              </div>
              <div class="introduce-bottom-right">
                <div class="browse">
                  <img src="@/assets/browse.png" alt="" />
                  <span class="number">{{ liveBrowse }}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            class="describe"
            :style="{ height: describeHeight }"
            v-if="isDescribe"
            @touchmove="handleTouch"
          >
            <span class="message" v-html="liveDescribe"></span>
          </div>
          <div
            class="review"
            :style="{
              'padding-bottom': goodsHeight + 'px',
              bottom: isExpression ? sendHeight + 160 + 'px' : sendHeight + 'px',
            }"
            v-if="!isDescribe"
          >
            <Barrage
              ref="barrage"
              @inputBlur="inputBlur"
              :isExpression="isExpression"
              :commentMessage="message"
              :movieHeight="movieHeight"
              :introduceHeight="introduceHeight"
              :goodsHeight="goodsHeight"
              :sendHeight="sendHeight"
              v-if="movieHeight"
            ></Barrage>
            <div class="start" v-if="showAccess">
              <canvas id="canvas" class="canvas"></canvas>
            </div>
            <div
              class="lucky_bag"
              v-if="luckyInfo.isBag"
              @click="getLuckyBag"
              :style="{ bottom: goodsHeight + 120 + 'px' }"
            >
              <van-count-down
                class="time"
                :time="luckyInfo.countDownLong"
                format="mm:ss"
                @finish="finish"
              />
            </div>
            <div
              class="lucky_turnplate"
              v-if="turnplateInfo.isTurnplate"
              @click="getTurnplateInfo"
              :style="{ bottom: goodsHeight + 50 + 'px' }"
            >
              <img src="@/assets/lucky_turnplate.png" alt="" />
            </div>
            <LiveLike :goodsHeight="goodsHeight" :liveCount="liveCount"></LiveLike>
            <div class="goodsBox" v-if="showGoods">
              <div class="goods" ref="goods">
                <img
                  class="picture"
                  :src="
                    goodsInfo.goodsPicture ? goodsInfo.goodsPicture.split(',')[0] : ''
                  "
                  alt=""
                />
                <div class="goods_info">
                  <span class="title">{{ goodsInfo.goodsName }}</span>
                  <div class="info">
                    <div class="info-left">
                      <span class="symbol">￥</span>
                      <span class="price">{{ goodsInfo.goodsPrice }}</span>
                      <span class="sell">已售：{{ goodsInfo.goodsSalesk }}</span>
                    </div>
                    <div
                      class="info-right"
                      @click="getDetail(goodsInfo.goodsId, goodsInfo.goodsPicture)"
                    >
                      <van-button class="buy">购买</van-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="content-bottom"
          ref="contentBottom"
          v-if="!showPresent && !isDescribe"
        >
          <div class="send" ref="send">
            <div class="send-left">
              <div class="shopping" v-if="cartInfo.isCart" @click="getShoppingInfo">
                <img
                  src="https://res1.qdszgh.cn/%E9%B8%BF%E9%9B%81%E8%9E%8D%E7%9B%B4%E6%92%AD/shopping.png"
                  alt=""
                />
              </div>
              <div class="input_box" :style="cartInfo.isCart ? 'width:2.24rem' : ''">
                <input
                  ref="refInput"
                  class="text"
                  :style="!cartInfo.isCart ? 'width:76%' : ''"
                  type="text"
                  name=""
                  id=""
                  :placeholder="
                    isForbidden && chatType == '0'
                      ? '您已被禁言，不能发布消息！'
                      : isForbidden && chatType == '1'
                      ? '全员禁言中，不能发布消息！'
                      : isForbidden && !laborApp
                      ? '游客身份，不能发布消息！'
                      : '这里是输入的内容'
                  "
                  v-model="message"
                  @keyup.enter="sendMessage"
                  @focus="onFocus"
                  :disabled="isForbidden"
                />
                <img
                  class="smile"
                  @click="toggleExpression"
                  src="https://res1.qdszgh.cn/%E9%B8%BF%E9%9B%81%E8%9E%8D%E7%9B%B4%E6%92%AD/expression.png"
                  alt=""
                />
              </div>
            </div>
            <div class="send-center" v-if="message">
              <van-button class="add" @click="sendMessage">发送</van-button>
            </div>
            <div class="send-right" v-else>
              <div class="gift" @click="getGiftInfo">
                <img src="@/assets/gift.png" alt="" />
              </div>
              <div class="more" @click="getMoreInfo">
                <img src="@/assets/more.png" alt="" />
              </div>
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
        <Shopping
          ref="shopping"
          :movieHeight="movieHeight"
          :showShopping="showShopping"
          :equipmentHeight="equipmentHeight"
          @closeShopping="closeShopping"
        ></Shopping>
        <Present
          ref="present"
          :movieHeight="movieHeight"
          :showPresent="showPresent"
          :equipmentHeight="equipmentHeight"
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
                <div class="streaming">
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
                    <div class="order_record" @click="getOrderRecord">
                      <img src="@/assets/more/order_record.png" alt="" />
                      <span class="message">订单记录</span>
                    </div>
                    <div class="share" @click="toShare">
                      <img src="@/assets/more/share.png" alt="" />
                      <span class="message">去分享</span>
                    </div>
                  </div>
                </div>
                <div class="manage" v-if="isAdmin != '0'">
                  <div class="manage-top">
                    <span class="title">管理员功能</span>
                  </div>
                  <div class="manage-bottom">
                    <div class="lucky_bag" @click="getLuckyManage">
                      <img src="@/assets/more/lucky_bag.png" alt="" />
                      <span class="message">福袋管理</span>
                    </div>
                    <!-- <div class="turnplate" @click="getTurnplateManage">
                      <img src="@/assets/more/turnplate.png" alt="" />
                      <span class="message">抽奖管理</span>
                    </div> -->
                    <div class="manager" @click="getManageInfo">
                      <img src="@/assets/more/manager.png" alt="" />
                      <span class="message">管理员</span>
                    </div>
                    <div class="ban" @click="getBanInfo">
                      <img src="@/assets/more/ban.png" alt="" />
                      <span class="message">禁言名单</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-action-sheet>
      </div>
    </div>
    <van-dialog
      class="lucky_bag_dialog"
      v-model:show="showLuckyBag"
      :showConfirmButton="false"
      :closeOnClickOverlay="true"
    >
      <div class="information">
        <div class="information-top">
          <span class="title">幸运福袋</span>
        </div>
        <div class="information-center">
          <span class="message">福袋将于</span>
          <van-count-down class="time" :time="luckyInfo.countDownLong" format="mm:ss" />
          <span class="message">后开启，快来报名吧！</span>
        </div>
        <div class="information-bottom">
          <van-button class="apply" v-if="luckyInfo.isApply">您已报名</van-button>
          <van-button class="apply" v-else @click="getApplyInfo">立即报名</van-button>
        </div>
      </div>
    </van-dialog>
    <van-dialog class="remind_dialog" v-model:show="showPrize" :showConfirmButton="false">
      <div class="remind">
        <span class="title">{{ prizeRemind }}</span>
        <span class="message">{{ prizeInfo }}</span>
        <van-button class="confirm" @click="showPrize = false">确认</van-button>
      </div>
    </van-dialog>
    <van-dialog
      class="warning_dialog"
      v-model:show="showWarning"
      :showConfirmButton="false"
    >
      <div class="warning">
        <span class="title">提示</span>
        <span class="message"
          >欢迎来到直播间！请文明观看发言，如有违规现象将会被请出直播间，严重违规者，平台将移交相关部门处理</span
        >
        <van-button class="confirm" @click="playVideo">我知道了</van-button>
      </div>
    </van-dialog>
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
import useClipboard from "vue-clipboard3";
import { useRouter, useRoute } from "vue-router";
import { Toast } from "vant";
import Barrage from "@/components/Barrage.vue";
import Shopping from "@/components/Shopping.vue";
import Present from "@/components/Present.vue";
import LiveLike from "@/components/LiveLike.vue";
import VideoPlayer from "@/components/VideoPlayer.vue";
import data from "emoji-mart-vue-fast/data/apple.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
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
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
import socket from "@/utils/socket";
import { Parser, Player, DB } from "svga";
import { uploadAction } from "@/utils/request";
import { getPhoneType } from "@/utils/barrageTool";
export default defineComponent({
  name: "live",
  components: {
    Barrage,
    Picker,
    Shopping,
    Present,
    LiveLike,
    VideoPlayer,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { appContext } = getCurrentInstance() as any;
    const axios = appContext.config.globalProperties.$axios;
    const store = userStore();
    const {
      liveId,
      userId,
      liveTitle,
      liveBrowse,
      liveDescribe,
      laborApp,
      isFirstApp,
      screenSizeType,
      userPhone,
      isAdmin,
    } = storeToRefs(store);
    let state = reactive({
      showGift: ref<boolean>(true), //默认显示礼物
      showPlive: ref<boolean>(false), //默认不显示图文直播
      pullFlowM3u8Address: ref<string>(""), //直播流
      videoHeight: ref<string>("100vh"),
      showPushStream: ref<boolean>(true), //默认显示推流
      warmTime: ref<number>(10 * 60 * 1000), //预热时间
      videoSource: {
        src: ref<string>(
          "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8"
        ),
        type: ref<string>("application/x-mpegURL"),
      }, //视频资源
      videoSrc: ref<string>(""), //视频mp4格式地址
      liveStatus: ref<number>(1), //当前直播状态 0 代表直播暂停 1代表开始推流 2代表推流结束
      // videoOption: {
      //   autoplay: true,
      //   controls: false,
      //   sources: [
      //     {
      //       src: "",
      //       type: "application/x-mpegURL",
      //     },
      //   ],
      //   loop: false,
      // },
      liveTitle: ref<string>(""), //直播主题
      liveBrowse: ref<string>(""), //直播浏览量
      liveCount: ref<number>(0), //直播点赞数
      liveDescribe: ref<string>(""), //直播描述
      laborApp: true, //齐鲁工惠app环境
      isAdmin: ref<string>("0"), //默认不是管理员
      emojiIndex,
      isExpression: false,
      message: "", //输入框的值
      isForbidden: false, //是否禁用输入框
      chatType: ref<string>(""),
      movieHeight: 0, //视频高度
      introduceHeight: 0, //介绍高度
      describeHeight: "", //直播描述高度
      equipmentHeight: 0, //设备高度
      goodsHeight: 0, //商品链接高度
      showGoods: ref<boolean>(false), //默认不显示商品链接
      timer: ref<number>(59), //默认商品链接显示时开启倒计时
      showShopping: false, //默认不显示购物车
      isDescribe: false, //默认不显示直播描述
      isBigScreen: false, //默认iphone不是全面屏
      sendHeight: 0, //发送高度
      givePresentList: ref<PresentShowConfig[]>([]), //赠送礼物列表
      showAccess: false, //默认不显示滑入
      showPresent: false, //默认不显示礼物窗口
      showMore: false, //默认不显示更多功能
      fileList: [], //上传图片视频返回值
      luckyInfo: {
        isBag: ref<boolean>(false), //默认不显示福袋
        countDownLong: ref<number>(0),
        liveGoodBagId: ref<string>(""),
        isApply: ref<boolean>(false), //默认没有参与福袋报名
      },
      showLuckyBag: ref<boolean>(false), //默认不显示福袋弹窗
      showPrize: ref<boolean>(false), //福袋中奖信息弹窗
      showWarning: ref<boolean>(false), //直播警告弹窗
      prizeRemind: ref<string>(""),
      prizeInfo: ref<string>(""),
      turnplateInfo: {
        isTurnplate: ref<boolean>(false), //默认不显示转盘
        turnplateId: ref<number>(0),
      },
      goldCoin: ref<number>(0), //剩余金币
      hiddenTime: ref<number>(0), //页面隐藏时间
      visibleTime: ref<number>(0), //页面显示时间
      cartInfo: {
        isCart: ref<boolean>(false), //默认不显示小黄车
      },
      //商品信息
      goodsInfo: {
        goodsId: ref<number>(0),
        goodsName: ref<string>(""),
        goodsPicture: ref<string>(""),
        goodsPrice: ref<number>(0),
        goodsSalesk: ref<number>(0),
      },
    });
    let movie = ref<null | HTMLElement>(null);
    let introduce = ref<null | HTMLElement>(null);
    let goods = ref<null | HTMLElement>(null);
    let send = ref<null | HTMLElement>(null);
    let contentBottom = ref<null | HTMLElement>(null);
    const barrage = ref<InstanceType<typeof Barrage>>();
    const shopping = ref<InstanceType<typeof Shopping>>();
    const present = ref<InstanceType<typeof Present>>();
    const video = ref<InstanceType<typeof VideoPlayer>>();
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
        store.$patch({
          screenSizeType: "2",
        });
      }
      if (introduce.value) {
        state.introduceHeight = introduce.value.offsetHeight;
      }
      if (send.value) {
        state.sendHeight = send.value.offsetHeight;
      }

      state.isBigScreen = getPhoneType();
      state.equipmentHeight = window.innerHeight;
      if (state.isBigScreen) {
        state.describeHeight =
          window.innerHeight - state.movieHeight - state.introduceHeight - 35 + "px";
      } else {
        state.describeHeight =
          window.innerHeight - state.movieHeight - state.introduceHeight + "px";
      }
    };
    //获取直播信息
    function getLiveInfo() {
      axios
        .get(axios.defaults.baseURL + "/jeecg-boot/live/api/getLive", {
          params: {
            liveId: liveId.value,
          },
        })
        .then((res: any) => {
          if (res.data.code == 200) {
            store.$patch({
              liveTitle: res.data.result.name,
              liveBrowse: res.data.result.viewPersonTime,
              liveDescribe: res.data.result.introduce,
            });

            state.pullFlowM3u8Address = res.data.result.pullFlowM3u8Address;
            state.liveTitle = liveTitle.value;
            state.liveBrowse = liveBrowse.value;
            state.liveDescribe = liveDescribe.value;
            state.laborApp = laborApp.value;
            if (!state.laborApp) {
              state.isForbidden = true;
            }

            let giveGiftFlag: number = res.data.result.giveGiftFlag;
            if (giveGiftFlag) {
              state.showGift = true;
            } else {
              state.showGift = false;
            }

            let imageTextLiveFlag: number = res.data.result.imageTextLiveFlag;
            if (imageTextLiveFlag) {
              state.showPlive = true;
            } else {
              state.showPlive = false;
            }

            let playBackFlag: number = res.data.result.playBackFlag;

            const serverTime = new Date(res.data.result.serverTime.replace(/-/g, "/"));
            const startTenMinutes = new Date(
              res.data.result.startTenMinutes.replace(/-/g, "/")
            );
            const startTime = new Date(res.data.result.startTime.replace(/-/g, "/"));
            const endTime = new Date(res.data.result.endTime.replace(/-/g, "/"));
            // if (startTime > serverTime) {
            //   router.push({
            //     name: "guide",
            //   });
            // } else if (startTime <= serverTime && serverTime <= endTime) {
            //   state.showWarning = true;
            // }
            if (startTenMinutes > serverTime) {
              router.push({
                name: "guide",
              });
            } else if (startTime <= serverTime && serverTime <= endTime) {
              state.showWarning = true;
              state.showPushStream = true;
              state.videoSource = {
                src: state.pullFlowM3u8Address,
                type: "application/x-mpegURL",
              };
              // state.videoOption.sources[0].src = res.data.result.pullFlowM3u8Address;
              // state.videoOption.sources[0].type = "application/x-mpegURL";
            } else if (startTime > serverTime && serverTime >= startTenMinutes) {
              state.showWarning = true;
              state.showPushStream = false;
              state.videoSrc = res.data.result.warmVideo;
              // state.videoOption.sources[0].src = res.data.result.warmVideo;
              // state.videoOption.sources[0].type = "video/mp4";
              // state.videoOption.loop = true;
              state.warmTime = startTime.getTime() - serverTime.getTime();
            } else if (serverTime > endTime) {
              state.showWarning = true;
              state.showPushStream = false;

              if (playBackFlag) {
                state.videoSrc = res.data.result.playBackAddress;
                // state.videoOption.sources[0].src = res.data.result.playBackAddress;
                // state.videoOption.sources[0].type = "video/mp4";
              }
            }
            state.liveCount = res.data.result.fabulous;
          }
        });
    }

    //预热事件结束
    const warmFinish = () => {
      state.showWarning = true;
      state.showPushStream = true;
      state.videoSource = {
        src: state.pullFlowM3u8Address,
        type: "application/x-mpegURL",
      };
    };
    function playVideo() {
      state.showWarning = false;
      video.value?.start();
    }
    function getRankInfo() {
      if (state.laborApp) {
        store.$patch({
          isFirstApp: false,
        });
        router.push({
          name: "rank",
        });
      } else {
        Toast("解锁全部功能，请登录“齐鲁工惠app”观看直播");
      }
    }
    function getPliveInfo() {
      if (state.laborApp) {
        store.$patch({
          isFirstApp: false,
        });
        router.push({
          name: "plive",
        });
      } else {
        Toast("解锁全部功能，请登录“齐鲁工惠app”观看直播");
      }
    }
    function getPresentList(pre: any) {
      state.givePresentList = [];
      state.givePresentList.push(pre);
      state.showAccess = true;
    }
    function switchLiveInfo() {
      store.$patch({
        isFirstApp: false,
      });
      state.isDescribe = !state.isDescribe;
    }
    watch(
      [() => state.givePresentList, () => state.showGoods],
      ([givePresentList, showGoods]) => {
        if (givePresentList.length) {
          setTimeout(() => {
            state.showAccess = false;
          }, 2000);
        }
        if (showGoods) {
          let auth_timer = setInterval(() => {
            state.timer = state.timer - 1;
            if (state.timer == 0) {
              state.showGoods = false;
              state.goodsHeight = 0;
              clearInterval(auth_timer);
            }
          }, 1000);
          setTimeout(() => {
            if (goods.value) {
              state.goodsHeight = goods.value.offsetHeight;
            }
          }, 0);
        }
      }
    );
    const startSvga = async function (swf: string) {
      try {
        const url = swf;
        const db = new DB();
        let svga = await db.find(url);
        if (!svga) {
          // Parser 需要配置取消使用 ImageBitmap 特性，ImageBitmap 数据无法直接存储到 DB 内
          const parser = new Parser({ isDisableImageBitmapShim: true });
          svga = await parser.load(url);
          await db.insert(url, svga);
        }
        const doc: any = document.getElementById("canvas");
        const player: any = new Player({
          container: doc,
          loop: 1,
        });
        await player.mount(svga);

        player.onStart = () => {
          // console.log("播放了");
        };

        // 开始播放动画
        player.start();
      } catch (error) {
        console.error(error);
      }
    };
    // 消息接收
    async function receiveMessage(message: any) {
      // const param = JSON.parse(Base64.decode(message.data));
      const param = JSON.parse(message.data);
      // 处理 赋值问题
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
      interface Pre {
        id: number;
        avatar: string;
        handlerName: string;
        icon: string;
        liveId: string;
        name: string;
        pushType: string;
        realname: string;
        sendMessageType: string;
        swf: string;
      }
      interface Ban {
        id: number;
        realname: string;
        pushType: string;
        chatType: string;
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
      } else if (params.pushType == "1") {
        state.luckyInfo.isBag = true;
        state.luckyInfo.countDownLong = params.countDownLong;
        state.luckyInfo.liveGoodBagId = params.liveGoodBagId;
        if (params.winPrizeFlag && params.goodBagType == "1") {
          state.prizeRemind = "福袋开奖！";
          state.prizeInfo = "恭喜开福袋获得" + params.goldCoin + "金币";
          state.showPrize = true;
        } else if (!params.winPrizeFlag && params.goodBagType == "1") {
          state.prizeRemind = "未中奖！";
          state.prizeInfo = "很遗憾，您未中奖！";
          state.showPrize = true;
        }
      } else if (params.pushType == "2") {
        state.isForbidden = true;
        state.chatType = params.chatType;
        const ban: Ban = {
          id: Date.now(),
          realname: params.realname,
          pushType: params.pushType,
          chatType: params.chatType,
        };
        await barrage.value?.addTimeOut(ban);
      } else if (params.pushType == "3") {
        const pre: Pre = {
          id: Date.now(),
          avatar: params.avatar,
          handlerName: params.handlerName,
          icon: params.icon,
          liveId: params.liveId,
          name: params.name,
          pushType: params.pushType,
          realname: params.realname,
          sendMessageType: params.sendMessageType,
          swf: params.swf,
        };
        await getPresentList(pre);
        await startSvga(params.swf);
      } else if (params.pushType == "4") {
        state.isForbidden = false;
        state.chatType = params.chatType;
        const ban: Ban = {
          id: Date.now(),
          realname: params.realname,
          pushType: params.pushType,
          chatType: params.chatType,
        };
        await barrage.value?.addTimeOut(ban);
      } else if (params.pushType == "5") {
        state.turnplateInfo.isTurnplate = true;
        state.turnplateInfo.turnplateId = params.liveGoodBagId;
      } else if (params.pushType == "6") {
        state.showGoods = true;
        state.goodsInfo = params;
      } else if (params.pushType == "7") {
        state.cartInfo.isCart = true;
      } else if (params.pushType == "9") {
        state.liveCount = params.fabulous;
      } else if (params.pushType == "10") {
        state.isAdmin = params.isAdmin;

        store.$patch({
          isAdmin: params.isAdmin,
        });
      } else if (params.pushType == "11") {
        state.liveStatus = params.liveStatus;

        switch (state.liveStatus) {
          case 0:
            break;
          case 1:
            state.showWarning = true;
            break;
          default:
            break;
        }
      }
    }
    onMounted(async () => {
      await elementHeight();
      await getLiveInfo();
      // socket.connectURL =
      //   "wss://websocket.qdszgh.cn:8443/jeecg-boot/liveWebsocket/" +
      //   liveId.value +
      //   "/" +
      //   userId.value;

      socket.connectURL =
        "wss://websocket.qdszgh.cn:8443/jeecg-boot/testLiveWebsocket/" +
        liveId.value +
        "/" +
        userId.value;

      socket.init(receiveMessage);
    });
    const inputBlur = () => {
      nextTick(() => {
        if (refInput.value) {
          refInput.value.blur();
        }
      });
    };
    function onFocus() {
      state.isExpression = false;
      barrage.value?.scrollBottom();

      // window.addEventListener("resize", () => {
      //   if (
      //     document.activeElement instanceof HTMLElement &&
      //     document.activeElement.tagName == "INPUT"
      //   ) {
      //     //延迟出现是由于有些 Android 手机键盘出现的比较慢
      //     state.videoHeight = state.equipmentHeight + "px";
      //     contentBottom.value ? (contentBottom.value.style.position = "static") : "";

      //     window.setTimeout(() => {
      //       (document.activeElement as any).scrollIntoViewIfNeeded();
      //       // document.activeElement.scrollIntoViewIfNeeded();
      //     }, 100);
      //   } else {
      //     state.videoHeight = "100vh";
      //     contentBottom.value ? (contentBottom.value.style.position = "fixed;") : "";
      //   }
      // });
    }
    function getLuckyBag() {
      socket.init(receiveMessage);
      state.showLuckyBag = true;
      judgeApplyInfo();
    }
    //倒计时结束
    const finish = () => {
      state.luckyInfo.isBag = false;
    };
    //判断是否报名福袋
    const judgeApplyInfo = () => {
      axios
        .get(axios.defaults.baseURL + "/jeecg-boot/goodBag/api/signUpGoodFlag", {
          params: {
            goodBagId: state.luckyInfo.liveGoodBagId,
          },
        })
        .then((res: any) => {
          if (res.data.code == 200) {
            state.luckyInfo.isApply = res.data.result;
          }
        });
    };
    function getApplyInfo() {
      axios
        .get(axios.defaults.baseURL + "/jeecg-boot/goodBag/api/goodBagEnroll", {
          params: {
            goodBagId: state.luckyInfo.liveGoodBagId,
          },
        })
        .then((res: any) => {
          if (res.data.code == 200) {
            Toast.success("报名成功");
          } else {
            Toast.fail(res.data.message);
          }
          state.showLuckyBag = false;
        });
    }
    function getTurnplateInfo() {
      router.push({
        path: "/lottery",
        query: { activityId: state.turnplateInfo.turnplateId },
      });
    }
    function getDetail(goodsId: number, goodsPicture: string) {
      state.showShopping = true;
      shopping.value?.getGoodsDetail(goodsId, goodsPicture);
    }
    function sendMessage() {
      if (state.message) {
        barrage.value?.getCommentMessage();
      } else {
        Toast.fail("请输入内容");
      }
      state.message = "";
    }
    function handleTouch(e: any) {
      e._isScroller = true;
    }
    function toggleExpression() {
      if (state.isForbidden && state.chatType == "0") {
        Toast("您已被禁言，不能发布表情！");
        return false;
      } else if (state.isForbidden && state.chatType == "1") {
        Toast("全员禁言中，不能发布表情！");
        return false;
      } else if (state.isForbidden && !laborApp) {
        Toast("解锁全部功能，请登录“齐鲁工惠app”观看直播");
        return false;
      }

      if (state.laborApp) {
        store.$patch({
          isFirstApp: false,
        });
        setTimeout(() => {
          state.isExpression = !state.isExpression;
          barrage.value?.scrollBottom();
        }, 100);
      }
    }
    function addEmoji(e: any) {
      state.message += e.native;
    }
    function getShoppingInfo() {
      state.showShopping = true;
    }
    function getGiftInfo() {
      if (state.showGift) {
        store.$patch({
          isFirstApp: false,
        });
        state.showPresent = true;
        state.isExpression = false;
        present.value?.getMyCoin();
      } else {
        Toast("禁止赠送礼物");
      }
    }
    function getMoreInfo() {
      state.showMore = true;
      axios
        .get(axios.defaults.baseURL + "/jeecg-boot/user/api/getMyGoldCoin")
        .then((res: any) => {
          if (res.data.code == 200) {
            if (res.data.result) {
              state.goldCoin = res.data.result;
            }
          }
        });
    }
    function onClose() {
      state.showMore = false;
    }
    const beforeRead = (file: any) => {
      if (state.isForbidden && state.chatType == "0") {
        Toast("您已被禁言，不能发布图片！");
        return false;
      } else if (state.isForbidden && state.chatType == "1") {
        Toast("全员禁言中，不能发布图片！");
        return false;
      } else if (state.isForbidden && !laborApp) {
        Toast("解锁全部功能，请登录“齐鲁工惠app”观看直播");
        return false;
      }

      if (file.type.indexOf("image")) {
        Toast("请上传jpg、jpeg、png格式图片");
        return false;
      }
      return true;
    };
    // 上传图片
    const afterRead = (file: any) => {
      if (state.laborApp) {
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
            barrage.value?.quene(res.data.message);
          } else {
            Toast("发送失败");
          }
        });
      } else {
        Toast("解锁全部功能，请登录“齐鲁工惠app”观看直播");
      }
    };
    function getPrizeRecord() {
      store.$patch({
        isFirstApp: false,
      });
      if (state.laborApp) {
        router.push({
          name: "prizeRecord",
        });
      } else {
        Toast("解锁全部功能，请登录“齐鲁工惠app”观看直播");
      }
    }
    function getGiveRecord() {
      store.$patch({
        isFirstApp: false,
      });
      if (state.laborApp) {
        router.push({
          name: "giveRecord",
        });
      } else {
        Toast("解锁全部功能，请登录“齐鲁工惠app”观看直播");
      }
    }

    function getOrderRecord() {
      router.push({
        name: "orderRecord",
      });
    }

    //福袋管理
    function getLuckyManage() {
      router.push({
        name: "luckyManage",
      });
    }
    //抽奖管理
    function getTurnplateManage() {
      router.push({
        name: "turnplateManage",
      });
    }
    //管理员管理
    function getManageInfo() {
      router.push({
        name: "adminManage",
      });
    }
    //禁言名单
    function getBanInfo() {
      router.push({
        name: "muteManage",
      });
    }

    const closeShopping = function () {
      state.showShopping = false;
    };
    const closeGift = function () {
      state.showPresent = false;
    };
    const { toClipboard } = useClipboard();
    const toShare = async () => {
      // const url = "https://livephone.qdszgh.cn/#/guide?liveId=" + liveId.value;
      const url = window.location.href;
      try {
        await toClipboard(url);
        Toast.success("复制链接成功");
      } catch (e: any) {
        Toast.fail(e);
      }
    };
    //解决IOS返回页面不刷新的问题
    var isPageHide = false;
    window.addEventListener("pageshow", function () {
      if (isPageHide) {
        window.location.reload();
      }
    });
    window.addEventListener("pagehide", function () {
      isPageHide = true;
    });

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState == "hidden" && laborApp.value) {
        //记录页面隐藏时间
        state.hiddenTime = new Date().getTime();
      } else if (document.visibilityState == "visible" && laborApp.value) {
        state.visibleTime = new Date().getTime();
        //页面再次可见的时间-隐藏时间>60s,重连
        if ((state.visibleTime - state.hiddenTime) / 1000 > 60) {
          socket.init(receiveMessage);
        }
      }
    });
    return {
      ...toRefs(state),
      onFocus,
      judgeApplyInfo,
      getLuckyBag,
      finish,
      getApplyInfo,
      getTurnplateInfo,
      getDetail,
      sendMessage,
      movie,
      introduce,
      goods,
      send,
      contentBottom,
      barrage,
      shopping,
      present,
      refInput,
      video,
      elementHeight,
      getRankInfo,
      getLiveInfo,
      warmFinish,
      playVideo,
      getPliveInfo,
      getPresentList,
      switchLiveInfo,
      inputBlur,
      handleTouch,
      toggleExpression,
      addEmoji,
      getShoppingInfo,
      getGiftInfo,
      getMoreInfo,
      onClose,
      beforeRead,
      afterRead,
      getPrizeRecord,
      getGiveRecord,
      getOrderRecord,
      getLuckyManage,
      getTurnplateManage,
      getManageInfo,
      getBanInfo,
      closeShopping,
      closeGift,
      toShare,
      startSvga,
      receiveMessage,
    };
  },
});
</script>

<style lang="scss" scoped>
.live {
  min-height: 100vh;
  background: #f6f6f6;
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
      z-index: 10;
      .header-top {
        width: 90%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .stream {
          display: flex;
          background: rgba(0, 0, 0, 0.26);
          border-radius: 41px;

          .stream-status {
            display: flex;
            width: 0.6rem;
            height: 0.26rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(0, 0, 0, 0.26);
            border-radius: 0 41px 41px 0;
            img {
              width: 10px;
              height: 10px;
            }

            .message {
              font-size: 11px;
              zoom: 0.9;
              font-weight: normal;
              color: #fff;
              margin: 0 0 0 2px;
              line-height: 16px;
            }
          }

          .stream-theme {
            width: 1.88rem;
            display: flex;
            align-items: center;

            .title {
              font-size: 14px;
              font-weight: normal;
              color: #fff;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              line-height: 16px;
              margin: 0 13px 0 7px;
            }
          }
        }
        .rank {
          width: 0.6rem;
          height: 0.26rem;
          display: flex;
          background: rgba(0, 0, 0, 0.26);
          border-radius: 41px;
          align-items: center;
          img {
            width: 14px;
            height: 14px;
            margin: 0 1px 0 5px;
          }
          .message {
            font-size: 11px;
            zoom: 0.9;
            font-family: PingFang SC-中等, PingFang SC;
            font-weight: normal;
            color: #ffffff;
          }
        }
      }
      .header-center {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin: 8px 0 0;
        .introduce-bottom {
          width: 1.7rem;
          height: 0.24rem;
          border-radius: 118px;
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.26);
          margin: 0 0 0 18px;

          .introduce-bottom-left {
            display: flex;

            .brief_normal {
              display: flex;
              .message {
                font-size: 11px;
                font-weight: normal;
                color: #ffffff;
                line-height: 13px;
                margin: 0 3px 0 8px;
                zoom: 0.9;
              }
            }
            .brief_active {
              display: flex;
              .message {
                font-size: 11px;
                font-weight: normal;
                color: #ffffff;
                line-height: 13px;
                margin: 0 3px 0 8px;
                zoom: 0.9;
              }
            }
          }

          .introduce-bottom-right {
            display: flex;
            margin: 0 0 0 15px;

            .browse {
              display: flex;
              img {
                width: 12px;
                height: 12px;
              }

              .number {
                font-size: 11px;
                font-weight: normal;
                color: #ffffff;
                line-height: 13px;
                margin: 1px 0 0 3px;
                zoom: 0.9;
              }
            }

            .like {
              display: flex;
              margin: 0 0 0 5px;
              img {
                width: 12px;
                height: 12px;
              }

              .number {
                font-size: 11px;
                font-weight: normal;
                color: #ffffff;
                line-height: 13px;
                margin: 1px 0 0 3px;
                zoom: 0.9;
              }
            }
          }
        }

        .photo {
          display: flex;
          align-items: center;
          width: 0.92rem;
          height: 0.24rem;
          background: rgba(0, 0, 0, 0.26);
          border-radius: 41px 0px 0px 41px;
          .text {
            width: 12px;
            height: 12px;
            margin: 0 0 0 9px;
          }
          .message {
            font-size: 11px;
            font-family: PingFang SC-中等, PingFang SC;
            font-weight: normal;
            color: #ffffff;
            zoom: 0.9;
            margin: 0 5px 0 1px;
          }
          img {
            width: 6px;
            height: 11px;
          }
        }
      }

      .header-bottom {
        width: 90%;
        display: flex;
        justify-content: flex-end;
        margin: 8px 0 0;
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
          height: 2.23rem;
          img {
            width: 100%;
            height: 100vh;
            object-fit: cover;
          }
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
              border-radius: 50%;
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
        // background: #fff;
        .introduce {
          width: 92%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 5px 0;
          visibility: hidden;
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
            justify-content: space-between;
            align-items: center;
            margin: 6px 0 0;
            .introduce-bottom-left {
              display: flex;
              .brief_normal {
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
              .brief_active {
                display: flex;
                border-bottom: 2px solid #ff2a00;
                padding: 0 0 5px 0;
                .message {
                  font-size: 13px;
                  font-family: PingFang SC-中等, PingFang SC;
                  font-weight: normal;
                  color: #ff2a00;
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
            }
          }
        }

        .describe {
          width: 100%;
          display: flex;
          justify-content: center;
          margin: 10px 0 13px;
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;
          background: #f6f6f6;
          z-index: 10;
          .message {
            font-size: 15px;
            font-family: PingFang SC-中等, PingFang SC;
            font-weight: normal;
            color: #323332;
            line-height: 25px;
          }
        }
        .describe::-webkit-scrollbar {
          display: none;
        }
        .review {
          width: 100%;
          display: flex;
          position: absolute;
          .start {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
          .lucky_bag {
            width: 0.58rem;
            height: 0.63rem;
            position: absolute;
            right: 10px;
            bottom: 90px;
            background: url("@/assets/lucky_bag.png") no-repeat center;
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            z-index: 10;
            .time {
              position: absolute;
              bottom: 3px;
              font-size: 11px;
              font-family: PingFang SC-中等, PingFang SC;
              font-weight: normal;
              color: #ffffff;
              line-height: 14px;
              letter-spacing: 2px;
              zoom: 0.9;
            }
          }
          .lucky_turnplate {
            position: absolute;
            right: 10px;
            bottom: 10px;
            z-index: 10;
            img {
              width: 58px;
              height: 63px;
            }
          }

          .goodsBox {
            width: 100%;
            display: flex;
            justify-content: center;
            position: absolute;
            bottom: 0;

            .goods {
              width: 95%;
              display: flex;
              background: #fefffe;
              border-radius: 8px;

              .picture {
                width: 0.86rem;
                height: 0.86rem;
                object-fit: cover;
                margin: 8px;
              }

              .goods_info {
                display: flex;
                flex-direction: column;
                margin: 8px 10px 8px 0;

                .title {
                  font-size: 16px;
                  font-weight: normal;
                  color: #323332;
                  line-height: 23px;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                }

                .info {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin: 17px 0 0;

                  .info-left {
                    display: flex;
                    align-items: center;
                    .symbol {
                      font-size: 14px;
                      font-weight: 600;
                      color: #ff2a00;
                      line-height: 22px;
                    }

                    .price {
                      font-size: 18px;
                      font-weight: 600;
                      color: #ff2a00;
                      line-height: 22px;
                    }

                    .sell {
                      font-size: 12px;
                      font-weight: normal;
                      color: #999999;
                      line-height: 12px;
                      margin: 0 0 0 7px;
                    }
                  }

                  .info-right {
                    display: flex;

                    .buy {
                      width: 0.61rem;
                      height: 0.21rem;
                      background: linear-gradient(270deg, #fe0d38 0%, #fc811f 100%);
                      border-radius: 20px;
                      font-size: 13px;
                      font-weight: normal;
                      color: #fefffe;
                      line-height: 13px;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .content-bottom {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: fixed;
        bottom: 0;
        z-index: 10;
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
            .shopping {
              display: flex;
              img {
                width: 26px;
                height: 26px;
              }
            }
            .input_box {
              width: 2.59rem;
              height: 0.4rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: rgba(0, 0, 0, 0.3);
              border-radius: 170px;
              .text {
                width: 80%;
                height: 0.3rem;
                margin: 0 0 0 14px;
                display: inline-block;
                border: none;
                font-size: 14px;
                font-family: PingFang SC-中等, PingFang SC;
                font-weight: normal;
                line-height: 14px;
                background: none;
                color: #fff;
              }
              .text::-webkit-input-placeholder {
                color: #ccc;
              }
              .smile {
                width: 18px;
                height: 18px;
                margin: 0 14px 0 0;
              }
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
                position: relative;
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
                  position: absolute;
                  left: 0;
                  bottom: 0;
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
                .give_record,
                .order_record,
                .share {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
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

            .manage {
              display: flex;
              flex-direction: column;
              margin: 22px 0 0 20px;
              .manage-top {
                display: flex;
                .title {
                  font-size: 14px;
                  font-family: PingFang SC-粗体, PingFang SC;
                  font-weight: normal;
                  color: #ff2a00;
                  line-height: 10px;
                }
              }
              .manage-bottom {
                display: flex;
                .lucky_bag,
                .turnplate,
                .manager,
                .ban {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
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
}
.lucky_bag_dialog {
  display: flex;
  .information {
    display: flex;
    flex-direction: column;
    align-items: center;
    .information-top {
      display: flex;
      margin: 43px 0 0;
      .title {
        font-size: 20px;
        font-family: PingFang SC-粗体, PingFang SC;
        font-weight: normal;
        color: #ff2a00;
        line-height: 20px;
      }
    }
    .information-center {
      display: flex;
      margin: 30px 0;
      .message {
        font-size: 16px;
        font-family: PingFang SC-中等, PingFang SC;
        font-weight: normal;
        color: #333333;
        line-height: 18px;
      }
    }
    .information-bottom {
      display: flex;
      margin: 0 0 28px;
      .apply {
        width: 1.62rem;
        height: 0.48rem;
        background: linear-gradient(180deg, #ff5736 0%, #ff2a00 100%);
        border-radius: 24px;
        font-size: 16px;
        font-family: PingFang SC-中等, PingFang SC;
        font-weight: normal;
        color: #ffffff;
        line-height: 16px;
      }
    }
  }
}
.remind_dialog {
  display: flex;
  .remind {
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      font-size: 20px;
      font-family: PingFang SC-粗体, PingFang SC;
      font-weight: normal;
      color: #ff2a00;
      line-height: 20px;
      margin: 43px 0 0;
    }
    .message {
      font-size: 16px;
      font-family: PingFang SC-中等, PingFang SC;
      font-weight: normal;
      color: #333333;
      line-height: 18px;
      margin: 30px 0;
    }
    .confirm {
      width: 1.62rem;
      height: 0.48rem;
      background: linear-gradient(180deg, #ff5736 0%, #ff2a00 100%);
      border-radius: 24px;
      font-size: 16px;
      font-family: PingFang SC-中等, PingFang SC;
      font-weight: normal;
      color: #ffffff;
      line-height: 16px;
      margin: 0 0 44px;
    }
  }
}

.warning_dialog {
  display: flex;
  .warning {
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      font-size: 20px;
      font-family: PingFang SC-粗体, PingFang SC;
      font-weight: normal;
      color: #ff2a00;
      line-height: 20px;
      margin: 43px 0 0;
    }
    .message {
      font-size: 16px;
      font-family: PingFang SC-中等, PingFang SC;
      font-weight: normal;
      color: #333333;
      line-height: 24px;
      margin: 30px;
    }
    .confirm {
      width: 1.62rem;
      height: 0.48rem;
      background: linear-gradient(180deg, #ff5736 0%, #ff2a00 100%);
      border-radius: 24px;
      font-size: 16px;
      font-family: PingFang SC-中等, PingFang SC;
      font-weight: normal;
      color: #ffffff;
      line-height: 16px;
      margin: 0 0 28px;
    }
  }
}
</style>
