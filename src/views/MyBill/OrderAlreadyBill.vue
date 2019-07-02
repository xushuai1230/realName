<template>
  <div id="order-Bill">
        <div v-if="overShow">
          <!-- 老订单 -->
          <div class="bill-over clearfix" v-for="oitem in clearOldBill" :key="oitem.orderCode">
            <div class="fl ml30">
              <div class="bill-over-type mt30 f-700">{{oitem.goodType}}</div>
              <div class="bill-over-money">
                <span class="overMoney-msg">分期金额: </span>
                <span class="overMoney-money"> &yen;{{oitem.bystagesAmount | priceFilters}}</span>
              </div>
              <div class="bill-over-mouth mt20">
                <span class="overMouth-msg">分期期数: </span>
                <span class="overMouth-mouth"> {{oitem.bystagesNum}}期</span>
              </div>
            </div>
            <div class="fr">
              <div class="order-check mt30" v-if="canOrder(oitem.orderCode)" @click="_goToOrderDetail(oitem.orderCode)">查看订单&gt;</div>
            </div>
          </div>
          <!-- 新订单 -->
          <div class="bill-over clearfix" v-for="oitem in clearNewBill" @click="gotoOrderDetailSet(oitem, 'clear')" :key="oitem.id">
            <!-- <div class="bill-over clearfix" v-for="oitem in overOrder" @click="_goToOrderPlan(oitem.orderCode,oitem.goodType)"> 已结清账单跳转账单详情页面,暂时没有接口可以做-->
            <div class="fl ml30">
              <div class="bill-over-type mt30 f-700">{{oitem.planName}}</div>
              <div class="bill-over-money">
                <span class="overMoney-msg total-color">账单总额: </span>
                <span class="overMoney-money total-color"> &yen;{{oitem.amount | priceFilters}}({{oitem.planCount}}笔)</span>
              </div>
              <div class="bill-over-mouth mt20">
                <span class="overMouth-msg">还款日期: </span>
                <span class="overMouth-mouth"> {{oitem.repaymentDate}}</span>
              </div>
            </div>
            <div class="fr">
              <div class="order-check mt30">{{oitem.statusDesc}}</div>
            </div>
          </div>
        </div>
        <div class="over-tip" v-else>
          <div class="over-tip-fp">
            <img src="~@/assets/img/blankpage_img_search@3x.png" class="over-tip-pic">
            <div class="over-tip-font">{{tipover}}</div>
          </div>
        </div>
  </div>
</template>
<script>
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
  },
  components: {},
  mounted () {
    this.postOverOrderv2()
  },
  methods: {
    noEmptyArr (arr) {
      return !!(arr instanceof Array && arr.length > 0)
    },
    // 点击跳转账单详情 未结清
    _goToOrderPlan (code) {
      this.$router.push({
        name: 'orderPlanDetail',
        params: { orderCode: code, type: 'singe', status: 'noClear' },
        query: { token: this.userToken, noCache: Date.now() }
      })
    },
    // 点击跳转订单详情 已结清
    _goToOrderDetail (code) {
      this.$router.push({ name: 'OrderDetail', params: { orderCode: code } })
    },
    // 合并已结清账单 v2
    postOverOrderv2 (cb) {
      if (!cb) this.isLoading = true
      let body = {
        token: this.userToken
      }
      this.$api['myBill/getClearedBillV2'](body)
        .then(body => {
          const singleBol = this.noEmptyArr(body.single)
          const mergeBol = this.noEmptyArr(body.merge)
          if (singleBol) {
            this._checkGoodType(body.single)
            this.clearOldBill = body.single
          }
          if (mergeBol) {
            this._checkBillStatus(body.merge)
            this.clearNewBill = body.merge
          }
          if (!singleBol && !mergeBol) {
            // 表示没有任何账单的时候
            this.tipover = '不剁手的日子很空虚~'
            this.overShow = false
          } else {
            this.overShow = true
          }
          cb ? cb() : this.isLoading = false
        })
        .catch(err => {
          console.log(err)
          this.tipover = '获取失败,请重试'
          this.overShow = false
          cb ? cb() : this.isLoading = false
        })
    },
    // 点击跳转合并账单详情 未结清
    gotoOrderDetailSet (order, status) {
      location.href = 'https://api.xiaoxiangyoupin.cn/portal/download'
      // this.$router.push({
      //   name: 'orderPlanDetailSet',
      //   params: { id: order.id, billNum: order.billNum, status }
      // })
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
    },
    canOrder (orderCode) {
      const code = orderCode.slice(0, 2)
      if (code === '32' || code === '34' || code === '38' || code === '26') {
        return true
      }
      return false
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
#order-Bill {
  font-family: PingFangSC-Regular;
}

.loveBanner {
  width: 100%;
  position: fixed;
  top: 0;
  height: 1.6rem;
  z-index: 9999999;
  background: url("~@/assets/img/userOrder/banner_loveCard.png") no-repeat center;
  background-size: 100% 100%;
}

.bill-now {
  width: 100%;
  background-color: #ffffff;
  margin-bottom: 0.266667rem;
}

.bill-now-type {
  font-weight: 600;
  height: 0.36rem;
  font-size: 0.4rem;
  color: #333;
  margin-top: 0.4rem;
  margin-bottom: 0.373333rem;
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
  color: #151515;
}

.nowMoney-money {
  font-size: 0.373333rem;
  color: #ed145b;
}

.date-ymd {
  font-size: 0.373333rem;
  color: #151515;
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
  width: 3.253333rem;
  padding-top: 0.306667rem;
  box-sizing: border-box;
}

.bill-now-sub {
  position: relative;
  z-index: 99;
  width: 2.026667rem;
  height: 0.846667rem;
  background: #f54b78;
  border-radius: .053333rem;
  text-align: center;
  font-size: 0.346667rem;
  color: #fff;
  line-height: 0.846667rem;
  margin-right: 0.306667rem;
  margin-bottom: 0.4rem;
}

.bill-now-flag {
  /* width: 1.12rem; */
  text-align-last: justify;
  margin-right: 0.32rem;
  white-space: nowrap;
}

.flag-mouth {
  font-size: 0.346667rem;
  color: #151515;
}

.flag-now {
  font-size: 0.346667rem;
  color: #f54b78;
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
  font-size: .373333rem;
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

.over-tip-fp,
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
.f-700 {
  font-weight: 700;
}
</style>
