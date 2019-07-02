<template>
  <div class="orderbillset-root" v-extend-height>
    <div class="bill-header" v-show="sumBills.surplusAmount != undefined">
      <span class="pay-explain" v-if="isFeizuxia" @click="orderInstructions">还款说明</span>
      <span class="bill-status"><span class="status-text">{{sumBills.statusDesc}}</span></span>
      <h1 class="bill-title">{{sumBills.planeNum}}月剩余应还</h1>
      <div class="bill-money">¥{{sumBills.surplusAmount | priceFilters}}</div>
      <p class="bill-time">账单出账日：{{sumBills.expenditureDate}}</p>
      <p class="bill-time">最后还款日：{{sumBills.repaymentDate}}</p>
    </div>
    <section class="bill-totle" v-show="sumBills.amount">
      <span class="bill-total-money">{{sumBills.planeNum}}月账单：¥{{sumBills.amount | priceFilters}}</span>
      <span class="bill-alr">已还：¥{{sumBills.completeAmount | priceFilters}}</span>
    </section>
    <dl class="bill-list" v-if="sumBills.planList">
      <dt>{{sumBills.planeNum}}月账单共{{sumBills.planList.length}}笔</dt>
      <dd v-for="item in sumBills.planList" @click="gotoDetail(item.orderCode, item.orderStatus)" :key="item.orderCode">
        <div :class="{zhihui: alredayPay(item.repaymentStatus)}" class="bill-item-list">
          <span>{{item.goodType}}</span>
          <span>{{item.currentSeq}}/{{item.seqNum}}期</span>
          <span>¥{{item.principal + item.serviceFee + item.overdueFee | priceFilters}}</span>
          <span :class="{yuqi: item.repaymentStatus === '2'}">{{item.statusDesc}}</span>
        </div>
      </dd>
    </dl>
    <div class="pay-area" v-if="isPay">
      <span class="pay-btn" @click="payBill">{{payDesc}}</span>
    </div>

  </div>
</template>
<script>
export default {
  data () {
    return {
      sumBills: {},
      isLoading: false,
      updateBol: false,
      payDetail: null
    }
  },
  async mounted () {
    await this.fetchTotalDetail()
    await this.getRepaymentType()
  },
  computed: {
    isPay () {
      if (this.sumBills.surplusAmount === 0) {
        return false
      }
      switch (this.sumBills.status) {
        case '0':
        case '1':
        case '3':
          return true
        default:
          return false
      }
    },
    isFeizuxia () {
      let ua = navigator.userAgent.toLocaleLowerCase()
      if (ua.match(/feizuxia/)) {
        return false
      }
      return true
    },
    payDesc () {
      switch (this.sumBills.status) {
        case '0':
          return '提前还款'
        case '1':
        case '3':
          return '立即还款'
        default:
          return ''
      }
    }
  },
  methods: {
    fetchTotalDetail (cb) {
      if (!cb) this.isLoading = true
      const token = this.userToken
      const billId = this.$route.params.id
      const billNum = this.$route.params.billNum
      return this.$api['myBill/getTotalBillDetail']({ token, billId, billNum })
        .then(body => {
          this.checkBillStatus(body.data)
          body.data.planList = this.checkSomeBillStatus(body.data.planList)
          this._checkGoodType(body.data.planList)
          this.fetchMonth(body.data)
          this.sumBills = body.data
          cb ? cb() : this.isLoading = false
        })
        .catch(err => {
          cb ? cb() : this.isLoading = false
          this.$toast(err)
        })
    },
    // 获取还款渠道
    async getRepaymentType () {
      let billData = this.sumBills
      const res = await this.$api['myBill/getRepaymentTypeByMergeBillIdV2']({
        token: this.userToken,
        billNum: billData.billNum,
        billId: billData.id
      })
      res.repaymentType.forEach(item => {
        if (item.channel === '3') {
          this.payDetail = item
        }
      })
    },
    // 支付
    async payBill () {
      if (!this.payDetail || String(this.payDetail.channel) !== '3') {
        this.$toast('此账单请去“小象优品APP”还款')
        return
      }
      let billObj = this.sumBills
      let res = await this.$api['myBill/repayMergeWeb']({
        billId: billObj.id,
        billNum: billObj.billNum,
        token: this.userToken,
        id: this.payDetail.id
      })
      global.vbus.$emit('loading_show', true)
      if (res.sign.indexOf('form') !== -1) { // 返回的是表单内容
        try {
          this.$tj('alipayclick')
          const div = document.createElement('div')
          div.innerHTML = res.sign
          document.body.appendChild(div)
          document.forms[0].submit()
        } catch (error) {
          this.$toast('唤醒支付异常' + error)
          global.vbus.$emit('loading_show', false)
        }
      } else {
        this.$toast('异常，请联系客服')
        global.vbus.$emit('loading_show', false)
      }
    },
    // 跳转 单笔账单详情
    gotoDetail (code, codeType) {
      let status = this.$route.params.status
      if (codeType === '3' || codeType === '5') status = 'clear'
      else status = 'noClear'

      this.$router.push({
        name: 'orderPlanDetail',
        params: { orderCode: code, type: 'merge', status },
        query: { token: this.userToken, noCache: Date.now() }
      })
    },
    // 判断商品类型
    _checkGoodType (arr) {
      for (let i = 0; i < arr.length; i++) {
        let code = arr[i].orderCode.slice(0, 2)
        if (code === '30' || code === '31' || code === '32' || code === '34') {
          arr[i].goodType = '商品分期'
        } else if (code === '33') {
          arr[i].goodType = '小象钱包'
        } else if (code === '35') {
          arr[i].goodType = '应急钱包'
        } else if (code === '36') {
          arr[i].goodType = '充值订单'
        } else if (code === '40') {
          arr[i].goodType = '汽车票'
        } else if (code === '41') {
          arr[i].goodType = '火车票'
        } else if (code === '42') {
          arr[i].goodType = '机票'
        } else if (code === '43') {
          arr[i].goodType = '酒店'
        } else if (code === '44') {
          arr[i].goodType = '饿了么'
        } else if (code === '45') {
          arr[i].goodType = '手续费'
        } else if (code === '22') {
          arr[i].goodType = '信用卡代还'
        } else if (code === '27') {
          arr[i].goodType = '颜值卡借款'
        } else {
          arr[i].goodType = '商品分期'
        }
      }
    },
    // 账单类型
    checkBillStatus (order) {
      switch (order.status) {
        case '0':
          order.statusDesc = '未出账'
          break
        case '1':
          order.statusDesc = '已出账'
          break
        case '2':
          order.statusDesc = '已结清'
          break
        case '3':
          order.statusDesc = '逾期中'
          break
        case '4':
          order.statusDesc = '逾期结清'
          break
      }
    },
    // 确定某笔账单的状态
    checkSomeBillStatus (arr) {
      if (!(arr instanceof Array)) return arr
      arr.forEach(item => {
        // TODO: 4和6的状态会显示吗
        switch (item.repaymentStatus) {
          case '0':
            item.statusDesc = '待还款'
            break
          case '1':
            item.statusDesc = '已还款'
            break
          case '2':
            item.statusDesc = '逾期待还'
            break
          case '3':
            item.statusDesc = '逾期已还'
            break
          case '5':
            item.statusDesc = '还款中'
            break
          case '7':
            item.statusDesc = '还款中'
        }
      })
      return arr
    },
    // 确定还账月数
    fetchMonth (order) {
      const reg = /.*(\d+).(\d+).*/
      let code = order.planName.match(reg)[2]
      code = parseInt(code)
      if (typeof code === 'number') {
        order.planeNum = code
      }
    },
    // 包含 已还 逾期已还
    alredayPay (status) {
      if (status === '1' || status === '3') {
        return true
      }
      return false
    },
    waitPay () {
      this.updateBol = true
      global.vbus.$emit('loading_show', true)
      // 定时检测
      window.updateTimeVal = setInterval(() => {
        if (!this.updateBol) {
          clearInterval(window.updateTimeVal)
        } else {
          this.fetchTotalDetail(function () {})
        }
      }, 1000)
      // 5秒后关闭
      window.updateTimeOut = setTimeout(() => {
        if (this.updateBol) {
          global.vbus.$emit('loading_show', false)
          this.$toast('网络有延迟，请稍后查看')
          this.updateBol = false
          if (window.updateTimeVal) clearInterval(window.updateTimeVal)
        }
      }, 15000)

      this.fetchTotalDetail(function () {})
    },
    // 点击跳转还款说明
    orderInstructions () {
      location.href = 'https://cdn.xiaoxiangyoupin.com/app/service/repay.html'
    },
    // 还款成功页面
    paySuccPage () {
      this.$router.push({
        name: 'MyBillPaySuccess',
        query: {
          noCache: Date.now()
        }
      })
    }
  },
  watch: {
    isLoading: function (newValue) {
      console.log('数据：', newValue)
      if (newValue) {
        global.vbus.$emit('loading_show', true)
      } else {
        global.vbus.$emit('loading_show', false)
      }
    },
    'sumBills.surplusAmount': function () {
      if (this.updateBol) {
        console.log('数据更新')
        this.updateBol = false
        global.vbus.$emit('loading_show', false)
        if (window.updateTimeVal) clearInterval(window.updateTimeVal)
        if (window.updateTimeOut) clearTimeout(window.updateTimeOut)
        this.paySuccPage()
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (window.updateTimeVal) clearInterval(window.updateTimeVal)
    if (window.updateTimeOut) clearTimeout(window.updateTimeOut)
    next()
  }
}
</script>
<style scoped>
.orderbillset-root{
  background: #f2f2f2;
}
.bill-status {
  display: inline-block;
  width: 2rem;
  line-height: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #fff;
  text-align: center;
  font-size: 0.4rem;
  font-weight: 400;
  border-top-right-radius: 0.433333rem;
  border-bottom-right-radius: 0.433333rem;
  margin-top: 0.333333rem;
  border-left: none;
  overflow: hidden;
}
.bill-status .status-text {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  width: 100%;
}
.bill-header {
  background: -webkit-gradient(linear, right top, left bottom ,from(#ffb479), to(#ff4e65));
}
.bill-header {
  position: relative;
  padding-bottom: 0.533333rem;
  background: linear-gradient(45deg, #ff4e65, #ffb479);
}

.bill-title {
  font-size: .373333rem;
  color: #fff;
  text-align: center;
  font-weight: 400;
  line-height: 1.2em;
  margin-top: 0.16rem;
}

.bill-money {
  font-size: 0.8rem;
  color: #fff;
  text-align: center;
  font-weight: 400;
  line-height: 1.12rem;
  margin: 0.226667rem 0.4rem;
}

.bill-time {
  font-size: .32rem;
  color: #fff;
  opacity: 0.7;
  text-align: center;
  font-weight: 400;
  line-height: 1.2em;
  margin-bottom: 0.133333rem;
}
.bill-time:last-child {
  margin-bottom: 0;
}

.bill-totle {
  background-color: #fff;
  font-size: 0;
  color: #333;
  padding: 0 0.4rem;
  white-space: nowrap;
}

.bill-totle span {
  display: inline-block;
  width: 50%;
  font-size: 0.373333rem;
  line-height: 1.173333rem;
}

.bill-totle span:last-child {
  text-align: right;
}

.bill-list {
  margin-top: 0.266667rem;
  padding-bottom: 4rem;
  width: 100%;
  overflow-x: hidden;
}

.bill-list dt {
  /* line-height: 1.28rem; */
  padding:.533333rem 0 .266667rem 0.4rem;
  color: #999;
  font-size: 0.346667rem;
  background-color: #fff;
}

.bill-list dd {
  background-color: #fff;
}

.bill-list dd > div {
  border-bottom: 1px solid #e5e5e5;
  white-space: nowrap;
  font-size: 0;
}
.bill-list dd > div:last-child {
  border-bottom: none;
}

.bill-list dd > div span {
  display: inline-block;
  width: 25%;
  white-space: nowrap;
  color: #333;
  font-size: .373333rem;
  line-height: 1.093333rem;
  text-align: center;
}
.bill-list dd > div span:last-child{
  color: #ed145b;
}
.bill-list dd > div.zhihui span {
  color: #bdbdbd;
}

.bill-list dd > div span.yuqi {
  color: #ed145b;
}

.pay-area {
  position: fixed;
  left: 0;
  width: 100%;
  bottom: 0;
  background-color: #fff;
  height: 1.306667rem;
  line-height: 1.306667rem;
  font-size: .453333rem;
  text-align: center;
  padding: constant(safe-area-inset-top) constant(safe-area-inset-right)
  constant(safe-area-inset-bottom) constant(safe-area-inset-left);
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
  env(safe-area-inset-bottom) env(safe-area-inset-left);
}
.pay-area span {
  /* width: 4.066667rem; */
  /* background-color: #f54b78; */
  display: inline-block;
  height: 100%;
  color: #ed145b;
  text-align: center;
}
.pay-explain {
  position: absolute;
  font-size: .373333rem;
  color: #fff;
  top: 0.48rem;
  right: 0.4rem;
}
.bill-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
}
.bill-item-list {
  display: -webkit-flex;
  justify-content: space-around;
  -webkit-justify-content: space-around;
}
</style>
