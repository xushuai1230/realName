import axios from 'axios'

let fns = [] // 需要等待微信jssdk注册的回调函数
let registerStart = 0 // 未开始0，进行中1，结束了2，失败了3

/**
 * @description 调用微信jssdk的功能
 * @author name
 * @date 2018-10-31
 * @param {boolean} [debug=false] 是否打开微信分享的debug模式
 * @returns
 *
 */
export default function wxHandler (fn, debug = false) {
  if (registerStart === 3) { // 失败了重新开始
    registerStart = 0
  }
  if (registerStart === 2) { // 成功了
    fn()
    return
  }
  if (registerStart === 1) { // 进行中未开始
    fns.push(fn)
    return
  }
  if (registerStart === 0) {
    fns.push(fn)
  }
  registerStart = 1
  axios({
    method: 'post',
    url: `https://api.xiaoxiangyoupin.com/elephant/api/public/sign`,
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    data: JSON.stringify({
      url: location.href
    })
  })
    .then(res => {
      let configData = res.data.body
      configData.debug = debug
      configData.jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage']
      wx.config(configData)
      wx.ready(function () {
        console.log(fns, 'fns')
        registerStart = 2
        let fn
        while (fns.length > 0) {
          fn = fns.pop()
          fn()
        }
      })
    })
    .catch(err => {
      console.log('分享数据请求错误：', err)
      registerStart = 3
    })
}
