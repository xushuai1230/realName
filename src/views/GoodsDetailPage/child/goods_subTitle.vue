<template>
	<div class="goodsSubTitle" v-if="goodsDetailData" :class="{active: !showLookingCardFlag}">
		<!-- 商品标题 -->
		<div class="goodsSubTitle__name">
			<img :src="sourcePlatformIconUrl" v-if="sourcePlatformIconUrl">
			<span>{{goodsName}}</span>
		</div>
		<!-- 商品价格 -->
		<div class="goodsSubTitle__price">
			<!-- 秒杀 -->
			<div class="seckillPrice clearfix" v-if="isSecKillGoods">
				<div class="left fl">
					<!-- 秒杀价 -->
					<span>
						<i>&yen;</i>{{secKillPrice | priceFilter}}</span>
					<!-- 原价 -->
					<del>&yen;{{goodsDetailData.xxypOriginalPrice | priceFilter}}</del>
					<!-- 设置提醒 -->
					<!-- <span class="notice" v-if="secKillStatus">
						设置提醒
					</span> -->
				</div>
				<!-- 秒杀价图标 -->
				<div v-if="!secKillStatus" class="icon-seckill fl">秒杀价</div>
				<div class="right fr">
					<span>月供
						<i>&yen;{{goodsDetailData.peroidInstalmentAmount | priceFilter}}</i>起</span>
				</div>
			</div>
			<!-- 普通月供商品 -->
			<div class="normalPrice clearfix" v-else>
				<!-- 月供价 -->
				<div class="left fl">月供:
					<span>&yen;<i>{{instalmentAmount | priceFilter}}</i></span>起
				</div>
        <!-- 用户未绑定手机号时，按照新人免息券未使用且未过期处理； -->
        <div class="left fl" style="padding: 0.25rem 0.2rem 0" v-if="!userToken">
					<span class="newuser-mianxi">新人专属2期免息</span>
				</div>
        <!-- 新人免息券 -->
        <div class="left fl" style="padding: 0.25rem 0.2rem 0" v-else-if="userToken && mianxiActive">
					<span class="newuser-mianxi">新人专属2期免息</span>
				</div>
				<!-- 总价 -->
				<div class="right fr"><span>&yen;{{promotionPrice | priceFilter}}</span></div>
			</div>
		</div>
		<!-- 颜值卡开通 -->
		<div class="goodsSubTitle__facecard clearfix" @click="jumpToFaceCard" v-if="showLookingCardFlag">
			<div class="left fl">
				<img src="~@/assets/img/classify/logo_lookcard_vip@3x.png" alt="">
			</div>
			<div class="middle fl">
				<div class="info">
					<span>颜值卡下单再减<i>{{reductionAmount | priceFilter}}</i>元</span>
					<img src="~@/assets/img/tickets_save_explain@3x.png" alt="" @click.stop.prevent="openGuide">
				</div>
				<div class="bottom">
					本商品享97折优惠
				</div>
			</div>
			<div class="right fr" v-if="lookingCardStatus === 0">
				<div class="desc">
					免费开通
				</div>
			</div>
			<div class="arrow" @click="jumpToFaceCard">
				<img src="~@/assets/img/classify/list_icon_enter_nol@3x.png" alt="">
			</div>
		</div>
		<van-dialog v-model="guideShow" title="颜值卡使用规则">
			<p>1、颜值卡每月可享受3次卡内余额的 97折优惠。</p>
			<p>2、若商品金额高于颜值卡可用余额， 可使用首付支付该金额。</p>
			<p>3、超出颜值卡余额的商品不能享受 97折优惠。</p>
			<p>4、使用颜值卡分期购物享受免审核！</p>
		</van-dialog>
	</div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapGetters } from 'vuex'

export default {
  name: '',
  props: ['goodsDetailData', 'isSecKillGoods', 'secKillStatus', 'promotionPrice', 'instalmentAmount', 'lookingCardStatus'],
  data () {
    return {
      guideShow: false
    }
  },
  computed: {
    goodsName () {
      return this.goodsDetailData && this.goodsDetailData.goodsName
    },
    sourcePlatformIconUrl () {
      return this.goodsDetailData && this.goodsDetailData.sourcePlatformIconUrl
    },
    seckillGoodsDetail () {
      return this.goodsDetailData && this.goodsDetailData.seckillGoodsDetail
    },
    secKillPrice () {
      return this.goodsDetailData.originalPrice * (this.seckillGoodsDetail.discount / 10000)
    },
    showLookingCardFlag () {
      return this.goodsDetailData && this.goodsDetailData.showLookingCardFlag
    },
    reductionAmount () {
      return this.goodsDetailData && this.goodsDetailData.lookingCardInfo && this.goodsDetailData.lookingCardInfo.reductionAmount
    },
    ...mapState([
      'mianxiActive'
    ]),
    ...mapGetters(['userToken', 'userId', 'userWeiboMark'])
  },
  methods: {
    jumpToFaceCard () {
      this.$tj('goodsDetail_faceCard_click')
      // 跳转情侣卡页面
      this.$router.push({
        name: 'Facescard'
      })
    },
    openGuide () {
      this.guideShow = true
    }
  }
}
</script>

<style scoped lang="scss">
.notice {
  font-size: 28px;
  color: #ff6f5a;
  font-family: PingFangSC-Medium;
  font-weight: bold;
}
.goodsSubTitle {
  &.active {
    padding: 40px 30px 0;
  }
  position: relative;
  background-color: #fff;
  padding: 40px 30px 130px;
  &__name {
    text-align: left;
    background-color: #fff;
    img {
      width: auto;
      height: 30px;
      margin:6px 10px 6px 0;
      vertical-align: top;
    }
    span {
      font-size: 30px;
      line-height: 42px;
      font-family: PingFangSC-Regular;
      color: #333;
    }
  }
  &__price {
    padding: 16px 0;
  }
  &__facecard {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 120px;
    background: rgba(248, 243, 236, 1);
    .left {
      margin: 20px 20px 0 30px;
      img {
        margin-top: 4px;
        width: 112px;
        height: 36px;
      }
    }
    .middle {
      margin-top: 20px;
      .info {
        margin-bottom: 5px;
        img {
          width: 48px;
          height: 48px;
          margin-top: -3px;
        }
        span {
          display: inline-block;
          margin-top: 4px;
          height: 37px;
          font-size: 28px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: #333;
          line-height: 37px;
          i {
            color: #ed145b;
          }
        }
      }
      .bottom {
        height: 30px;
        font-size: 24px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #939393;
        line-height: 30px;
      }
    }
    .right {
      height: 120px;
      width: 138px;
      background: linear-gradient(
        270deg,
        rgba(225, 205, 170, 1) 0%,
        rgba(231, 221, 204, 1) 100%
      );
      .desc {
        margin: 23px 0 0 30px;
        width: 60px;
        height: 74px;
        font-size: 28px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(39, 40, 57, 1);
        line-height: 37px;
      }
    }
    .arrow {
      position: absolute;
      top: 38px;
      right: 30px;
      img {
        width: 22px;
        height: 44px;
      }
    }
  }
}
.seckillPrice {
  .left {
    text-align: left;
    margin-right: 20px;
    span {
      display: inline-block;
      &:first-child {
        color: #ed145b;
        font-size: 46px;
        font-family: PingFangSC-Medium;
        line-height: 65px;
        i {
          font-style: normal;
          font-size: 32px;
          height: 45px;
          line-height: 45px;
        }
      }
    }
    del {
      color: #636363;
      font-size: 28px;
      font-family: PingFangSC-Regular;
    }
  }
  .icon-seckill {
    background-image: linear-gradient(-90deg, #ff7a66 0%, #f54b78 100%);
    color: #fff;
    padding: 0 6px;
    line-height: 32px;
    border-radius: 4px;
    margin-top: 20px;
  }
  .right {
    span {
      display: inline-block;
      font-size: 28px;
      margin-top: 25px;
    }
    i {
      color: #ed145b;
    }
  }
}
.normalPrice {
  .left {
    font-size: 28px;
    font-family: PingFangSC-Medium;
    color: #333;
    line-height: 37px;
    span {
      color: #ed145b;
    }
    i {
      height: 65px;
      font-size: 46px;
      font-family: PingFangSC-Medium;
      color: rgba(237, 20, 91, 1);
      line-height: 65px;
      margin-right: 5px;
    }
  }
  .right {
    height: 37px;
    font-size: 28px;
    color: #939393;
    line-height: 37px;
    span {
      display: inline-block;
      margin-top: 20px;
    }
  }
}
.newuser-mianxi {
  height: 0.53333rem;
    border-radius: 0.08rem;
    // border: 0.02667rem solid #f54b78;
    // color: #f54b78;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-right: 0.4rem;
    line-height: 0.53333rem;
    font-family: PingFangSC-Regular;
    padding: 0 0.10667rem;
    font-size: 0.32rem;
    color: #FF7E24 !important;
}
</style>
