import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { AppRouteMetaConfig } from "@/types/router"
import { objectToString } from '@vue/shared'
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
import axios from 'axios'
import { Toast } from "vant";
declare const labor: any

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: "/live",
    },
    {
        path: '/live',
        name: "live",
        meta: {
            title: "观看直播",
        },
        component: () => import('@/views/Live/Live.vue')
    },
    {
        path: '/home',
        name: "home",
        meta: {
            title: "观看直播",
        },
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/guide',
        name: "guide",
        meta: {
            title: "观看直播",
        },
        component: () => import('@/views/Guide/Guide.vue')
    },
    {
        path: '/confirmOrder',
        name: "confirmOrder",
        meta: {
            title: "确认订单",
        },
        component: () => import('@/views/ConfirmOrder/ConfirmOrder.vue')
    },
    {
        path: '/giveRecord',
        name: "giveRecord",
        meta: {
            title: "赠送记录",
        },
        component: () => import('@/views/Record/GiveRecord.vue')
    },
    {
        path: '/orderRecord',
        name: "orderRecord",
        meta: {
            title: "订单记录",
        },
        component: () => import('@/views/Record/OrderRecord.vue')
    },
    {
        path: '/prizeRecord',
        name: "prizeRecord",
        meta: {
            title: "中奖记录",
        },
        component: () => import('@/views/Record/PrizeRecord.vue')
    },
    {
        path: '/prizeRecordDetail/:id',
        name: "prizeRecordDetail",
        meta: {
            title: "获奖详情",
        },
        component: () => import('@/views/Record/PrizeRecordDetail.vue')
    },
    {
        path: '/lottery',
        name: "lottery",
        meta: {
            title: "幸运抽奖",
        },
        component: () => import('@/views/Lottery/Lottery.vue')
    },
    {
        path: '/receiveAddress',
        name: "receiveAddress",
        meta: {
            title: "幸运抽奖",
        },
        component: () => import('@/views/Lottery/ReceiveAddress.vue')
    },
    {
        path: '/rank',
        name: "rank",
        meta: {
            title: "排行榜",
        },
        component: () => import('@/views/Rank/Rank.vue')
    },
    {
        path: '/forbidden',
        name: "forbidden",
        component: () => import('@/views/Forbidden/Forbidden.vue')
    },
    {
        path: '/remind',
        name: "remind",
        component: () => import('@/views/Remind/Remind.vue')
    },
    {
        path: '/luckyManage',
        name: "luckyManage",
        meta: {
            title: "福袋管理",
        },
        component: () => import('@/views/Manage/LuckyManage.vue')
    },
    {
        path: '/turnplateManage',
        name: "turnplateManage",
        meta: {
            title: "抽奖管理",
        },
        component: () => import('@/views/Manage/TurnplateManage.vue')
    },
    {
        path: '/winUser/:id',
        name: "winUser",
        meta: {
            title: "中奖名单",
        },
        component: () => import('@/views/Manage/WinUser.vue')
    },
    {
        path: '/joinUser/:id',
        name: "joinUser",
        meta: {
            title: "参与名单",
        },
        component: () => import('@/views/Manage/JoinUser.vue')
    },
    {
        path: '/muteManage',
        name: "muteManage",
        meta: {
            title: "禁言管理",
        },
        component: () => import('@/views/Manage/MuteManage.vue')
    },
    {
        path: '/adminManage',
        name: "adminManage",
        meta: {
            title: "管理员管理",
        },
        component: () => import('@/views/Manage/AdminManage.vue')
    },
    {
        path: '/plive',
        name: "plive",
        meta: {
            title: "图文直播",
        },
        component: () => import('@/views/Manage/Plive.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(), //hash模式
    routes
})


//获取齐鲁工惠用户信息
function getInfo() {
    return new Promise(function (resolve, reject) {
        labor.getLaborStatus(function (res: any) {
            if (res.laborStatus == "" || res.laborStatus == 0) {
                //代表齐鲁工惠App未注册认证会员
                reject('/forbidden')
            } else {
                labor.getUserInfo(function (obj: any) {
                    //非齐鲁工惠进入
                    if (obj.error == 'no data') {
                        reject('/remind')
                    } else {
                        interface UserInfo {
                            memberId: string;
                            fullName: string;
                            userPhone: number;
                            laborId: number;
                            laborName: string;
                            userIcon: string;
                            sex: string;
                            laborBirthday: string;
                            districtCode: string
                            laborCode: string
                        }
                        const userInfo: UserInfo = {
                            memberId: obj.memberId,
                            fullName: obj.fullName,
                            userPhone: obj.userPhone,
                            laborId: obj.laborId,
                            laborName: obj.laborName,
                            userIcon: obj.userIcon,
                            sex: obj.sex,
                            laborBirthday: obj.birthday,
                            districtCode: obj.districtCode ? obj.districtCode.substring(0, 6) : obj.laborCode.substring(0, 6),
                            laborCode: obj.laborCode
                        };
                        resolve(userInfo)
                    }
                })
            }
        })

    })
}

//获取登录接口信息
function login(userInfo: any) {
    return new Promise(function (resolve, reject) {
        axios.post(axios.defaults.baseURL + '/jeecg-boot/sys/phoneRegisterOrLogin', userInfo).then(res => {
            if (res.data.result.token) {
                const store = userStore();
                const { token, userId, userPhone } = storeToRefs(store);
                store.$patch({
                    token: res.data.result.token,
                    userId: res.data.result.userInfo.id,
                    userPhone: res.data.result.userInfo.phone
                });
                resolve('success')
            } else {
                reject()
            }
        }).catch(() => {
            reject()
        })
    })
}

//获取匿名游客登录接口信息
function visitorLogin() {
    return new Promise(function (resolve, reject) {
        axios.post(axios.defaults.baseURL + '/jeecg-boot/sys/phoneAnonymousLogin').then(res => {
            if (res.data.result.token) {
                const store = userStore();
                const { token, userId, laborApp } = storeToRefs(store);
                store.$patch({
                    token: res.data.result.token,
                    userId: res.data.result.userInfo.id,
                    laborApp: false
                });
                resolve('success')
            } else {
                reject()
            }
        }).catch(() => {
            reject()
        })
    })
}


router.beforeEach((to, from, next) => {
    const meta = to.meta as AppRouteMetaConfig;
    document.title = meta.title ? meta.title : "工会直播"
    const store = userStore();
    const { token, liveId } = storeToRefs(store);
    if (to.query.liveId) {
        store.$patch({
            liveId: String(to.query.liveId),
        });
    }
    store.$patch({
        token: store.token,
    });
    if (!token.value) {
        let userInfo = window.sessionStorage.getItem('userInfo');
        if (userInfo) {
            login(userInfo).then(() => {
                next()
            }).catch(() => {
                Toast.fail('登录失败');
                next()
            })
        } else {
            if (to.path != '/forbidden' && to.path !== '/remind' && labor.isApp()) {
                getInfo().then((event) => {
                    let user = event;
                    window.sessionStorage.setItem('userInfo', JSON.stringify(user));
                    login(user).then(() => {
                        next()
                    }).catch(() => {
                        Toast.fail('登录失败');
                        next()
                    })
                }).catch((error) => {
                    next(error)
                })
            } else {
                visitorLogin().then(() => {
                    next()
                })

            }
        }
    } else {
        next();
    }
})

export default router