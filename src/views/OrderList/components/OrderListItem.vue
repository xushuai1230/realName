<template>
	<div class="OrderListItem" @click="jumpToOrderDetail">
		<div class="OrderListItem__title van-hairline--bottom">
			<div class="orderIcon order-type-goods"></div>
			<div class="orderType">商品订单</div>
			<div class="orderStatus">{{orderStatus | loveStatusFilter}}</div>
		</div>
		<div class="OrderListItem__goods">
			<normal-goods :order="order"></normal-goods>
		</div>
		<div class="OrderListItem__downpay van-hairline--top" v-if="downpayAmount &&  downpayAmount > 0">
			<span>首付:&nbsp;</span>
			<span>&yen;{{downpayAmount | priceFilter}}</span>
		</div>
		<div class="OrderListItem__price van-hairline--top">
			<!-- 普通订单 -->
			<div class="normalPrice clearfixclearfix">
				<div class="money fl">
					<span>实付:&nbsp;</span><span>&yen;{{dealWithAmount | priceFilter}}</span>
				</div>
				<order-btn class="fnbtns fr" :order="order" :type="type"></order-btn>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import OrderBtn from '@/components/OrderBtn/OrderBtn'
import NormalGoods from './NormalGoods'
export default {
  name: '',
  props: [
    'order', 'type'
  ],
  computed: {
    orderCode () {
      return this.order && this.order.orderCode
    },
    orderType () {
      return String(this.orderCode).slice(0, 2)
    },
    mergeOrderFlag () {
      return this.order && this.order.mergeOrderFlag
    },
    orderStatus () {
      return this.order && this.order.orderStatus
    },
    downpayAmount () {
      return this.order && this.order.downpayAmount
    },
    instalmentAmount () {
      return this.order && this.order.instalmentAmount
    },
    dealWithAmount () {
      return this.order && this.order.dealWithAmount
    }
  },
  methods: {
    jumpToOrderDetail () {
      this.$router.push({
        name: 'OrderDetail',
        params: {
          orderCode: this.orderCode
        }
      })
    }
  },
  filters: {
    loveStatusFilter (val) {
      if (typeof val === 'undefined') {
        return ''
      }
      let LovetatusEnum = {
        '0': '等待付款',
        '21': '已取消',
        '22': '已取消',
        '94': '订单确认中',
        '95': '订单确认中',
        '96': '订单确认中',
        '91': '审核未通过',
        '40': '待绑卡',
        '86': '待付首付',
        '41': '备货中',
        '51': '已发货',
        '61': '交易成功',
        '102': '交易取消'
      }
      return LovetatusEnum[val.toString()]
    }
  },
  components: {
    OrderBtn,
    NormalGoods
  }
}

</script>

<style scoped lang="scss">
.OrderListItem {
  background-color: #fff;
  margin-bottom: 20px;
  &__title {
    position: relative;
    padding: 16px 26px;
    text-align: left;
    font-size: 0;
    > div {
      display: inline-block;
      vertical-align: middle;
    }
    .orderIcon {
      width: 44px;
      height: 44px;
      background: url("~@/assets/img/order/oricon1.png") no-repeat;
      background-size: 100% 100%;
      margin-right: 8px;
      &.order-type-goods {
        background-image: url("~@/assets/img/order/oricon9.png");
      }
      &.order-type-ping,
      &.order-type-zero {
        background-image: url("~@/assets/img/order/oricon12.png");
      }
      &.order-type-vr {
        background-image: url("~@/assets/img/order/oricon7.png");
      }
      &.order-type-train {
        background-image: url("~@/assets/img/order/oricon5.png");
      }
      &.order-type-bus {
        background-image: url("~@/assets/img/order/oricon6.png");
      }
      &.order-type-food {
        background-image: url("~@/assets/img/order/oricon1.png");
      }
      &.order-type-hotel {
        background-image: url("~@/assets/img/order/oricon11.png");
      }
      &.order-type-airplane {
        background-image: url("~@/assets/img/order/oricon10.png");
      }
      &.order-type-cinema {
        background-image: url("~@/assets/img/order/oricon13.png");
      }
      &.order-type-bargain {
        background-image: url("~@/assets/img/order/oricon8.png");
      }
    }
    .orderType {
      height: 37px;
      font-size: 28px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 37px;
    }
    .orderStatus {
      position: absolute;
      right: 31px;
      top: 20px;
      height: 37px;
      font-size: 28px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(237, 20, 91, 1);
      line-height: 37px;
    }
  }
  &__goods {
  }
  &__downpay {
    background: #fff;
    padding: 0 0.373333rem;
    height: 1.066667rem;
    line-height: 1.016rem;
    font-size: 28px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    span:nth-of-type(2) {
      color: #f54b78;
    }
  }
  &__price {
    .normalPrice {
      height: 54px;
      padding: 12px 24px 12px 30px;
      .money {
        height: 54px;
        font-size: 28px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 54px;
        span:nth-of-type(2) {
          color: #ed145b;
        }
      }
    }
  }
}
</style>
