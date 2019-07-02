<template>
	<div class="OrderPayInfoList">
		<div class="OrderPayInfoList__info" ref="info">
			<div>合计需还</div>
			<div>&yen;{{repaymentSum | priceFilter}}</div>
			<div>含手续费&yen;{{serviceAmountSum | priceFilter}}</div>
			<div class="info" @click="jumpToRepay">
				<span>还款说明</span>
				<img src="~@/assets/img/pay/type_interrogation_a@3x.png" alt="">
			</div>
		</div>
		<div class="OrderPayInfoList__list" ref="list">
			<ul class="list">
				<li class="van-hairline--bottom">
					<span>收支明细</span>
					<span>月供</span>
					<span>本金</span>
					<span>手续费</span>
				</li>
				<li :class="{'van-hairline--bottom': index !== installmentPlan.length - 1}" v-for="(item, index) in installmentPlan" :key="index">
					<span>{{item.bsCode}}/{{installmentNum}}</span>
					<span>{{item.repaymentAmount | priceFilter}}</span>
					<span>{{(item.repaymentAmount - item.counterFee) | priceFilter}}</span>
					<span>{{item.counterFee | priceFilter}}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'OrderPayInfoList',
  props: {},
  data () {
    return {
      orderCode: '',
      amount: '',
      freeDay: '',
      periods: '',
      infodata: null
    }
  },
  computed: {
    serviceAmountSum () {
      return this.infodata && this.infodata.serviceAmountSum
    },
    repaymentSum () {
      return this.infodata && this.infodata.repaymentSum
    },
    installmentPlan () {
      return this.infodata && this.infodata.installmentPlan
    },
    installmentNum () {
      return this.infodata && this.infodata.installmentNum
    }
  },
  mounted () {
    console.log('mounted')
    this.orderCode = this.getQueryString('orderCode')
    this.amount = this.getQueryString('amount')
    this.freeDay = this.getQueryString('freeDay')
    this.periods = this.getQueryString('periods')
    this.getElephantPayInfo()
    // let infoHeight = this.$refs.info.getBoundingClientRect().height
    // let bodyHeight = document.documentElement.clientHeight
    // let listHeight = bodyHeight - infoHeight - 20
    // this.$refs.list.style.maxHeight = listHeight + 'px'
  },
  methods: {
    // 跳转到还款说明页面
    jumpToRepay () {
      location.href = 'https://cdn.basestonedata.com/app/service/repay.html'
    },
    getElephantPayInfo () {
      return this.$api['pay/getElephantPayInfo']({
        'orderCode': this.orderCode, // 订单号
        'amount': this.amount, // 分期金额
        'freeDay': this.freeDay, // 免息天数
        'periods': this.periods, // 分期期数
        'token': this.userToken
      }).then(res => {
        this.infodata = res.data
        console.log(res)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.OrderPayInfoList {
  text-align: center;
  &__info {
    background: #fff;
    padding: 58px 0;
    box-sizing: border-box;
    margin-bottom: 20px;
    position: relative;
    .info {
      position: absolute;
      top: 30px;
      right: 30px;
      height: 40px;
      line-height: 40px;
      vertical-align: bottom;
      span {
        display: inline-block;
        height: 39px;
        font-size: 28px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #939393;
        line-height: 39px;
        vertical-align: bottom;
        margin-right: 4px;
      }
      img {
        display: inline-block;
        vertical-align: bottom;
        width: 40px;
        height: 40px;
      }
    }
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
        margin-top: 12px;
        height: 84px;
        font-size: 60px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: #ed145b;
        line-height: 84px;
      }
      &:nth-of-type(3) {
        margin-top: 8px;
        height: 40px;
        font-size: 28px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #939393;
        line-height: 40px;
      }
    }
  }
  &__list {
    padding: 18px 30px 0;
    background-color: #fff;
    // overflow-y: scroll;
    // -webkit-overflow-scrolling: touch;
    .list {
      li {
        display: flex;
        justify-content: flex-start;
        color: #333;
        font-size: 28px;
        &:nth-of-type(1) {
          color: #636363;
        }
        span {
          flex: 1;
          margin-right: 30px;
          line-height: 90px;
          height: 90px;
          &:nth-of-type(4) {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
