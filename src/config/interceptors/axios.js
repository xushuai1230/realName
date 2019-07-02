import { CONSOLE_REQUEST_ENABLE, CONSOLE_RESPONSE_ENABLE } from '../index.js'
import qs from 'qs'
import store from '@/plugins/store'
import { CHANNEL_WEIBOBIND, CHANNEL_BOBO } from '@/const/constdata'
export function requestSuccessFunc (config) {
  !config.noShowLoading && global.vbus.$emit('loading_show', true)
  // 开启请求参数打印
  CONSOLE_REQUEST_ENABLE && console.info('请求参数打印:', `url: ${config.url}`, config)
  if (config.noStringify) {
    return config
  }
  // 请求头携带token
  let tokenHeader = store.state.userIdentity.token
  if (tokenHeader) {
    config.headers.common.token = tokenHeader
  }
  // config.headers.common.cas = 'true'
  // 处理请求体携带参数格式
  if (
    config.method.toLocaleLowerCase() === 'post' ||
    config.method.toLocaleLowerCase() === 'put' ||
    config.method.toLocaleLowerCase() === 'delete'
  ) {
    let spReg = /elephant\/api\/public\/auth|order\/address\/save|newFreight|order\/save|createMergeOrder|skload/
    let jsonBody = /application\/json|multipart\/form-data/i
    if (!spReg.test(config.url) && !jsonBody.test(config.headers['Content-Type'])) { // 如果是json的格式排除
      config.data = qs.stringify(config.data)
    }
  }
  return config
}
export function requestFailFunc (error) {
  !error.noCloseLoading && global.vbus.$emit('loading_show', false)
  !error.noShowDefaultError && global.vbus.$emit('toast_show', error.message)
  return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
}
export function responseSuccessFunc (res) {
  // 开启请求参数打印
  CONSOLE_RESPONSE_ENABLE && console.info('响应数据打印:', `url: ${res.config.url}`, res.data)
  let reqUrl = res.config.url
  let result = res.data
  // 开启响应数据打印
  !res.config.noCloseLoading && global.vbus.$emit('loading_show', false)
  let spReg = /writeImages|elephant\/api\/public\/auth|getLoginSmsCode|submitWithdrawApply|imgSendVerCode|checkVerCode|getChannelSms|signRequest/
  if (spReg.test(reqUrl)) {
    return result
  }
  if (result === '') { // 返回数据为空字符串时，判断请求失败
    return Promise.reject(new Error('请求数据为空'))
  }
  // 根据返回的code值来做不同的处理（和后端约定）
  // 登陆过期，提示登陆
  let headsCode = Number(result.heads.code)
  let weiboBindExpired = false
  if (headsCode === 10001 || /没登录/.test(result.heads.message)) {
    const ch = store.state.loginChannel
    if (ch !== CHANNEL_WEIBOBIND && CHANNEL_BOBO !== ch) {
      store.commit('setLoginStatus', true)
    } else {
      weiboBindExpired = true
    }
  }
  switch (result.heads.code) {
    case 200:
      return result.body
    default:
      // 业务中还会有一些特殊 code 逻辑，我们可以在这里做统一处理，也可以下方它们到业务层
      let message = result.heads.message || result.heads.errorMsg || `业务错误:${result.heads.code}`
      global.vbus.$emit('loading_show', false)
      if (!res.config.noShowDefaultError) {
        // 微博h5绑定登录的token失效了情况下，单独提示
        if (weiboBindExpired) {
          let expiredToast = '哎呀，丢失您的信息了哦，请退出重试吧！'
          if (process.env.VUE_APP_SERVEN === 'DEV') {
            expiredToast = message + ' ' + expiredToast
          }
          global.vbus.$emit('toast_show', expiredToast)
        } else {
          global.vbus.$emit('toast_show', message)
        }
      }
      return Promise.reject(result)
  }
}
export function responseFailFunc (err) {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误'
        break

      case 401:
        err.message = '未授权，请登录'
        break

      case 403:
        err.message = '拒绝访问'
        break

      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`
        break

      case 408:
        err.message = '请求超时'
        break

      case 500:
        err.message = '服务器内部错误'
        break

      case 501:
        err.message = '服务未实现'
        break

      case 502:
        err.message = '网关错误'
        break

      case 503:
        err.message = '服务不可用'
        break

      case 504:
        err.message = '网关超时'
        break

      case 505:
        err.message = 'HTTP版本不受支持'
        break

      default:
    }
  }
  if (/timeout/.test(err.message)) {
    err.message = '网络超时'
  }
  !err.config.noShowDefaultError && global.vbus.$emit('toast_show', err.message)
  !err.config.noCloseLoading && global.vbus.$emit('loading_show', false)
  return Promise.reject(err)
}
