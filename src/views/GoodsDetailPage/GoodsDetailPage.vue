<template>
	<div class="goodsDetail">
		<div class="goodsDetail__wrap">
			<div class="goodsDetail__container" v-show="!pageLoadErr">
				<!-- 商品标题 -->
				<div class="goodsDetail__thumbnailImg">
					<van-swipe :autoplay="3000">
						<van-swipe-item v-for="(image, index) in brandImgList" :key="index">
							<img v-lazy="image" />
						</van-swipe-item>
					</van-swipe>
					<div class="labelImgUrl" v-if="labelImgUrl">
						<img :src="labelImgUrl" alt="">
					</div>
				</div>
				<!-- 秒杀 -->
				<!-- <goods-seckill v-if="isSecKillGoods" :goodsDetailData="goodsDetailData" :secKillStatus="secKillStatus" :systemTime="systemTime" @changeStatus="changeStatus" @closeSecKill="closeSecKill"></goods-seckill> -->
				<!-- 商品价格 -->
				<goods-subTitle :goodsDetailData="goodsDetailData" :isSecKillGoods="isSecKillGoods" :secKillStatus="secKillStatus" :instalmentAmount="instalmentAmount" :promotionPrice="promotionPrice" :lookingCardStatus="lookingCardStatus"></goods-subTitle>
				<goods-sku :joinCar="joinCar" :startSku="skuStatus" :sku="goodsDetailData" :goodsImg="thumbnailUrl" :categoryTowCode="categoryTowCode" @openSku="openSku" @selectTxt="selectTxt"></goods-sku>
				<!-- 商品额外信息 -->
				<goods-additional :goodsDetailData="goodsDetailData" :goodsCoupon="goodsCoupon" :isSelectOk="isSelectOk" :skuBuyGoodsNum="skuBuyGoodsNum" :selectTitleTxT="selectTitleTxT" @openSku="openSku"></goods-additional>
				<!-- 全网比价  -->
				<goods-compare :goodsDetailData="goodsDetailData"></goods-compare>
				<!-- 同类商品推荐 暂不开放 -->
				<goods-recommend :goodsList="goodsList"></goods-recommend>
				<!-- 商品来源-->
				<div class="goodsDetail__source">
					<div v-if="!isJD">
						<span class="shopname">商品来源：</span>
						<img :src="sourcePlatformPicurl">
					</div>
					<div v-else>
						<span class="shopname">商品来源：</span>
						<span>{{goodSourceName}}</span>
					</div>
					<div v-if="goodsSourceStoreName">
						<span class="shopname">商家名称：</span>
						<span>{{goodsSourceStoreName}}</span>
					</div>
				</div>
				<!-- 图文详情 规格参数-->
				<div class="goodsDetail__moreInfo">
					<van-tabs sticky swipeable :duration=".5" :line-width="Number(55)">
						<van-tab title="图文详情">
							<goods-detail :goodsDetailData="goodsDetailData" :platforminfo="platforminfo"></goods-detail>
						</van-tab>
						<van-tab title="规格参数">
							<goods-paramer :goodsDetailData="goodsDetailData"></goods-paramer>
						</van-tab>
					</van-tabs>
				</div>
				<!-- 底部按钮 -->
				<goods-footer :peroidInstalmentAmount="peroidInstalmentAmount" :skuFlag="skuFlag" :goodsName="goodsName" :goodSource="goodSource" :thumbnailUrl="thumbnailUrl" :instalmentAmount="instalmentAmount" :promotionPrice="promotionPrice" :secKillStatus="secKillStatus" :goodsCode="goodsCode" :categoryTowCode="categoryTowCode" :tax="tax" :goodSourceName="goodSourceName" :isSelectOk="isSelectOk" :haitaoFlag="haitaoFlag" @openSku="openSku" @isJoinCar="isJoinCar"></goods-footer>
        <!-- 领取优惠券 -->
        <receive-coupon :coupons="goodsCoupon" v-if="couponModelShow"></receive-coupon>
			</div>
			<div class="noData" v-show="pageLoadErr" ref="noData">
				<img src="~@/assets/img/blankpage_img_waitpay@3x.png" alt="">
				<p>{{pageLoadErr}}</p>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
import GoodsDetail from './child/goods_detail'
import GoodsParamer from './child/goods_paramer'
import GoodsCompare from './child/goods_pricecompara'
import GoodsRecommend from './child/goods_recommend'
import GoodsSeckill from './child/goods_seckill'
import GoodsSubTitle from './child/goods_subTitle'
import GoodsAdditional from './child/goods_additional'
import GoodsFooter from './child/goods_footer'
import GoodsSku from './child/goods_sku'
import ReceiveCoupon from '@/components/ReceiveCoupon/ReceiveCoupon'

import { mapState } from 'vuex'
import loginMixin from '@/mixins/login'
import { ModalHelper } from '@/module/common'
import newUser from '@/mixins/newUser'

export default {
  name: 'detail',
  mixins: [loginMixin, newUser],
  data () {
    return {
      goodSource: 1,
      goodsId: '',
      goodsDetailData: null,
      goodsCoupon: null,
      goodsList: [],
      close: true,
      isSel: false,
      linkHref: '',
      platforminfo: null,
      secKillStatus: false,
      systemTime: '',
      iconurl: '',
      skuStatus: false,
      callbackOrderSku: null,
      skuBuyGoodsNum: 1,
      selectTitleTxT: '',
      instalmentAmount: '',
      promotionPrice: '',
      isSelectOk: false,
      joinCar: false,
      pageLoadErr: '',
      couponModelShow: false
    }
  },
  computed: {
    installmentPrice () {
      let total = this.goodsDetailData.seckillGoodsDetail
        ? this.secKillTotal
        : this.goodsDetailData.originalPrice
      let result = (total / 100 / 12).toFixed(2)
      return result
    },
    isSecKillGoods () {
      let ret = false
      if (this.goodsDetailData && this.goodsDetailData.seckillGoodsDetail) {
        ret = true
      }
      return ret
    },
    brandImgList () {
      return this.goodsDetailData && this.goodsDetailData.detail.split(',')
    },
    goodsName () {
      return this.goodsDetailData && this.goodsDetailData.goodsName
    },
    title () {
      return this.goodsDetailData && this.goodsDetailData.title
    },
    thumbnailUrl () {
      return this.goodsDetailData && this.goodsDetailData.thumbnailUrl
    },
    skuFlag () {
      return this.goodsDetailData && this.goodsDetailData.skuFlag
    },
    goodsCode () {
      return this.goodsDetailData && this.goodsDetailData.goodsCode
    },
    categoryTowCode () {
      return this.goodsDetailData && this.goodsDetailData.categoryTow && this.goodsDetailData.categoryTow.id
    },
    peroidInstalmentAmount () {
      return this.goodsDetailData && this.goodsDetailData.peroidInstalmentAmount
    },
    lookingCardInfo () {
      return this.goodsDetailData && this.goodsDetailData.lookingCardInfo
    },
    lookingCardStatus () {
      return this.lookingCardInfo && this.lookingCardInfo.lookingCardStatus
    },
    tax () {
      return this.goodsDetailData && this.goodsDetailData.tax
    },
    labelImgUrl () {
      return this.goodsDetailData && this.goodsDetailData.labelImgUrl
    },
    goodSourceName () {
      return this.goodsDetailData && this.goodsDetailData.goodSourceName
    },
    goodsSourceStoreName () {
      return this.goodsDetailData && this.goodsDetailData.goodsSourceStoreName
    },
    haitaoFlag () {
      return this.goodsDetailData && this.goodsDetailData.haitaoFlag
    },
    isJD () {
      if (!this.goodSourceName) return false
      return this.goodSourceName.indexOf('京东') > -1
    },
    sourcePlatformPicurl () {
      return this.goodsDetailData && this.goodsDetailData.sourcePlatformPicurl
    },
    ...mapState(['linkMeLoadStatus'])
  },
  mounted () {
    this.init()
    global.vbus.$on('changeCouponModel', (val) => {
      console.log(val)
      this.couponModelShow = val
    })
  },
  methods: {
    // 初始化商详页
    async init () {
      this.selectTitleTxT = ''
      this.goodsId = this.$route.params.id
      this.goodSource = this.$route.params.goodSource
      this.$tj('entergoodsdetail', { id: this.goodsId })
      await this.getGoodsDetail()
      await this.getGoodsPlatforminfo()
      window.scrollTo(0, 0)
      this.$refs.noData.style.minHeight = document.documentElement.clientHeight + 'px'
      if (this.userToken) {
      // 进入检测新人免息券是否可用，存入vuex
        this.detailNewUserPrizeCheck()
      }
    },
    // 关闭秒杀窗口
    closeSecKill (val) {
      this.goodsDetailData.seckillGoodsDetail = null
    },
    // 改变秒杀状态
    changeStatus (val) {
      this.secKillStatus = val
    },
    selectTxt (txt, orderSku, flag) {
      if (orderSku) {
        this.promotionPrice = orderSku && orderSku.skuPrice
        this.instalmentAmount = orderSku && orderSku.peroidInstalmentAmount
      } else {
        this.promotionPrice = this.goodsDetailData && this.goodsDetailData.promotionPrice
        this.instalmentAmount = this.goodsDetailData && this.goodsDetailData.peroidInstalmentAmount
      }
      this.isSelectOk = flag
      this.selectTitleTxT = txt
    },
    isJoinCar (val) {
      this.joinCar = val
    },
    openSku (val, callbackOrderSku, skuBuyGoodsNum) {
      this.skuStatus = val
      this.callbackOrderSku = callbackOrderSku
      this.skuBuyGoodsNum = skuBuyGoodsNum
    },
    // 获取商品信息
    getGoodsDetail () {
      return this.$api['goods/getGoodsDetail']({
        goodsId: this.goodsId,
        goodSource: this.goodSource,
        token: this.userToken
      }, {
        noShowDefaultError: true
      }).then(async res => {
        let result = res.good
        this.goodsDetailData = result
        this.promotionPrice = this.goodsDetailData && this.goodsDetailData.promotionPrice
        this.instalmentAmount = this.goodsDetailData && this.goodsDetailData.peroidInstalmentAmount
        // 是否请求优惠券
        if (result.goodsCode && result.categoryTow) {
          let body = {
            categoryTwoId: result.categoryTow.id,
            goodsCode: result.goodsCode
          }
          this.getCouponList(body)
        }
        // 秒杀判断
        if (result.seckillGoodsDetail) {
          this.getSystemTime() // 获取时间戳
        }
        // 同类商品请求
        if (result.brand && JSON.stringify(result.brand) !== '{}') {
          let body = {
            goodSource: result.goodSource,
            goodsCode: result.goodsCode
          }
          this.getGoodsList(body)
        }
        this.pageLoadErr = ''
      }).catch(err => {
        console.log(err)
        this.pageLoadErr = err.heads.message
      })
    },
    // 获取商品售后相关信息
    getGoodsPlatforminfo () {
      return this.$api['goods/platforminfo']().then(res => {
        this.platforminfo = res.platformInfo
      })
    },
    // 获取同类商品列表
    getGoodsList (body) {
      return this.$api['goods/recommend']({
        goodSource: body.goodSource,
        goodsCode: body.goodsCode
      }, {
        noShowDefaultError: true
      }).then(async res => {
        this.goodsList = res.good
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取系统时间,判断秒杀
    getSystemTime () {
      return this.$api['goods/getSystemTime']().then(async res => {
        this.systemTime = res.data
      })
    },
    // 获取商品优惠券
    getCouponList (body) {
      return this.$api['goods/getGoodCoupon']({
        categoryTwoId: body.categoryTwoId,
        goodsCode: body.goodsCode
      }).then(async res => {
        this.goodsCoupon = res.goodCoupons.goodCouponDetail
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    ModalHelper.beforeClose()
    next()
  },
  watch: {
    '$route' (to, from) { // 监听路由是否变化
      console.log('params.id', this.$route.params.id)
      if (this.$route.params.id) { // 判断条件1  判断传递值的变化
        this.init()
      }
    },
    userToken (val) {
      if (val) this.getGoodsDetail()
    },
    skuStatus (val) {
      if (val) {
        ModalHelper.afterOpen()
      } else {
        ModalHelper.beforeClose()
      }
    },
    couponModelShow (val) {
      if (val) {
        ModalHelper.afterOpen()
      } else {
        ModalHelper.beforeClose()
      }
    }
  },
  components: {
    GoodsDetail,
    GoodsParamer,
    GoodsCompare,
    GoodsRecommend,
    GoodsSeckill,
    GoodsSubTitle,
    GoodsAdditional,
    GoodsFooter,
    GoodsSku,
    ReceiveCoupon
  }
}
</script>
<style lang="scss">
.goodsDetail {
  .van-swipe__indicator {
    width: 12px;
    height: 12px;
    background: rgba(255,255,255,.5);
  }
  .van-swipe__indicator--active {
    width: 12px;
    height: 12px;
    background-color: #fff;
  }
  .van-swipe__indicator:not(:last-child) {
    margin-right: 10px;
  }
  .van-tab--active {
    color: #ed145b !important;
  }
  .van-tabs--line {
    padding-top: 1.013333rem;
    .van-tabs__wrap {
      height: 1.013333rem;
      .van-tab {
        font-family: PingFangSC-Regular;
        font-size: 0.346667rem;
        color: #636363;
        letter-spacing: 0;
        text-align: center;
        height: 1.013333rem;
        line-height: 1.013333rem;
      }
    }
  }
  .van-tabs__line {
    height: 0.053333rem;
    background: #f54b78;
    border-radius: 0.053333rem;
  }
  .van-hairline--top-bottom::after {
    border: none;
  }
  .van-swipe__indicators {
    bottom: 30px;
  }
  .van-button--large {
    height: 88px;
    line-height: 88px;
  }
  .van-dialog {
    width: 7.2rem;
    border-radius: 0.266667rem;
    &__header {
      font-size: 34px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: #333;
      line-height: 0.6rem;
      padding-top: 34px;
    }
    &__content {
      padding: 34px 22px 34px 48px;
      p {
        margin-bottom: 0.266667rem;
        font-size: 0.373333rem;
        line-height: 0.533333rem;
        color: #333;
        &:nth-of-type(4) {
          margin: 0;
        }
      }
    }
  }
  .van-button--danger {
    background-color: #f54b78;
    border-color: #f54b78;
  }
  .van-button--warning {
    background-color: #ffb074;
    border-color: #ffb074;
  }
}
</style>

<style lang="scss" scoped>
.noData {
  background-color: #fff;
  padding: 270px 195px 0;
  box-sizing: border-box;
  height: 100%;
  img {
    width: 360px;
    height: 360px;
    margin-bottom: 11px;
  }
  p {
    height: 40px;
    font-size: 28px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #636363;
    line-height: 40px;
    text-align: center;
  }
}
.goodsDetail {
  position: relative;
  background-color: #f2f2f2;
  width: 100%;
  &__container {
    padding-bottom: 100px;
  }
  &__thumbnailImg {
    position: relative;
    background-color: #fff;
    min-height: 750px;
    max-height: 750px;
    .labelImgUrl {
      position: absolute;
      left: 30px;
      top: 30px;
      img {
        width: 170px;
        height: 170px;
      }
    }
    img {
      // width: 600px;
      // height: 600px;
      width: 100%;
      height: 750px;
      margin: 0 auto;
    }
  }
  &__source {
    background-color: #fff;
    padding: 26px 30px;
    margin-bottom: 20px;
    div {
      font-size: 0;
      font-family: PingFangSC-Regular;
      color: #636363;
      line-height: 37px;
      text-align: left;
      &:nth-of-type(2) {
        margin-top: 17px;
      }
      .shopname {
        // font-weight: bold;
      }
      span {
        display: inline-block;
        margin-right: 10px;
        font-size: 28px;
        height: 37px;
      }
      img {
        display: inline-block;
        width: auto;
        height: 37px;
      }
    }
  }
  &__moreInfo {
    width: 100%;
    padding: constant(safe-area-inset-top) constant(safe-area-inset-right)
    constant(safe-area-inset-bottom) constant(safe-area-inset-left);
    padding: env(safe-area-inset-top) env(safe-area-inset-right)
    env(safe-area-inset-bottom) env(safe-area-inset-left);
  }
}
</style>
