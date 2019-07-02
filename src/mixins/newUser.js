import { mapMutations, mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['loginStatus', 'loginChannel', 'couponDialogLogin', 'loginFlag', 'hadCouponFlag'])
  },
  methods: {
    afterSubmit () {
      if (!this.userToken) {
        console.log('afterSubmit')
        this.$tj('welfarenewclick')
        this.setShowNewUserDialogStatus(false)
        this.setNewUserDragStatus(true)
        this.setLoginStatus(true)
        this.setLoginFlag('newUserLogin')
      }
    },
    afterLogin (callback) {
      if (this.loginFlag === 'newUserLogin') {
        this.$router.push({
          name: 'MyCoupon'
        })
        callback()
      }
      // this.setLoginFlag('')
      this.setShowNewUserDialogStatus(false)
      this.setNewUserDragStatus(false)
    },
    newUserPrizeCheck () {
      let firstHadCoupon = localStorage.getItem('firstHadCoupon')
      if (this.hadCouponFlag === 'hadCouponLogin' && firstHadCoupon === 'true' && this.loginFlag === '' && this.$route.name !== 'shopHome') {
        return this.$api['shopHome/newUserPrizeCheck']({
          token: this.userToken
        }).then(res => {
          this.setHadCouponFlag('')
          // 奖励是否还有效
          if (res.data.mianxiActive) {
            this.$tj('welfarenewgetshow')
            this.setShowHadCouponDialog(true)
            localStorage.setItem('firstHadCoupon', 'false')
          }
        })
      }
    },
    // 新人奖品优惠券是否有效 用于商品详情字段展示
    detailNewUserPrizeCheck () {
      return this.$api['shopHome/newUserPrizeCheck']({
        token: this.userToken
      }).then(res => {
        // 奖励是否还有效
        console.log('新人奖品优惠券是否有效 用于商品详情字段展示')
        this.setMianxiActive(res.data.mianxiActive)
      })
    },
    ...mapMutations(['setNewUserDragStatus', 'setShowNewUserDialogStatus', 'setOldUserDialog', 'setWeiboExchangeStatus', 'setCouponDialogLogin', 'setLoginFlag', 'setHadCouponFlag', 'setShowHadCouponDialog', 'setMianxiActive', 'setFirstOpenFlag'])
  }
}
