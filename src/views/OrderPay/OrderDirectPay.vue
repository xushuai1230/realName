<template>
	<div class="OrderDirectPay">
		<div class="OrderDirectPay__info">
			<div>实付金额</div>
			<div v-show="dealWithAmount">
        &yen;{{dealWithAmount | priceFilter}}
      </div>
		</div>
		<div class="OrderDirectPay__list">
			<div class="listItem van-hairline--bottom" v-show="false">
				<div class="left">
					<img src="~@/assets/img/pay/list_icon_zhifubao@3x.png" alt="">
					<span>支付宝支付</span>
				</div>
				<div class="right">
					<img src="~@/assets/img/list_icon_enter_nol@3x.png" alt="">
				</div>
			</div>
      <div class="listItem">
				<div class="left">
					<img src="~@/assets/img/pay/list_icon_pay_xiaoxiang@3x.png" alt="">
					<span>去小象app还款</span>
				</div>
				<div class="right">
					<img src="~@/assets/img/list_icon_enter_nol@3x.png" alt="">
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'OrderDirectPay',
  props: {},
  data () {
    return {
      orderCode: '',
      infodata: null
    }
  },
  computed: {
    dealWithAmount () {
      return this.infodata && this.infodata.dealWithAmount
    }
  },
  mounted () {
    this.orderCode = this.$route.params.orderCode || this.$route.query.orderCode
    this.getCashierData()
  },
  methods: {
    getCashierData () {
      return this.$api['cashierdesk/queryOrderAmountInfo']({
        orderCode: this.orderCode,
        token: this.userToken
      }).then(res => {
        this.infodata = res.data
      })
    }
  }
}
</script>

<style scoped lang="scss">
.OrderDirectPay {
  text-align: center;
  &__info {
    height: 300px;
    background: #fff;
    padding-top: 58px;
    box-sizing: border-box;
    margin-bottom: 20px;
    div {
      &:nth-of-type(1) {
        height: 40px;
        font-size: 28px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #333;
        line-height: 40px;
      }
      &:nth-of-type(2) {
        margin-top: 8px;
        height: 84px;
        font-size: 60px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #333;
        line-height: 84px;
      }
    }
  }
  &__list {
    .listItem {
      display: flex;
      justify-content: space-between;
      padding: 15px 20px;
      background-color: #fff;
      .left {
        img {
          width: 58px;
          height: 58px;
          margin-right: 10px;
        }
        span {
          display: inline-block;
          height: 40px;
          font-size: 28px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: #333;
          line-height: 40px;
          margin-top: 9px;
        }
      }
      .right {
        img {
          width: 44px;
          height: 44px;
          margin-top: 7px;
        }
      }
    }
  }
}
</style>
