<template>
	<div class="OrderPayFreeList">
		<div class="OrderPayFreeList__Container" v-if="coupons.length">
      <div class="OrderPayFreeList__tip" @click="goToUseIllustration">
        <img src="~@/assets/img/pay/shuoming-icon-ab@3x.png" alt="">
        <span>优惠券使用说明</span>
      </div>
			<div class="OrderPayFreeList__list">
				<div class="OrderPayFreeList__item" :class="{active: item.isSelect}" v-for="(item, index) in coupons" :key="index" @click="selectCoupon(item, index)">
					<div class="left">
						<div class="name">{{item.couponName}}</div>
						<!-- <div class="desc">{{item.ruleList | ruleFilter}}</div> -->
            <div class="desc">
              <p v-for="(rule, index) in item.ruleList" :key="index">
                {{rule}}
              </p>
            </div>
						<div class="desc">有效期至：{{item.useDeadline}}</div>
					</div>
					<div class="right">
						<div>
							<span>{{item.unit / 30}}</span>期
						</div>
					</div>
				</div>
			</div>
      <div class="OrderPayFreeList__confirm" @click="BackToPrev">确定</div>
		</div>
    <div class="noData" v-else>
      <img src="~@/assets/img/pay/blankpage_img_search@3x.png" alt="">
      <p>亲，您暂时没有可用优惠券哦～</p>
    </div>
	</div>
</template>

<script type="text/ecmascript-6">

export default {
  name: 'OrderPayFreeList',
  props: {},
  data () {
    return {
      coupons: [],
      currentCoupon: null,
      isChildOrder: '',
      orderCode: '',
      couponCode: '',
      setOrderCode: ''
    }
  },
  created () {
    this.orderCode = this.getQueryString('orderCode')
    this.goodsCode = this.getQueryString('goodsCode')
    this.couponCode = this.getQueryString('couponCode')
    this.setOrderCode = this.getQueryString('setOrderCode')
    console.log('payFreeCoupons', JSON.parse(window.sessionStorage.getItem('payFreeCoupons')))
    this.coupons = JSON.parse(window.sessionStorage.getItem('payFreeCoupons'))
  },
  methods: {
    goToUseIllustration () {
      location.href = 'https://cdn.basestonedata.com/app/service/newcoupon.html'
    },
    BackToPrev () {
      window.sessionStorage.setItem('payFreeCoupons', JSON.stringify(this.coupons))
      this.$router.go(-1)
    },
    selectCoupon (coupon, index) {
      this.coupons.forEach((item, ins) => {
        if (ins === index) {
          this.coupons[ins]['isSelect'] = !this.coupons[ins]['isSelect']
        } else {
          this.coupons[ins]['isSelect'] = false
        }
      })
    }
  },
  filters: {
    ruleFilter (val) {
      if (Array.isArray(val)) {
        return val.toString()
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.noData {
  text-align: center;
  padding-top: 100px;
  img {
    width: 360px;
    height: 360px;
    margin-bottom: 12px;
  }
  p {
    height:40px;
    font-size:28px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:40px;
  }
}
.OrderPayFreeList {
  padding: 24px 14px 112px;
  &__tip {
    padding: 5px 0 24px;
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
  &__item {
    display: flex;
    width: 712px;
    // height: 212px;
    margin-bottom: 12px;
    background: url("~@/assets/img/list_goods_interest_nol@3x.png") no-repeat;
    background-size: 100% 100%;
    &.active {
      background: url("~@/assets/img/list_goods_interest_sel@3x.png") no-repeat;
      background-size: 100% 100%;
    }
    .left {
      width: 506px;
      padding: 32px 0 38px 46px;
      text-align: left;
      box-sizing: border-box;
      .name {
        height: 42px;
        font-size: 30px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 42px;
        margin-bottom: 26px;
      }
      .desc {
        // height: 33px;
        margin-bottom: 8px;
        font-size: 24px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 33px;
        &:nth-of-type(2) {
          margin-bottom: 0;
        }
      }
    }
    .right {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28px;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: rgba(243, 131, 71, 1);
      line-height: 95px;
      span {
        height: 95px;
        font-size: 68px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        line-height: 95px;
      }
    }
  }
  &__confirm {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    line-height: 100px;
    color: #ed145b;
    font-size: 32px;
    text-align: center;
    background-color: #fff;
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
