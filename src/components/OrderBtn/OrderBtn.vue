<template>
	<div class="orderBtn">
		<div class="orderBtn__wrap">
			<div class="btn active" v-if="deleteShow" @click.stop.prevent="deleteOrder">
				<span>删除订单</span>
			</div>
			<div class="btn" v-if="bindCardShow" @click.stop.prevent="goBindCard">
				<span>去绑卡</span>
			</div>
			<div class="btn" v-if="payDownShow" @click.stop.prevent="jumpToPayDown">
				<span>去小象app付首付</span>
			</div>
			<div class="btn" v-if="payShow" @click.stop.prevent="goCashDesk">
				<span>去结算</span>
			</div>
			<div class="btn active" v-if="cancelShow" @click.stop.prevent="toggleCancelModelShow(true)">
				<span>取消订单</span>
			</div>
			<div class="btn active" v-if="logisticsShow" @click.stop.prevent="viewLogistics">
				<span>查看物流</span>
			</div>
			<div class="btn" v-if="receiveShow" @click.stop.prevent="confirmOrder">
				<span>确认收货</span>
			</div>
			<div class="btn" v-if="haoTaoCCLShow" @click.stop.prevent="goHaitao">
				<span>清关信息</span>
			</div>
		</div>
		<!-- 取消订单弹窗 -->
		<cancel-model v-if="cancelModelShow" @toggleCancelModelShow="toggleCancelModelShow" :orderCode="orderCode"></cancel-model>
	</div>
</template>

<script type="text/ecmascript-6">
import cancelModel from '@/components/orderCancelModel/orderCancelModel'
export default {
  name: '',
  props: ['order', 'type'],
  data () {
    return {
      cancelModelShow: false
    }
  },
  computed: {
    lookingCardOrder () {
      return this.order && this.order.lookingCardOrder
    },
    orderStatus () {
      return this.order && this.order.orderStatus
    },
    orderCode () {
      return this.order && this.order.orderCode
    },
    systemTime () {
      return this.order && this.order.systemTime
    },
    orderTime () {
      return this.order && this.order.orderTime
    },
    hotelOrderInfo () {
      return this.order && this.order.hotelOrderInfo
    },
    deliveryInfo () {
      return this.order && this.order.deliveryInfo
    },
    deliveryInfoId () {
      return this.deliveryInfo && this.deliveryInfo.id
    },
    includeHaiTaoGoods () {
      return this.deliveryInfo && this.deliveryInfo.includeHaiTaoGoods
    },
    orderItemStatus () {
      return this.order && this.order.orderItems[0] && this.order.orderItems[0].status
    },
    deleteShow () { // 删除订单
      if (!this.orderCode) return false
      let stautsArr = [21, 22, 91, 102]
      let orderCodeArr = [20, 21, 32, 34, 36, 38]
      let ordercode = Number(this.orderCode.slice(0, 2))
      // 订单状态 优先级最高
      if (stautsArr.indexOf(this.orderStatus) > -1) {
        return true
      }
      // 商品订单以及虚拟充值订单
      if (orderCodeArr.indexOf(ordercode) > -1) {
        let orderTime = this.orderTime + 1000 * 60 * 60 * 24 * 30
        return (this.orderStatus === 61) && (this.systemTime > orderTime)
      }
      return false
    },
    haoTaoCCLShow () { // 清关信息
      return this.includeHaiTaoGoods && this.orderStatus === 41 && this.orderItemStatus === 4
    },
    bindCardShow () { // 去绑卡
      return this.orderStatus === 40
    },
    payDownShow () { // 支付首付
      return this.orderStatus === 86
    },
    cancelShow () { // 取消订单
      let name = this.$route.name
      if (this.lookingCardOrder) return false
      return (this.orderStatus === 0 || this.orderStatus === 94 || this.orderStatus === 95 || this.orderStatus === 96) && name === 'OrderDetail'
    },
    payShow () { // 去结算
      return this.orderStatus === 0
    },
    logisticsShow () { // 查看物流
      if (!this.orderCode) return false
      let code = Number(this.orderCode.slice(0, 2))
      let codeArr = [33, 35, 42, 45, 46, 48]
      if (codeArr.indexOf(code) > -1) {
        return false
      }
      return this.orderStatus === 51 || this.orderStatus === 61
    },
    receiveShow () {
      return this.orderStatus === 51
    }
  },
  methods: {
    // 取消订单
    toggleCancelModelShow (val) {
      this.cancelModelShow = val
    },
    // 去结算
    goCashDesk () {
      this.$router.push({
        name: 'OrderPay',
        params: {
          orderCode: this.orderCode
        },
        query: {
          noCache: Date.now()
        }
      })
    },
    // 删除订单
    deleteOrder () {
      this.$dialog.confirm({
        message: '确定要删除此订单吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        console.log(this.$route)
        let name = this.$route.name
        this.$api['order/orderDelete']({
          token: this.userToken,
          code: this.orderCode
        })
          .then(res => {
            if (name === 'OrderDetail') this.$router.go(-1)
            // global.vbus.$emit('initList')
            global.vbus.$emit('setChangOrderCode', this.orderCode)
          })
      })
    },
    // 查看物流信息
    viewLogistics () {
      this.$router.push({
        name: 'orderLogistics',
        params: {
          orderCode: this.orderCode
        },
        query: {
          noCache: Date.now()
        }
      })
    },
    // 去绑卡
    goBindCard () {
      let routerData = null
      let name = this.$route.name
      if (name === 'OrderList') {
        routerData = JSON.stringify({
          name: this.$route.name,
          query: this.$route.query,
          params: {
            type: this.type
          }
        })
      } else {
        routerData = JSON.stringify({
          name: this.$route.name,
          path: this.$route.path,
          query: this.$route.query,
          params: this.$route.params
        })
      }
      this.$router.push({
        name: 'BindCardYiBao',
        query: {
          type: 'router',
          routerData: routerData,
          noCache: Date.now()
        }
      })
    },
    // 支付首付
    jumpToPayDown () {
      location.href = 'https://api.xiaoxiangyoupin.cn/portal/download'
      // this.$router.push({
      //   name: 'OrderDirectPay',
      //   params: {
      //     orderCode: this.orderCode
      //   }
      // })
    },
    // 确认收货
    confirmOrder () {
      this.$api['order/confirm']({
        code: this.orderCode
      }, {
        headers: {
          token: this.userToken
        }
      }).then(res => {
        let name = this.$route.name
        if (name === 'OrderDetail') this.$router.go(-1)
        global.vbus.$emit('setChangOrderCode', this.orderCode)
      })
    },
    // 海淘清关信息
    goHaitao () {
      let routerData = {
        name: this.$route.name,
        params: this.$route.params,
        query: this.$route.query
      }
      this.$router.push({
        name: 'IdCardAuth',
        query: {
          addressId: this.deliveryInfoId,
          routerData: JSON.stringify(routerData),
          method: 'replace',
          type: 'router',
          noCache: Date.now()
        }
      })
    }
  },
  components: {
    cancelModel
  }
}
</script>

<style scoped lang="scss">
.bottom {
  bottom: 68px;
}
.orderBtn {
  &.fixed {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100px;
    padding-bottom: env(safe-area-inset-bottom);
    background-color: #fff;
    .orderBtn__wrap {
      padding: 22px 30px;
      box-sizing: border-box;
    }
  }
  .btn {
    &.active {
      background-color: #fff;
      border: 2px solid rgba(147, 147, 147, 0.6);
      span {
        color: #636363;
      }
    }
    position: relative;
    min-width: 150px;
    height: 54px;
    padding: 0 8px;
    box-sizing: border-box;
    float: right;
    margin-left: 20px;
    background-color: #f54b78;
    border-radius: 4px;
    text-align: center;
    span {
      display: inline-block;
      height: 54px;
      font-size: 28px;
      font-weight: 400;
      color: #fff;
      line-height: 54px;
    }
  }
}
</style>
