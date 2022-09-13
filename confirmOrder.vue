<template>
  <div class="confirmOrder">
    <!-- <div class="deliveryDiv" v-if="isMode == 1">
      <span class="deliverySpan"
        ><img
          src="../../assets/img/car.png"
          alt=""
          class="siteIcon"
        />选择配送方式：</span
      >
      <van-radio-group
        v-model="delivery"
        class="deliveryChecked"
        direction="horizontal"
      >
        <van-radio checked-color="#FF6D17" name="1">快递</van-radio>
        <van-radio checked-color="#FF6D17" name="2">自提</van-radio>
      </van-radio-group>
    </div> -->
    <div class="groupSite" v-if="type == 4">
      <h5>
        团购地址<i v-if="!groupId">发起拼团后不可修改</i
        ><i v-else>拼团地址不可修改</i>
      </h5>
    </div>
    <div v-if="delivery == 1">
      <div class="siteInf" v-if="JSON.stringify(address) == '{}'">
        <div class="noAddress" @click="toAddr">
          <van-icon name="add-o"></van-icon>
          <span>添加收货人信息</span>
        </div>
      </div>
      <div class="siteInf" v-else @click="editAddr">
        <div class="siteLocation">
          <img src="~@/assets/img/site.png" alt="" />
          <h5>{{ address.addressName }}，{{ address.addressPhone }}</h5>
          <p>
            {{ address.addressProvince }}{{ address.addressCity
            }}{{ address.addressCounty }}{{ address.addressDetail }}
          </p>
          <van-icon name="arrow" v-if="!groupId" />
        </div>
      </div>
    </div>
    <div v-if="delivery == 2" class="bySelf">
      <p>商家名称：{{ shopData.departName }}</p>
      <p v-if="shopData.contacts">联系人：{{ shopData.contacts }}</p>
      <p v-if="shopData.servicePhone">
        商家电话：<a>{{ shopData.servicePhone }}</a>
      </p>
      <p v-if="shopData.businessAddress">
        商家地址：{{ shopData.businessAddress }}
      </p>
    </div>
    <div class="confirmCont">
      <div class="waresList">
        <div class="wareOne" v-for="(event, index) in goodsList" :key="index">
          <div class="wareName">{{ event.shopName }}</div>
          <div class="wareDiv" v-for="(item, i) in event.shopData" :key="i">
            <div class="wareImg">
              <van-image
                :src="item.skuImage ? item.skuImage : item.picture"
                fit="cover"
              ></van-image>
            </div>
            <div class="wareInf">
              <h5>{{ item.goodsName }}</h5>
              <div class="spec">
                <span>{{ item.specName }}</span>
              </div>
              <div class="price">
                <span class="nowPrice" v-if="type == 1 || type == 4"
                  >¥{{ parseFloat(item.skuPrice).toFixed(2)
                  }}<i style="font-size: 12px; font-style: normal"
                    >(含运费)</i
                  ></span
                >
                <span class="nowPrice" v-else
                  >¥{{ parseFloat(item.discountPrice).toFixed(2)
                  }}<i style="font-size: 12px; font-style: normal"
                    >(含运费)</i
                  ></span
                >
                <!-- <span class="oldPrice">¥350</span> -->
                <span class="nums">数量：{{ item.buyNum }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="remarksBox">
          <span>订单备注</span>
          <div class="remarksDiv" @click="remarkShow = true">
            <input
              type="text"
              placeholder="无备注"
              v-model="remarks"
              readonly
            />
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="amount">
          共{{ number }}件商品 合计：<i>¥{{ amount }}</i>
        </div>
      </div>
      <div class="payWay">
        <div class="payDiv">
          <!--v-if="discountShow"-->
          <div class="payOne" v-if="couponShow">
            <img src="../../assets/img/coupons.png" alt="" />
            <span class="payName">优惠券</span>
            <span class="payCoupon"
              >{{ discount }}<van-icon name="arrow" color="#999"
            /></span>
          </div>
          <div class="payOne" @click="payCouponFun" v-if="discountShow">
            <img src="../../assets/img/coupons.png" alt="" />
            <span class="payName">优惠券</span>
            <span class="payCoupon"
              >{{ discount }}<van-icon name="arrow" color="#999"
            /></span>
          </div>
          <div class="payOne" @click="hotbigFun">
            <img src="../../assets/img/hotbig.png" alt="" />
            <span class="payName">红包</span>
            <span class="payCoupon"
              >{{ hotbig }}<van-icon name="arrow" color="#999"
            /></span>
          </div>
          <van-radio-group v-model="payment">
            <!-- <h4>选择支付方式</h4> -->
            <div class="payOne" v-show="!miniprogram">
              <img src="../../assets/img/wechat.png" alt="" />
              <span class="payName">微信支付</span>
              <span class="payCheck">
                <van-radio checked-color="#FF6D17" name="1"></van-radio>
              </span>
            </div>
            <div class="payOne" v-show="!miniprogram">
              <img src="../../assets/img/alipay.png" alt="" />
              <span class="payName">支付宝支付</span>
              <span class="payCheck">
                <van-radio checked-color="#FF6D17" name="2"></van-radio>
              </span>
            </div>
            <div class="payOne" v-show="miniprogram">
              <img src="../../assets/img/wechat.png" alt="" />
              <span class="payName">小程序支付</span>
              <span class="payCheck">
                <van-radio checked-color="#FF6D17" name="3"></van-radio>
              </span>
            </div>
            <div class="payOne" v-show="!miniprogram">
              <img
                src="../../assets/img/cloudPay.png"
                alt=""
                style="height: 18px; width: auto"
              />
              <span class="payName"></span>
              <span class="payCheck">
                <van-radio checked-color="#FF6D17" name="4"></van-radio>
              </span>
            </div>
            <div
              class="payOne"
              v-show="!miniprogram && enterType == 1 && isSetPublic == '1'"
            >
              <img src="../../assets/img/public.png" alt="" />
              <span class="payName">公户支付</span>
              <span class="payCheck">
                <van-radio checked-color="#FF6D17" name="5"></van-radio>
              </span>
            </div>
          </van-radio-group>
        </div>
        <div class="amount">
          实付金额：<i>¥{{ total }}</i>
        </div>
      </div>
      <div class="groupHint" v-if="type == 4">
        <h5>团购规则:</h5>
        <p>团长发起拼团后不可取消订单；</p>
        <p>发起拼团后48小时内拼团不成功订单款项将原路返回，原拼团链接失效；</p>
        <p>
          拼团数量达最低购买量后，2小时内扔可继续参与拼团，团长可选择立即提交订单，提交发货后原链接失效。
        </p>
      </div>
      <div style="width: 100%; height: 60px"></div>
      <div class="groupPay">
        <div class="groupPrice">
          <p>
            合计:<i>￥{{ total }}</i>
          </p>
          <span>已优惠:￥{{ disTotal }}</span>
        </div>
        <div class="topay" @click="payNow">{{ payText }}</div>
      </div>
    </div>
    <!-- 优惠券列表 -->
    <div class="couponMask" v-if="showList" @click="couponClose"></div>
    <div
      class="couponPop"
      v-if="showList"
      :class="{ slideIn: showList, slideOut: !showList }"
    >
      <h4>使用优惠券</h4>
      <div class="useCoupon">
        <van-radio-group v-model="couponChoose">
          <div
            class="useOne"
            v-for="(item, index) in couponList"
            :key="index"
            @click="chooseCou(item)"
          >
            <span class="price"
              >￥<i>{{ item.couponPrice }}</i></span
            >
            <div class="name">{{ item.couponName }}</div>
            <div class="describe">满{{ item.couponFullPrice }}元可用</div>
            <div class="describe">
              有效期{{ item.couponStartTime }}至{{ item.couponEndTime }}
            </div>
            <van-radio :name="item.memberCouponId"></van-radio>
          </div>
        </van-radio-group>
      </div>
      <div class="noUseDiv">
        <div class="noUse" @click="noUse(1)">不使用优惠券</div>
      </div>
    </div>
    <div class="couponMask" v-if="hotbigShow" @click="hotbigClose"></div>
    <div
      class="couponPop"
      v-if="hotbigShow"
      :class="{ slideIn: hotbigShow, slideOut: !hotbigShow }"
    >
      <h4>使用红包</h4>
      <div class="useCoupon">
        <van-checkbox-group v-model="hotlist1">
          <div
            class="useOne"
            v-for="(item, index) in hotbigList"
            :key="index"
            @click="choosehotbig(item)"
          >
            <span class="price"
              >￥<i>{{ item.couponPrice }}</i></span
            >
            <div class="name">{{ item.couponName }}</div>
            <div class="describe">满{{ item.couponFullPrice }}元可用</div>
            <div class="describe">
              有效期{{ item.couponStartTime }}至{{ item.couponEndTime }}
            </div>
            <van-checkbox :name="parseInt(item.memberCouponId)"></van-checkbox>
          </div>
        </van-checkbox-group>
      </div>
      <div class="noUseDiv">
        <div class="useQuit" @click="noUse(2)">不使用红包</div>
        <div class="noUse" @click="useHotBig">使用红包</div>
      </div>
    </div>
    <!--订单备注-->
    <van-action-sheet v-model="remarkShow" title="订单备注">
      <div class="content">
        <van-field
          v-model="message"
          rows="6"
          autosize
          type="textarea"
          maxlength="200"
          placeholder="请填写备注信息！"
          show-word-limit
        />
        <div class="ramarkSubmit" @click="remarkSubmit">提交备注</div>
      </div>
    </van-action-sheet>
    <!--订单备注-->
  </div>
</template>

<script>
import {
  Image as VanImage,
  Radio,
  Icon,
  RadioGroup,
  Toast,
  Dialog,
  ActionSheet,
  Field,
  Checkbox,
  CheckboxGroup,
} from "vant"; //引入vant组件
export default {
  name: "ConfirmOrder",
  components: {
    [VanImage.name]: VanImage,
    [Radio.name]: Radio,
    [Icon.name]: Icon,
    [RadioGroup.name]: RadioGroup,
    [Toast.name]: Toast,
    [Dialog.name]: Dialog,
    [ActionSheet.name]: ActionSheet,
    [Field.name]: Field,
    [CheckboxGroup.name]: CheckboxGroup,
    [Checkbox.name]: Checkbox,
  },
  data() {
    return {
      address: {
        // addressId:"",
        // addressName:"",
        // addressPhone:"",
        // addressProvince:"",
        // addressCity:"",
        // addressCounty:"",
        // addressDetail:""
      }, //地址信息
      goodsList: [], //数据列表
      couponList: [], //优惠券列表
      amount: 0, //合计金额
      total: 0, //实付金额
      number: 0, //商品件数
      discountShow: false, //是否显示选用优惠券
      showList: false, //优惠券弹窗是否出现
      couponChoose: 0, //默认选中的优惠券
      discount: "暂无可用优惠券", //优惠金额
      payShow: true, //支付按钮是否可点击
      type: null, //订单类型
      payment: "1", //支付方式 1微信，2支付宝 3微信小程序 4云闪付支付 5公户支付
      delivery: "1", //配送方式 1快递，2自提
      shopData: null, //商家信息
      isMode: 0, //是否允许自提 0不允许 1允许
      miniprogram: false,
      hotbig: "暂无可用红包",
      couponShow: false, //使用优惠券
      hotbigList: [], //红包列表
      hotbigShow: false, //红包弹窗是否出现
      hotbigChoose: 0, //使用红包id
      remarks: "", //备注
      remarkShow: false, //订单备注弹窗是否出现
      message: "", //要填写的备注信息
      enterType: 1, //1从商品页进入 2从购物车进入
      isSetPublic: "0", //是否支持公户支付 0不支持 1支持
      groupId: null, //拼团id
      payText: "立即支付", //支付按钮文字
      skuId: null, //商品规格id
      disTotal: 0, //已优惠金额
      isUse: true, //红包和优惠券是否可以同时使用
      couponTotal: 0, //优惠券优惠的金额
      hotbigTotal: 0, //红包优惠的金额
      hotcouponList: [], //选择红包的列表
      hotlist1: [],
    };
  },
  created() {
    let that = this;
    wx.miniProgram.getEnv(function (res) {
      that.miniprogram = true;
      that.payment = "3";
    });
    this.type = this.$route.query.type;
    this.enterType = this.$route.query.enterType;
    if (this.$route.query.groupId) {
      this.groupId = this.$route.query.groupId;
      this.payText = "参与并支付";
    }
    if (this.$route.query.skuId) {
      this.skuId = this.$route.query.skuId;
    }
    this.goodsList = JSON.parse(sessionStorage.getItem("orderData"));
    let sign = true;
    // console.log(this.goodsList)
    let setPublicSign = true;
    this.goodsList.forEach((item) => {
      if (item.isSetPublic != "1") {
        setPublicSign = false;
      }
      item.shopData.forEach((e) => {
        that.number += e.buyNum;
        //商品是否有规格
        if (this.type == 1 || this.type == 4) {
          that.amount += parseFloat(e.skuPrice).toFixed(2) * e.buyNum;
        } else {
          that.amount += parseFloat(e.discountPrice).toFixed(2) * e.buyNum;
        }
      });
      if (item.isMode != undefined) {
        //从商品页直接进入
        if (item.isMode == 0) {
          sign = false;
        }
      } else {
        //从购物车页面进入
        item.shopData.forEach((e) => {
          if (e.isMode == 0) {
            sign = false;
          }
        });
      }
    });
    if (setPublicSign) {
      this.isSetPublic = "1";
    } else {
      this.isSetPublic = "0";
    }
    // if (sign) {
    //   this.isMode = 1;
    // } else {
    //   this.isMode = 0;
    // }
    this.amount = parseFloat(this.amount).toFixed(2);
    this.total = this.amount;
    let addrData = sessionStorage.getItem("AddrInfo");
    if (addrData) {
      this.address = JSON.parse(addrData);
    } else {
      this.getAddr();
    }
    if (!this.$route.query.mode && !this.$route.query.memberCouponId) {
      //获取优惠券
      this.getCoupon();
      //获取红包
      this.getHotbig();
    }
    //获取商家信息
    this.shopData = JSON.parse(sessionStorage.getItem("shopData"));
    // console.log(this.shopData)
    //商品兑换券
    if (this.$route.query.mode == 1) {
      this.couponShow = true;
      this.discountShow = false;
      this.discount = "商品兑换券";
      this.couponChoose = this.goodsList[0].memberCouponId;
      this.total = 0;
      this.disTotal = this.amount;
    }
    //商品兑换券兑换多规格商品
    if (this.$route.query.memberCouponId) {
      this.couponShow = true;
      this.discountShow = false;
      this.couponChoose = this.$route.query.memberCouponId;
      this.discount = "商品兑换券";
      let disPrice = this.goodsList[0].shopData[0].skuPrice;
      this.disTotal = parseFloat(disPrice).toFixed(2);
      this.total = parseFloat(this.amount - this.disTotal).toFixed(2);
    }
  },
  mounted() {},
  methods: {
    //获取地址
    getAddr() {
      this.$fetch("/jeecg-boot/api/memberAddress/list", {
        pageNo: 1,
        pageSize: 1,
        groupId: this.groupId,
      })
        .then((res) => {
          if (res.result.records.length > 0) {
            this.address = res.result.records[0];
            this.payShow = true;
          }
        })
        .catch(() => {});
    },
    //获取优惠券
    getCoupon() {
      let goodsId = "";
      this.goodsList.forEach((item) => {
        item.shopData.forEach((e) => {
          if (!goodsId) {
            goodsId += e.goodsId;
          } else {
            goodsId = goodsId + "," + e.goodsId;
          }
        });
      });
      this.$fetch("/jeecg-boot/api/coupon/memberCoupon/list", {
        pageNo: 1,
        pageSize: 10,
        memberCouponStatus: "1",
        couponType: "1",
        goodsId: goodsId,
      })
        .then((res) => {
          this.couponList = res.result.records;
          this.couponList.forEach((item) => {
            item.couponStartTime = item.couponStartTime.substring(0, 10);
            item.couponEndTime = item.couponEndTime.substring(0, 10);
          });
          this.couponList = this.couponList.filter(
            (e) => this.amount >= e.couponFullPrice
          );
          if (this.couponList.length > 0) {
            this.discount = "请选择优惠券";
          }
          if (this.type == 1) {
            this.discountShow = true;
          }
        })
        .catch(() => {});
    },
    //选择优惠券
    chooseCou(item) {
      let goodsId = 1985,
        goodsId1 = 2047,
        useGoodsId,
        buyNum,
        isCake = false;
      this.goodsList.forEach((item) => {
        item.shopData.forEach((e) => {
          if (goodsId == e.goodsId) {
            buyNum = parseInt(e.buyNum);
            isCake = true;
          }
          if (goodsId1 == e.goodsId) {
            buyNum = parseInt(e.buyNum);
            isCake = true;
          }
        });
      });
      if (item.isEachDiscount == 1) {
        useGoodsId = item.useGoodsId;
        this.goodsList.forEach((item) => {
          item.shopData.forEach((e) => {
            if (useGoodsId == e.goodsId) {
              buyNum = parseInt(e.buyNum);
              isCake = true;
            }
          });
        });
      }
      if (item.isMeanwhile == "0") {
        this.isUse = false;
      } else {
        this.isUse = true;
      }

      if (this.isUse || this.hotcouponList.length == 0) {
        if (isCake && item.couponType == "5") {
          this.couponChoose = item.memberCouponId;
          this.showList = false;
          this.discount =
            "-￥" + (parseFloat(item.couponPrice) * buyNum).toFixed(2);
          this.total = (
            this.amount -
            parseFloat(item.couponPrice) * buyNum
          ).toFixed(2);
          if (this.total < 0) {
            this.total = 0;
          }
          this.couponTotal = (parseFloat(item.couponPrice) * buyNum).toFixed(2);
          this.disTotal =
            parseFloat(this.couponTotal) + parseFloat(this.hotbigTotal);
          return;
        } else {
          this.couponChoose = item.memberCouponId;
          this.showList = false;
          this.discount = "-￥" + item.couponPrice;
          this.total = (this.amount - parseFloat(item.couponPrice)).toFixed(2);
          if (this.total < 0) {
            this.total = 0;
          }
          this.couponTotal = parseFloat(item.couponPrice).toFixed(2);
          this.disTotal =
            parseFloat(this.couponTotal) + parseFloat(this.hotbigTotal);
        }
      } else {
        Toast("红包和优惠券不能同时使用！");
      }
    },
    //添加收货人信息
    toAddr() {
      this.$router.push({ path: "/mine/edit", query: { Addrtype: 3 } });
    },
    //选择地址
    editAddr() {
      if (!this.groupId) {
        this.$router.push({
          path: "/mine/address",
          query: {
            Addrtype: 1,
            type: this.$route.query.type,
            enterType: this.$route.query.enterType,
          },
        });
      } else {
        Toast("拼团地址不可修改!");
      }
    },
    //立即支付
    payNow() {
      const that = this;
      if (this.payShow) {
        if (this.delivery == 1) {
          if (JSON.stringify(this.address) != "{}") {
            let id = that.goodsList[0].shopData[0].goodsId;
            if (id == 780) {
              that.buyGoods();
            } else if (id == 782) {
              that.buyGoods1();
            } else {
              that.payShow = false;
              that.payFun(that.delivery, that.address.addressId);
            }
            // that.payFun(this.delivery, this.address.addressId);
          } else {
            Dialog.alert({
              message: "请先选择收货地址",
            }).then(() => {
              // on close
            });
          }
        } else if (this.delivery == 2) {
          if (
            this.shopData.departName &&
            this.shopData.servicePhone &&
            this.shopData.businessAddress
          ) {
            that.payShow = false;
            that.payFun(this.delivery);
          } else {
            Dialog.alert({
              message: "商家信息不完整，不能选择自提方式！",
            }).then(() => {
              // on close
            });
          }
        }
      } else {
        Toast("正在支付，请稍等！");
      }
    },
    buyGoods() {
      const that = this;
      if (
        that.address.addressCounty.indexOf("市南区") != -1 ||
        that.address.addressCounty.indexOf("市北区") != -1 ||
        that.address.addressCounty.indexOf("崂山区") != -1 ||
        that.address.addressCounty.indexOf("李沧区") != -1
      ) {
        that.payShow = false;
        that.payFun(that.delivery, that.address.addressId);
      } else if (
        that.address.addressCounty.indexOf("城阳") != -1 ||
        that.address.addressCounty.indexOf("即墨") != -1
      ) {
        if (that.buyNum >= 10) {
          that.payShow = false;
          that.payFun(that.delivery, that.address.addressId);
        } else {
          Dialog.alert({
            message:
              "市南区、市北区、崂山区、李沧区5箱起购，城阳区、即墨区10箱起购，其余地区不支持购买！",
          }).then(() => {
            // on close
          });
        }
      } else {
        Dialog.alert({
          message:
            "市南区、市北区、崂山区、李沧区5箱起购，城阳区、即墨区10箱起购，其余地区不支持购买！",
        }).then(() => {
          // on close
        });
      }
    },
    buyGoods1() {
      const that = this;
      if (
        that.address.addressCounty.indexOf("市南区") != -1 ||
        that.address.addressCounty.indexOf("市北区") != -1 ||
        that.address.addressCounty.indexOf("崂山区") != -1 ||
        that.address.addressCounty.indexOf("李沧区") != -1 ||
        that.address.addressCounty.indexOf("城阳") != -1 ||
        that.address.addressCounty.indexOf("即墨") != -1
      ) {
        that.payShow = false;
        that.payFun(that.delivery, that.address.addressId);
      } else {
        Dialog.alert({
          message:
            "除市南区、市北区、崂山区、李沧区、城阳区、即墨区外，其余地区不支持购买！",
        }).then(() => {
          // on close
        });
      }
    },
    //支付方法
    payFun(disMode, addressId) {
      this.payShow = false;
      let orderGoodsList = [];
      let promotionSeckill = {};
      let promotionPintuanGroup = {};
      //接龙商品参数
      let shopPromotionJielongGroup = {};
      let memberCouponList = [];
      if (this.$route.query.groupId) {
        shopPromotionJielongGroup.groupId = this.$route.query.groupId;
      }
      this.goodsList.forEach((item) => {
        item.shopData.forEach((e) => {
          let one = {
            skuId: e.skuId,
            goodsNum: e.buyNum,
          };
          if (e.seckillId) {
            promotionSeckill.id = e.seckillId;
          }
          if (this.type == 3) {
            if (e.pintuanId) {
              promotionSeckill.id = e.pintuanId;
              promotionPintuanGroup.pintuanId = e.pintuanId;
              promotionPintuanGroup.groupId = "";
            }
            if (e.groupId) {
              promotionPintuanGroup.groupId = e.groupId;
            }
          }
          orderGoodsList.push(one);
        });
      });
      let payData = {
        memberAddressId: addressId,
        memberCouponList: memberCouponList,
        orderGoodsList: orderGoodsList,
        goodsType: "",
        disMode: disMode, //配送方式 1快递 2自提
      };
      // let couponarr = this.couponChoose.split(",");
      // couponarr.forEach((e) => {
      //   let obj = new Object();
      //   obj.memberCouponId = e;
      //   payData.memberCouponList.push(obj);
      // });
      //使用优惠券
      if (this.couponChoose != 0) {
        payData.memberCouponList.push({ memberCouponId: this.couponChoose });
      }
      //使用红包
      if (this.hotcouponList.length > 0) {
        this.hotcouponList.forEach((e) => {
          payData.memberCouponList.push({ memberCouponId: e.memberCouponId });
        });
      }

      if (this.type > 1) {
        payData.promotionSeckill = promotionSeckill;
      }
      if (this.type == 2) {
        payData.goodsType = "promotionSeckill";
      }
      if (this.type == 3) {
        payData.promotionPintuanGroup = promotionPintuanGroup;
        payData.goodsType = "promotionPintuan";
      }

      if (this.type == 4) {
        payData.goodsType = "promotionJielong";
        payData.shopPromotionJielongGroup = shopPromotionJielongGroup;
      }

      let payType = this.payment;
      payData.payType = this.payment;
      payData.remarks = this.remarks;

      if (this.payment == 5) {
        sessionStorage.setItem("payData", JSON.stringify(payData));
        sessionStorage.setItem("payTotal", this.total);
        this.$router.push("/public");
        return;
      }

      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "支付中...",
      });
      this.$post("/jeecg-boot/api/payOrder/order/add", payData)
        .then((res) => {
          // console.log(res)
          if (res.result == 0) {
            Toast("提交成功！");
            this.$router.push("/mine/orders?type=2");
          } else {
            if (payType == 1) {
              if (res.code == 200 && res.result.mweb_url) {
                window.location.href =
                  res.result.mweb_url +
                  "&redirect_url=" +
                  "https%3A%2F%2Fhgyx.qdszgh.cn%2F%23%2Fmine";
                // sessionStorage.removeItem("orderData");
              } else if (res.code == 200 && !res.result.mweb_url) {
                Toast("提交成功！");
                this.$router.push("/mine/orders?type=0");
                // sessionStorage.removeItem("orderData");
              } else if (res.code == 500) {
                Dialog.alert({
                  message: res.message,
                }).then(() => {
                  // on close
                });
              }
            } else if (payType == 2) {
              if (res.code == 200) {
                this.aliPay(res);
              } else {
                Dialog.alert({
                  message: res.message,
                }).then(() => {
                  // on close
                });
              }
            } else if (payType == 3) {
              if (res.code == 200) {
                let type = this.$route.query.type;
                if (type == 4) {
                  wx.miniProgram.navigateTo({
                    url:
                      "/pages/pay/pay?id=" +
                      res.result +
                      "&webUrl=" +
                      encodeURIComponent(
                        "https://hgyx.qdszgh.cn/#/wxGroup?orderId=" + res.result
                      ),
                  });
                } else {
                  wx.miniProgram.navigateTo({
                    url:
                      "/pages/pay/pay?id=" +
                      res.result +
                      "&webUrl=" +
                      encodeURIComponent(
                        "https://hgyx.qdszgh.cn/#/mine/orders?type=0"
                      ),
                  });
                }
              } else {
                Dialog.alert({
                  message: res.message,
                }).then(() => {
                  // on close
                });
              }
            } else if (payType == 4) {
              if (res.code == 200) {
                this.cloudPay(res);
              } else {
                Dialog.alert({
                  message: res.message,
                }).then(() => {
                  // on close
                });
              }
            }
          }
          // this.aliPay(res);
          this.payShow = true;
          Toast.clear();
        })
        .catch(() => {});
    },
    //支付宝支付
    aliPay(res) {
      const div = document.createElement("div");
      div.innerHTML = res.result; //res.result是返回的表单
      document.body.appendChild(div);
      document.forms[0].submit();
      document.body.removeChild(div);
    },
    //云闪付支付
    cloudPay(res) {
      const div = document.createElement("div");
      div.className = "cloudPay";
      div.innerHTML = res.result; //res.result是返回的表单
      document.body.appendChild(div);
      document.forms[0].submit();
      document.body.removeChild(div);
    },
    //关闭优惠券弹窗
    couponClose() {
      setTimeout(() => {
        this.showList = false;
        this.hotbigShow = false;
      }, 500);
    },
    //关闭红包弹窗
    hotbigClose() {
      setTimeout(() => {
        this.hotbigShow = false;
        this.hotbig = "不使用红包";
        this.hotbigChoose = 0;
        this.hotbigTotal = 0;
        this.hotlist1 = [];
        this.hotcouponList = [];
      }, 500);
    },
    //优惠券弹窗是否出现
    payCouponFun() {
      if (this.couponList.length > 0) {
        this.showList = true;
      }
    },
    //获取红包列表
    getHotbig() {
      this.$fetch("/jeecg-boot/api/coupon/memberCoupon/getRedEnvelopesList", {
        pageNo: 1,
        pageSize: 10,
        memberCouponStatus: 1,
      })
        .then((res) => {
          if (res.code == 200) {
            this.hotbigList = res.result.records;
            this.hotbigList.forEach((item) => {
              item.couponStartTime = item.couponStartTime.substring(0, 10);
              item.couponEndTime = item.couponEndTime.substring(0, 10);
            });
            this.hotbigList = this.hotbigList.filter(
              (e) => this.amount >= e.couponFullPrice
            );
            if (this.hotbigList.length > 0) {
              this.hotbig = "请选择红包";
            }
          }
        })
        .catch(() => {});
    },
    //红包弹窗是否出现
    hotbigFun() {
      if (this.hotbigList.length > 0) {
        this.hotbigShow = true;
      }
    },
    //选择红包
    choosehotbig(item) {
      let that = this;
      if (this.isUse) {
        if (this.hotcouponList.length == 0) {
          this.hotcouponList.push({
            memberCouponId: item.memberCouponId,
            couponPrice: item.couponPrice,
          });
        } else {
          this.hotcouponList.forEach((e) => {
            if (item.memberCouponId == e.memberCouponId) {
              that.hotcouponList = that.hotcouponList.filter(
                (event) => item.memberCouponId != event.memberCouponId
              );
            } else {
              that.hotcouponList.push({
                memberCouponId: item.memberCouponId,
                couponPrice: item.couponPrice,
              });
            }
          });
        }
        // this.hotbigChoose = item.memberCouponId;
      } else {
        Toast("红包与优惠券不能同时使用!");
      }
    },
    //使用红包
    useHotBig() {
      let couponPrices = 0;
      this.hotcouponList.forEach((e) => {
        couponPrices += parseFloat(e.couponPrice);
      });
      this.hotbig = "-￥" + couponPrices;
      this.total = (this.amount - parseFloat(couponPrices)).toFixed(2);
      if (this.total < 0) {
        this.total = 0;
      }
      this.hotbigTotal = parseFloat(couponPrices).toFixed(2);
      this.disTotal =
        parseFloat(this.couponTotal) + parseFloat(this.hotbigTotal);
      this.hotbigShow = false;
    },
    //不使用优惠券或红包
    noUse(type) {
      if (type == 1) {
        this.showList = false;
        this.discount = "不使用优惠券";
        this.couponChoose = 0;
        this.couponTotal = 0;
      } else {
        this.hotbigShow = false;
        this.hotbig = "不使用红包";
        this.hotbigChoose = 0;
        this.hotbigTotal = 0;
        this.hotlist1 = [];
        this.hotcouponList = [];
      }
      this.disTotal =
        parseFloat(this.couponTotal) + parseFloat(this.hotbigTotal);
      this.total = parseFloat(this.amount) - this.disTotal;
      this.$forceUpdate();
    },
    //提交备注
    remarkSubmit() {
      if (this.message) {
        this.remarks = this.message;
      }
      this.remarkShow = false;
    },
  },
  destroyed() {
    //页面销毁之后，清除地址缓存
    sessionStorage.removeItem("AddrInfo");
  },
};
</script>

<style lang="scss" scoped>
.confirmOrder {
  // padding-top: 50px;
  i {
    font-style: normal;
  }
  .deliveryDiv {
    background: #fff;
    padding: 12px 12px 0px 12px;
    .deliverySpan {
      float: left;
      img {
        width: 24px;
        margin: 0px 10px 0px 5px;
      }
    }
    .deliveryChecked {
      float: right;
    }
  }
  .deliveryDiv:after {
    content: "";
    display: block;
    clear: both;
  }
  .bySelf {
    padding: 12px 15px;
    background: #fff;
    p {
      font-size: 16px;
      line-height: 1.6;
    }
  }
  .siteInf {
    padding: 12px 15px;
    background: #fff;
    .siteOne {
      padding-left: 43px;
      position: relative;
      min-height: 22px;
      .siteIcon {
        width: 18px;
        height: 18px;
        position: absolute;
        top: 2px;
        left: 5px;
      }
      .name {
        font-size: 16px;
        color: #333;
        font-weight: bold;
        line-height: 22px;
        padding-right: 110px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .phone {
        font-size: 16px;
        color: #333;
        line-height: 22px;
        position: absolute;
        top: 0px;
        right: 0px;
        font-weight: bold;
      }
      .info {
        font-size: 12px;
        color: #333;
        line-height: 22px;
      }
    }
    .siteOne:first-child {
      margin-bottom: 10px;
    }
    .siteLocation {
      padding: 0px 15px 0px 30px;
      position: relative;
      img {
        width: 14px;
        position: absolute;
        top: 50%;
        margin-top: -9px;
        left: 5px;
      }
      h5 {
        font-size: 16px;
        color: #333;
        line-height: 20px;
        font-weight: bold;
        margin-bottom: 6px;
      }
      p {
        font-size: 14px;
        color: #333;
      }
      .van-icon {
        height: 30px;
        line-height: 30px;
        position: absolute;
        right: 0px;
        top: 50%;
        margin-top: -15px;
        color: #666;
      }
    }
    .noAddress {
      text-align: center;
      padding: 10px;
      line-height: 30px;
      font-size: 14px;
      color: #666;
      .van-icon {
        font-size: 20px;
        margin-right: 10px;
        position: relative;
        top: 5px;
      }
    }
  }
  .confirmCont {
    padding: 10px;
    .waresList {
      background: #fff;
      border-radius: 12px;
      margin-bottom: 10px;
      .wareOne {
        padding: 12px;
        border-bottom: 1px #f0f0f0 solid;
        position: relative;
        .wareName {
          margin-bottom: 5px;
          font-size: 16px;
          color: #333;
        }
        .wareDiv {
          position: relative;
          padding: 10px 0px;
        }
        .wareImg {
          width: 75px;
          height: 75px;
          border-radius: 5px;
          overflow: hidden;
          position: absolute;
          top: 10px;
          left: 0px;
          .van-image {
            width: 100%;
            height: 100%;
          }
        }
        .wareInf {
          height: 75px;
          padding-left: 100px;
          position: relative;
          h5 {
            font-size: 14px;
            color: #333;
            line-height: 1.7;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .spec {
            height: 30px;
            line-height: 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
              font-size: 14px;
              color: #666;
              margin-right: 15px;
            }
          }
          .price {
            line-height: 20px;
            position: relative;
            .nowPrice {
              font-size: 16px;
              color: #ff5959;
              font-weight: bold;
              margin-right: 10px;
            }
            .oldPrice {
              font-size: 12px;
              color: #999;
              text-decoration: line-through;
            }
            .nums {
              font-size: 14px;
              color: #666;
              position: absolute;
              top: 0px;
              right: 0px;
            }
          }
        }
      }
    }
    .amount {
      padding: 5px 15px;
      line-height: 30px;
      text-align: right;
      font-size: 14px;
      color: #333;
      i {
        color: #ff5959;
      }
    }
    .payWay {
      background: #fff;
      border-radius: 12px;
      .payDiv {
        padding: 10px 0px;
        border-bottom: 1px #f0f0f0 solid;
        h4 {
          font-size: 14px;
          color: #333;
          line-height: 30px;
          padding: 0px 15px;
          font-weight: normal;
        }
      }
      .payOne {
        padding: 10px 15px;
        line-height: 20px;
        border-bottom: 1px #f7f7f7 solid;
        img {
          width: 18px;
          margin-right: 5px;
        }
        .payName {
          font-size: 14px;
          color: #333;
        }
        .payCoupon {
          font-size: 14px;
          color: #999;
          float: right;
          .van-icon {
            font-size: 16px;
            position: relative;
            top: 3px;
          }
        }
        .payCheck {
          float: right;
        }
      }
      .payOne:after {
        content: "";
        display: block;
        clear: both;
      }
    }
    // .topay {
    //   width: 100%;
    //   height: 42px;
    //   background: linear-gradient(to right, #f39533, #e72e51);
    //   color: #fff;
    //   font-size: 16px;
    //   text-align: center;
    //   line-height: 42px;
    //   border-radius: 22px;
    //   margin: 20px auto;
    // }
  }
  .couponMask {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 11;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.5);
  }
  .couponPop {
    width: 100%;
    max-height: 80%;
    position: fixed;
    z-index: 111;
    left: 0px;
    bottom: 0px;
    background: #f5f5f5;
    border-radius: 10px 10px 0px 0px;
    h4 {
      font-size: 16px;
      text-align: center;
      line-height: 40px;
      color: #333;
    }
    .useCoupon {
      padding: 0px 10px;
      .useOne {
        background: #fff;
        border-radius: 5px;
        margin-bottom: 10px;
        padding: 10px 40px 10px 80px;
        position: relative;
        box-shadow: 0px 0px 5px #ccc;
        .price {
          font-size: 12px;
          color: #666;
          position: absolute;
          top: 50%;
          margin-top: -25px;
          left: 10px;
          line-height: 50px;
          i {
            font-size: 20px;
            color: #ff5959;
          }
        }
        .name {
          font-size: 16px;
          color: #333;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .describe {
          font-size: 12px;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.5;
        }
        .van-radio,
        .van-checkbox {
          position: absolute;
          top: 50%;
          margin-top: -10px;
          right: 10px;
        }
      }
    }
    .noUseDiv {
      width: 90%;
      height: 40px;
      margin: 20px auto;
      display: flex;
      .useQuit {
        width: 40%;
        margin-right: 3%;
        height: 40px;
        border-radius: 20px;
        background: #ccc;
        color: #fff;
        font-size: 16px;
        color: #fff;
        text-align: center;
        line-height: 40px;
      }
      .noUse {
        flex: 1;
        height: 40px;
        border-radius: 20px;
        background: linear-gradient(to right, #f39533, #e72e51);
        color: #fff;
        font-size: 16px;
        color: #fff;
        text-align: center;
        line-height: 40px;
      }
    }
  }
  .slideIn {
    animation: slideIn 0.3s;
  }
  .slideOut {
    animation: slideOut 0.3s;
  }
  .remarksBox {
    height: 40px;
    line-height: 30px;
    position: relative;
    padding: 5px 12px 5px 90px;
    span {
      font-size: 14px;
      color: #333;
      position: absolute;
      top: 5px;
      left: 12px;
    }
    .remarksDiv {
      padding-right: 15px;
      position: relative;
      input {
        font-size: 14px;
        color: #333;
        background: #fff;
        text-align: right;
        width: 100%;
      }
      .van-icon {
        height: 30px;
        position: absolute;
        right: 0px;
        line-height: 30px;
        text-align: center;
        color: #999;
        font-size: 16px;
        top: 1px;
      }
    }
  }
  /deep/.van-cell__value {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 10px;
  }
  /deep/.van-field__control {
    font-size: 14px;
    color: #999;
  }
  .ramarkSubmit {
    width: 80%;
    height: 42px;
    background: linear-gradient(to left, #fa3d29 0%, #fa4632 50%, #ff692b 100%);
    color: #fff;
    font-size: 16px;
    text-align: center;
    line-height: 42px;
    margin: 50px auto;
    border-radius: 22px;
  }
  .groupSite {
    background: #fff;
    margin-bottom: 10px;
    padding: 10px 15px;
    h5 {
      font-size: 14px;
      color: #333;
      line-height: 30px;
      font-weight: normal;
      i {
        margin-left: 10px;
        color: #ff5959;
      }
    }
  }
  .groupHint {
    padding: 20px 0px;
    h5 {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }
    p {
      font-size: 14px;
      color: #999;
      line-height: 1.5;
    }
  }
  .groupPay {
    width: 100%;
    padding: 5px 10px;
    background: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    .groupPrice {
      width: 54%;
      p {
        font-size: 14px;
        color: #666;
        line-height: 26px;
        i {
          font-size: 18px;
          color: #e72e51;
        }
      }
      span {
        font-size: 14px;
        color: #ff5959;
        line-height: 20px;
      }
    }
    .topay {
      width: 46%;
      height: 42px;
      background: linear-gradient(
        to left,
        #fa3d29 0%,
        #fa4632 50%,
        #ff692b 100%
      );
      color: #fff;
      font-size: 16px;
      text-align: center;
      line-height: 42px;
      border-radius: 22px;
    }
  }
}
@keyframes slideIn {
  0% {
    bottom: -1000px;
  }
  100% {
    bottom: 0px;
  }
}
@keyframes slideOut {
  0% {
    bottom: 0px;
  }
  100% {
    bottom: -1000px;
  }
}
</style>
