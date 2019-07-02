<template>
	<div class="OrderDetail" ref="detail">
		<div class="OrderDetail__wrap" v-show="reqReady">
			<div class="OrderDetail__container" v-show="order">
				<!-- 顶部提示 -->
				<div class="OrderDetail__headTip headTip" :classs="isIntercept ? 'klorder' : ''">
					<!-- 订单倒计时 -->
					<div class="OrderDetail__countdown clearfix" v-if="canCountDownShow">
						<span class="tips fl">等待付款</span>
						<span class="countdown fr" v-show="countDownShow">剩余支付时间<i>{{h}}</i> : <i>{{m}}</i> : <i>{{s}}</i></span>
					</div>
					<!-- 备货中补充文案 -->
					<div class="OrderDetail__tip clearfix" v-else-if="goodsReady">
						<span>备货中</span><span>({{reviewTips}})</span>
					</div>
					<!-- 订单状态描述 -->
					<div class="OrderDetail__tip" :classs="isIntercept ? 'kl' : ''" v-else>
						<span class="fl">{{orderStatus | loveStatusFilter | noPassOrder}}</span>
					</div>
					<div class="order-tip" v-if="isIntercept">
						<p>该进口商品已被海关拦截，请联系客服人员为您及时处理。</p>
						<p>拦截原因：{{isIntercept}}</p>
					</div>
				</div>
				<!-- 用户信息框 -->
				<div class="OrderDetail__userInfo userInfo">
					<!-- 商品订单 收货人，手机号，收货地址  -->
					<div class="userInfo__name">
						<span>{{deliveryInfo && deliveryInfo.person}}</span>
						<span>{{deliveryInfo && deliveryInfo.mobilePhone}}</span>
					</div>
					<div class="userInfo__address">
						<img src="~@/assets/img/list_icon_address_red@3x.png">
						<span>{{deliveryInfo && deliveryInfo.address}}</span>
					</div>
					<div class="userInfo__arrow" v-show="false">
						<img src="~@/assets/img/list_icon_enter_nol@3x.png" alt="">
					</div>
				</div>
				<!-- 商品展示框 -->
				<div class="OrderDetail__goodsArea goodsArea">
					<div class="goods">
						<div class="goods__title van-hairline--bottom">
							<span>{{goodSourceDesc}}</span>
						</div>
						<div class="goods__list">
							<div class="goods__item good" @click="goGoodsDetail">
								<div class="top">
									<div class="good__img">
										<img :src="goodsImageUrl" alt="">
									</div>
									<div class="good__info">
										<div class="content">
											<div class="name">{{goodsData && goodsData.goodsName}}</div>
											<div class="skustr" v-if="goodsData && goodsData.skuProps && goodsData.skuProps.length">{{goodsData && goodsData.skuProps | skuPropsFilter}}</div>
											<!-- <div class="tax" v-if="good.tax">总进税费:&nbsp;&yen;{{good.tax | priceFilter}}</div> -->
											<div class="freight" v-if="freight">运费:&nbsp;&yen;{{freight | priceFilter}}</div>
											<div class="price clearfix" v-if="instalment">
												<div class="fl instalmentAmount">
													<span> &yen;{{instalmentAmount | priceFilter}}x{{instalmentCount}}期</span>
												</div>
												<div class="fr goodsPrice">x{{goodsCount}}</div>
											</div>
											<div class="price clearfix" v-else>
												<div class="fl instalment">
													<span>月供: </span><i>&yen;{{instalmentAmount | priceFilter}}</i><span>起</span>
												</div>
												<div class="fr goodsPrice">&yen;{{goodsPrice | priceFilter}}x{{goodsCount}}</div>
											</div>
										</div>
									</div>
								</div>
								<div class="remark" v-show="orderRemark">
									留言:
									<span>{{orderRemark}}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 商品额外信息框 -->
				<div class="OrderDetail__extInfo extInfo">
					<div class="extInfo__item clearfix" v-if="discountCoupon > 0">
						<span class="fl">现金券</span>
						<span class="fr price">-&yen;&nbsp;{{discountCoupon | priceFilter}}</span>
					</div>
					<div class="extInfo__item clearfix" v-if="tax > 0">
						<span class="fl">进口税</span>
						<span class="fr price">&yen;&nbsp;{{tax | priceFilter}}</span>
					</div>
					<div class="extInfo__item clearfix" v-if="downpayAmount > 0">
						<span class="fl">首付金额</span>
						<span class="fr price">&yen;&nbsp;{{downpayAmount | priceFilter}}</span>
					</div>
					<div class="extInfo__item clearfix">
						<span class="fl">邮费</span>
						<span class="fr price">&yen;&nbsp;{{freight | priceFilter}}</span>
					</div>
					<div class="extInfo__item clearfix" v-if="instalment" @click="gotoStages">
						<span class="fl">分期方式</span>
						<span class="fr arrow">
							<img src="~@/assets/img/list_icon_enter_nol@3x.png" />
						</span>
						<span class="fr price">{{instalmentCount}}期</span>
					</div>
					<div class="extInfo__item clearfix">
						<span class="fl">实付金额</span>
						<span class="fr price">&yen;&nbsp;{{dealWithAmount | priceFilter}}</span>
					</div>
				</div>
				<!-- 订单信息框 -->
				<div class="OrderDetail__orderInfo orderInfo">
					<div class="orderInfo__item">
						<span>订单编号:&nbsp;</span>
						<span id="orderCode">{{orderCode}}</span>
						<!-- <span class="copy-btn" ref="copy" data-clipboard-target="#orderCode" @click.stop.prevent="copyText">
							<i>复制</i>
						</span> -->
            <span class="copy-btn"  @click.stop.prevent="Clip($event,orderCode)">
							<i>复制</i>
						</span>
					</div>
					<div class="orderInfo__item">
						<span>下单时间:&nbsp;</span>
						<span>{{orderTime| timeFilter}}</span>
					</div>
					<!-- <div class="orderInfo__item">
					<span>买家留言:&nbsp;</span>
					<span>{{orderTime| timeFilter}}</span>
				</div> -->
				</div>
				<!-- 订单底部功能栏 -->
				<order-footer-btn class="fixed" :order="order"></order-footer-btn>
			</div>
      <div class="noData" v-show="!order" ref="noData">
        <img src="~@/assets/img/blankpage_img_waitpay@2x.png" alt="">
        <p>亲，页面加载失败，您再试试呗~</p>
      </div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import orderFooterBtn from '@/components/OrderBtn/OrderBtn'
export default {
  name: 'OrderDetail',
  props: {},
  data () {
    return {
      order: null,
      h: null, // 普通订单倒计时h
      m: null, // 普通订单倒计时m
      s: null, // 普通订单倒计时s
      timer: null, // 普通订单定时器对象
      countDownShow: false, // 倒计时是否显示
      cancelModelShow: false,
      reqReady: false,
      copyBtn: null
    }
  },
  computed: {
    // 现金券
    discountCoupon () {
      return this.order && this.order.discountCoupon
    },
    // 进口税
    tax () {
      return this.order && this.order.tax
    },
    goodsData () {
      return this.order && this.order.orderItems && this.order.orderItems[0]
    },
    instalment () {
      return this.order && this.order.instalment
    },
    // 商品总金额
    goodsTotalMoney () {
      return this.order && this.order.goodsTotalMoney
    },
    dealWithAmount () {
      return this.order && this.order.dealWithAmount
    },
    systemTime () {
      return this.order && this.order.systemTime
    },
    orderTime () {
      return this.order && this.order.orderTime
    },
    orderStatus () {
      return this.order && this.order.orderStatus
    },
    orderCode () {
      return this.order && this.order.orderCode
    },
    goodSource () {
      return this.order && this.order.goodSource
    },
    isIntercept () {
      return this.order && this.order.kaolaLimitReason
    },
    deliveryInfo () {
      return this.order && this.order.deliveryInfo
    },
    downpayAmount () {
      return this.order && this.order.downpayAmount
    },
    // 分期计划数据
    instalmentPlan () {
      return this.order && this.order.instalmentPlan
    },
    // 订单总运费
    freight () {
      return this.order && this.order.freight
    },
    goodsDataStauts () {
      return this.goodsData && this.goodsData.status
    },
    instalmentCount () {
      return this.goodsData && this.goodsData.instalmentCount
    },
    instalmentAmount () {
      return this.goodsData && this.goodsData.instalmentAmount
    },
    goodsPrice () {
      return this.goodsData && this.goodsData.instalmentAmount
    },
    goodsCount () {
      return this.goodsData && this.goodsData.goodsCount
    },
    orderRemark () {
      return this.goodsData && this.goodsData.orderRemark
    },
    goodsCode () {
      return this.goodsData && this.goodsData.goodsCode
    },
    goodSourceDesc () {
      return (this.goodsData && this.goodsData.goodSourceDesc) || '商品信息'
    },
    goodsImageUrl () {
      return this.goodsData && this.goodsData.goodsImageUrl
    },
    canCountDownShow () {
      let ret = false
      if (this.orderStatus === 0) {
        ret = true
      }
      return ret
    },
    goodsReady () {
      if (!this.orderCode) return false
      let ret = false
      let order = Number(this.orderCode.slice(0, 2))
      if (order === 34 && (this.goodsDataStauts === 3 || this.goodsDataStauts === 4)) {
        ret = true
      }
      return ret
    },
    reviewTips () {
      let ret = ''
      if (this.goodsDataStauts === 3 || this.goodsDataStauts === 4) {
        if (this.goodsDataStauts === 3) {
          ret = '已采购,等待商家发货'
        } else if (this.goodsDataStauts === 4) {
          ret = '待采购'
        }
      }
      return ret
    }
  },
  async mounted () {
    let bodyHeight = document.documentElement.clientHeight
    this.$refs.detail.style.minHeight = bodyHeight + 'px'
    this.$refs.noData.style.height = bodyHeight + 'px'
    await this.queryOrderDetail()
    this.$nextTick(() => {
      if (!this.$refs.copy || this.$refs.copy === 'string') return false
      this.copyBtn = new this.$clipboard(this.$refs.copy)
    })
  },
  methods: {
    Clip (event, text) {
      // 复制功能
      const clipboard = new this.$clipboard(event.target, {
        text: () => text
      })
      clipboard.on('success', () => {
        this.$toast('复制成功')
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        this.$toast('复制失败，请刷新试试')
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
      })
      clipboard.onClick(event)
    },
    gotoStages () {
      window.sessionStorage.setItem('instalmentPlan', JSON.stringify(this.instalmentPlan))
      this.$router.push({ name: 'OrderRepayment', query: { noCache: Date.now() } })
    },
    copyText () {
      let clipboard = this.copyBtn
      clipboard.on('success', () => {
        this.$toast('复制成功')
      })
      clipboard.on('error', () => {
        this.$toast('复制失败，请手动复制')
      })
    },
    toggleCancelModelShow (val) {
      this.cancelModelShow = val
    },
    goGoodsDetail () {
      this.$router.push({
        name: 'GoodsDetail',
        params: {
          id: this.goodsCode,
          goodSource: this.goodSource
        }
      })
    },
    queryOrderDetail () {
      let orderCode = this.$route.params.orderCode
      this.$api['order/getOrderDetail']({
        code: orderCode,
        token: this.userToken
      }).then(res => {
        this.order = res.order
        this.reqReady = true
      }).catch(err => {
        console.log(err)
        this.reqReady = true
      })
    },
    // 倒计时处理
    setCountDown () {
      this.t = this.orderTime + 86400000 - this.systemTime
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        // console.log(this.t)
        if (this.t <= 0) {
          this.countDownShow = false
          clearInterval(this.timer)
          this.queryOrderDetail()
          return false
        }
        this.h = Math.floor((this.t / 1000 / 60 / 60) % 24)
        this.m = Math.floor((this.t / 1000 / 60) % 60)
        this.s = Math.floor((this.t / 1000) % 60)
        if (this.h < 10) {
          this.h = '0' + this.h
        }
        if (this.m < 10) {
          this.m = '0' + this.m
        }
        if (this.s < 10) {
          this.s = '0' + this.s
        }
        this.t -= 1000
        if (!this.countDownShow) this.countDownShow = true
      }, 1000)
    }
  },
  filters: {
    loveStatusFilter (val) {
      if (!val) {
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
    },
    noPassOrder (val) {
      if (val === '审核未通过') {
        return '审核未通过(由于您近期综合信用评估不足，审核未通过)'
      } else {
        return val
      }
    },
    timeFilter (time) {
      const orderDate = new Date(time)
      const yyyy = orderDate.getFullYear()
      const MM = (orderDate.getMonth() + 1) < 10 ? '0' + (orderDate.getMonth() + 1) : (orderDate.getMonth() + 1)
      const dd = orderDate.getDate() < 10 ? '0' + orderDate.getDate() : orderDate.getDate()
      const HH = orderDate.getHours() < 10 ? '0' + orderDate.getHours() : orderDate.getHours()
      const mm = orderDate.getMinutes() < 10 ? '0' + orderDate.getMinutes() : orderDate.getMinutes()
      return yyyy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm
    }
  },
  watch: {
    order (val) {
      if (!val) return false
      if (!this.$refs.copy || this.$refs.copy === 'string') return false
      this.copyBtn = new this.$clipboard(this.$refs.copy)
    },
    orderStatus (val) {
      if (val === 0) {
        this.setCountDown()
      }
    }
  },
  destroyed () {
    clearInterval(this.timer)
  },
  components: {
    orderFooterBtn
  }
}
</script>
<style scoped lang="scss">
.OrderDetail {
  background-color: #f2f2f2;
  &__container {
    position: relative;
    padding-bottom: 108px;
  }
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
      height:40px;
      font-size:28px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color: #636363;
      line-height:40px;
      text-align: center;
    }
  }
}
.countdown {
  width: 5.333333rem;
  text-align: right;
  // padding-right: 2px;
}
.countdown > i {
  font-style: normal;
}
.userInfo {
  position: relative;
  padding: 0.293333rem 0.4rem 0.293333rem 0.666667rem;
  background-color: #fff;
  margin-bottom: 20px;
  &__name {
    height: 0.533333rem;
    font-size: 0.373333rem;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    line-height: 0.533333rem;
    margin-bottom: 0.173333rem;
    span {
      display: inline-block;
      &:nth-of-type(1) {
        margin-right: 40px;
      }
    }
  }
  &__address {
    position: relative;
    font-size: 0.32rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 0.44rem;
    img {
      position: absolute;
      left: -0.48rem;
      top: 0;
      width: 0.426667rem;
      height: 0.426667rem;
    }
  }
  &__arrow {
    position: absolute;
    top: 0.573333rem;
    right: 0.4rem;
    img {
      display: block;
      width: 0.586667rem;
      height: 0.586667rem;
    }
  }
}
.headTip {
  height: 1.6rem;
  padding: 0 0.4rem;
  line-height: 1.6rem;
  background: url("../../assets/img/order/order_detail_banner_bg@3x.png")
    no-repeat;
  background-size: contain;
  font-size: 0.4rem;
  font-family: PingFangSC-Regular;
  color: #ed145b;
  margin-bottom: 0 !important;
  &.klorder {
    height: 2.506667rem;
    padding: 0.48rem 0.4rem;
    background: url("../../assets/img/order/order_detail_banner_bg2@3x.png")
      no-repeat;
    box-sizing: border-box;
    .order-tip {
      &.kl {
        font-family: PingFangSC-Regular;
        font-size: 0.4rem;
        line-height: 0.56rem;
        color: #ed145b;
        margin-bottom: 0.16rem;
      }
      p {
        font-family: PingFangSC-Regular;
        font-size: 0.32rem;
        color: #ff6496;
        line-height: 0.426667rem;
        margin-bottom: 0.106667rem;
      }
      p:last-child {
        margin-bottom: 0;
      }
    }
  }
}
.goodsArea {
  margin-bottom: 0 !important;
  .goods {
    margin-bottom: 0.266667rem;
    &__title {
      height: 1.173333rem;
      padding: 0.32rem 0.4rem;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 1);
      span {
        height: 0.533333rem;
        font-size: 0.373333rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 0.533333rem;
      }
    }
    &__list {
      background-color: #fff;
      padding-left: 0.266667rem;
    }
    &__item {
      padding: 0.4rem 0.266667rem 0.4rem 0;
    }
  }
}
.extInfo {
  background-color: #fff;
  padding: 0.533333rem 0.4rem 0.4rem;
  margin-bottom: 20px;
  &__item {
    height: 44px;
    font-size: 0.373333rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 44px;
    margin-bottom: 26px;
    .price {
      color: #939393;
    }
    .arrow {
      img {
        width: 44px;
        height: 44px;
      }
    }
  }
  &__item:last-child {
    margin-bottom: 0;
  }
}
.orderInfo {
  background-color: #fff;
  padding: 0.4rem;
  &__item {
    position: relative;
    height: 0.533333rem;
    font-size: 0.373333rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 0.533333rem;
    margin-bottom: 0.266667rem;
    .copy-btn {
      position: absolute;
      right: 0;
      top: 0;
      padding: 0.046667rem 0.213333rem;
      border-radius: 4px;
      box-sizing: border-box;
      height: 0.533333rem;
      border: 2px solid rgba(147, 147, 147, 0.6);
      i {
        display: block;
        font-size: 0.32rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 0.44rem;
        height: 0.44rem;
        font-style: normal;
      }
    }
  }
  &__item:last-child {
    margin-bottom: 0;
  }
}
.good {
  position: relative;
  &__img {
    position: absolute;
    top: 0.4rem;
    left: 0.133333rem;
    img {
      display: block;
      width: 2.4rem;
      height: 2.4rem;
    }
  }
  &__info {
    margin-left: 2.8rem;
    padding-right: 0.133333rem;
    box-sizing: border-box;
    .content {
      position: relative;
      min-height: 2.4rem;
      width: 6.533333rem;
      padding-bottom: 0.533333rem;
      box-sizing: border-box;
    }
    .name {
      height: 0.533333rem;
      font-size: 0.373333rem;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 0.533333rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      margin-bottom: 0.133333rem;
    }
    .skustr,
    .tax,
    .freight {
      margin-bottom: 0.106667rem;
      height: 0.44rem;
      font-size: 0.32rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 0.44rem;
    }
    .skustr {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      margin-bottom: 0.133333rem;
    }
    .freight {
      margin-bottom: 0.12rem;
    }
    .price {
      position: absolute;
      left: 0;
      bottom: 0.04rem;
      width: 100%;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 0.44rem;
      font-size: 0;
      .instalmentAmount {
        font-size: 0;
        height: 0.533333rem;
        span {
          margin-top: 0.046667rem;
          display: inline-block;
          color: #ed145b;
          line-height: 0.44rem;
          font-size: 0.32rem;
        }
      }
      .instalment {
        font-size: 0;
        height: 0.533333rem;
        span {
          margin-top: 0.046667rem;
          display: inline-block;
          color: #636363;
          line-height: 0.44rem;
          font-size: 0.32rem;
        }
        i {
          font-style: normal;
          color: #ed145b;
          font-size: 0.373333rem;
          line-height: 0.533333rem;
        }
      }
      .goodsPrice {
        margin-top: 0.046667rem;
        display: inline-block;
        line-height: 0.44rem;
        color: #939393;
        font-size: 28px;
      }
    }
  }
  .remark {
    margin-top: 0.4rem;
    padding: 0.266667rem;
    background: rgba(247, 247, 247, 1);
    border-radius: 0.106667rem;
    box-sizing: border-box;
    span {
      height: 0.44rem;
      font-size: 0.32rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 0.44rem;
    }
  }
}
</style>
