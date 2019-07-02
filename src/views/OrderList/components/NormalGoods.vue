<template>
	<div class="NormalGoods">
		<div class="left">
			<img v-lazy="goodsImageUrl" alt="">
		</div>
		<div class="right">
			<div class="name">{{goodsName}}</div>
			<div class="sku">{{skuProps | skuPropsFilter}}</div>
			<div class="price clearfix">
				<span class="fl" v-if="orderStatus === 0">月供:&yen;{{instalmentAmount | priceFilter}}起</span>
        <span class="fl" v-else>&yen;{{instalmentAmount | priceFilter}} X {{instalmentCount}}</span>
        <span class="fr">×{{goodsCount}}</span>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
// 普通订单 含0元助力 拼团 颜值卡 情侣卡 3c回收 卡密回收 虚拟卡充值
export default {
  name: '',
  props: ['order'],
  data () {
    return {}
  },
  computed: {
    goodsImageUrl () {
      return this.order && this.order.orderItems[0] && this.order.orderItems[0].goodsImageUrl
    },
    goodsName () {
      return this.order && this.order.orderItems[0] && this.order.orderItems[0].goodsName
    },
    skuProps () {
      return this.order && this.order.orderItems[0] && this.order.orderItems[0].skuProps
    },
    instalmentAmount () {
      return this.order && this.order.orderItems[0] && this.order.orderItems[0].instalmentAmount
    },
    instalmentCount () {
      return this.order && this.order.orderItems[0] && this.order.orderItems[0].instalmentCount
    },
    orderStatus () {
      return this.order && this.order.orderStatus
    },
    goodsCount () {
      return this.order && this.order.orderItems[0] && this.order.orderItems[0].goodsCount
    }
  },
  filters: {
    skuPropsFilter (arr) {
      if (!arr) return
      let result = ''
      arr.forEach(function (item, index, array) {
        result += item.pname + ':'
        result += item.pvalue + '; '
      })
      return result.slice(0, result.length - 2)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/scss/mixin.scss';

.NormalGoods {
  position: relative;
  padding: 19px 53px 18px 35px;
  // height: 110px;
  .left {
    position: absolute;
    top: 17px;
    left: 35px;
    width: 110px;
    height: 110px;
  }
  .right {
    margin-left: 145px;
    text-align: left;
    .name {
      width: 490px;
      height: 40px;
      font-size: 28px;
      font-weight: 600;
      color: #333;
      line-height: 40px;
      @include text-overflow(1);
    }
    .sku {
      height: 30px;
      font-size: 24px;
      font-weight: 400;
      color: #636363;
      line-height: 30px;
      margin-bottom: 10px;
      @include text-overflow(1);
    }
    .price {
      height: 37px;
      font-size: 24px;
      font-weight: 400;
      line-height: 37px;
      color: rgba(51, 51, 51, 1);
    }
  }
}
</style>
