import { mapMutations } from 'vuex'
export default {
  methods: {
    afterSubmit () {
      // 领券
      if (!this.userToken) {
        this.setCouponDialogLogin(true)
        this.setLoginStatus(true)
        this.setDragStatus(true)
      } else {
        // 已登录领取
        this.redPacketsLogin()
      }
      this.setShowCouponDialogStatus(false)
    },
    redPacketsLogin () {
      // 微博红包飞登录领券
      return this.$api['shopHome/gustLogin']({
        mobile: this.phone || '',
        verCode: this.sms || '',
        token: this.userToken || '',
        registerType: Number(this.loginChannel)
      }).then(res => {
        let weiboExchangeStatus = Number(res.weiboExchangeStatus)
        if (!this.userToken) {
          this.muUserMetaInfo(res)
          this.muUserMark(null)
          global.vbus.$emit('setBindUser', false) // 颜值卡里面使用
        }
        // 设置领券状态
        this.setWeiboExchangeStatus(weiboExchangeStatus)
        if (weiboExchangeStatus === -1) {
          this.$toast('挤爆了！请稍后再试')
          this.setDragStatus(true)
          return false
        } else if (weiboExchangeStatus === 1) {
          if (this.loginChannel === '353') {
            this.$router.push({
              name: 'RedPackets'
            })
            return false
          } else {
            this.$toast('领取成功')
          }
        } else if (weiboExchangeStatus === 2) {
          this.$toast('您已领取过该福利,不能重复领取')
        } else if (weiboExchangeStatus === 3) {
          this.$toast('券已领完')
        } else if (weiboExchangeStatus === 4) {
          this.setOldUserDialog(true)
          this.$tj('hbfabcalertshow')
        }
        this.$router.push({
          name: 'MyCoupon'
        })
        this.setCouponDialogLogin(false)

        let redpacketChannels = ['353', '354', '355', '356']
        let tjString = ['hbfalertclick1', 'hbfalertclick2', 'hbfalertclick3', 'hbfalertclick4']
        let isRedPacketChannel = redpacketChannels.indexOf(this.loginChannel)
        this.$tj(tjString[isRedPacketChannel])
      })
    },
    ...mapMutations(['setDragStatus', 'setShowCouponDialogStatus', 'setOldUserDialog', 'setWeiboExchangeStatus', 'setCouponDialogLogin'])
  }
}
