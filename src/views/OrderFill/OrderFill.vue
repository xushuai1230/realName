<template>
	<div class="OrderFill">
		<div class="OrderFill__headerTip" v-if="haitaoTipShow">
			海关提示：订单包含跨境商品，需补充{{person}}的清关信息，否则无法发货！
		</div>
		<order-fill-address :curAdreess="curAdreess" :class="{'mb20': !haitaoFlag}"></order-fill-address>
		<div class="OrderFill__IdCard van-hairline--top" v-if="haitaoFlag">
			<div class="wrap clearfix">
				<span>身份证号码:</span>
				<span v-if="UserIdCard">{{UserIdCard}}</span>
				<input type="text" :placeholder="IdCardPlaceHolder" v-model="IdCard" v-else>
			</div>
		</div>
		<div class="OrderFill__body">
			<div class="info">
				<div class="title van-hairline--top">{{goodSourceName}}</div>
				<order-fill-goods :goodsName="goodsName" :goodsNum="goodsNum" :goodsImg="goodsImg" :instalmentAmount="instalmentAmount" :promotionPrice="promotionPrice" :skuFillStr="skuFillStr"></order-fill-goods>
				<div class="remark">
					<div class="remark__wrap clearfix">
						<span>填写留言:&nbsp;</span>
						<input type="text" class="input" v-model="remark" placeholder="填写留言，小象会尽可能满足您的需求">
					</div>
				</div>
				<div class="extInfo">
					<!-- 现金券 -->
					<div class="extInfo__title van-hairline--bottom" @click="goCouponPage">
						<span>现金券</span>
						<span class="coupon" :class="{active: canUseCoupon}" v-if="!couponName">
							{{canUseCoupon ? '有可用现金券' : '无可用现金券'}}
						</span>
						<span class="coupon active" v-else>
							{{couponName}}
						</span>
						<div class="img">
							<img src="~@/assets/img/list_icon_enter_nol@3x.png" alt="">
						</div>
					</div>
          <div class="extInfo__list">
            <!-- 订单总额 -->
            <div class="extInfo__item">
              <span>订单总额</span>
              <span class="price"><i>&yen;</i>{{orderPrice | priceFilter}}</span>
            </div>
            <!-- 邮费 -->
            <div class="extInfo__item">
              <span>邮费</span>
              <span class="price active">+<i>&yen;</i>{{postagePrice | priceFilter}}</span>
            </div>
            <!-- 进口税 -->
            <div class="extInfo__item">
              <span>进口税</span>
              <span class="price active">+<i>&yen;</i>{{tax | priceFilter}}</span>
            </div>
            <!-- 现金券 -->
            <div class="extInfo__item">
              <span>现金券</span>
              <span class="price active">-<i>&yen;</i>{{couponUnit | priceFilter}}</span>
            </div>
          </div>
				</div>
			</div>
			<div class="tips" v-show="false">
				<img src="~@/assets/img/list_icon_remind_sel@3x.png" alt="">使用现金券将不能参与直付立减活动
			</div>
		</div>
		<div class="OrderFill__footer van-hairline--top">
			<div class="wrap">
				<div class="left">
					<span>&nbsp;&yen;{{UnitPrice | priceFilter}}&nbsp;</span>
				</div>
				<div class="right" @click="submitOrder">
					提交订单
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import orderFillAddress from './OrderFillAddress'
import orderFillGoods from './OrderFillGoods'
export default {
  name: 'OrderFill',
  props: {},
  data () {
    return {
      currentData: null,
      curAdreess: null,
      userAddress: null,
      postagePrice: 0,
      remark: '',
      IdCard: '',
      needCheck: true,
      promotionPrice: 0,
      couponUnit: 0,
      couponName: '',
      canUseCoupon: false,
      coupons: [],
      couponCodeList: [],
      isFirstEnter: false
    }
  },
  computed: {
    code () {
      return this.currentData && this.currentData.code
    },
    skuCode () {
      return this.currentData && this.currentData.skuCode
    },
    goodsNum () {
      return this.currentData && this.currentData.goodsNum
    },
    goodSource () {
      return this.currentData && this.currentData.goodSource
    },
    instalmentAmount () {
      return this.currentData && this.currentData.instalmentAmount
    },
    skuFillStr () {
      return this.currentData && this.currentData.skuFillStr
    },
    goodsImageUrl () {
      return this.currentData && this.currentData.goodsImageUrl
    },
    curSkuImg () {
      return this.currentData && this.currentData.curSkuImg
    },
    tax () {
      return this.currentData && this.currentData.tax
    },
    goodSourceName () {
      return this.currentData && this.currentData.goodSourceName
    },
    productCategoryId () {
      return this.currentData && this.currentData.productCategoryId
    },
    goodsImg () {
      return this.curSkuImg || this.goodsImageUrl
    },
    goodsName () {
      return this.currentData && this.currentData.goodsName
    },
    deliverAddressId () {
      return this.curAdreess && this.curAdreess.id
    },
    person () {
      return (this.curAdreess && this.curAdreess.person) || '收货人'
    },
    UserIdCard () {
      return this.curAdreess && this.curAdreess.idCard
    },
    cardFrontImg () {
      return this.curAdreess && this.curAdreess.cardFrontImg
    },
    cardBackImg () {
      return this.curAdreess && this.curAdreess.cardBackImg
    },
    orderPrice () {
      let goodsPrice = this.promotionPrice * this.goodsNum
      return goodsPrice + this.postagePrice + this.tax
    },
    UnitPrice () {
      return this.orderPrice - this.couponUnit
    },
    haitaoFlag () {
      return this.currentData && this.currentData.haitaoFlag !== -1
    },
    haitaoTipShow () {
      if (!this.haitaoFlag) return false
      return !this.UserIdCard || !this.cardFrontImg || !this.cardBackImg
    },
    IdCardPlaceHolder () {
      return `请填写${this.person}的身份证号`
    }
  },
  created () {
    this.isFirstEnter = true
  },
  async activated () {
    if (!this.$route.meta.isBack || this.isFirstEnter) {
      this.currentData = JSON.parse(window.sessionStorage.getItem('currentBuyData'))
      this.promotionPrice = this.currentData && this.currentData.promotionPrice
      let currentSelectAddress = this.$route.params.currentSelectAddress
      if (!currentSelectAddress) {
        await this.queryAddress()
      } else {
        this.curAdreess = currentSelectAddress
        this.setIdCard()
      }
      let haitaoComplete = this.getQueryString('haitao')
      if (haitaoComplete === 'complete') {
        this.NormalOrderSubmit()
      }
      window.sessionStorage.setItem('selectedCoupon', '')
    }
    this.$route.meta.isBack = false
    this.isFirstEnter = false
    this.isLeave = false
    let selectedCoupon = window.sessionStorage.getItem('selectedCoupon')
    if (selectedCoupon) {
      selectedCoupon = JSON.parse(selectedCoupon)
      this.couponName = selectedCoupon[0].couponName
      this.couponUnit = selectedCoupon[0].unit
      this.couponCodeList = selectedCoupon.map(item => {
        return item.couponCode
      })
    } else {
      this.couponUnit = 0
      this.couponName = ''
      this.couponCodeList = []
    }
  },
  methods: {
    goCouponPage () {
      this.$tj('orderfillcouponclick')
      let orderFillCoupons = JSON.stringify(this.coupons)
      window.sessionStorage.setItem('orderFillCoupons', orderFillCoupons)
      this.$router.push({
        name: 'OrderFillCoupon'
      })
    },
    queryFreight () {
      this.$api['pay/queryFreight']({
        'deliverAddressId': this.deliverAddressId,
        'goods': [{
          'goodCode': this.code,
          'goodCount': this.goodsNum,
          'goodSource': this.goodSource,
          'skuCode': this.skuCode
        }]
      }).then(async res => {
        console.log('postagePrice', res)
        this.postagePrice = res.data.sumFreight
        if (this.goodSource === '41') {
          let batch = await this.batchCheck()
          if (batch) {
            this.promotionPrice = batch.hasChanged ? batch.latestElepPrice : batch.elepPrice
          }
        }
        await this.getUsableByGoodsV2()
      }).catch(err => {
        console.log(err)
      })
    },
    queryAddress () {
      return this.$api['address/getAllAddress']({
        'token': this.userToken
      }).then(res => {
        this.userAddress = res.addresses
        if (!this.userAddress) return false
        else {
          this.userAddress.forEach(item => {
            if (item.isDefault) {
              this.curAdreess = item
              this.setIdCard()
            }
          })
        }
      })
    },
    async submitOrder () {
      if (!this.curAdreess) {
        this.$toast('请填写收货地址')
        return false
      }
      if (this.haitaoFlag) {
        if (!this.IdCard) {
          this.$toast('请输入身份证号码')
          return false
        }
        if (this.IdCard && this.IdCard.length < 18) {
          this.$toast('请输入正确的身份证号码位数')
          return false
        }
        let cardFrontImg = this.curAdreess && this.curAdreess.cardFrontImg
        let cardBackImg = this.curAdreess && this.curAdreess.cardBackImg
        if (cardFrontImg && cardBackImg) {
          this.needCheck = false
        }
        if (this.needCheck) {
          try {
            await this.perfetInformation()
            this.$dialog.confirm({
              message: `订单包含跨境商品，需补充收件人的清关信息，否则无法发货，是否现在提交信息？`,
              confirmButtonText: '前往提交',
              cancelButtonText: '稍后提交',
              className: 'passgoodsDailog',
              beforeClose: (action, done) => {
                if (action === 'confirm') {
                  // 跳转去补偿页面
                  this.jumpToIdCard()
                } else {
                  this.needCheck = false
                }
                done()
              }
            })
          } catch (error) {
            this.$toast(error.message)
            return false
          }
        } else {
          this.NormalOrderSubmit()
        }
      } else {
        this.NormalOrderSubmit()
      }
    },
    setIdCard () {
      if (this.curAdreess && this.curAdreess.idCard) this.IdCard = this.curAdreess.idCard
      else this.IdCard = ''
    },
    jumpToIdCard () {
      // 跳转去补偿页面
      let routerData = JSON.stringify({
        name: this.$route.name,
        query: this.$route.query,
        params: this.$route.params
      })
      this.$router.push({
        name: 'IdCardAuth',
        query: {
          type: 'router',
          routerData: routerData,
          addressId: this.deliverAddressId
        }
      })
    },
    getUsableByGoodsV2 (body) {
      return this.$api['pay/getUsableByGoodsV2']({
        token: this.userToken,
        couponType: 4,
        prodParamList: [
          {
            productCategoryId: this.productCategoryId,
            goodsNum: this.goodsNum,
            goodsCode: this.code,
            goodsPrice: this.orderPrice,
            goodSource: this.goodSource
          }
        ]
      }, {
        noStringify: true
      }).then(res => {
        let tag = false
        this.coupons = res.data.map(item => {
          if (item.usable) tag = true
          item.active = false
          return item
        })
        this.canUseCoupon = this.coupons.length !== 0 && tag
      })
    },
    async NormalOrderSubmit () {
      this.$api['pay/orderSubmit']({
        'couponCodeList': this.couponCodeList,
        'deliverAddressId': this.deliverAddressId,
        'goods': [{
          'goodCode': this.code,
          'goodCount': this.goodsNum,
          'goodSource': this.goodSource
        }],
        'source': 8,
        'skuCode': this.skuCode,
        'remark': this.remark,
        'shoppingCartFlag': false
      }, {
        headers: {
          token: this.userToken
        }
      }).then(res => {
        let result = res.data
        this.curAdreess = null
        this.currentData = null
        if (result.couldInstalment) {
          // 分期收银台
          this.$router.replace({
            name: 'OrderPay',
            params: {
              orderCode: result.orderCode
            },
            query: {
              noCache: Date.now()
            }
          })
        } else {
          // 直付收银台
          this.$router.replace({
            name: 'OrderDirectPay',
            params: {
              orderCode: result.orderCode
            }
          })
        }
      })
    },
    MergeOrderSubmit () {
      this.$api['pay/mergeOrderSubmit']({
        'couponCodeList': [],
        'deliverAddressId': this.deliverAddressId,
        'goods': [{
          'goodCode': this.code,
          'goodCount': this.goodsNum,
          'goodSource': this.goodSource,
          'skuCode': this.skuCode, // sku编号
          'remark': this.remark
        }],
        'source': 'h5'
      }, {
        headers: {
          token: this.userToken
        }
      }).then(res => {

      })
    },
    perfetInformation () {
      const formData = new FormData()
      formData.append('token', this.userToken)
      formData.append('idCard', this.IdCard)
      formData.append('addressId', this.deliverAddressId)
      return this.$api['auth/perfetInformation'](formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
    batchCheck () {
      return this.$api['cashierdesk/batchCheck']({
        skuIds: [this.code],
        deliverAddressId: this.deliverAddressId
      }, {
        headers: {
          token: this.userToken
        },
        noStringify: true
      }).then(res => {
        let result = res.data
        return result && result.suningProducts[0]
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'OrderFillCoupon') {
      to.meta.isBack = true
    }
    to.meta.keepAlive = true
    next()
  },
  beforeRouteLeave (to, from, next) {
    let arr = ['OrderFillCoupon', 'Address']
    if (arr.indexOf(to.name) === -1) {
      global.appIns.alive = false
      from.meta.keepAlive = false
      this.$nextTick(() => {
        global.appIns.alive = true
      })
    }
    next()
  },
  filters: {
    priceFinalFilter (price) {
      let ret
      if (!price) {
        ret = 0
      } else {
        ret = Math.ceil(price / 12) / 100
      }
      return ret.toFixed(2)
    }
  },
  watch: {
    deliverAddressId (val) {
      if (val) this.queryFreight()
    },
    async userToken (val) {
      if (val) {
        await this.queryAddress()
      }
    }
  },
  components: {
    orderFillAddress,
    orderFillGoods
  }
}
</script>
<style lang="scss">
.passgoodsDailog {
  .van-dialog__message {
    font-size: 30px;
  }
}
</style>

<style scoped lang="scss">
@import "../../assets/scss/mixin.scss";
.mb20 {
  margin-bottom: 20px;
}
.OrderFill {
  padding-bottom: 100px;
  &__footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 98px;
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: border-box;
    background-color: #fff;
    .wrap {
      display: flex;
      justify-content: space-between;
      width: 700px;
      padding: 14px 20px 16px 30px;
    }
    .left {
      height: 50px;
      font-size: 28px;
      line-height: 50px;
      padding: 9px 0;
      span {
        font-size: 36px;
        color: #ed145b;
        font-weight: bold;
        line-height: 50px;
      }
    }
    .right {
      width: 230px;
      height: 68px;
      background: rgba(245, 75, 120, 1);
      border-radius: 4px;
      line-height: 68px;
      font-size: 28px;
      font-weight: 400;
      text-align: center;
      color: #fff;
    }
  }
  &__headerTip {
    background-color: #fff5d9;
    padding: 20px 30px;
    color: #c8732c;
    font-size: 24px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    line-height: 33px;
    margin-bottom: 20px;
  }
  &__IdCard {
    height: 48px;
    padding: 20px 30px;
    background-color: #fff;
    margin-bottom: 20px;
    span {
      float: left;
      height: 48px;
      line-height: 48px;
      font-size: 28px;
      font-weight: 400;
      margin-right: 20px;
      color: #333;
      text-align: left;
    }
    input {
      float: left;
      width: 450px;
      color: #333;
      height: 48px;
      font-size: 28px;
      line-height: normal;
      box-sizing: border-box;
    }

    input::-webkit-input-placeholder {
      color: #939393;
    }
  }
}
.info {
  margin-bottom: 20px;
  .title {
    height: 88px;
    padding: 0 30px;
    background: rgba(255, 255, 255, 1);
    font-size: 28px;
    font-weight: 400;
    color: #333;
    line-height: 88px;
    box-sizing: border-box;
    text-align: left;
  }
}
.tips {
  padding: 0 30px;
  height: 33px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 33px;
  img {
    width: 26px;
    height: 26px;
    margin: 3.5px 8px;
  }
}
.extInfo {
  background-color: #fff;
  margin-top: 20px;
  &__title {
    display: flex;
    height: 40px;
    font-size: 28px;
    font-weight: 400;
    justify-content: space-between;
    color: rgba(51, 51, 51, 1);
    line-height: 40px;
    padding: 24px 30px;
    &.message {
      justify-content: flex-start;
      span,
      input {
        display: inline-block;
      }
      span {
        margin-right: 20px;
      }
      input {
        width: 500px;
        line-height: normal;
        color: #333;
        box-sizing: border-box;
        @include text-overflow(1);
      }
      input::-webkit-input-placeholder {
        color: #939393;
      }
    }
    .price {
      color: #939393;
      &.active {
        color: #ed145b;
      }
    }
    .coupon {
      padding-right: 44px;
      color: #939393;
      &.active {
        color: #ed145b;
      }
    }
    .img {
      position: absolute;
      right: 30px;
      top: 20px;
      img {
        width: 44px;
        height: 44px;
      }
    }
  }
  &__list {
    padding: 9px 0 15px;
  }
  &__item {
    display: flex;
    height: 40px;
    font-size: 28px;
    font-weight: 400;
    justify-content: space-between;
    color: rgba(51, 51, 51, 1);
    line-height: 40px;
    padding: 15px 30px;
    &.message {
      justify-content: flex-start;
      span,
      input {
        display: inline-block;
      }
      span {
        margin-right: 20px;
      }
      input {
        width: 500px;
        line-height: normal;
        color: #333;
        box-sizing: border-box;
        @include text-overflow(1);
      }
      input::-webkit-input-placeholder {
        color: #939393;
      }
    }
    .price {
      color: #939393;
      i {
        padding: 0 5px;
      }
      &.active {
        color: #ed145b;
      }
    }
    .coupon {
      padding-right: 44px;
      color: #939393;
      &.active {
        color: #ed145b;
      }
    }
    .img {
      position: absolute;
      right: 30px;
      top: 20px;
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
.remark {
  padding: 34px 20px 16px;
  background: #fff;
  &__wrap {
    padding: 16px 20px;
    height: 72px;
    background-color: #f7f7f7;
    border-radius: 4px;
    box-sizing: border-box;
  }
  span {
    float: left;
    height: 40px;
    font-size: 24px;
    font-weight: 400;
    color: #333;
    line-height: 40px;
  }
  input {
    float: left;
    height: 40px;
    width: 550px;
    font-size: 24px;
    font-weight: 400;
    line-height: normal;
    color: #333;
    background-color: #f7f7f7;
    box-sizing: border-box;
  }
  input::-webkit-input-placeholder {
    color: #939393;
  }
}
</style>
