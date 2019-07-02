<template>
	<div class="goodsDetailfooter">
		<div class="goodsDetailfooter__installment van-hairline--top">
			<div>月供:
				<span class="price">&yen;{{peroidInstalmentAmount | priceFilter}}</span>起
      </div>
		</div>
		<div class="goodsDetailfooter__buy" @click="buyGoods">
			<div class="link-wrap">
				{{secKillStatus ? '立即抢购' : '立即购买'}}
			</div>
		</div>
		<!-- <van-goods-action>
			<van-goods-action-mini-btn icon="cart" text="购物车" :info="carNums" @click="goShopcar" v-if="carNums"/>
			<van-goods-action-mini-btn icon="cart" text="购物车" @click="goShopcar" v-else/>
			<van-goods-action-big-btn text="加入购物车" @click="joinToShopcar"/>
			<van-goods-action-big-btn text="立即购买" primary @click="buyGoods"/>
		</van-goods-action> -->
	</div>
</template>

<script type="text/ecmascript-6">
import loginMixin from '@/mixins/login'
import { mapGetters } from 'vuex'

export default {
  name: '',
  mixins: [loginMixin],
  props: ['skuFlag', 'secKillStatus', 'goodsName', 'goodSource', 'thumbnailUrl', 'instalmentAmount', 'promotionPrice', 'goodsCode', 'peroidInstalmentAmount', 'tax', 'goodSourceName', 'isSelectOk', 'haitaoFlag', 'categoryTowCode'],
  data () {
    return {
      carNums: 0
    }
  },
  // created () {
  //   this.getShopCarList()
  // },
  methods: {
    goShopcar () {
      if (!this.userToken) {
        this.handlerLogin()
        return false
      }
      this.$router.push({
        name: 'shopCar'
      })
    },
    // 加入购物车
    async joinToShopcar () {
      if (!this.userToken) {
        this.handlerLogin()
        return false
      }
      this.$emit('isJoinCar', true)
      if (this.skuFlag) {
        // 打开sku面板
        this.$emit('openSku', true)
      } else {
        await this.joinCart()
        this.$router.push({
          name: 'shopCar'
        })
      }
    },
    // 购买商品
    async buyGoods () {
      if (!this.userToken) {
        this.handlerLogin()
        return false
      }
      this.$tj(`clickgoodsbuy`, { id: this.goodsCode })
      if (this.skuFlag && !this.isSelectOk) {
        // 打开sku面板
        this.$emit('openSku', true)
        this.$emit('isJoinCar', false)
      } else {
        // 将购买数据存储在sessionstorage中
        let currentBuyData = {
          code: this.goodsCode,
          skuCode: '',
          goodsNum: 1,
          goodSource: this.goodSource,
          skuFillStr: '',
          promotionPrice: this.promotionPrice,
          instalmentAmount: this.instalmentAmount,
          goodsImageUrl: this.thumbnailUrl,
          curSkuImg: '',
          goodsName: this.goodsName,
          tax: this.tax,
          goodSourceName: this.goodSourceName,
          haitaoFlag: this.haitaoFlag,
          productCategoryId: this.categoryTowCode
        }
        window.sessionStorage.setItem('currentBuyData', JSON.stringify(currentBuyData))
        this.$router.push({
          path: '/orderfill'
        })
      }
    },
    joinCart () {
      return this.$api['shopcar/joinCart']({
        'goodsSource': this.goodSource,
        'goodsCode': this.goodsCode,
        'skuCode': '',
        'goodsCount': 1
      }, {
        noStringify: true,
        headers: {
          token: this.userToken
        }
      })
    },
    // 获取购物车信息
    getShopCarList () {
      if (!this.userToken) return false
      return this.$api['shopcar/getShopCarList']({
        token: this.userToken
      }, {
        noShowDefaultError: true
      }).then(res => {
        this.carNums = res.cart.goods.length
      }).catch(err => {
        console.log(err)
        this.carNums = 0
      })
    }
  },
  computed: {
    ...mapGetters(['userToken', 'userId', 'userWeiboMark'])
  }
}
</script>

<style scoped lang="scss">
.goodsDetailfooter {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  z-index: 199;
  background-color: #fff;
  justify-content: flex-start;
  padding: constant(safe-area-inset-top) constant(safe-area-inset-right)
  constant(safe-area-inset-bottom) constant(safe-area-inset-left);
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
  env(safe-area-inset-bottom) env(safe-area-inset-left);
  &__installment,
  &__buy {
    height: 100px;
    font-size: 32px;
    font-family: PingFangSC-Medium;
  }
  &__installment {
    flex: 1;
    background-color: #fff;
    line-height: 100px;
    font-family: PingFangSC-Regular;
    text-align: left;
    padding-left: 30px;
    box-sizing: border-box;
    > div {
      display: inline-block;
      font-size: 28px;
    }
    span {
      font-size: 34px;
      color: #ed145b;
      font-family: PingFangSC-Medium;
      font-weight: bold;
      margin: 0 5px;
    }
  }
  &__buy {
    width: 330px;
    background-color: #f54b78;
    line-height: 100px;
    font-weight: bold;
    color: #fff;
    text-align: center;
  }
}
.newuser-text {
  font-size: .293333rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(153,153,153,1);
  line-height:30px;
}
</style>
