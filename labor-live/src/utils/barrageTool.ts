/**
 * @desc 函数防抖
 * @param {需要防抖的函数} func
 * @param {延迟时间} wait
*/

// import { setTimeout } from "core-js";

export function debounce(func: Function, wait = 3000) {
    //缓存一个定时器 id
    let timer: any = null;
    //这里返回的函数是每次用户实际调用的防抖函数
    //如果已经设定过定时器了就清空上一次的定时器
    //开始一个新的定时器，延迟执行用户传入的方法

    // return function (...args: any) {
    //     if (timer) clearTimeout(timer)
    //     timer = setTimeout(() => {
    //         func.apply(this, args)
    //     }, wait)
    // }

    return function (this: any) {
        let args = arguments;
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, wait)
    }
}

/**
 * @desc 是否滚到容器底部
 * @param {滚动容器} ele
 * @param {容器高度} wrapHeight
*/

export function isScrollBottom(ele: any, wrapHeight: number, threshold = 30) {
    const h1 = ele.scrollHeight - ele.scrollTop;
    const h2 = wrapHeight + threshold;
    const isBottom = h1 <= h2;
    return isBottom
}

/**
 * 判断iphone型号
 * https://feizhaojun.com/?p=2650
 */
declare const labor: any
export function getPhoneType() {
    let isBigScreen = false; //默认iphone不是全面屏
    let ua = window.navigator.userAgent;
    let deviceScreen = window.screen.width + ',' + window.screen.height;
    let iPhoneScreen = [
        '375,812',  // X、XS、11 Pro
        '414,896',  // XR、11、Xs Max、11 Pro Max
        '390,844',  // 12、12 Pro
        '428,926',  // 12 Pro Max
    ]
    //ua.indexOf('MicroMessenger') > -1
    if ((ua.indexOf('MicroMessenger') > -1 || labor.isApp()) && !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) && iPhoneScreen.indexOf(deviceScreen) > -1) {
        isBigScreen = true;
    }
    return isBigScreen;
}

/**
 * 判断机型是普通屏幕还是全面屏幕
 */
export function judgeBigScreen() {  //这里根据返回值 true 或 false 返回true的话 则为全面屏
    let result = false;
    let rate = window.screen.height / window.screen.width;
    let limit = window.screen.height == window.screen.availHeight ? 1.8 : 1.65; //临界判断值


    //window.screen.height 为屏幕高度
    //window.screen.availHeight 为浏览器 可用高度
    if (rate > limit) {
        result = true;
    }

    return result;

}
