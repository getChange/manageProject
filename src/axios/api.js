let baseUrlApi = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_URL : ''

import {
  get,
  post
} from '@/axios/axios'

/**
 * 获取广告列表
 * @returns 
 */
export const adListData = (data) => get(baseUrlApi + 'api/patchvideo/list', data, {})
/**
 * 获取视频列表
 * @returns 
 */
export const videoListData = (data) => get(baseUrlApi + 'api/patchvideo/list', data, {})
/**
 * 获取输入建议列表
 * @returns 
 */
export const suggestListData = (data) => post(baseUrlApi + 'api/patchvideo/list', data, {})
/**
 * 提交编辑/新增结果
 * @param {*} data 
 * @returns 
 */
export const submitData = (data) => post(baseUrlApi + 'api/patchvideo/list', data, {})
/**
 * 删除列表内容
 * @param {*} data 
 * @returns 
 */
export const deleteData = (data) => post(baseUrlApi + 'api/patchvideo/list', data, {})