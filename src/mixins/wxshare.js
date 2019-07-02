import wxshare from '@/module/wxshare'
import tongji from '@/module/tongji.js'

export default {
  methods: {
    /**
     * 配置APP环境分享 消息分享
     * @param {Object} config 配置参数
     * config.url 最终要分享的url
     * config.popdesc app分享提示
     * config.title 分享标题
     * config.text 分享描述
     * config.imgurl 分享图片
     */
    appShareConfig (config) {
      const authUrl = `${window.location.origin}/dev/transferlink/index.html?insto=${encodeURIComponent(config.url)}`
      let clientUrl = `bsd://share?popdesc=${config.popdesc}&title=${this.order.goodsName}&text=${config.text}&url=${encodeURIComponent(authUrl)}&imgurl=${config.imgurl}`
      location.href = clientUrl
    },
    /**
     * 配置微信环境分享
     * @param {Object} config 配置参数
     * config.title 标题
     * config.imgUrl 标题
     * config.desc = 描述
     *
     */
    wxShareConfig (config) {
      let link = `${window.location.origin}/dev/transferlink/index.html?insto=${encodeURIComponent(config.url)}`
      var ua = navigator.userAgent.toLocaleLowerCase()
      if (ua.match(/micromessenger/)) {
        tongji('groupbooking', 'wx_share')
        wxshare({
          title: config.title,
          imgUrl: config.imgUrl,
          url: link,
          desc: config.desc
        })
      }
    },
    judgeAppEnviron () {
      let ua = navigator.userAgent.toLocaleLowerCase()
      if (ua.match(/instalment/)) {
        return true
      } else {
        return false
      }
    }
  }
}
