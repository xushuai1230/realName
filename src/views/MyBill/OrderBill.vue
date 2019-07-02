<template>
  <div id="order-Bill">
    <!-- <p class="bill-notic">注：请勿在小象APP以外的任何途径进行还款操作，谨防诈骗！</p> -->
    <div v-if="nowShow">
          <!-- 老订单 -->
          <div class="bill-now clearfix" v-for="item in unClearOldBill" @click="_goToOrderPlan(item.orderCode)" :key="item.orderCode">
            <div class="fl flbox ml34">
              <div class="bill-now-type"><b>{{item.goodType}}</b>
              </div>
              <div class="bill-now-amount">
                <span class="amount-msg">分期金额: </span>
                <span class="amount-money"> &yen;{{item.bystagesAmount | priceFilters}}</span>
              </div>
              <div class="bill-now-nowMoney mt20">
                <span class="nowMoney-msg">本期应还: </span>
                <span class="nowMoney-money"> &yen;{{item.shouldBeAmount | priceFilters}}</span>
              </div>
              <div class="bill-now-date mt20">
                <span class="date-msg">还款日期: </span>
                <span class="date-ymd"> {{item.repaymentDate}}</span>
              </div>
            </div>

            <div class="fr frbox">
              <!-- 旧账单 还款状态(0:未还 1:已还 2:逾期 3:逾期已还 5：还款中（代扣）6：（取消）7:还款中(支付宝)) -->
              <div class="bill-now-status fl" v-show="item.status===2"></div>
              <div class="fl clone-status" v-show="item.status!==2"> </div>
              <div class="bill-now-flag fr">
                <span class="flag-now">{{item.currentRepaymentPeriod}}</span>
                <span class="flag-mouth">/{{item.bystagesNum}}期</span>
              </div>
            </div>
            <div class="bill-now-sub fr mt23">去APP还款</div>

          </div>
          <!-- 新订单(合并) -->
          <div class="bill-now clearfix" v-for="item in unClearNewBill" @click="gotoOrderDetailSet(item, 'noClear')" :key="item.id">
            <div class="fl flbox ml34">
              <div class="bill-now-type"><b>{{item.planName}}</b>
              </div>
              <div class="bill-now-nowMoney mt20">
                <span class="nowMoney-msg">账单总额: </span>
                <span class="nowMoney-money"> &yen;{{item.amount | priceFilters}}</span>
                <span class="nowMoney-money">({{item.planCount}}笔)</span>
              </div>
              <div class="bill-now-date mt20">
                <span class="date-msg">最后还款日: </span>
                <span class="date-ymd"> {{item.repaymentDate}}</span>
              </div>
            </div>

            <div class="fr frbox">
              <div class="bill-now-flag fr">
                <span class="flag-mouth">{{item.statusDesc}}</span>
              </div>
            </div>
            <div class="bill-now-sub fr mt40">去APP还款</div>
          </div>
    </div>
    <div v-else>
        <div class="now-tip-fp">
            <img src="~@/assets/img/blankpage_img_search@3x.png" class="now-tip-pic">
            <div class="now-tip-font">{{tipnow}}</div>
        </div>
    </div>
  </div>
</template>
<script>
import { noEmptyArr } from '@/module/common'
export default {
  data () {
    return {
      nowOrder: [], // 未结清
      overOrder: [], // 已结清
      isLoading: false,
      nowShow: true,
      overShow: true,
      tipnow: ' ',
      tipover: ' ',
      unClearOldBill: null,
      unClearNewBill: null,
      clearOldBill: null,
      clearNewBill: null
    }
  },
  computed: {
    isFeizuxia () {
      let ua = navigator.userAgent.toLocaleLowerCase()
      if (ua.match(/feizuxia/)) {
        return false
      }
      return true
    }
  },
  components: {},
  mounted () {
    this.postNowOrderv2()
  },
  methods: {
    // 点击跳转账单详情 未结清
    _goToOrderPlan (code) {
      location.href = 'https://api.xiaoxiangyoupin.com/portal/download'
      // this.$tj('orderreturnclick')
      // this.$router.push({
      //   name: 'orderPlanDetail',
      //   params: { orderCode: code, type: 'singe', status: 'noClear' },
      //   query: { token: this.userToken }
      // })
    },
    // 点击跳转合并账单详情 未结清
    gotoOrderDetailSet (order, status) {
      location.href = 'https://api.xiaoxiangyoupin.com/portal/download'
      // this.$tj('orderreturnclick')
      // this.$router.push({
      //   name: 'orderPlanDetailSet',
      //   params: { id: order.id, billNum: order.billNum, status }
      // })
    },
    /**
     * 合并未结清账单 v2
     */
    postNowOrderv2 (cb) {
      if (!cb) this.isLoading = true
      let body = {
        token: this.userToken
      }
      this.$api['myBill/getNotClearedBillV2'](body)
        .then(body => {
          let singleBol = noEmptyArr(body.single)
          let mergeBol = noEmptyArr(body.merge)
          if (singleBol) {
            this._checkGoodType(body.single)
            this.unClearOldBill = body.single
          }
          if (mergeBol) {
            this._checkBillStatus(body.merge)
            this.unClearNewBill = body.merge
          }
          if (!singleBol && !mergeBol) {
            // 表示没有任何账单的时候
            this.tipnow = '不剁手的日子很空虚~'
            this.nowShow = false
          } else {
            this.nowShow = true
          }
          cb ? cb() : this.isLoading = false
        })
        .catch(err => {
          console.log(err)
          this.tipnow = '获取失败,请重试'
          this.nowShow = false
          cb ? cb() : this.isLoading = false
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
        } else if (code === '39') {
          arr[i].goodType = '购物提现'
        } else if (code === '22') {
          arr[i].goodType = '信用卡代还'
        } else if (code === '25') {
          arr[i].goodType = '情侣卡借款'
        } else if (code === '27') {
          arr[i].goodType = '颜值卡借款'
        } else if (code === '47') {
          arr[i].goodType = '保险订单'
        } else {
          arr[i].goodType = '商品分期'
        }
      }
    },
    // 账单类型
    _checkBillStatus (arr) {
      if (!(arr instanceof Array)) return arr
      arr.forEach(item => {
        switch (item.status) {
          case '0':
            item.statusDesc = '未出账'
            break
          case '1':
            item.statusDesc = '已出账'
            break
          case '2':
            item.statusDesc = '已结清'
            break
          case '3':
            item.statusDesc = '逾期中'
            break
          case '4':
            item.statusDesc = '逾期结清'
            break
        }
      })
      return arr
    }
  },
  watch: {
    isLoading: function (newValue) {
      if (newValue) {
        global.vbus.$emit('loading_show', true)
      } else {
        global.vbus.$emit('loading_show', false)
      }
    }
  }
}
</script>
<style scoped lang="scss">
#order-Bill {
  font-family: PingFangSC-Regular;
}
 .w50 {
    width: 50%;
  }
  .w25 {
    width: 25%;
  }
  .w20 {
    width: 20%;
  }
  .w33 {
    width: 33.333333%;
  }
  .w30 {
    width: 30%;
  }
  .w60 {
    width: 60%;
  }
  .text_cent {
    text-align: center;
  }
  .clearfix:after {
    content: "";
    display: block;
    visibility: hidden;
    height: 0;
    clear: both;
  }
  /* 使得表单元素在 ie 下能继承字体大小 */
  /* 注：optgroup 无法扶正 */
  /** 重置表格元素 **/
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  *,
  *::before,
  *::after {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .h20 {
    width: 100%;
    height: 20px;
    background-color: #f2f2f2;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .ml34 {
    margin-left: 0.453333rem;
  }
  .ml30 {
    margin-left: 0.4rem;
  }
  .mt20 {
    margin-top: 0.266667rem;
  }
  .mt30 {
    margin-top: 0.4rem;
  }
  .clearfix:after {
    content: "";
    display: block;
    visibility: hidden;
    height: 0;
    clear: both;
  }
  .one-txt {
  overflow: hidden;
  /*文字超出用省略号*/
  text-overflow: ellipsis;
  /*盒子模型*/
  display: -webkit-box;
  /*显示的文本行数*/
  -webkit-line-clamp: 1;
  /*子元素的垂直排列方式*/
  -webkit-box-orient: vertical;
}
.tips {
  width: 100%;
  padding: 0.373333rem 0.4rem;
  background: #fff7de;
  font-size: 0.346667rem;
  color: #6a5829;
  height: 1.2rem;
  z-index: 111;
  box-sizing: border;
}
.loveBanner {
  width: 100%;
  position: fixed;
  top: 0;
  height: 1.6rem;
  z-index: 9999999;
  background: url('~@/assets/img/userOrder/banhuabanner.png') no-repeat center;
  background-size: 100% 100%;
}

.bill-now {
  width: 100%;
  background-color: #ffffff;
  margin-bottom: 0.266667rem;
  position: relative;
}

.bill-now-type {
  font-weight: 600;
  height: 0.36rem;
  font-size: .4rem;
  color: #333;
  margin-top: .453333rem;
  margin-bottom: .453333rem;
}

.bill-now-amount,
.bill-now-nowMoney,
.bill-now-date,
.bill-over-type,
.bill-over-money,
.bill-over-mouth {
  height: 0.36rem;
}

.amount-msg,
.nowMoney-msg,
.date-msg,
.overMoney-msg,
.overMouth-msg {
  font-size: 0.373333rem;
  color: #939393;
}

.amount-money,
.overMoney-money,
.overMouth-mouth {
  font-size: 0.373333rem;
  color: #333;
}

.nowMoney-money {
  font-size: 0.373333rem;
  color: #ed145b;
}

.date-ymd {
  font-size: 0.373333rem;
  color: #333;
}

.bill-now-status {
  background: url("~@/assets/img/userOrder/order-bill-now.png") no-repeat center center;
  width: 1.613333rem;
  height: 1.413333rem;
  background-size: cover;
}

.clone-status {
  width: 1.613333rem;
  height: 1.413333rem;
}

.frbox {
  position: relative;
  width: 3.553333rem;
  padding-top: 0.306667rem;
  box-sizing: border-box;
  height: 100%;
}

.bill-now-sub {
  position: absolute;
  z-index: 99;
  width: 2.133333rem;
  background: #f54b78;
  border-radius: .053333rem;
  text-align: center;
  font-size: .373333rem;
  color: #fff;
  line-height: .72rem;
  bottom: .4rem;
  right: 0.306667rem;
}

.bill-now-flag {
  text-align-last: justify;
  margin-right: 0.32rem;
  white-space: nowrap;
}

.flag-mouth {
  font-size: 0.346667rem;
  color: #333
}

.flag-now {
  font-size:.373333rem;
  color: #ed145b
}

.bill-over {
  width: 100%;
  height: 2.533333rem;
  background: #ffffff;
  margin-bottom: 0.266667rem;
}

.bill-over-type {
  font-size: 0.4rem;
  color: #333;
  margin-bottom: 0.373333rem;
}

.order-check {
  font-size: 0.346667rem;
  color: #333;
  margin-right: 0.306667rem;
}

.bill-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
}

.now-tip,
.over-tip {
  width: 100%;
  height: 15rem;
}

.over-tip-fp {
  width: 100%;
  position: relative;
  top: 3.6rem;
  left: 50%;
  text-align: center;
}
.now-tip-fp {
    width: 100%;
    position: relative;
    top: 5.6rem;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    text-align: center;
}

.now-tip-pic,
.over-tip-pic {
  width: 4.8rem;
  height: 4.8rem;
  background-size: 4.8rem;
}

.now-tip-font,
.over-tip-font {
  font-size: 0.373333rem;
  color: #636363;
}
.total-color {
  color: #f54b78;
}
.mt40 {
  margin-top: 0.533333rem;
}
.mt23 {
  margin-top: 0.306667rem;
}
.bill-notic {
  font-size: .32rem;
  text-align: center;
  line-height: 1.133333rem;
}
.bill-now-date {
  padding-bottom: .533333rem;
  height: auto;
}
</style>
