"use strict";(self.webpackChunklabor_live=self.webpackChunklabor_live||[]).push([[581],{1098:(e,n,s)=>{s.r(n),s.d(n,{default:()=>Ye});var t=s(6252),i=s(3577),o=s(9963);var r=s(1077),a=s(4127),l=s(2536),c=(s(4994),s(2805),s(2853),function(e){return(0,t.dD)("data-v-27431c0e"),e=e(),(0,t.Cn)(),e}),u={class:"home"},m={class:"headerBox"},d={class:"header"},g={class:"header-top"},v=[c((function(){return(0,t._)("img",{src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAA20lEQVQoU5XRvUoDYRCF4WcSLUSwsLRT/NuApVhYeB+CCGmsFAt7bb0CbW1svA1vIboQUBEUbG2MoPlkI5Etdsl6qmHgnTlzJpSU1mxr24g7l+N2ylwYOItHb+NeFEUiLJkzFGbcCHsGPkxb0XLo09EIePAepEjrdoRrYaG8tbJOXiW7kTJ9YXki8OdXP1KncPc/VUPfutoOsFU1rhoaWpR7lukK55gvw7VQ5J5Gyf6+4bYRJPcicyycYrYJdKKli07zmyaEWdzUq5tYw/Yirdo05QpZg2/d+7L/AzzsQuWI7cAQAAAAAElFTkSuQmCC",alt:""},null,-1)})),c((function(){return(0,t._)("span",{class:"message"},"视频直播",-1)}))],p={class:"contentBox"},f={class:"content"},h={class:"content-center"},w={class:"introduce",ref:"introduce"},b={class:"introduce-top"},y={class:"stream"},E=c((function(){return(0,t._)("div",{class:"stream-status"},[(0,t._)("img",{src:r,alt:""}),(0,t._)("span",{class:"message"},"直播中")],-1)})),x={class:"stream-theme"},H={class:"title"},A={class:"introduce-bottom"},I={class:"introduce-bottom-right"},M={class:"browse"},k=c((function(){return(0,t._)("img",{src:a,alt:""},null,-1)})),L={class:"number"},T={class:"review"},q={class:"content-bottom",ref:"contentBottom"},B={class:"send",ref:"send"},Y={class:"send-left"},O=["placeholder","disabled"],N={key:0,class:"send-center"},D=(0,t.Uk)("发送"),F={key:1,class:"send-right"},U=c((function(){return(0,t._)("img",{src:l,alt:"",style:{width:"36px"}},null,-1)})),z=c((function(){return(0,t._)("span",{class:"message"},null,-1)})),Z={class:"restBox"},G={class:"rest"},P={class:"rest-top"},J={class:"account"},S=c((function(){return(0,t._)("span",{class:"title"},"剩余：",-1)})),Q={class:"number"},j={class:"rest-center"},C={class:"chat"},R=c((function(){return(0,t._)("div",{class:"chat-top"},[(0,t._)("span",{class:"title"},"聊天室功能")],-1)})),W={class:"chat-bottom"},X=c((function(){return(0,t._)("img",{src:l,alt:""},null,-1)})),K=c((function(){return(0,t._)("span",{class:"message"},"发图片",-1)})),V=["src"];var _=s(655),$=s(2262),ee=s(4949),ne=s(1751),se=(s(4333),{class:"barrage"}),te={class:"comment"},ie={class:"content",ref:"list"},oe={key:0,class:"container-top"},re={class:"timeBox"},ae={class:"information"},le=["src"],ce=function(e){return(0,t.dD)("data-v-96438072"),e=e(),(0,t.Cn)(),e}((function(){return(0,t._)("span",{class:"adminLabel"},"管理员",-1)})),ue={class:"name"},me={class:"messageBox"},de=["src","onClick"],ge={key:1,class:"message"};var ve=s(6486),pe=s(8851),fe=s(523),he=s.n(fe),we=s(5296),be=s(5869),ye=(s(5881),s(5759)),Ee=s(5684);he().polyfill();const xe=(0,t.aZ)({name:"barrageImg",props:{isExpression:Boolean,commentMessage:String,movieHeight:Number,introduceHeight:Number,sendHeight:Number},setup:function(e,n){var s=this,i=((0,t.FN)().appContext.config.globalProperties.$axios,(0,$.qj)({commentWrapHeight:{height:""},expressionHeight:0,commentList:[],restNums:0,wrapperDom:(0,$.iH)(null),listDom:(0,$.iH)(null),wrapperHeight:0,isBigScreen:!1,isBindScrolled:!1}));function o(){i.commentWrapHeight.height=window.innerHeight-i.expressionHeight+"px"}(0,t.m0)((function(){i.isBigScreen=(0,pe.ct)(),e.isExpression&&i.isBigScreen?i.expressionHeight=e.movieHeight+e.introduceHeight+10+e.sendHeight+35+160:e.isExpression&&!i.isBigScreen?i.expressionHeight=e.movieHeight+e.introduceHeight+10+e.sendHeight+160:!e.isExpression&&i.isBigScreen?i.expressionHeight=e.movieHeight+e.introduceHeight+10+e.sendHeight+35:e.isExpression||i.isBigScreen||(i.expressionHeight=e.movieHeight+e.introduceHeight+10+e.sendHeight),window.addEventListener("resize",o())}));var r=(0,$.iH)(null),a=(0,$.iH)(null);function l(){r.value&&(i.listDom=a,i.wrapperHeight=r.value.offsetHeight,i.wrapperDom=r)}var c=ve.throttle((function(e){return(0,_.mG)(s,void 0,void 0,(function(){var n;return(0,_.Jh)(this,(function(s){return n={message:e,pushType:"0",messageType:"0"},we.Z.send(n),[2]}))}))}),3e3,{leading:!0,trailing:!1});function u(){(0,pe.Ds)(m(),200),i.isBindScrolled=!0}function m(){var e=i.wrapperDom;(0,pe.zK)(e,e.clientHeight)&&(i.restNums=0)}function d(){(0,t.Y3)((function(){r.value&&(r.value.scrollTop=r.value.scrollHeight)}))}function g(e){i.commentList.length,i.commentList.push(e),v.$patch({richTxtList:i.commentList}),(0,t.Y3)((function(){h()}))}var v=(0,ye.H)(),p=(0,Ee.Jk)(v).richTxtList;function f(){i.commentList=p.value,d()}function h(){var n=i.listDom.offsetHeight,s=e.isExpression?n-i.wrapperHeight+160:n-i.wrapperHeight;s-i.wrapperDom.scrollTop<1.5*i.listDom.lastElementChild.offsetHeight?s>0&&(i.isBindScrolled&&(i.isBindScrolled=!1,i.wrapperDom.removeEventListener("scroll",u())),i.wrapperDom.scrollTo({top:s+10,left:0,behavior:"smooth"}),i.restNums=0):(++i.restNums,i.isBindScrolled||(i.isBindScrolled=!0,i.wrapperDom.addEventListener("scroll",u())))}return(0,t.bv)((function(){return(0,_.mG)(s,void 0,void 0,(function(){return(0,_.Jh)(this,(function(e){switch(e.label){case 0:return[4,l()];case 1:return e.sent(),[4,f()];case 2:return e.sent(),[2]}}))}))})),(0,t.Ah)((function(){window.removeEventListener("resize",o())})),(0,_.pi)((0,_.pi)({},(0,$.BK)(i)),{initDom:l,wrapper:r,list:a,addTimeOut:function(e){return new Promise((function(n,s){setTimeout((function(){g(e),n("success")}),500)}))},quene:c,addScroll:u,listScroll:m,scrollBottom:d,addComment:g,renderComment:h,getCommentHeight:o,getCommentMessage:function(){c(e.commentMessage,"0")},handleTouch:function(e){e._isScroller=!0,n.emit("inputBlur")},showImg:function(e,s){var t={url:e,type:s};n.emit("showImg",t)},getPhoto:function(){console.log("send img!"),c("base64","1")},imagePreview:function(e){(0,be.Z)([e])},getCommentInfo:f})}});var He=s(3744);const Ae=(0,He.Z)(xe,[["render",function(e,n,s,o,r,a){return(0,t.wg)(),(0,t.iD)("div",se,[(0,t._)("div",te,[(0,t._)("div",{class:"comment-wrap",ref:"wrapper",style:(0,i.j5)(e.commentWrapHeight),onTouchmove:n[0]||(n[0]=function(){for(var n=[],s=0;s<arguments.length;s++)n[s]=arguments[s];return e.handleTouch&&e.handleTouch.apply(e,n)})},[(0,t._)("div",ie,[((0,t.wg)(!0),(0,t.iD)(t.HY,null,(0,t.Ko)(e.commentList,(function(n){return(0,t.wg)(),(0,t.iD)("div",{class:"container",key:n.id},[0==n.pushType?((0,t.wg)(),(0,t.iD)("div",oe,[(0,t._)("div",re,(0,i.zw)(n.createTime),1),(0,t._)("div",ae,[(0,t._)("img",{class:"profile",src:n.avatar,alt:""},null,8,le),ce,(0,t._)("span",ue,(0,i.zw)(n.realname)+" : ",1),(0,t._)("div",me,[(0,t.kq)(' <span v-if="item.messageType==0" class="message">{{ item.message }}</span>\r\n                     <div v-if="item.messageType==1" @click="showImg(item.message,1)">\r\n                          <van-image fit="fill" class="imgBox"  :src="item.message" />\r\n                     </div>\r\n                     <div v-if="item.messageType==2" @click="showImg(item.message,2)">\r\n                          <video  class="imgBox"  :src="item.message" />\r\n                     </div> '),-1!=n.message.indexOf(".png")||-1!=n.message.indexOf(".jpeg")||-1!=n.message.indexOf(".jpg")?((0,t.wg)(),(0,t.iD)("img",{key:0,src:n.message,class:"imgBox",onClick:function(s){return e.imagePreview(n.message)},alt:""},null,8,de)):((0,t.wg)(),(0,t.iD)("span",ge,(0,i.zw)(n.message),1))])])])):(0,t.kq)("v-if",!0)])})),128))],512)],36)])])}],["__scopeId","data-v-96438072"]]);var Ie=s(8935),Me=s(1509),ke=s(8095),Le=s(1610);const Te=s.p+"e9a4d11550afb151cf6a.png";var qe=new ke.xd(Me,{emojisToShowFilter:function(e){return!0},exclude:["search","recent","people","nature","foods","activity","objects","symbols","flags","custom"]});const Be=(0,t.aZ)({name:"home",components:{BarrageImg:Ae,Picker:ke.cW,Present:Ie.Z},setup:function(){var e=(0,ee.tv)(),n=((0,ee.yj)(),(0,t.FN)().appContext.config.globalProperties.$axios),s=(0,$.qj)({emojiIndex:qe,isExpression:!1,message:"",isForbidden:!0,chatType:(0,$.iH)(""),movieHeight:0,introduceHeight:0,sendHeight:0,givePresentList:(0,$.iH)([]),showAccess:!1,showPresent:!1,showMore:!1,mediaUrl:"",mediaType:0,liveTitle:"",liveBrowse:"",screenSizeType:""}),i=(0,$.iH)(null),o=(0,$.iH)(null),r=(0,$.iH)(null),a=(0,$.iH)(null),l=(0,$.iH)(),c=(0,$.iH)(null);document.body.addEventListener("touchmove",(function(e){e._isScroller||e.preventDefault()}),{passive:!1});var u=function(){i.value&&(s.movieHeight=i.value.offsetHeight),o.value&&(s.introduceHeight=o.value.offsetHeight),r.value&&(s.sendHeight=r.value.offsetHeight)};(0,t.YP)((function(){return s.givePresentList}),(function(e){e.length&&setTimeout((function(){s.showAccess=!1}),2e3)}));var m=function(){(0,Le.U2)(n.defaults.baseURL+"/jeecg-boot/api/liveAdmin/list",{liveId:p.value}).then((function(e){if(200==e.data.code&&e.data.result){var n=e.data.result.records;if(n.length>0)for(var t=0;t<n.length;t++)n[t].userId==f.value&&0!=n[t].isAdmin&&(console.log(n[t].userId),s.isForbidden=!1)}}))},d=(0,$.iH)("wss://websocket.qdszgh.cn:8443/jeecg-boot/testLiveImageTextWebsocket/"),g=(0,ye.H)(),v=(0,Ee.Jk)(g),p=v.liveId,f=v.userId,h=v.liveTitle,w=v.liveBrowse,b=v.screenSizeType;function y(e){var n;return(0,_.mG)(this,void 0,void 0,(function(){var s,t,i;return(0,_.Jh)(this,(function(o){switch(o.label){case 0:return s=JSON.parse(e.data),"0"!=(t=JSON.parse(JSON.stringify(s))).pushType?[3,2]:(i={id:Date.now(),avatar:t.avatar,handlerName:t.handlerName,liveId:t.liveId,message:t.message,messageType:t.messageType,pushType:t.pushType,realname:t.realname},[4,null===(n=l.value)||void 0===n?void 0:n.addTimeOut(i)]);case 1:o.sent(),o.label=2;case 2:return[2]}}))}))}s.liveTitle=h.value,s.liveBrowse=w.value,s.screenSizeType=b.value,m(),(0,t.bv)((function(){u(),we.Z.connectURL=d.value+p.value+"/"+f.value,we.Z.init(y)}));var E=(0,$.iH)(!1);return(0,_.pi)((0,_.pi)({},(0,$.BK)(s)),{onFocus:function(){var e;s.isExpression=!1,null===(e=l.value)||void 0===e||e.scrollBottom(),window.addEventListener("resize",(function(){document.activeElement instanceof HTMLElement&&"INPUT"==document.activeElement.tagName?(a.value&&(a.value.style.position="static"),window.setTimeout((function(){document.activeElement.scrollIntoViewIfNeeded()}),100)):a.value&&(a.value.style.position="fixed;")}))},sendMessage:function(){var e;s.message?null===(e=l.value)||void 0===e||e.getCommentMessage():ne.Z.fail("请输入内容"),s.message=""},sendPhoto:function(){var e;null===(e=l.value)||void 0===e||e.getPhoto(),s.showMore=!1},movie:i,introduce:o,send:r,contentBottom:a,barrage:l,refInput:c,elementHeight:u,getPresentList:function(){s.givePresentList=[{id:1,name:"张三",message:"棒棒糖",count:1,img:"data:image/png;base64,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",photo:Te}],s.showAccess=!0},inputBlur:function(){(0,t.Y3)((function(){c.value&&c.value.blur()}))},handleTouch:function(e){e._isScroller=!0},toggleExpression:function(){setTimeout((function(){var e;s.isExpression=!s.isExpression,null===(e=l.value)||void 0===e||e.scrollBottom()}),100)},addEmoji:function(e){s.message+=e.native},getGiftInfo:function(){s.showPresent=!0},getMoreInfo:function(){s.showMore=!0},closeGift:function(){s.showPresent=!1},toHome:function(){"1"==s.screenSizeType?e.push("/home"):e.push("/live")},showImg:function(e){(0,t.Y3)((function(){console.log("zoom img"+JSON.stringify(e)),s.mediaType=e.type,s.mediaUrl=e.url,E.value=!0}))},show:E,getAdminState:m,getLiveAbout:function(){e.push({name:"guide"})},afterRead:function(e){ne.Z.loading({duration:0,message:"发送中...",forbidClick:!0});var s=new FormData;s.append("file",e.file),(0,Le.B7)(n.defaults.baseURL+"/jeecg-boot/sys/common/upload",s).then((function(e){var n;ne.Z.clear(),e.data.message?(console.log(e.data.message),null===(n=l.value)||void 0===n||n.quene(e.data.message)):(0,ne.Z)("发送失败")}))},beforeRead:function(e){return!e.type.indexOf("image")||((0,ne.Z)("请上传jpg、jpeg、png格式图片"),!1)}})}}),Ye=(0,He.Z)(Be,[["render",function(e,n,s,r,a,l){var c=(0,t.up)("BarrageImg"),_=(0,t.up)("van-button"),$=(0,t.up)("van-uploader"),ee=(0,t.up)("Picker"),ne=(0,t.up)("Present"),se=(0,t.up)("van-action-sheet"),te=(0,t.up)("van-image"),ie=(0,t.up)("van-popup");return(0,t.wg)(),(0,t.iD)("div",u,[(0,t._)("div",m,[(0,t._)("div",d,[(0,t._)("div",g,[(0,t._)("div",{class:"rank",onClick:n[0]||(n[0]=function(){for(var n=[],s=0;s<arguments.length;s++)n[s]=arguments[s];return e.toHome&&e.toHome.apply(e,n)})},v)]),(0,t.kq)(' <div class="header-bottom">\r\n          <div class="photo">\r\n            <img src="@/assets/video/video.png" alt="" />\r\n            <span class="message">直播回看</span>\r\n          </div>\r\n        </div> ')])]),(0,t._)("div",p,[(0,t._)("div",f,[(0,t._)("div",h,[(0,t._)("div",w,[(0,t._)("div",b,[(0,t._)("div",y,[E,(0,t._)("div",x,[(0,t._)("span",H,(0,i.zw)(e.liveTitle),1)])])]),(0,t._)("div",A,[(0,t.kq)(' <div class="introduce-bottom-left">\r\n                <div class="brief">\r\n                  <span class="message">直播简介</span>\r\n                </div>\r\n                <img src="@/assets/arrow-gray-right.png" alt="" />\r\n              </div> '),(0,t._)("div",I,[(0,t._)("div",M,[k,(0,t._)("span",L,(0,i.zw)(e.liveBrowse),1)]),(0,t.kq)(' <div class="like">\r\n                  <img src="@/assets/like.png" alt="" />\r\n                  <span class="number">200</span>\r\n                </div> ')])])],512),(0,t._)("div",T,[(0,t.Wm)(c,{ref:"barrage",onInputBlur:e.inputBlur,onShowImg:e.showImg,isExpression:e.isExpression,commentMessage:e.message,movieHeight:e.movieHeight,introduceHeight:e.introduceHeight,sendHeight:e.sendHeight},null,8,["onInputBlur","onShowImg","isExpression","commentMessage","movieHeight","introduceHeight","sendHeight"])])]),(0,t._)("div",q,[(0,t._)("div",B,[(0,t._)("div",Y,[(0,t.wy)((0,t._)("input",{ref:"refInput",class:"text",type:"text",name:"",id:"",placeholder:e.isForbidden?"非管理员不能发布消息！":"这里是输入的内容","onUpdate:modelValue":n[1]||(n[1]=function(n){return e.message=n}),onKeyup:n[2]||(n[2]=(0,o.D2)((function(){for(var n=[],s=0;s<arguments.length;s++)n[s]=arguments[s];return e.sendMessage&&e.sendMessage.apply(e,n)}),["enter"])),onFocus:n[3]||(n[3]=function(){for(var n=[],s=0;s<arguments.length;s++)n[s]=arguments[s];return e.onFocus&&e.onFocus.apply(e,n)}),disabled:e.isForbidden},null,40,O),[[o.nr,e.message]]),(0,t.kq)(' <img @click="toggleExpression" src="@/assets/expression.png" alt="" /> ')]),e.message?((0,t.wg)(),(0,t.iD)("div",N,[(0,t.Wm)(_,{class:"add",onClick:e.sendMessage},{default:(0,t.w5)((function(){return[D]})),_:1},8,["onClick"])])):((0,t.wg)(),(0,t.iD)("div",F,[(0,t.kq)(' <div class="gift" @click="getGiftInfo">\r\n                <img src="@/assets/gift.png" alt="" />\r\n              </div> '),(0,t.kq)(' <div class="more" @click="getMoreInfo">\r\n                <img src="@/assets/more.png" alt="" />\r\n              </div> '),(0,t.Wm)($,{class:"van-uploader","after-read":e.afterRead,"before-read":e.beforeRead,accept:"image/png,image/jpg,image/jpeg","max-count":1,disabled:e.isForbidden},{default:(0,t.w5)((function(){return[U,z]})),_:1},8,["after-read","before-read","disabled"])]))],512),(0,t.wy)((0,t._)("div",{class:"expression",onTouchmove:n[4]||(n[4]=function(){for(var n=[],s=0;s<arguments.length;s++)n[s]=arguments[s];return e.handleTouch&&e.handleTouch.apply(e,n)})},[(0,t.Wm)(ee,{data:e.emojiIndex,set:"apple",showSearch:!1,showPreview:!1,showCategories:!1,onSelect:e.addEmoji},null,8,["data","onSelect"])],544),[[o.F8,e.isExpression]])],512),(0,t.Wm)(ne,{movieHeight:e.movieHeight,showPresent:e.showPresent,onGetPresentList:e.getPresentList,onCloseGift:e.closeGift},null,8,["movieHeight","showPresent","onGetPresentList","onCloseGift"]),(0,t.Wm)(se,{show:e.showMore,"onUpdate:show":n[9]||(n[9]=function(n){return e.showMore=n}),round:!1},{default:(0,t.w5)((function(){return[(0,t._)("div",Z,[(0,t._)("div",G,[(0,t._)("div",P,[(0,t._)("div",J,[S,(0,t._)("span",Q,(0,i.zw)(e.goldCoin)+"金币",1)]),(0,t._)("span",{class:"close",onClick:n[5]||(n[5]=function(){for(var n=[],s=0;s<arguments.length;s++)n[s]=arguments[s];return e.onClose&&e.onClose.apply(e,n)})},"关闭")]),(0,t._)("div",j,[(0,t._)("div",C,[R,(0,t._)("div",W,[(0,t.Wm)($,{class:"van-uploader","after-read":e.afterRead,"before-read":e.beforeRead,accept:"image/png,image/jpg,image/jpeg","max-count":1},{default:(0,t.w5)((function(){return[X,K]})),_:1},8,["after-read","before-read"])])]),(0,t.kq)("v-if",!0)])])])]})),_:1},8,["show"])])]),(0,t.Wm)(ie,{show:e.show,"onUpdate:show":n[10]||(n[10]=function(n){return e.show=n}),closeable:"",round:"",style:{width:"95%"}},{default:(0,t.w5)((function(){return[(0,t._)("div",null,[1==e.mediaType?((0,t.wg)(),(0,t.j4)(te,{key:0,fit:"cover",src:e.mediaUrl},null,8,["src"])):(0,t.kq)("v-if",!0),2==e.mediaType?((0,t.wg)(),(0,t.iD)("video",{key:1,controls:"",autoplay:"",src:e.mediaUrl},null,8,V)):(0,t.kq)("v-if",!0)])]})),_:1},8,["show"])])}],["__scopeId","data-v-27431c0e"]])}}]);
//# sourceMappingURL=581.661cbf9c56a99c291c20.js.map