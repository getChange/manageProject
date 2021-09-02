let baseUrlApi = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_URL : ''
let searchApi = process.env.NODE_ENV === 'production' ? process.env.VUE_SEARCH_URL : ''
import {
  get,
  post
} from '@/axios/axios'

/**
 * 获取广告列表
 * @returns 
 */
export const adListData = (data) => post(baseUrlApi + 'api/advert/list', data, {})
/**
 * 获取视频列表
 * @returns 
 */
export const videoListData = (data) => post(baseUrlApi + 'api/patchVideo/list', data, {})
/**
 * 获取输入建议列表
 * @returns 
 */
export const suggestListData = (data) => get(searchApi + 'Cmpp/runtime/interface_750535.jhtml', data, {})
/**
 * 广告提交编辑/新增结果
 * @param {*} data 
 * @returns 
 */
export const submitAdData = (data) => post(baseUrlApi + 'api/advert/save', data, {})
/**
 * 视频提交新增结果
 * @param {*} data 
 * @returns 
 */
export const addVideoData = (data) => post(baseUrlApi + 'api/patchVideo/add', data, {})
/**
 * 视频提交编辑结果
 * @param {*} data 
 * @returns 
 */
export const editVideoData = (data) => post(baseUrlApi + 'api/patchVideo/edit', data, {})
/**
 * 广告删除列表内容
 * @param {*} data 
 * @returns 
 */
export const deleteAdData = (data) => post(baseUrlApi + 'api/advert/del', data, {})
/**
 * 视频删除列表内容
 * @param {*} data 
 * @returns 
 */
export const deleteVideoData = (data) => post(baseUrlApi + 'api/patchVideo/del', data, {})