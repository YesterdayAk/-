

import { createApp } from "vue"
import App from "./App.vue"  //引入 App 页面组件
import store from "./store"
import router from "./router"


//引入rem.js文件
import './modules/rem'
//引入main.scss样式文件
import "./stylesheets/main.scss"
//引入vant插件

import { Image as VanImage, CountDown, Search, PullRefresh, NavBar, NumberKeyboard, Toast, Button, List, Form, Field, Area, Popup, Cell, CellGroup, ActionSheet, Dialog, Uploader, ImagePreview, Empty, Stepper } from 'vant';


// 引入动画库
import "animate.css"
//引入video-js样式文件
import 'video.js/dist/video-js.css'
import 'videojs-markers/dist/videojs.markers.css'
import 'videojs-markers'
import 'videojs-landscape-fullscreen'
//引入vconsole
// import Vconsole from "vconsole";
// let vConsole = new Vconsole;
//引入lucky-canvas
import VueLuckyCanvas from '@lucky-canvas/vue'
//引入axios
import axios from "./utils/request";
const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.use(store).use(router).use(NavBar).use(NumberKeyboard).use(Toast).use(Button).use(List).use(Form).use(Field).use(Area).use(Popup).use(Cell).use(CellGroup).use(ActionSheet).use(Search).use(PullRefresh).use(VanImage).use(CountDown).use(Dialog).use(Uploader).use(ImagePreview).use(Empty).use(Stepper).use(VueLuckyCanvas).mount('#app');