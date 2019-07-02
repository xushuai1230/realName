import { appAgentBol, wxAgentBol } from 'insfns'
import { wxOnLoad } from 'wxjssdk'
let isApp = appAgentBol()
let isWx = wxAgentBol()
export default {
  data () {
    return {
      shareConfigData: {
        popdesc: '选择分享方式',
        title: '',
        text: '',
        desc: '',
        imgUrl: '',
        shareLink: '',
        callback: () => {}
      }
    }
  },
  computed: {
    isApp () {
      return appAgentBol()
    },
    isWx () {
      return wxAgentBol()
    }
  },
  methods: {
    // app,wx分享
    openShare () {
      if (isApp) {
        window.trigger = (type) => {
          try {
            if (type === 'wxshareCb') {
              this.shareConfigData.callback()
            }
          } catch (err) {
            console.log('t', err)
          }
        }
        this.openAppShareModel(this.shareConfigData)
      } else if (isWx) {
        global.vbus.$emit('wxGuideModel_show', true)
      }
    },
    setWxShareConfig () {
      wxOnLoad(this.wxShareConfig(this.shareConfigData))
    },
    setWxShareData (data) {
      this.shareConfigData = data
    },
    wxShareConfig (config) {
      let title = config.title
      let imgUrl = config.imgUrl
      let link = window.location.origin + '/dev/transferlink/bargain.html?insto=' + encodeURIComponent(config.url)
      let desc = config.desc
      let callback = config.callback
      // 分享到朋友圈
      wx.onMenuShareTimeline({
        title: title,
        imgUrl: imgUrl,
        link: link,
        success: function success (data) {
          if (callback) callback()
        },
        error: function error (errorType, _error) {}
      })
      // 分享到好友
      wx.onMenuShareAppMessage({
        title: title,
        imgUrl: imgUrl,
        desc: desc,
        link: link,
        success: function success (data) {
          if (callback) callback()
        },
        error: function error (errorType, _error2) {}
      })
    },
    openAppShareModel (config) {
      let authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx29770e85a4b89826&redirect_uri=${encodeURIComponent(
        config.url
      )}&response_type=code&scope=snsapi_userinfo&state=share#wechat_redirect`

      let clientUrl = `bsd://share?popdesc=${config.popdesc}&title=${
        config.title
      }&text=${config.text}&url=${encodeURIComponent(authUrl)}&imgurl=${
        config.imgUrl
      }&cb=wxshareCb`
      location.href = clientUrl
    }
  }
}
