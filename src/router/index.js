import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  projectRoute
} from './routes'
// import _session from '@/state/sessionStorage'
// import {
//   getUserInfo
// } from '@/axios/api'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  base: process.env.NODE_ENV === 'production' ? '/web/' : '/',
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: projectRoute
})

let defaultTitle = '凤凰FM-解析真相 增长见闻 引发思考 触动人心'

// function GetRequest() {
//   var url = location.search // 获取url中"?"符以及其后的字串
//   var theRequest = {}
//   if (url.indexOf('?') !== -1) {
//     var str = url.substr(1)
//     var strs = str.split('&')
//     for (var i = 0; i < strs.length; i++) {
//       theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
//     }
//   }
//   return theRequest
// }

// function getUserInfoMethod(uid, appid, methods) {
//   let data = {
//     'uid': uid,
//     'appid': appid
//   }
//   getUserInfo(data).then(res => {
//     if (res.code === 0) {
//       _session.set('userInfo', res.data[0])
//       _session.set('uid', uid)
//       _session.set('appid', appid)
//       methods()
//     } else if (res.code === 2) {
//       Vue.prototype.$message.error(res.msg)
//       setTimeout(() => {
//         window.location.href = 'http://p.renbenzhihui.com/login/index'
//       }, 2000)
//     } else {
//       Vue.prototype.$message.error(res.msg)
//       setTimeout(() => {
//         window.location.href = 'http://p.renbenzhihui.com/login/index'
//       }, 2000)
//       // window.location.href = 'http://p.renbenzhihui.com/login/index'
//     }
//   })
// }

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : defaultTitle
  // if (!_session.get('uid') && !_session.get('appid')) {
  //   getUserInfoMethod(GetRequest()['uid'], GetRequest()['id'], next)
  // } else {
  //   next()
  // }
  next()
})

export default router