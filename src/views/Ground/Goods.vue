<template>
	<div class="goods" v-if="goodsShow">
		<div class="goods__list" :class="lineShow ? 'line3': 'line2'">
			<a class="good" :href="linkHref" v-for="good in childGoodsList" :key="good.id" @click="jumpToGoodsDetail(good)">
				<!-- 商品右上角图片标识 -->
				<img :src="good.labelImgUrl" class="pos-flag" v-if="good.labelImgUrl" alt="">
				<!-- 商品图片 -->
				<div class="good__imgwrap">
					<img v-lazy="good.thumbnailUrl">
				</div>
				<!-- 商品描述 -->
				<div class="good__tip">
					<p class="shop-name">{{good.goodsName}}</p>
					<p class="fen">
						<i>&yen;</i><span>{{good.originalPrice / 12 | payByMonth}}</span>x12期
					</p>
					<span v-if="good.directPaymentAmount > 0" class="count">{{good.directPaymentAmount | directPay}}</span>
				</div>
			</a>
		</div>
	</div>
</template>
<script type="text/javascript">

export default {
  props: [
    'childGoods', 'lineShow', 'linkHref'
  ],
  data () {
    return {}
  },
  computed: {
    childGoodsList () {
      return this.childGoods && this.childGoods.goods
    },
    goodsShow () {
      return this.childGoodsList && this.childGoods.goods.length
    }
  },
  methods: {
    jumpToGoodsDetail (good) {
      this.$router.push({
        name: 'GoodsDetail',
        params: {
          id: good.goodsCode,
          goodSource: good.goodSource
        }
      })
    }
  },
  filters: {
    payByMonth (value) { // 分期金额
      var payPrice = (value / 100).toFixed(2)
      return `${payPrice}`
    },
    directPay (value) { // 直付立减
      return `直付立减${(value / 100).toFixed(2)}`
    }
  }
}
</script>
<style lang="scss">
// .ground {
//   &__tabs {
//     [class*="van-hairline"]::after {
//       display: none;
//     }
//     .van-tab {
//       font-size: 28px;
//     }
//   }
// }
</style>

<style scoped lang="scss">
@import "../../assets/scss/mixin.scss";

.good {
  position: relative;
  display: inline-block;
  background: #fff;
  margin-bottom: 20px;
  .pos-flag {
    position: absolute;
  }
}
.goods {
  padding: 20px;
  background: #f2f2f2;
  &__list {
    text-align: left;
    margin-bottom: -20px;
    &.line3 {
      .good {
        width: 223px;
        .pos-flag {
          width: 90px;
          height: 90px;
        }
        &:nth-of-type(3n + 2) {
          margin: 0 20px 20px;
        }
        &__imgwrap {
          padding: 0;
        }
        &__tip {
          padding: 20px;
          text-align: center;
          .pos-flag {
            position: absolute;
            top: 0;
            left: 0;
            width: 1.2rem;
          }
          .shop-name {
            width: 183px;
            height: 58px;
            font-size: 24px;
            font-family: PingFangSC-Regular;
            color: #333;
            line-height: 30px;
            margin-bottom: 12px;
            @include text-overflow(2);
          }
          .fen {
            color: #939393;
            font-size: 20px;
            font-family: PingFangSC-Regular;
            line-height: 30px;
            i {
              color: #ed145b;
              font-size: 24px;
            }
            span {
              color: #ed145b;
              font-size: 28px;
              line-height: 30px;
            }
          }
        }
      }
    }
    &.line2 {
      .good {
        .pos-flag {
          width: 110px;
          height: 110px;
        }
        width: 345px;
        &:nth-of-type(2n + 1) {
          margin-right: 20px;
        }
        &__tip {
          padding: 20px;
          text-align: center;
          .pos-flag {
            position: absolute;
            top: 0;
            left: 0;
            width: 1.2rem;
          }
          .shop-name {
            width: 305px;
            height: 58px;
            font-size: 24px;
            font-family: PingFangSC-Regular;
            color: #333;
            line-height: 30px;
            margin-bottom: 12px;
            @include text-overflow(2);
          }
          .fen {
            color: #939393;
            font-size: 20px;
            font-family: PingFangSC-Regular;
            line-height: 30px;
            i {
              color: #ed145b;
              font-size: 24px;
            }
            span {
              color: #ed145b;
              font-size: 28px;
              line-height: 30px;
            }
          }
        }
      }
    }
  }
}
</style>
