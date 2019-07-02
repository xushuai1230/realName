<template>
	<div class="OrderPaySuccess">
		<div class="OrderPaySuccess__img">
			<img src="~@/assets/img/pay/icon_rembursement@3x.png" alt="">
		</div>
		<div class="OrderPaySuccess__desc">
			<h4>支付成功，正在备货中…</h4>
			<p>小象将立即为您准备商品，请耐心等待收货</p>
		</div>
		<div class="OrderPaySuccess__btn clearfix">
			<div class="btn" @click="jumpToHome">继续逛逛</div>
			<div class="btn" @click="jumpToOrderList">查看订单</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'OrderPaySuccess',
  props: {},
  methods: {
    jumpToHome () {
      this.$router.replace({
        name: 'shopHome'
      })
    },
    jumpToOrderList () {
      this.$router.replace({
        name: 'OrderList',
        params: {
          type: 1
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.OrderPaySuccess {
  text-align: center;
  &__img {
    padding-top: 171px;
    text-align: center;
    margin-bottom: 40px;
    img {
      width: 441px;
      height: 402px;
    }
  }
  &__desc {
    h4 {
      height: 48px;
      font-size: 34px;
      font-weight: 400;
      color: #333;
      line-height: 49px;
      margin-bottom: 27px;
    }
    p {
      height: 33px;
      font-size: 28px;
      font-weight: 400;
      color: #939393;
      line-height: 33px;
      margin-bottom: 90px;
    }
  }
  &__btn {
    padding: 0 55px;
    .btn {
      width: 310px;
      height: 88px;
      border-radius: 4px;
      font-size: 32px;
      font-weight: 400;
      color: #fff;
      line-height: 88px;
      text-align: center;
      float: left;
      &:nth-of-type(1) {
        background: rgba(255, 148, 80, 1);
        margin-right: 20px;
      }
      &:nth-of-type(2) {
        background: #f54b78;
      }
    }
  }
}
</style>
