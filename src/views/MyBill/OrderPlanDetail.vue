<template>
  <div id="orderPlanDeail_warp" v-extend-height>
    <!-- 还款模态框 -->
    <div id="mask" v-show="maskShow" @click="_maskOff">
      <div class="modal_box_center" @click.stop>
        <div class="mask-font-box">
          <div class="modal_box_benjing">
            <span class="mask-font">本金:</span>
            <span class="mask-font-main">&yen;{{getprincipal.principal | priceFilters}}</span>
          </div>
          <div class="modal_box_chargedFee" v-if="getprincipal.isFreeInterest === 1">
            <span class="mask-font">手续费: </span>
            <span class="mask-font-main">&yen;0.00</span>
          </div>
          <div class="modal_box_chargedFee" v-else>
            <span class="mask-font">手续费: </span>
            <span class="mask-font-main">&yen;{{getprincipal.counterFee | priceFilters}}</span>
          </div>
          <div class="modal_box_penalty">
            <span class="mask-font">违约金: </span>
            <span class="mask-font-main">&yen;{{getprincipal.overdueAmount | priceFilters}}</span>
          </div>
          <div class="modal_box_penalty">
            <span class="mask-font">还款日: </span>
            <span class="mask-font-main">{{getprincipal.lastRepaymentDate}}</span>
          </div>
        </div>
        <template v-if="canPay()">
        <button class="but_anteng" @click.stop="getMoneybtn" v-if="isSinge && but_show_now">立即还款</button>
        <p  class="modal_prompt" v-if="isSinge && prompt_show">注: 您需要按期逐一还款哦!
          <br/>&nbsp;&nbsp;&nbsp;&nbsp;当前您已还款至
          <span class="modal_rep_time">{{repaymentList[statusCoutTime].bsCode}}/{{repaymentList[statusCoutTime].bystagesNum}}期
          </span>
        </p>
        </template>
        <template v-else>
          <p class="modal_prompt huank">您有一笔账单正在还款中，请稍后再尝试。</p>
        </template>
      </div>
    </div>
    <header id="header_content" v-show="header_loading">
      <div class="order_title clearfix">
        <span class="order_pay">
          <span class="status-text">{{orderType}}</span>
        </span>
        <span class="order_ment" v-if="hasOrderDetail" @click="lookRrder">订单详情&nbsp;&gt;</span>
      </div>
      <div class="intotal_content">
        <span>合计应还</span>
        <span>&yen;{{ getCounterFee + getOverdueAmount + getBystagesAmount.bystagesAmount - getCancelMoney | priceFilters}}</span>
      </div>
      <div class="order_money clearfix">
        <div class="order_principal  txl">
          <div class="style_c999 ben_moeny_one">本金(元)</div>
          <div class="all_money">{{getBystagesAmount.bystagesAmount | priceFilters}}</div>
        </div>
        <div class="roder_chargedFee  text_cent">
          <span class="bill-line left"></span>
          <div class="style_c999 chargedFee_otwo">手续费(元)</div>
          <div class="chargedFee_moeny">{{ getCounterFee | priceFilters}}</div>
          <span class="bill-line right"></span>
        </div>
        <div class=" roder_penalty txr">
          <div class="style_c999 penalty_three"> 违约金(元)</div>
          <div class="penalty_moeny">{{getOverdueAmount | priceFilters}}</div>
        </div>
      </div>
    </header>
    <div class="h_40"></div>
    <!-- 剩余还款 -->
    <footer id="footer_dingdan_content" v-show="footer_data_content">
      <div class="surplus_title clearfix">
        <span class="surplus_pay">
          <span class="surplus_pay_back">剩余应还:</span>
          <em class="em_yuan">&yen;{{ (getCounterFee + getOverdueAmount + getBystagesAmount.bystagesAmount - getForgotMoney - getCancelMoney) | priceFilters}}</em>
        </span>
      </div>
      <div class="roder_fenqu">
        <ul>
          <li class="fenqu_list clearfix" @click="getRepayment(item,index)" v-for="(item,index) in repaymentList" :key="index">

            <div class="w30 fenqu_list_time fl" :class="{'active_color_bb':item.repaymentStatus=== '1'||item.repaymentStatus==='3'}">
              {{item.bsCode}}/{{item.bystagesNum}}期
            </div>

            <div class=" fenqu_list_money fl" :class="{'active_color_bb':item.repaymentStatus=== '1'||item.repaymentStatus==='3'}">
              &yen;{{item.totalAmount | priceFilters}}
              <span v-if="item.repaymentStatus === '2' || item.repaymentStatus === '3' ? true : false">(含违约金)</span>
            </div>

            <!-- 合并资产的样式 -->
            <template v-if="isMerge">
              <div class="w30 fenqu_list_state fr " :class="{'active_color_bb' : item.repaymentStatus=== '1'|| item.repaymentStatus==='3', yuqi: item.repaymentStatus === '2'}">
                {{shiftTypeTxt(item.repaymentStatus)}}
              </div>
            </template>
            <!-- 老的独立资产样式 -->
            <template v-else>
              <div :class="{'active_color_bb' : item.repaymentStatus=== '1'|| item.repaymentStatus==='3'}" class="w30 fenqu_list_state fr ">
                <template v-if="item.repaymentStatus === '0' || item.repaymentStatus === '2'">
                  <button :class="{first: isTopPay(index)}">{{shiftTypeTxt(item.repaymentStatus)}}</button>
                </template>
                <template v-else>
                  {{item.deductionAmount === 0 ? shiftTypeTxt(item.repaymentStatus) : '抵扣还款'}}
                </template>
              </div>
            </template>

          </li>
        </ul>
      </div>
    </footer>
    <!-- <mt-spinner :size="50" color="#F54B78" type="fading-circle" v-if="isShow" class="loading_show"></mt-spinner> -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      orderType: null,
      isShow: false,
      header_loading: false,
      footer_data_content: false,
      but_show_now: false,
      prompt_show: false,
      arrList: [],
      repaymentList: [],
      countFee: [], // 免息手续费为0的数据
      getBystagesAmount: {
        bystagesAmount: null,
        bystagesNum: null
      },
      getprincipal: {},
      statusCoutTime: '',
      maskShow: false, // 模态框控制
      updateBol: false,
      nowBsCode: null,
      payDetail: null
    }
  },
  computed: {
    // 计算所有手续费
    getCounterFee () {
      let cout1 = 0
      let that = this
      for (let i = 0; i < this.repaymentList.length; i++) {
        if (that.repaymentList[i].repaymentStatus === '6') { // 订单取消不要手续费
          continue
        }
        if (that.repaymentList[i].isFreeInterest === 1) { // 免手续费
          continue
        }
        cout1 += this.repaymentList[i].counterFee
      }
      return cout1
    },
    // 计算违约金
    getOverdueAmount: function () {
      let cout2 = 0
      for (let i = 0; i < this.repaymentList.length; i++) {
        cout2 += this.repaymentList[i].overdueAmount
      }
      return cout2
    },
    // 计算已还金额
    getForgotMoney () {
      let cout3 = 0
      let that = this
      for (let i = 0; i < this.arrList.length; i++) {
        // debugger
        if (
          that.arrList[i].repaymentStatus === '1' ||
          that.arrList[i].repaymentStatus === '3'
        ) {
          cout3 += that.arrList[i].totalAmount
          // console.log("已还金额" + cout3)
        }
      }
      return cout3
    },
    // 计算 已取消金额
    getCancelMoney () {
      let retMoney = 0
      let that = this
      let item
      for (let i = 0; i < this.arrList.length; i++) {
        // debugger
        item = that.arrList[i]
        if (item.repaymentStatus === '6') {
          if (item.isFreeInterest === 0) {
            retMoney += (item.totalAmount - item.counterFee)
          } else if (item.isFreeInterest === 1) {
            retMoney += item.totalAmount
          }
        }
      }
      console.log(retMoney)
      return retMoney
    },
    isMerge () {
      const type = this.$route.params.type
      if (type === 'merge') {
        return true
      }
      return false
    },
    isSinge () {
      const type = this.$route.params.type
      if (type === 'singe') {
        return true
      }
      return false
    },
    hasOrderDetail () {
      let type = this.$route.params.orderCode.slice(0, 2)
      if (!type.match(/33|35|45|39|22|25|27|47/)) {
        return true
      }
      return false
    },
    billLen () {
      return this.repaymentList.length
    }
  },
  mounted () {
    const orderCode = this.$route.params.orderCode
    this._checkGoodType(orderCode)
    this.getOrderRement(orderCode)
    this.getRepaymentType(orderCode)
  },
  methods: {
    // 获取数据
    getOrderRement (code, cb) {
      let status = this.$route.params.status
      let port = ''
      if (status === 'noClear') {
        port = 'orderRepayDeail'
      } else if (status === 'clear') {
        port = 'orderAlRepayDetail'
      } else {
        return
      }
      if (!cb) this.isShow = true
      this.$api[`myBill/${port}`]({ token: this.userToken, orderCode: code })
        .then(res => {
          cb ? cb() : this.isShow = false
          if (res.data && res.data.length > 0) {
            this.repaymentList = []
            this.getBystagesAmount = {}
            this.getBystagesAmount.bystagesAmount = res.data[0].bystagesAmount
            this.arrList = res.data
            let arr = res.data
            let strArr = ['2', '0', '5', '7', '1', '3', '6']
            this.setRepamentList(arr, strArr, '0')
            this.header_loading = true
            this.footer_data_content = true
          } else {
            this.$router.go(-1)
          }
        })
        .catch(err => {
          cb ? cb() : this.isShow = false
          console.log('err: ', err)
          this.$toast(err)
        })
    },
    // 排序还款顺序&&还款日期  封装
    setRepamentList (arr, strArr, status) {
      for (let n = 0; n < strArr.length; n++) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].repaymentStatus === strArr[n]) {
            if (status === '0') {
              this.repaymentList.push(arr[i])
            } else {
              return (this.statusCoutTime = i)
            }
          }
        }
      }
      // 按月份排序
      let startPays = []
      let endPays = []
      let somePayStatus, qpoint
      for (let i = this.repaymentList.length - 1; i >= 0; i--) {
        somePayStatus = this.repaymentList[i].repaymentStatus
        if (somePayStatus === '2' || somePayStatus === '0') {
          qpoint = i
          break
        }
      }
      startPays = this.repaymentList.slice(0, qpoint + 1)
      endPays = this.repaymentList.slice(qpoint + 1)
      endPays.sort((a, b) => {
        return Number(a.bsCode) - Number(b.bsCode)
      })
      this.repaymentList = startPays.concat(endPays)
    },
    // 点击获取当前的数据
    getRepayment (item, index) {
      this.maskShow = true
      this.getprincipal = item
      if (index === 0) {
        if (
          this.getprincipal.repaymentStatus === '0' ||
          this.getprincipal.repaymentStatus === '2'
        ) {
          this.but_show_now = true
          this.prompt_show = false
          return this.getprincipal
        }
      } else if (
        this.getprincipal.repaymentStatus === '1' ||
        this.getprincipal.repaymentStatus === '3'
      ) {
        this.but_show_now = false
        this.prompt_show = false
      } else {
        // 用户未还 且位置不是首位  以及状态 5 6 7
        this.but_show_now = false
        this.prompt_show = true
        // 求用户换到哪个月份
        let arr = this.repaymentList
        let str = ['2', '0']
        this.setRepamentList(arr, str, '1')
      }
    },
    // 独立资产获取还款方式
    async getRepaymentType (orderCode) {
      const res = await this.$api['myBill/getRepaymentTypeByOrderCodeV2']({
        token: this.userToken,
        orderCode
      })
      res.repaymentType.forEach(item => {
        if (item.channel === '3') {
          this.payDetail = item
        }
      })
    },
    // 立即还款
    getMoneybtn () {
      this.$tj('goRepayment')
      this.maskShow = false
      const type = this.$route.params.type
      if (type === 'merge') {
        this.$router.go(-1)
      } else if (type === 'singe') {
        this.selectPayChannel()
      }
    },
    async selectPayChannel () {
      if (!this.payDetail || String(this.payDetail.channel) !== '3') {
        this.$toast('此账单请去“小象优品APP”还款')
        return
      }
      const orderCode = this.$route.params.orderCode
      const periods = this.getprincipal.bsCode
      let res = await this.$api['myBill/repayPlanWeb']({ orderCode, periods, token: this.userToken, id: this.payDetail.id })
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
    joinJfObjct (data) {
      let ret = ''
      for (let key in data) {
        ret += `${key}=${encodeURIComponent(data[key])}&`
      }
      return ret.slice(0, ret.length - 1)
    },
    shiftTypeTxt (type) {
      switch (type) {
        case '0':
          return '待还款'
        case '1':
          return '已还款'
        case '2':
          return '逾期待还'
        case '3':
          return '逾期已还'
        case '5':
          return '还款中'
        case '6':
          return '已取消'
        case '7':
          return '还款中'
      }
      return ''
    },
    // 跳转订单详情
    lookRrder () {
      let orderCode = this.$route.params.orderCode
      this.$router.push({
        name: 'OrderDetail',
        params: {
          orderCode: orderCode
        },
        query: {
          sonic_remain_params: 1
        }
      })
    },
    // 判断商品类型
    _checkGoodType (ordercode) {
      let code = ordercode.slice(0, 2)
      if (code === '30' || code === '31' || code === '32' || code === '34') {
        this.orderType = '商品分期'
      } else if (code === '33') {
        this.orderType = '小象钱包'
      } else if (code === '35') {
        this.orderType = '应急钱包'
      } else if (code === '36') {
        this.orderType = '充值订单'
      } else if (code === '40') {
        this.orderType = '汽车票'
      } else if (code === '41') {
        this.orderType = '火车票'
      } else if (code === '42') {
        this.orderType = '机票'
      } else if (code === '43') {
        this.orderType = '酒店'
      } else if (code === '44') {
        this.orderType = '饿了么'
      } else if (code === '45') {
        this.orderType = '手续费'
      } else if (code === '39') {
        this.orderType = '购物提现'
      } else if (code === '22') {
        this.orderType = '信用卡代还'
      } else if (code === '25') {
        this.orderType = '情侣卡借款'
      } else if (code === '27') {
        this.orderType = '颜值卡借款'
      } else if (code === '47') {
        this.orderType = '保险订单'
      } else {
        this.orderType = '商品分期'
      }
    },
    _maskOff () {
      this.maskShow = false
    },
    waitPay () {
      this.updateBol = true
      global.vbus.$emit('loading_show', true)
      // 定时检测
      window.updateTimeVal = setInterval(() => {
        if (!this.updateBol) {
          clearInterval(window.updateTimeVal)
        } else {
          this.getOrderRement(this.$route.params.orderCode, function () { })
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

      this.getOrderRement(this.$route.params.orderCode, function () { })
    },
    canPay () {
      // 有还款中的状态，不允许还
      let arr = this.repaymentList
      let ment
      if (arr instanceof Array) {
        for (let i = 0, len = arr.length; i < len; i++) {
          ment = arr[i]
          if (ment.repaymentStatus === '5' || ment.repaymentStatus === '7') {
            return false
          }
        }
      }
      return true
    },
    isTopPay (index) {
      if (index === 0) {
        return true
      }
      return false
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
    isShow: function (newValue) {
      if (newValue) {
        global.vbus.$emit('loading_show', true)
      } else {
        global.vbus.$emit('loading_show', false)
      }
    },
    nowBsCode: function (newValue) {
      if (this.updateBol) {
        console.log('数据更新')
        this.updateBol = false
        global.vbus.$emit('loading_show', false)
        if (window.updateTimeVal) clearInterval(window.updateTimeVal)
        if (window.updateTimeOut) clearTimeout(window.updateTimeOut)
        this.paySuccPage()
      }
    },
    repaymentList: function () {
      let list = this.repaymentList
      if (list instanceof Array && list.length > 0) {
        this.nowBsCode = list[0]['bsCode']
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
#orderPlanDeail_warp{
  background: #f2f2f2;
}
  button{
    border: 0;
    outline: none;
    background-color: transparent;
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
#orderPlanDeail_warp {
  background: #f2f2f2;
  position: relative;
  font-family: PingFangSC-Regular;
}

#orderPlanDeail_warp .h_20 {
  height: 0.266667rem;
  width: 100%;
  background: #f2f2f2;
}

#orderPlanDeail_warp .h_40 {
  height: .266667rem;
  width: 100%;
  background: #f2f2f2;
}

#header_content {
  box-sizing: border-box;
  padding-bottom: 0.4rem;
  background: linear-gradient(45deg, #ff4e65, #ffb479);
}
#header_content {
  background: -webkit-gradient(linear, right top, left bottom ,from(#ffb479), to(#ff4e65));
}

#header_content .order_title .order_pay {
  display: inline-block;
  min-width: 2.4rem;
  line-height: 0.8rem;
  border: .026667rem solid rgba(255,255,255, .5);
  color: #fff;
  text-align: center;
  font-size: .4rem;
  font-weight: 400;
  border-top-right-radius: 0.433333rem;
  border-bottom-right-radius: 0.433333rem;
  margin-top: 0.333333rem;
  border-left: none;
  overflow: hidden;
}

.order_pay .status-text {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  width: 100%;
  padding: 0 .2rem;
}

#header_content .order_title .order_ment {
  font-size: .373333rem;
  color: #fff;
  float: right;
  white-space: nowrap;
  text-align: right;
  margin: 0.493333rem 0.4rem 0 0;
}

#header_content .intotal_content {
  text-align: center;
  font-size: 0.413333rem;
  font-weight: 400;
  color: #fff;
}

.intotal_content > span {
  display: block;
  font-size: .373333rem;
  color: #fff;
  font-weight: 500;
  margin-top: 0.133333rem;
}
.intotal_content > span:last-child {
  font-size: 0.8rem;
}

.order_money {
  margin-top: 0.533333rem;
  box-sizing: border-box;
  font-size: 0;
}

.order_money .ben_moeny_one,
.chargedFee_otwo,
.penalty_three {
  color: #fff;
  margin-bottom: 0.226667rem;
  font-size: .373333rem;
  opacity: 0.6;
  line-height: 0.346667rem;
  text-align: center;
}

.order_money .all_money,
.chargedFee_moeny,
.penalty_moeny {
  font-size: .426667rem;
  line-height: 0.346667rem;
  margin-top: 0.226667rem;
  color: #fff;
  text-align: center;
}
.roder_chargedFee{
  display: inline-block;
  vertical-align: top;
  width: 33.3%;
  position: relative;
}
.order_principal {
  position: relative;
  /* padding-left: 0.866667rem; */
  display: inline-block;
  box-sizing: border-box;
  vertical-align: top;
  width: 33.3%;
}

.roder_penalty {
  position: relative;
  /* padding-right: 0.866667rem; */
  display: inline-block;
  box-sizing: border-box;
  vertical-align: top;
  width: 33.3%;
}

#footer_dingdan_content {
  background-color: #fff;
  padding: 0 0.453333rem;
}

#footer_dingdan_content .surplus_pay .surplus_pay_back {
  font-size: .373333rem;
  letter-spacing: 0;
  color: #939393;
  line-height: 0.346667rem;
}

.surplus_title {
  padding:.533333rem 0 .266667rem 0;
}

.surplus_pay .surplus_pay_back .em_yuan {
  font-size: .373333rem;
  color: #151515;
  letter-spacing: 0;
  line-height: 0.346667rem;
}
.surplus_pay  .em_yuan {
  font-size: .373333rem;
  color: #333;
  letter-spacing: 0;
  line-height: 0.346667rem;
}

.roder_fenqu .fenqu_list {
  box-sizing: border-box;
  width: 100%;
  border-bottom: .013333rem solid #e6e6e6;
  line-height: 1.173333rem;
  /* height: 1.093333rem; */
}

.fenqu_list:nth-last-child(1) {
  border-bottom: none;
}

.fenqu_list .fenqu_list_time {
  font-family: PingFangSC-Regular;
  font-size: .373333rem;
  color: #333;
}

.fenqu_list .fenqu_list_money {
  text-align: center;
  width: 40%;
  font-family: PingFangSC-Regular;
  font-size: .373333rem;
  color: #333;
}

.fenqu_list .fenqu_list_state {
  text-align: right;
  font-family: PingFangSC-Regular;
  font-size: 0.346667rem;
  color:#ed145b;
}

.fenqu_list_state button {
  display: inline-block;
  width: 1.84rem;
  /* height: 0.613333rem; */
  line-height: .586667rem;
  background-color: #ffabc1;
  border-radius: .053333rem;
  color: #fff;
}
.fenqu_list_state button.first {
  background-color: #f54b78;
}

.but_anteng {
  margin-top: .666667rem;
  background: #f54b78;
  border-radius:.053333rem;
  border: none;
  width: 3.56rem;
  height: 0.906667rem;
  color: #fff;
  outline: none;
  font-size: 0.4rem;
}

.active_color_bb {
  color: #bdbdbd !important;
}

.acite_color_blue {
  color: #6f96ff;
}

.loading_show {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
}

.repayment_null {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  background: red;
}

.repayment_null_icon {
  width: 4.666667rem;
  height: 4.666667rem;
  background: url("~@/assets/img/userOrder/blankpage_img_search@2x.png")no-repeat center center;
  background-size: 100%;
}
.huank {
  padding: 0 0.4rem;
  text-align: left;
}

#mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.modal_box_center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  width: 7.2rem;
  background-color: #fff;
  border: 2px solid rgba(147,147,147, .6);
  border-radius: .32rem;
  text-align: center;
  z-index: 99;
  padding: .666667rem 0;
  box-sizing: border-box;
}

.modal_box_benjing {
  /* margin-top: 0.5rem; */
  font-size: 0.346667rem;
  height: 0.36rem;
  text-align: center;
}
.modal_box_benjing span,
.modal_box_chargedFee span,
.modal_box_penalty span,
.modal_box_penalty span{
  font-size: .373333rem;
  color:#333;
}

.modal_box_chargedFee,
.modal_box_penalty {
  font-size: 0.346667rem;
  height: 0.36rem;
  margin-top: 0.246667rem;
}

.modal_prompt {
  font-size: .32rem;
  color: #636363;
  letter-spacing: 0;
  line-height: 0.44rem;
  margin-top: 0.506667rem;
  padding: 0 .666667rem;
}

.modal_rep_time {
  color: #f54b78;
}

.mask-font-box {
  padding-left: 1.7rem;
  text-align: center;
  box-sizing: border-box;
}

.mask-font {
  float: left;
  width: 1.333333rem;
  height: 0.36rem;
  text-align: justify;
  font-size: 0.346667rem;
}

.mask-font-main {
  float: left;
  height: 0.36rem;
}

.yuqi {
  color: #ed145b;
}

.bill-line {
  position: absolute;
  top: 0.1rem;
  width: 1px;
  height: 0.666667rem;
  background-color: #fff;
  opacity: 0.5;
}
.roder_chargedFee .bill-line.right{
  right:0;

}
.roder_chargedFee .bill-line.left{
  left:.013333rem;
}
</style>
