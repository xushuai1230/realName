<template>
	<div class="ReceiveCoupon" @click.self="closeReceiveCoupon">
		<div class="ReceiveCoupon__wrap">
			<div class="ReceiveCoupon__title van-hairline--bottom">领取优惠券</div>
			<div class="ReceiveCoupon__content">
				<ul class="coupons">
					<li class="coupon" :class="{'free':coupon.type === 2}" v-for="coupon in coupons" :key="coupon.couponCode">
						<div class="desc">
							<p class="big" v-if="coupon.type === 1">
								<i>&yen;</i>
								<span>{{coupon.unit | priceFront}}</span>
							</p>
              <p class="big" v-else>
								<span>{{coupon.unit}}</span>
                <i>天</i>
							</p>
							<p class="small" v-for="(rule, index) in coupon.ruleList" :key="index">
								{{rule}}
							</p>
						</div>
						<div class="receive">
							<div class="btn" @click="receiveCoupon(coupon)">点击领取</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: '',

  components: {},

  props: ['coupons'],

  data () {
    return {
      isloading: false
    }
  },

  computed: {},

  mouted () { },

  methods: {
    async receiveCoupon (coupon) {
      if (!this.userToken) {
        this.handlerLogin()
        return false
      }
      await this.getCategoryCoupon(coupon)
    },
    closeReceiveCoupon () {
      global.vbus.$emit('changeCouponModel', false)
    },
    getCategoryCoupon (coupon) {
      return this.$api['goods/getCategoryCoupon']({
        grantChannels: 1,
        discountNumber: coupon.couponCode,
        token: this.userToken,
        goodsCouponId: coupon.id
      }).then(res => {
        global.vbus.$emit('changeCouponModel', false)
        this.$toast('优惠券领取成功')
        return res.data
      }).catch(err => {
        console.log(err)
        let message = err.heads.message
        global.vbus.$emit('changeCouponModel', false)
        this.$toast(message)
      })
    }
  }

}

</script>

<style scoped lang="scss">
.ReceiveCoupon {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  &__wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-bottom: env(safe-area-inset-bottom);
    background-color: #fff;
  }
  &__title {
    height: 100px;
    line-height: 100px;
    font-size: 36px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #333;
    text-align: center;
  }
  &__content {
    height: 700px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    background-color: #f2f2f2;
  }
}
.coupons {
  padding: 20px;
}
.coupon {
  width: 722px;
  height: 212px;
  background: url("~@/assets/img/pay/list_goods_cash_coupon_nol@3x.png") no-repeat;
  background-size: 100% 100%;
  margin-bottom: 20px;
  display: flex;
  &.free {
    background: url("~@/assets/img/pay/list_goods_interest_nol@3x.png") no-repeat;
    background-size: 100% 100%;
    .btn {
      background-color: #FFA25B;
    }
    .big {
      color: #FFA25B;
    }
  }
  .desc {
    flex: 1;
    padding: 20px 0 0 40px;
    .big {
      margin-bottom: 4px;
      i {
        font-size: 40px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(245, 75, 120, 1);
        margin-right: 6px;
      }
      span {
        font-size: 70px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(245, 75, 120, 1);
        line-height: 98px;
      }
    }
    .small {
      position: relative;
      font-size: 20px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 28px;
      padding-left: 10px;
      &:before {
        position: absolute;
        left: 0;
        top: 11px;
        content: "";
        width: 6px;
        height: 6px;
        background: rgba(185, 185, 185, 1);
        border-radius: 50%;
      }
    }
  }
  .receive {
    width: 212px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
      width: 156px;
      height: 48px;
      background: rgba(245, 75, 120, 1);
      border-radius: 24px;
      font-size: 28px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      line-height: 48px;
      color: #fff;
      text-align: center;
    }
  }
}
.coupon:nth-last-child() {
  margin-bottom: 0;
}
</style>
