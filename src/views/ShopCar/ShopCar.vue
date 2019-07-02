<template>
	<div class="shopcar">
    <div class="shopcar__loading" v-if="!reqReady">
      <img src="~@/assets/img/loadding.gif" alt="">
    </div>
		<div class="shopcar__list" v-else-if="reqReady && carList && carList.length">
			<van-swipe-cell :right-width="69" v-for="(item, index) in carList" :key="index" class="listItem">
				<div class="listItem__body clearfix" @click="jumpToGoodsDetail(item)">
					<div class="selectIcon" @click.stop.prevent="changeSelect(index)">
						<img src="~@/assets/img/list_icon_selec_nol1@3x.png" alt="" v-if="!item.select">
						<img src="~@/assets/img/list_icon_sel@3x.png" alt="" v-else>
					</div>
					<div class="goodsImg">
						<img :src="item.thumbnailUrl" alt="">
					</div>
					<div class="goodsInfo">
						<div class="name">{{item.goodsName}}</div>
						<div class="sku">
							<span v-if="item.skuFlag">{{item.goodsName}}</span>
						</div>
						<div class="price">&yen;{{item.promotionPrice | priceFilter}}</div>
						<div class="mix clearfix">
							<div class="instalment fl">月供:<span>&yen;{{item.peroidInstalmentAmount * item.goodsNum | priceFilter}}</span>起</div>
							<div class="numCn fr clearfix">
								<span class="sub" @click.stop.prevent="updateShopcarGoods(item, 0)">
									<img src="~@/assets/img/list_icon_cut_dis@3x.png" alt="">
								</span>
								<span class="num">{{item.goodsNum}}</span>
								<span class="add" @click.stop.prevent="updateShopcarGoods(item, 1)">
									<img src="~@/assets/img/list_icon_add_dis@3x.png" alt="">
								</span>
							</div>
						</div>
					</div>
				</div>
				<div slot="right" class="swiperRight" @click="deleteShopcarGoods(item)">删除</div>
			</van-swipe-cell>
		</div>
		<div class="shopcar__nodata" v-else>
			<img src="~@/assets/img/classify/blankpage_img_search@3x.png" alt="">
			<p>当前的购物车是空的，赶快去添加哦！</p>
		</div>
		<div class="shopcar__recommend" v-if="goodVoList && goodVoList.length">
			<div class="title">— 为你推荐 —</div>
			<van-list class="recommendlist" v-model="loading" :finished="finished" @load="getRecommend" :immediate-check="false">
				<div class="goods" v-for="(item, index) in goodVoList" :key="index">
					<div class="goodsImg">
						<img :src="item.thumbnailUrl" alt="">
					</div>
					<div class="goodsName">
						{{item.goodsName}}
					</div>
					<div class="goodsPrice">
						<span><i>&yen;</i>{{item.peroidInstalmentAmount | priceFilter}}</span>
						x{{item.instalmentPeriods}}期
					</div>
				</div>
			</van-list>
		</div>
		<div class="shopcar__footer clearfix" v-if="carList && carList.length">
			<div class="payBtn fr" @click="goPayFill ">结算</div>
			<div class="footerInfo fr">
				<div>月供:<span>&yen;{{currentInstalmentAmount | priceFilter}}</span>起</div>
				<div>原价:&nbsp;&yen;{{currentPromotionPrice * currentGoodsNum | priceFilter}}</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  props: {},
  data () {
    return {
      carData: null,
      carList: null,
      currentPromotionPrice: 0,
      currentInstalmentAmount: 0,
      currentGoodsSource: '',
      currentGoodsCode: '',
      currentSkuCode: '',
      currentGoodsName: '',
      currentGoodsNum: '',
      currentGoodsImg: '',
      currentSkuFillStr: '',
      noSelect: true,
      goodVoList: null,
      loading: false,
      finished: false,
      pageNum: 1,
      reqReady: false
    }
  },
  async created () {
    try {
      await this.getShopCarList()
      await this.getRecommend()
      this.reqReady = true
    } catch (error) {
      this.reqReady = true
    }
  },
  methods: {
    jumpToGoodsDetail (item) {
      this.$router.push({
        name: 'GoodsDetail',
        params: {
          id: item.goodsCode,
          goodSource: item.goodSource
        }
      })
    },
    changeSelect (index) {
      let noSelect = true
      this.carList.forEach((item, ins) => {
        if (index === ins) {
          this.$set(this.carList[ins], 'select', !this.carList[ins]['select'])
          if (this.carList[ins]['select']) {
            noSelect = false
            this.currentPromotionPrice = this.carList[ins].promotionPrice
            this.currentInstalmentAmount = this.carList[ins].peroidInstalmentAmount * this.carList[ins].goodsNum
            this.currentGoodsSource = this.carList[ins].goodSource
            this.currentGoodsCode = this.carList[ins].goodsCode
            this.currentSkuCode = this.carList[ins].skuCode
            this.currentGoodsName = this.carList[ins].goodsName
            this.currentGoodsNum = this.carList[ins].goodsNum
            this.currentGoodsImg = this.carList[ins].thumbnailUrl
            this.currentSkuFillStr = this.carList[ins].title
          } else {
            this.currentPromotionPrice = 0
            this.currentInstalmentAmount = 0
            this.currentGoodsSource = ''
            this.currentGoodsCode = ''
            this.currentSkuCode = ''
            this.currentGoodsName = ''
            this.currentGoodsNum = 0
            this.currentGoodsImg = ''
            this.currentSkuFillStr = ''
          }
        } else {
          this.$set(this.carList[ins], 'select', false)
        }
      })
      this.noSelect = noSelect
    },
    goPayFill () {
      if (this.noSelect) return false
      let currentBuyData = {
        code: this.currentGoodsCode,
        skuCode: this.currentSkuCode,
        goodsNum: this.currentGoodsNum,
        goodSource: this.currentGoodsSource,
        skuFillStr: this.currentSkuFillStr,
        promotionPrice: this.currentPromotionPrice,
        instalmentAmount: this.currentInstalmentAmount,
        goodsImageUrl: this.currentGoodsImg,
        curSkuImg: this.currentGoodsImg,
        goodsName: this.currentGoodsName
      }
      console.log('跳转')
      window.sessionStorage.setItem('currentBuyData', JSON.stringify(currentBuyData))
      this.$router.push({
        name: 'OrderFill'
      })
    },
    async onLoad () {
      // 上拉加载
      this.pageNum++
      await this.getRecommend()
    },
    // 删除购物车商品
    deleteShopcarGoods (item) {
      this.currentGoodsSource = item.goodSource
      this.currentGoodsCode = item.goodsCode
      this.currentSkuCode = item.skuCode
      return this.$api['shopcar/deleteGoods']({
        'skuGoodsVoList': [
          {
            'goodsSource': this.currentGoodsSource,
            'goodsCode': this.currentGoodsCode,
            'skuCode': this.currentSkuCode
          }
        ]
      }, {
        noStringify: true,
        headers: {
          token: this.userToken
        }
      }).then(async res => {
        await this.getShopCarList()
      })
    },
    // 增减购物车商品
    updateShopcarGoods (item, mode) {
      if (item.goodsNum === 1 && mode === 0) return false
      this.currentGoodsSource = item.goodSource
      this.currentGoodsCode = item.goodsCode
      this.currentSkuCode = item.skuCode
      return this.$api['shopcar/updateGoods']({
        'goodsSource': this.currentGoodsSource,
        'goodsCode': this.currentGoodsCode,
        'skuCode': this.currentSkuCode,
        'mode': mode
      }, {
        noStringify: true,
        headers: {
          token: this.userToken
        }
      }).then(async res => {
        await this.getShopCarList()
      })
    },
    // 获取购物车信息
    getShopCarList () {
      return this.$api['shopcar/getShopCarList']({
        token: this.userToken
      }, {
        noShowLoading: true
      }).then(res => {
        this.carData = res.cart
        this.carList = res.cart.goods
        this.carList.forEach((item, index) => {
          this.$set(this.carList[index], 'select', false)
        })
      })
    },
    // 获取购物车推荐商品
    getRecommend () {
      let skuGoodsVoList = this.carList.map(item => {
        return {
          'goodsCode': item.goodsCode,
          'goodsCount': item.goodsNum,
          'skuCode': item.skuCode,
          'goodsSource': item.goodSource
        }
      })
      return this.$api['shopcar/goodsRecommend']({
        pageNum: 1,
        skuGoodsVoList: skuGoodsVoList
      }, {
        headers: {
          token: this.userToken
        },
        noShowLoading: true,
        noStringify: true
      }).then(res => {
        let goodCount = res.data.goodsCount
        if (!goodCount) {
          this.finished = true
        } else {
          this.finished = this.pageNum >= (goodCount / 4)
        }
        if (!this.goodVoList) this.goodVoList = res.data.goodVoList || null
        else this.goodVoList = [...this.goodVoList, ...res.data.goodVoList]
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/scss/mixin.scss';
.shopcar {
  padding-bottom: 128px;
  &__loading {
    text-align: center;
    img {
      margin-top: 500px;
      width: 300px;
      height: 300px;
    }
  }
  &__list {
    .listItem {
      background-color: #fff;
      margin-top: 20px;
    }
  }
  &__footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 108px;
    background: #fff;
    z-index: 100;
    .payBtn {
      height: 108px;
      width: 200px;
      line-height: 108px;
      font-size: 30px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #fff;
      text-align: center;
      background-color: #f54b78;
    }
    .footerInfo {
      margin: 18px 20px 0 0;
      div {
        text-align: right;
        &:nth-of-type(1) {
          height: 40px;
          font-size: 28px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 40px;
          span {
            color: #ed145b;
            font-family: PingFangSC-Medium;
          }
        }
        &:nth-of-type(2) {
          height: 33px;
          font-size: 24px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          line-height: 33px;
        }
      }
    }
  }
  &__nodata {
    text-align: center;
    img {
      margin-top: 10px;
      width: 360px;
      height: 360px;
    }
    p {
      height: 40px;
      font-size: 28px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 40px;
    }
  }
  &__recommend {
    margin-top: 120px;
    padding: 0 20px;
    .title {
      text-align: center;
      height: 41px;
      font-size: 29px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #333;
      line-height: 41px;
      margin-bottom: 40px;
    }
    .recommendlist {
      .goods {
        display: inline-block;
        width: 345px;
        height: 500px;
        margin: 0 20px 20px 0;
        background-color: #fff;
        &:nth-of-type(2n) {
          margint: 0 0 20px 0;
        }
        .goodsImg {
          margin-bottom: 20px;
        }
        .goodsName {
          padding: 0 20px;
          height: 70px;
          font-size: 24px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: #333;
          line-height: 35px;
          @include text-overflow(2);
        }
        .goodsPrice {
          color: #999999;
          height: 40px;
          font-size: 24px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          line-height: 40px;
          text-align: center;
          span {
            color: #ed145b;
            font-size: 28px;
            font-family: PingFangSC-Medium;
            font-weight: 500;
            line-height: 40px;
            i {
              font-size: 24px;
              line-height: 40px;
            }
          }
        }
      }
    }
  }
}
.listItem {
  &__body {
    height: 228px;
    padding: 24px 30px;
    box-sizing: border-box;
    > div {
      float: left;
    }
    .selectIcon {
      margin-right: 20px;
      img {
        margin-top: 71px;
        width: 38px;
        height: 38px;
      }
    }
    .goodsImg {
      margin-right: 20px;
      img {
        width: 180px;
        height: 180px;
      }
    }
    .goodsInfo {
      width: 432px;
      .name {
        height: 40px;
        font-size: 28px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 40px;
        margin-bottom: 10px;
        @include text-overflow(1);
      }
      .sku {
        height: 33px;
        font-size: 24px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 33px;
        margin-bottom: 13px;
        @include text-overflow(1);
      }
      .price {
        height: 33px;
        font-size: 24px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 33px;
        margin-bottom: 5px;
      }
      .mix {
        height: 42px;
        .instalment {
          margin-top: 2px;
          height: 40px;
          line-height: 40px;
          font-size: 24px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          span {
            height: 40px;
            font-size: 28px;
            font-family: PingFangSC-Medium;
            font-weight: 500;
            color: rgba(237, 20, 91, 1);
            line-height: 40px;
          }
        }
        .numCn {
          .sub,
          .add {
            float: left;
            img {
              width: 40px;
              height: 40px;
            }
          }
          .num {
            float: left;
            width: 60px;
            height: 40px;
            font-size: 28px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 40px;
            text-align: center;
          }
        }
      }
    }
  }
}
.swiperRight {
  width: 138px;
  background-color: #e43129;
  height: 228px;
  font-size: 28px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #fff;
  line-height: 228px;
  text-align: center;
}
</style>
