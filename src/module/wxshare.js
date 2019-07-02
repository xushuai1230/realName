var axios = require('axios')
/**
 * 微信分享配置
 * @param {*Object} opt 配置对象
 *
 */
export default function (opt) {
  var title = opt.title
  var imgUrl = opt.imgUrl
  var link = opt.url
  var desc = opt.desc
  let locUrl = location.href
  locUrl = locUrl.slice(0, locUrl.indexOf('#'))
  axios({
    method: 'post',
    url: 'https://api.xiaoxiangyoupin.com/elephant/api/public/sign',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    data: JSON.stringify({
      url: locUrl
    })
  })
    .then(res => {
      let data = res.data.body
      data.jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage']
      // data.debug = false
      wx.config(data)
      wx.ready(function () {
        // 分享到朋友圈
        wx.onMenuShareTimeline({
          title: title,
          imgUrl: imgUrl,
          link: link,
          success: function (data) {},
          error: function (errorType, error) {}
        })
        // 分享到好友
        wx.onMenuShareAppMessage({
          title: title,
          imgUrl: imgUrl,
          desc: desc,
          link: link,
          success: function (data) {},
          error: function (errorType, error) {}
        })
      })
    })
    .catch(response => {
      console.log(response)
    })
}
