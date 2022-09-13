import { ref, computed } from "vue"
import { defineStore } from "pinia";
import { CommentListConfig } from "@/types/introduce";


// 使用composition API模式定义store
export const userStore = defineStore('user', () => {
    /**
     * @descriptipn 用户信息，权限处理
     */
    const token = ref<string>('');
    const liveId = ref<string>('') //直播间id
    const userId = ref<string>('') //用户唯一id
    const userPhone = ref<string>('') //用户手机号
    const isAdmin = ref<string>('') //默认不是管理员
    const liveTitle = ref<string>('') //直播主题
    const liveBrowse = ref<string>('') //直播浏览量
    const liveDescribe = ref<string>('') //直播描述
    const screenSizeType = ref<string>('') //默认从图文直播进入视频直播为横屏
    const laborApp = ref<boolean>(true) //默认是齐鲁工惠app环境
    const isFirstApp = ref<boolean>(true) //默认是初始进入齐鲁工惠
    const count = ref<number>(1);
    const commentList = ref<CommentListConfig[]>([]);
    const richTxtList = ref<CommentListConfig[]>([]);
    const buyGoodsInfo = ref<any>({
        shopName: ref<string>(''), //商家名称
        buyNum: ref<number>(0), //购买数量
        goodsName: ref<string>(''), //商品名称
        picture: ref<string>(''), //商家图片
        goodsId: ref<number>(0), //商品id
        skuPrice: ref<number>(0), //商品价格
        skuId: ref<number>(0), //商品规格id
        specName: ref<string>(''), //商品规格名称
    })
    const doubleCount = computed(() => {
        return count.value * 2
    });

    return {
        token,
        liveId,
        userId,
        userPhone,
        isAdmin,
        liveTitle,
        liveBrowse,
        liveDescribe,
        screenSizeType,
        laborApp,
        isFirstApp,
        count,
        commentList,
        doubleCount,
        richTxtList,
        buyGoodsInfo

    }
}, {
    persist: {
        enabled: true
    }
})

