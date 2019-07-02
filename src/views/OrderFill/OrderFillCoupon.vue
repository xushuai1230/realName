<template>
	<div class="OrderFillCoupon">
		<van-tabs sticky swipeable :duration=".5" :line-width="Number(55)">
			<van-tab title="不可叠加">
				<div class="tip" @click="goToUseIllustration">
					<img src="~@/assets/img/pay/shuoming-icon-ab@3x.png" alt="">
					<span>优惠券使用说明</span>
				</div>
				<ul class="coupons" v-if="NoCanSuperCoupons.length">
					<li class="coupon" :class="[coupon.usable ? '' : 'unable', coupon.active ? 'active' : '']" v-for="coupon in NoCanSuperCoupons" :key="coupon.id" @click="selectCoupon(coupon)">
						<div class="left">
							<div class="top">
								<p class="name">{{coupon.couponName}}</p>
								<p class="rule" v-for="(rule, index) in coupon.ruleList" :key="index">
									{{rule}}
								</p>
							</div>
							<div class="bottom">有效期至:&nbsp;&nbsp;{{coupon.useDeadline}}</div>
						</div>
						<div class="right">
							<i>&yen;</i>
							<span>{{coupon.unit | couponPriceFilter}}</span>
						</div>
					</li>
				</ul>
				<div class="noData" v-else>
					<img src="~@/assets/img/pay/blankpage_img_search@3x.png" alt="">
					<p>亲，您暂时没有可用优惠券哦～</p>
				</div>
				<div class="btn van-hairline--top" v-if="NoCanSuperCoupons.length" @click="confirmCoupon">确定</div>
			</van-tab>
			<van-tab title="可叠加">
				<div class="tip" @click="goToUseIllustration">
					<img src="~@/assets/img/pay/shuoming-icon-ab@3x.png" alt="">
					<span>优惠券使用说明</span>
				</div>
				<ul v-if="CanSuperCoupons.length">
					<li v-for="coupon in CanSuperCoupons" :key="coupon.id">{{coupon.couponName}}</li>
				</ul>
				<div class="noData" v-else>
					<img src="~@/assets/img/pay/blankpage_img_search@3x.png" alt="">
					<p>亲，您暂时没有可用优惠券哦～</p>
				</div>
				<div class="btn van-hairline--top" v-if="CanSuperCoupons.length">确定</div>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script>
export default {
  name: 'OrderFillCoupon',

  components: {},

  props: {},

  data () {
    return {
      coupons: []
    }
  },

  computed: {
    CanSuperCoupons () {
      return this.coupons.filter(item => item.type === 2).sort((a, b) => {
        if (a.usable && !b.usable) {
          return 1
        } else if (!a.usable && b.usable) {
          return -1
        } else {
          return 0
        }
      })
    },
    NoCanSuperCoupons () {
      return this.coupons.filter(item => item.type === 1).sort((a, b) => {
        if (a.usable && !b.usable) {
          return -1
        } else if (!a.usable && b.usable) {
          return 1
        } else {
          return 0
        }
      })
    }
  },

  created () {
    this.coupons = JSON.parse(window.sessionStorage.getItem('orderFillCoupons'))
    let selectedCoupon = window.sessionStorage.getItem('selectedCoupon')
    if (selectedCoupon) {
      selectedCoupon = JSON.parse(selectedCoupon)
      this.coupons.forEach(item => {
        selectedCoupon.forEach(coupon => {
          if (item.couponCode === coupon.couponCode) {
            item.active = true
          }
        })
      })
    }
  },

  mouted () { },

  methods: {
    goToUseIllustration () {
      location.href = 'https://cdn.basestonedata.com/app/service/newcoupon.html'
    },
    confirmCoupon () {
      let selectedCoupon = this.coupons.filter(item => item.active)
      window.sessionStorage.setItem('selectedCoupon', JSON.stringify(selectedCoupon))
      this.$router.go(-1)
    },
    selectCoupon (coupon) {
      let type = coupon.type
      let usable = coupon.usable
      if (!usable) return false
      if (type === 1) {
        this.coupons.forEach(item => {
          if (item.id === coupon.id) {
            item.active = !item.active
          } else {
            item.active = false
          }
        })
      }
    }
  },

  filters: {
    couponPriceFilter (price) {
      let ret
      if (!price) {
        ret = 0
      } else {
        ret = price / 100
      }
      return parseInt(ret)
    }
  }

}

</script>
<style lang="scss">
.OrderFillCoupon {
  .van-tabs__line {
    border-radius: 2px;
  }
  .van-tab--active {
    // color: #ed145b;
  }
}
</style>
<style scoped lang="scss">
.btn {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 88px;
  line-height: 88px;
  background-color: #fff;
  z-index: 100;
  font-size: 32px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #ed145b;
  text-align: center;
  padding-bottom: env(safe-area-inset-bottom);
}
.tip {
  padding: 30px 0 26px;
  text-align: center;
  img {
    margin: 2px 15px 0 0;
    width: 28px;
    height: 28px;
  }
  span {
    display: inline-block;
    height: 33px;
    font-size: 24px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #939393;
    line-height: 33px;
    text-align: center;
  }
}
.noData {
  text-align: center;
  padding-top: 100px;
  img {
    width: 360px;
    height: 360px;
    margin-bottom: 12px;
  }
  p {
    height: 40px;
    font-size: 28px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 40px;
  }
}
.coupons {
  padding: 0 14px 88px;
  background-color: #f2f2f2;
  .coupon {
    width: 722px;
    height: 212px;
    background: url("~@/assets/img/list_goods_cash_coupon_nol@3x.png") no-repeat;
    background-size: 100% 100%;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    &.unable {
      background: url("~@/assets/img/pay/list_goods_cash_coupon_gra@3x.png")
        no-repeat;
      background-size: 100% 100%;
      .right {
      i {
        color: #BDBDBD;
      }
      span {
        color: #BDBDBD;
      }
    }
    }
    &.active {
      background: url("~@/assets/img/pay/list_goods_cash_coupon_sel@3x.png")
        no-repeat;
      background-size: 100% 100%;
    }
    .left {
      padding: 26px 0 30px 46px;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .name {
        height: 42px;
        font-size: 30px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: #333;
        line-height: 42px;
        margin-bottom: 6px;
      }
      .rule {
        height: 33px;
        font-size: 24px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #636363;
        line-height: 33px;
      }
      .bottom {
        height: 33px;
        font-size: 24px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #636363;
        line-height: 33px;
      }
    }
    .right {
      width: 210px;
      line-height: 212px;
      text-align: center;
      i {
        font-size: 28px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: #ff3a6f;
      }
      span {
        font-size: 68px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: #ff3a6f;
      }
    }
  }
}
</style>
