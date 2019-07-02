<template>
	<div class="additional" :class="(taxShow || ticketShow || infoShow || skuFlag)  ? 'van-hairline--top' : ''">
		<div class="noAdditional" v-if="!skuFlag && !infoShow && !taxShow && !ticketShow"></div>
		<!-- 优惠信息 -->
		<div class="info " v-if="infoShow" :class="(taxShow || ticketShow) ? 'van-hairline--bottom' : ''">
			<span>优惠:&nbsp;</span>
			<span>直付立减&yen;{{goodsDetailData.directPaymentAmount | priceFilter}}</span>
		</div>
		<!-- 进口税 -->
		<div class="tax van-hairline--bottom" v-if="taxShow" :class="ticketShow ? 'van-hairline--bottom' : ''">
			<span>进口税</span>
			<span>&yen;{{goodsDetailData.tax | priceFilter}}</span>
		</div>
		<!-- 优惠券信息 -->
		<div class="ticket van-hairline--bottom" v-if="ticketShow" @click="changeCouponModel">
			<div class="wrap clearfix">
				<span class="fl">
					领券:
				</span>
				<span v-for="(item,index) in coupons" :key="index" class="coupn fl">
				  {{item.name}}
				</span>
        <div class="img fr">
          <img src="~@/assets/img/list_icon_enter_nol@3x.png" alt="">
        </div>
			</div>
		</div>
		<!-- 已选 -->
		<div class="skuTitle" @click="skuClickFn" v-if="skuFlag">
			<div class="skuCenter clearfix">
				<div v-if="!isSelectOk" class="skuCenterTxt fl clearfix">
					<div class="fl">请选择&nbsp;</div>
					<div class="fl">{{selectTxt}}</div>
				</div>
				<div v-else class="skuCenterTxt clearfix fl" :class="{active: isSelectOk}">
					<div class="fl">已选：</div>
					<div class="fl">{{selectTxt}}</div>
				</div>
				<div class="rightIcon fr"></div>
			</div>
		</div>
		<!-- 商品banner图 -->
		<!-- <div class="banner">
      <img :src="banner" alt="">
    </div> -->
	</div>
</template>

<script type="text/ecmascript-6">
import loginMixin from '@/mixins/login'
export default {
  name: '',
  props: ['goodsDetailData', 'goodsCoupon', 'selectTitleTxT', 'isSelectOk', 'callbackpitchProp'],
  mixins: [loginMixin],
  data () {
    return {}
  },
  computed: {
    skuFlag () {
      return this.goodsDetailData && this.goodsDetailData.skuFlag
    },
    skuProps () {
      return this.goodsDetailData && this.goodsDetailData.skuProps
    },
    coupons () {
      return this.goodsCoupon && this.goodsCoupon.slice(0, 2)
    },
    selectTxt () {
      if (!this.isSelectOk) {
        return this.selectTitleTxT && this.selectTitleTxT.slice(4)
      } else {
        return this.selectTitleTxT && this.selectTitleTxT.slice(3)
      }
    },
    banner () {
      return this.goodsDetailData && this.goodsDetailData.banner && this.goodsDetailData.banner.imgUrl
    },
    infoShow () {
      let ret = false
      if (this.goodsDetailData && Number(this.goodsDetailData.directPaymentAmount) > 0) {
        ret = true
      }
      return ret
    },
    taxShow () {
      let ret = false
      if (this.goodsDetailData && this.goodsDetailData.haitaoFlag === 1) {
        ret = true
      }
      return ret
    },
    ticketShow () {
      let ret = false
      if (this.goodsCoupon && this.goodsCoupon.length > 0) {
        ret = true
      }
      return ret
    }
  },
  methods: {
    changeCouponModel () {
      this.$tj('couponsxclick')
      global.vbus.$emit('changeCouponModel', true)
    },
    skuClickFn () {
      if (!this.userToken) {
        this.handlerLogin()
        return false
      }
      if (this.skuFlag && this.skuProps.length) {
        this.$emit('openSku', true)
        return false
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/scss/mixin.scss";
.additional {
  padding-left: 30px;
  background-color: #fff;
  margin-bottom: 20px;
  .noAdditional {
    height: 40px;
  }
  .info,
  .tax {
    padding: 25px 0;
    text-align: left;
    span {
      display: inline-block;
      height: 37px;
      font-size: 28px;
      font-family: PingFangSC-Medium;
      color: rgba(51, 51, 51, 1);
      line-height: 37px;
      &:first-child {
        margin-right: 20px;
      }
    }
  }
  .ticket {
    padding:22px 30px 22px 0;
    .wrap {
      .fl {
        display: inline-block;
        height: 37px;
        font-size: 28px;
        font-family: PingFangSC-Medium;
        color: rgba(51, 51, 51, 1);
        line-height: 37px;
        margin:7px 20px 7px 0;
      }
      .coupn {
        height: 40px;
        border-radius: 6px;
        border: 2px solid rgba(245, 75, 120, 1);
        color: rgba(245, 75, 120, 1);
        box-sizing: border-box;
        margin-right: 30px;
        line-height: 40px;
        font-family: PingFangSC-Regular;
        padding: 0 8px;
        font-size: 24px;
      }
      .img {
        img {
          width: 44px;
          height: 44px;
        }
      }
    }
  }
  .banner {
    padding: 0 30px 30px 0;
  }
}
.skuTitle {
  height: 89px;
  padding-right: 30px;
  background: #fff;
  margin-bottom: 20px;
  .skuCenter {
    height: 89px;
    line-height: 89px;
    text-align: left;
    .skuCenterTxt {
      font-size: 28px;
      &.active {
        :nth-child(2) {
          color: #939393;
          width: 500px;
          @include text-overflow(1);
        }
      }
      :nth-child(1) {
        font-family: PingFangSC-Medium;
        font-weight: normal;
      }
      :nth-child(2) {
        color: #333;
        font-family: PingFangSC-Medium;
        width: 500px;
        @include text-overflow(1);
      }
    }
    .rightIcon {
      height: 44px;
      width: 44px;
      background: url("~@/assets/img/list_icon_enter_nol@3x.png") center;
      background-size: 44px 44px;
      float: right;
      margin-top: 26px;
    }
  }
}
</style>
