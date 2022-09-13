import axios from "axios";
import qs from "qs"
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";

// axios.defaults.baseURL = "https://livephone.qdszgh.cn" // 测试
axios.defaults.baseURL = "https://testlivephone.qdszgh.cn"

//设置超时时间
axios.defaults.timeout = 300000
//添加请求拦截器
axios.interceptors.request.use((config) => {
    //在发送请求之前做某事
    const store = userStore();
    const { token } = storeToRefs(store);
    if (token.value) {
        config.headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': token.value,
            'Authorization': 'Bearer' + token.value,
        }
    } else {
        config.headers = {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    }
    return config
}, (error) => {
    //请求错误时做些事
    return Promise.reject(error);
});

//添加响应拦截器
axios.interceptors.response.use((response) => {
    //对响应数据做些事
    if (response.status == 200) {
        return Promise.resolve(response);
    }
}, (error) => {
    return Promise.reject(error)
})


/**
 * 封装get方法
 * @param {string} url 路径
 * @param {object} data
 * @returns {Promise}
 */

export function get(url: string, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
            .then(response => {
                resolve(response)
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url: string, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url: string, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url: string, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装delete请求
 * @param url
 * @returns {Promise}
 */

export function deletes(url: string) {
    return new Promise((resolve, reject) => {
        axios.delete(url)
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
    })
}

/*
 * 文件上传
 */

export function uploadAction(url: string, parameter = {}) {
    return axios({
        url: url,
        data: parameter,
        method: 'post',

    })

}


export default axios