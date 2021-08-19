import axios from 'axios'
import qs from 'qs'
import {
  Loading,
  Message
} from 'element-ui'
import router from '@/router/index'
import _local from '@/state/localStorage'

let loadingInstance = null // 加载全局的loading

const instance = axios.create({ //创建axios实例，在这里可以设置请求的默认配置
  timeout: 10000, // 设置超时时间10s
  // baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_URL : '' //根据自己配置的反向代理去设置不同环境的baeUrl
  transformRequest: []
})
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

/** 添加请求拦截器 **/
instance.interceptors.request.use(config => {
  // config.headers['token'] = _local.get('token') || ''
  loadingInstance = Loading.service({ // 发起请求时加载全局loading，请求失败或有响应时会关闭
    spinner: 'fa fa-spinner fa-spin fa-3x fa-fw',
    text: '拼命加载中...'
  })

  // 在发送请求之前做处理...
  config.headers = Object.assign(config.method === 'get' ? {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  } : {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }, config.headers);

  if (config.method === 'post') {
    // 我这里是文件上传，发送的是二进制流，所以需要设置请求头的'Content-Type'
    if (config.url.includes('index.php/api/uploadFile')) {
      config.headers['Content-Type'] = 'multipart/form-data;charset=UTF-8'
    }
    const contentType = config.headers['Content-Type'];
    // 根据Content-Type转换data格式
    if (contentType) {
      if (contentType.includes('multipart')) { // 类型 'multipart/form-data;'
        config.data
      } else if (contentType.includes('json')) { // 类型 'application/json;'
        // 服务器收到的raw body(原始数据) "{name:"nowThen",age:"18"}"（普通字符串）
        config.data = JSON.stringify(config.data);
      } else { // 类型 'application/x-www-form-urlencoded;'
        // 服务器收到的raw body(原始数据) name=nowThen&age=18
        config.data = qs.stringify(config.data);
      }
    }
  }
  if (config.method === 'get') { // 添加时间戳参数，防止浏览器（IE）对get请求的缓存
    config.params = {
      ...config.params,
      t: new Date().getTime()
    }
  }
  return config
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

/** 添加响应拦截器  **/
instance.interceptors.response.use(response => {
  loadingInstance.close()
  if (response.status === 200) {
    return Promise.resolve(response)
  } else {
    Message({
      message: response.data.message,
      type: 'error'
    })
    return Promise.reject(response)
  }
}, error => {
  loadingInstance.close()
  console.log(error)
})

/* 统一封装get请求 */
export const get = (url, params, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'get',
      url,
      params,
      ...config
    }).then(response => {
      resolve(response.data)
    }).catch(error => {
      reject(error)
    })
  })
}

/* 统一封装post请求  */
export const post = (url, data, config) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'post',
      url,
      data,
      ...config
    }).then(response => {
      resolve(response.data)
      if (response.data.code === '3') {
        _local.remove('token')
        _local.remove('userInfo')
        setTimeout(() => {
          router.replace({
            path: '/',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
        }, 300)
      }
    }).catch(error => {
      reject(error)
    })
  })
}
