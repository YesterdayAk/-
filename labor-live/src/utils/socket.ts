import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
/**
 * @description 封装socket方法
 */

import { Toast } from "vant";
// const Base64 = require('js-base64').Base64
import { Base64 } from "js-base64"

interface socket {
    websocket: any
    connectURL: string
    socket_open: boolean
    hearbeat_timer: any
    hearbeat_interval: number
    is_reconnect: boolean
    reconnect_count: number
    reconnect_current: number
    reconnect_number: number
    reconnect_timer: any
    reconnect_interval: number

    init: (receiveMessage: Function | null) => any
    receive: (message: any) => void
    heartbeat: () => void
    send: (data: any, callback?: any) => void
    close: () => void
    reconnect: () => void
}
const store = userStore();
const { liveId, userId } = storeToRefs(store);
const socket: socket = {
    websocket: null,
    // connectURL: "wss://websocket.qdszgh.cn:8443/jeecg-boot/liveWebsocket/" + liveId.value + '/' + userId.value,
    connectURL: "wss://websocket.qdszgh.cn:8443/jeecg-boot/testLiveWebsocket/" + liveId.value + '/' + userId.value,
    //开启标识
    socket_open: false,
    //心跳timer
    hearbeat_timer: null,
    //心跳发送频率
    hearbeat_interval: 60000,
    //是否自动重连
    is_reconnect: true,
    //重连次数
    reconnect_count: 3,
    //已发起重连次数
    reconnect_current: 1,
    //网络错误提示此时
    reconnect_number: 0,
    //重连timer
    reconnect_timer: null,
    //重连频率
    reconnect_interval: 5000,


    init: (receiveMessage: Function | null) => {
        if (!('WebSocket' in window)) {
            Toast.fail("浏览器不支持websocket");
            return null
        }
        socket.websocket = new WebSocket(socket.connectURL)
        socket.websocket.onmessage = (e: any) => {
            if (receiveMessage) {
                receiveMessage(e)
            }
        }

        socket.websocket.onclose = (e: any) => {
            clearInterval(socket.hearbeat_interval)
            socket.socket_open = false;

            //需要重新连接
            if (socket.is_reconnect) {
                socket.reconnect_timer = setTimeout(() => {
                    //超过重连次数
                    if (socket.reconnect_current > socket.reconnect_count) {
                        clearTimeout(socket.reconnect_timer)
                        socket.is_reconnect = false;
                        return
                    }


                    //记录重连次数
                    socket.reconnect_current++
                    socket.reconnect()
                }, socket.reconnect_interval)
            }
        }

        //连接成功
        socket.websocket.onopen = function () {
            socket.socket_open = true
            socket.is_reconnect = true
            //开启心跳
            socket.heartbeat()
        }

        //连接发生错误
        socket.websocket.onerror = function () { }
    },


    send: (data, callback = null) => {
        //开启状态直接发送
        if (socket.websocket.readyState == socket.websocket.OPEN) {
            socket.websocket.send(JSON.stringify(data))
            if (callback) {
                callback()
            }

            //正在开启状态，则等待1s后调用
        } else {
            clearInterval(socket.hearbeat_timer)
            if (socket.reconnect_number < 1) { }
            socket.reconnect_number++
        }
    },


    receive: (message: any) => {
        // let params = Base64.decode(JSON.parse(message.data).data)
        let params = Base64.decode(JSON.parse(message.data))
        params = JSON.parse(params)
        return params
    },

    heartbeat: () => {
        if (socket.hearbeat_timer) {
            clearInterval(socket.hearbeat_timer)
        }

        socket.hearbeat_timer = setInterval(() => {
            let data = {
                content: 'ping'
            }
            let sendDara = {
                encryption_type: 'base64',
                data: Base64.encode(JSON.stringify(data))
            }
            socket.send(sendDara)
        }, socket.hearbeat_interval)
    },

    close: () => {
        clearInterval(socket.hearbeat_interval)
        socket.is_reconnect = false
        socket.websocket.close()
    },


    /**
     * 重新连接
     */

    reconnect: () => {
        if (socket.websocket && !socket.is_reconnect) {
            socket.close()
        }

        socket.init(null)
    }
}

export default socket

