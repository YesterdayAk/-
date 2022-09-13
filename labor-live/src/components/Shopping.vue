<template>
  <div class="shopping">
    <van-action-sheet
      v-model:show="showShopping"
      :close-on-click-overlay="false"
      @click-overlay="onClose"
    >
      <div
        class="cartBox"
        :style="shoppingWindowHeight"
        v-show="showCart"
        @touchmove="handleTouch"
      >
        <div class="cart">
          <van-list
            style="width: 100%"
            v-model:loading="loading"
            :finished="finished"
            :finished-text="shoppingList.length ? '没有更多了' : ''"
            @load="onLoad"
          >
            <div class="shop" v-for="(item, index) in shoppingList" :key="index">
              <div class="shop-top">
                <div class="store">
                  <span class="title">{{ item.deptName }}</span>
                </div>
              </div>
              <div class="shop-center">
                <div
                  class="container"
                  v-for="liveGoods in item.liveGoodsList"
                  :key="liveGoods.goodsId"
                  @click="getGoodsDetail(liveGoods.goodsId, liveGoods.goodsPicture)"
                >
                  <img
                    class="picture"
                    :src="
                      liveGoods.goodsPicture ? liveGoods.goodsPicture.split(',')[0] : ''
                    "
                    alt=""
                  />
                  <div class="information">
                    <span class="title">{{ liveGoods.goodsName }}</span>
                    <div class="info">
                      <div class="info-left">
                        <span class="symbol">￥</span>
                        <span class="price">{{ liveGoods.price }}</span>
                      </div>
                      <div class="info-right">
                        <span class="inventory">库存：{{ liveGoods.stock }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
          <van-empty v-if="!shoppingList.length" description="暂无数据" />
        </div>
      </div>

      <div class="contentBox" v-show="!showCart" :style="shoppingWindowHeight">
        <div class="content">
          <div class="content-top">
            <div class="spec">
              <span class="title">商品规格</span>
              <img
                @click="onClose"
                src="https://res1.qdszgh.cn/%E9%B8%BF%E9%9B%81%E8%9E%8D%E7%9B%B4%E6%92%AD/close.png"
              />
            </div>
            <div class="goods">
              <img
                class="picture"
                :src="
                  specInfo.skuImage
                    ? specInfo.skuImage.split(',')[0]
                    : goodsPicture
                    ? goodsPicture.split(',')[0]
                    : ''
                "
                alt=""
              />
              <div class="information">
                <span class="title" v-if="!goodsInfo.isSpecs">{{
                  specInfo.specName
                }}</span>
                <span class="title" v-else
                  >{{ specInfo.goodsName }}{{ specInfo.specName }}</span
                >
                <div class="info">
                  <div class="info-left">
                    <span class="symbol">￥</span>
                    <span class="price">{{ specInfo.liveSkuPrice }}</span>
                  </div>
                  <div class="info-right">
                    <span class="inventory">库存：{{ specInfo.liveSkuStock }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="content-center">
            <div class="spec">
              <div class="spec-top" v-if="goodsInfo.isSpecs">
                <div
                  class="information"
                  v-for="(item, index) in goodsSpecList"
                  :key="item.key"
                >
                  <div class="information-top">
                    <span class="caption">{{ item.goods_spec_name }}</span>
                  </div>
                  <div class="information-bottom">
                    <div
                      :class="['container', goods_spec_value.isCheck ? 'active' : '']"
                      v-for="(goods_spec_value, i) in item.goods_spec_value"
                      :key="i"
                      @click="choiceSpecInfo(goods_spec_value, index, i)"
                    >
                      <span class="title">{{
                        goods_spec_value.goods_spec_value_name
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="spec-bottom" v-else>
                <span class="message">{{ specInfo.specName }}</span>
              </div>
            </div>
          </div>
          <div class="content-bottom">
            <div class="count">
              <span class="title">购买数量：</span>
              <van-stepper
                v-model="count"
                :min="specInfo.liveMinBuyNum"
                theme="round"
                button-size="22"
                disable-input
              />
            </div>
          </div>
        </div>
      </div>
      <div class="operationBox" van-safe-area-bottom v-show="!showCart">
        <div class="operation">
          <van-button class="buy" @click="confirmOrder">购买</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  nextTick,
  reactive,
  ref,
  toRefs,
  onMounted,
  onUnmounted,
  watch,
} from "vue";
import {
  shoppingListConfig,
  liveGoodsListConfig,
  goodsSpecListConfig,
  goodsSpecValueConfig,
} from "@/types/goods";
import { useRouter, useRoute } from "vue-router";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { Toast } from "vant";
import { rmSync } from "fs";
export default defineComponent({
  name: "shopping",
  props: {
    movieHeight: Number,
    showShopping: Boolean,
    equipmentHeight: Number,
  },
  setup(props: any, context: any) {
    const router = useRouter();
    const route = useRoute();
    const { appContext } = getCurrentInstance() as any;
    const axios = appContext.config.globalProperties.$axios;
    const store = userStore();
    const { liveId, buyGoodsInfo } = storeToRefs(store);
    const state = reactive({
      shoppingWindowHeight: {
        height: "",
      },
      isBigScreen: false, //默认iphone不是全面屏
      shoppingList: ref<shoppingListConfig[]>([]), //购物车列表
      liveGoodsList: ref<liveGoodsListConfig[]>([]), //商品列表
      hasMore: ref<boolean>(true), //默认有更多数据
      loading: ref<boolean>(false), //默认开启无限滚动
      finished: ref<boolean>(false), //数据加载完成时的题案
      pageNum: ref<number>(1),
      pageSize: ref<number>(10),
      count: ref<number>(1),
      showCart: ref<boolean>(true),
      goodsSpecList: ref<goodsSpecListConfig[]>([]), //商品规格列表
      goodsSpecValue: ref<goodsSpecValueConfig[]>([]), //商品规格名列表
      //商品信息
      goodsInfo: {
        isSpecs: ref<number>(0), //默认单一商品规格
        liveGoodsSku: ref<Array<any>>([]),
      },
      //商品规格信息
      specInfo: {
        goodsId: ref<number>(0),
        goodsName: ref<string>(""),
        skuId: ref<number>(0),
        skuImage: ref<string>(""),
        specName: ref<string>(""),
        liveSkuPrice: ref<number>(0),
        liveSkuStock: ref<number>(0),
        liveMinBuyNum: ref<number>(0),
        deptName: ref<string>(""),
      },
      goodsPicture: ref<string>(""), //商品图片
    });
    /*
    购物车窗口高度
    */
    function getShoppingHeight(): any {
      state.shoppingWindowHeight.height =
        props.equipmentHeight - props.movieHeight + "px";
    }
    function handleTouch(e: any) {
      e._isScroller = true;
    }
    //获取购物车列表
    function getGoodsList() {
      Toast.loading({
        message: "正在加载...",
        duration: 0,
        forbidClick: true,
      });
      state.loading = true; //关闭无限滚动

      axios
        .get(axios.defaults.baseURL + "/jeecg-boot/hgyxapi/live/getGoodsListByLiveId", {
          params: {
            otherLiveId: liveId.value,
            pageNum: state.pageNum,
            pageSize: state.pageSize,
          },
        })
        .then((res: any) => {
          if (res.data.code == 200) {
            state.shoppingList = state.shoppingList.concat(res.data.result);
            Toast.clear();
            state.loading = false; //开启无限滚动
            if (state.pageNum * state.pageSize >= res.data.result.length) {
              state.hasMore = false;
              return;
            }
            state.pageNum++;
          }
        })
        .catch((err: any) => {
          Toast.clear();
        });
    }
    const onLoad = () => {
      if (!state.hasMore) {
        //没有更多数据
        state.loading = true; //关闭无限滚动
        state.finished = true;
        return false;
      }
      getGoodsList();
    };
    //获取商品详情信息
    function getGoodsDetail(goodsId: number, goodsPicture: string) {
      axios
        .get(axios.defaults.baseURL + "/jeecg-boot/hgyxapi/live/liveGoods/queryById", {
          params: {
            otherLiveId: liveId.value,
            goodsId,
          },
        })
        .then((res: any) => {
          state.showCart = false;
          state.goodsInfo = res.data.result;
          state.specInfo = res.data.result.liveGoodsSku[0];
          state.goodsPicture = goodsPicture;
          state.goodsSpecList = JSON.parse(res.data.result.goodsSpecList);
          state.goodsSpecList.forEach((item) => {
            item.goods_spec_value.forEach((item, index) => {
              if (index == 0) return (item.isCheck = true);
              item.isCheck = false;
            });
          });
        });
    }
    //选择规格信息
    function choiceSpecInfo(goods_spec_value: any, index: number, i: number) {
      nextTick(() => {
        state.goodsSpecList[index].goods_spec_value.forEach((item) => {
          item.isCheck = false;
        });
        goods_spec_value.isCheck = true;
        state.specInfo = state.goodsInfo.liveGoodsSku[i];
      });
    }
    /**
     * 关闭购物车窗口
     */
    function onClose() {
      context.emit("closeShopping");
    }
    //跳转确认订单页面
    function confirmOrder() {
      store.$patch((aaa) => {
        aaa.buyGoodsInfo = {
          shopName: state.specInfo.deptName, //商家名称
          buyNum: state.count, //购买数量
          goodsName: state.specInfo.goodsName, //商品名称
          picture: state.specInfo.skuImage
            ? state.specInfo.skuImage.split(",")[0]
            : state.goodsPicture.split(",")[0], //商家图片
          goodsId: state.specInfo.goodsId, //商品id
          skuPrice: state.specInfo.liveSkuPrice, //商品价格
          skuId: state.specInfo.skuId, //商品规格id
          specName: state.specInfo.specName, //商品规格名称
        };
      });

      router.push({
        name: "confirmOrder",
      });
    }
    watch(
      () => props.showShopping,
      (value) => {
        if (value) {
          state.showCart = true;
        }
        window.addEventListener("resize", getShoppingHeight());
      }
    );
    onUnmounted(() => {
      window.removeEventListener("resize", getShoppingHeight());
    });
    return {
      ...toRefs(state),
      handleTouch,
      getGoodsList,
      onLoad,
      getGoodsDetail,
      choiceSpecInfo,
      onClose,
      confirmOrder,
    };
  },
});
</script>

<style lang="scss" scoped>
.shopping {
  .cartBox {
    display: flex;
    justify-content: center;
    height: 100%;
    overflow-y: scroll;
    .cart {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      margin: 17px 0 0;
      .shop {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 5px;
        .shop-top {
          width: 100%;
          display: flex;
          justify-content: center;
          .store {
            width: 90%;
            display: flex;
            justify-content: space-between;
            margin: 0 0 17px;

            .title {
              font-size: 14px;
              font-weight: normal;
              color: #323332;
              line-height: 14px;
            }
          }
        }
        .shop-center {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          .container {
            width: 90%;
            display: flex;
            margin: 0 0 17px 0;
            padding: 0 0 17px 0;
            border-bottom: 1px solid #f6f7f6;

            .picture {
              width: 0.86rem;
              height: 0.86rem;
              object-fit: cover;
              // min-width: 0.86rem;
            }

            .information {
              width: 100%;
              display: flex;
              flex-direction: column;
              margin: 0 0 0 8px;
              position: relative;

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
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 17px 0 0;
                position: absolute;
                bottom: 0;

                .info-left {
                  display: flex;

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
                }

                .info-right {
                  display: flex;

                  .inventory {
                    font-size: 12px;
                    font-weight: normal;
                    color: #989998;
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
  .cartBox::-webkit-scrollbar {
    display: none;
  }
  .contentBox {
    display: flex;
    justify-content: center;

    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 5px;

      .content-top {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-bottom: 1px solid#F6F7F6;

        .spec {
          width: 90%;
          display: flex;
          justify-content: space-between;
          margin: 20px 0 30px;

          .title {
            font-size: 14px;
            font-weight: normal;
            color: #323332;
            line-height: 14px;
          }

          img {
            width: 13px;
            height: 13px;
          }
        }

        .goods {
          width: 90%;
          display: flex;
          margin: 0 0 17px 0;

          .picture {
            width: 0.86rem;
            height: 0.86rem;
            object-fit: cover;
          }

          .information {
            width: 100%;
            display: flex;
            flex-direction: column;
            margin: 0 0 0 8px;
            position: relative;

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
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 17px 0 0;
              position: absolute;
              bottom: 0;

              .info-left {
                display: flex;

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
              }

              .info-right {
                display: flex;

                .inventory {
                  font-size: 12px;
                  font-weight: normal;
                  color: #989998;
                  line-height: 12px;
                }
              }
            }
          }
        }
      }

      .content-center {
        width: 100%;
        display: flex;
        justify-content: center;
        border-bottom: 1px solid#F6F7F6;
        .spec {
          width: 90%;
          display: flex;
          flex-direction: column;

          .spec-top {
            display: flex;
            flex-direction: column;
            margin: 16px 0;
            .information {
              display: flex;
              flex-direction: column;
              margin: 0 0 5px;
              .information-top {
                display: flex;
                .caption {
                  font-size: 13px;
                  color: #333;
                  font-weight: 600;
                }
              }
              .information-bottom {
                display: flex;
                flex-wrap: wrap;
                margin: 10px 0 0;

                .container {
                  border-radius: 4px;
                  border: 1px solid #eeefee;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin: 0 15px 12px 0;
                  padding: 2px 10px;
                  &.active {
                    border-color: #e13734;
                    color: #e13734;
                    background: rgba(225, 55, 52, 0.1);
                  }
                }
              }
            }
          }
          .spec-bottom {
            display: flex;
            margin: 16px 0;
            .message {
              font-size: 13px;
              font-weight: normal;
              color: #666666;
              line-height: 20px;
            }
          }
        }
      }

      .content-bottom {
        width: 100%;
        display: flex;
        justify-content: center;

        .count {
          width: 90%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 16px 0 0;

          .title {
            font-size: 13px;
            font-weight: normal;
            color: #666666;
            line-height: 13px;
          }
        }
      }
    }
  }

  .operationBox {
    display: flex;
    justify-content: center;

    .operation {
      width: 100%;
      display: flex;
      justify-content: center;
      position: fixed;
      left: 0;
      bottom: 0;

      .buy {
        width: 3.51rem;
        height: 0.4rem;
        background: linear-gradient(270deg, #ff6f36 0%, #ff0800 100%);
        border-radius: 29px;
        margin: 5px 0;
        font-size: 14px;
        font-weight: normal;
        color: #fefffe;
        line-height: 14px;
      }
    }
  }
}
</style>
