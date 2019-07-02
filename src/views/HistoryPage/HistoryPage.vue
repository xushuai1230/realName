<template>
  <div class="HistoryPage">
    <div class="addPersonageMsg" v-if="needWorkMsg" @click="goWorkMsg">
      <div class="addPersonageMsg__leftIcon"></div>
      对信息进行补充可增加审核速度和通过率哦~
      <div class="addPersonageMsg__rightIcon"></div>
    </div>
    <van-pull-refresh v-model="refreshIsLoading" @refresh="onRefresh">
      <div class="cennter">
        <div class="history"  v-if="historyList && historyList.length > 0" v-for="(item, historyIndex) in historyList" :key="historyIndex">
          <div class="history__header">
            <div class="header-left">小象钱包：{{item.orderCode}} </div>
            <div class="header-right">{{listStatusTxt(item.orderStatus)}}</div>
          </div>
          <div class="history__center">
            <div class="center-left">
              <div>分期总金额：¥ {{item.goodsTotalMoney | priceFilter}}</div>
              <div>分期期数： {{item.instalmentAmount ? item.instalmentCount : 0}}期</div>
              <div>申请时间： {{item.orderTime | timeFilter}}</div>
            </div>
            <div class="center-right">
              <!-- 取消借款按钮 -->
              <!-- <div class="center-right-txt"
                  v-show="item.orderStatus === 94 || item.orderStatus === 95 || item.orderStatus === 96"
                  @click="cancelBorrowShowFn(historyIndex)">
                取消借款
              </div> -->
              <!-- 待绑卡 -->
              <div class="center-right-txt"
                  v-show="item.orderStatus === 40"
                  @click="confirmationShowFn(item, historyIndex)">
                立即绑卡
              </div>
              <!-- 立即提现 -->
              <div class="center-right-txt"
                   @click="withdrawFn(item)"
                   v-show="item.orderStatus === 71">
                立即提现
              </div>
              <!-- 待认证 -->
              <div class="center-right-txt"
                  @click="attestationFn(item)"
                  v-show="item.orderStatus === 42">
                认证
              </div>
              <!-- 补充资料 -->
              <div class="center-right-txt"
                  @click="attestationFn(item)"
                  v-show="item.orderStatus === 43">
                补充资料
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <div class="nolistdata" v-if="historyList && historyList.length === 0">
      <div class="logoImg"></div>
      <div class="nolistdata__txt">亲,暂时还没有您的借款记录哦~</div>
    </div>
    <!-- 取消借款弹窗 -->
    <div class="cancel-borrow" v-if="cancelBorrowDialogStatus">
      <div class="cancel-borrow__center">
        <div class="cancel-borrow-txt">确定要取消借款申请？</div>
        <div class="cancel-borrow-btnbox">
          <div class="cancel-left-btn" @click="noCancelBorrowFn">取消</div>
          <div class="cancel-right-btn" @click="cancelBorrowFn">确定</div>
        </div>
      </div>
    </div>
    <!-- 待绑卡确认信息弹窗 -->
    <div class="confirmation-msg" v-if="confirmationDialogStatus">
      <div class="confirmation-msg__center">
        <div class="confirmation-msgtxt">
          <div class="confirmation-title1">绑卡认证信息如下</div>
          <div class="confirmation-title2">一经确认，无法修改</div>
          <div class="msg">
            <span>真实姓名：</span>
            <span>{{realname}}</span>
          </div>
          <div class="msg">
            <span>身份证号码：</span>
            <span>{{idCard}}</span>
          </div>
          <div class="msg">
            <span>认证手机：</span>
            <span>{{confirmationMobile}}</span>
          </div>
        </div>
        <div class="confirmation-btnbox">
          <div class="confirmation-left-btn" @click="noConfirmationFn">取消</div>
          <div class="confirmation-right-btn" @click="confirmationFn">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryPage',
  data () {
    return {
      // 取消借款弹窗显示状态
      cancelBorrowDialogStatus: false,
      // 取消借款下标
      cancelBorrowIndex: null,
      // 待绑卡确认信息显示状态
      confirmationDialogStatus: false,
      // 待绑卡确认信息
      confirmationIndex: null,
      historyList: null,
      userInfo: null,
      refreshIsLoading: false,
      needWorkMsg: false
    }
  },
  computed: {
    realname () {
      let temp = ''
      if (this.userInfo && this.userInfo.realname) {
        temp = this.userInfo.realname.substring(1, 0) + Array(this.userInfo.realname.length).join('*')
      }
      return temp
    },
    idCard () {
      let temp = ''
      if (this.userInfo && this.userInfo.idCard) {
        let reg = /^(\d{3})\d*(\d{4})$/
        temp = this.userInfo.idCard.replace(reg, '$1***********$2')
      }
      return temp
    },
    confirmationMobile () {
      let temp = ''
      if (this.userInfo && this.userInfo.mobile) {
        temp = this.userInfo.mobile
      }
      return temp
    }
  },
  async mounted () {
  },
  async created () {
    await this.isSuppJobinfo()
    await this.loanRecordListFn()
  },
  methods: {
    isSuppJobinfo () {
      this.$api['borrowHistory/isSuppJobinfo']({
        token: this.userToken
      }).then(res => {
        this.needWorkMsg = res.isSupp
      }).catch(err => {
        this.needWorkMsg = false
        console.log(err)
      })
    },
    goWorkMsg () {
      let routerData = JSON.stringify({
        name: this.$route.name,
        path: this.$route.path,
        query: this.$route.query,
        params: this.$route.params
      })
      this.$router.push({
        name: 'WorkMsg',
        query: {
          type: 'router',
          method: 'push',
          routerData: routerData
        }
      })
    },
    onRefresh () {
      this.loanRecordListFn()
    },
    loanRecordListFn () {
      this.$api['borrowHistory/loanRecordList']({
        token: this.userToken
      }).then(res => {
        this.historyList = res.data
        this.refreshIsLoading = false
      }).catch(err => {
        console.log(err)
        this.refreshIsLoading = false
      })
    },
    listStatusTxt (type) {
      switch (type) {
        case 40:
          return '待绑卡'
        case 41:
          return '打款中'
        case 42:
          return '待认证'
        case 43:
          return '补充资料'
        case 61:
          return '借款成功'
        case 51:
          return '借款成功'
        case 71:
          return '立即提现'
        case 91:
          return '未通过'
        case 94:
          return '处理中'
        case 95:
          return '处理中'
        case 96:
          return '处理中'
        default:
          return ''
      }
    },
    // 待认证点击
    attestationFn (item) {
      console.log(item)
      this.$api['borrowHistory/getjumpurl']({
        token: this.userToken,
        orderCode: item.orderCode
      }).then(res => {
        let url = res.url
        let assetstype = url.replace(/^.+?assetstype=/, '')
        let routerData = JSON.stringify({
          name: this.$route.name,
          path: this.$route.path,
          query: this.$route.query,
          params: this.$route.params
        })
        this.$router.push({
          name: 'XiaoyingSign',
          query: {
            orderCode: item.orderCode,
            assetstype: assetstype,
            type: 'router',
            method: 'push',
            routerData: routerData,
            noCache: Date.now()
          }
        })
      })
    },
    // 显示取消借款弹窗
    cancelBorrowShowFn (index) {
      this.cancelBorrowDialogStatus = true
      this.cancelBorrowIndex = index
    },
    // 取消借款弹窗取消按钮
    noCancelBorrowFn () {
      this.cancelBorrowDialogStatus = false
      this.cancelBorrowIndex = null
    },
    // 取消借款弹窗确定按钮
    cancelBorrowFn () {
      this.$api['borrowHistory/cancel']({
        token: this.userToken,
        code: this.historyList[this.cancelBorrowIndex].orderCode
      }).then(res => {
        this.historyList.splice(this.cancelBorrowIndex, 1)
        this.cancelBorrowDialogStatus = false
        this.cancelBorrowIndex = null
      })
    },
    // 立即提现
    withdrawFn (item) {
      this.$api['borrowHistory/withdraw']({
        token: this.userToken,
        orderCode: item.orderCode
      }).then(res => {
        location.href = res.url
      })
    },
    // 查询认证信息
    queryMsg () {
      this.$api['borrowHistory/getUserAuthStatus']({
        token: this.userToken
      }).then(res => {
        this.userInfo = res.data
      })
    },
    // 待绑卡按钮
    async confirmationShowFn (item, index) {
      this.$api['borrowHistory/getUserAuthStatus']({
        token: this.userToken,
        orderCode: this.historyList[index].orderCode
      }).then(res => {
        if (res.status && res.status === 0) {
          // 未确认信息
          this.queryMsg()
          this.confirmationDialogStatus = true
        } else if (res.status && res.status === '1') {
          // 未绑卡
          let routerData = JSON.stringify({
            name: this.$route.name,
            path: this.$route.path,
            query: this.$route.query,
            params: this.$route.params
          })
          this.$router.push({
            name: 'BindingCard',
            query: {
              orderCode: item.orderCode,
              type: 'router',
              method: 'push',
              routerData: routerData
            }
          })
        } else if (res.status && res.status === '2') {
          // 用户未设置新浪密码
          this.setsinapaypassFn(index)
        } else if (res.status && res.status === '3') {
          // 已设置支付密码
          this.loanRecordListFn()
        } else if (res.status && res.status === '4') {
          // 未绑定代扣通道
          console.log(item, '绑定代扣通道')
          this.getBindcardChannelInfoFn(item)
        } else if (res.status && res.status === '7') {
          // 跳转链接
          location.href = res.data.url
        }
      })
    },
    // 设置支付密码
    setsinapaypassFn (index) {
      this.$api['borrowHistory/setsinapaypass']({
        token: this.userToken,
        orderCode: this.historyList[index].orderCode
      }).then(res => {
        location.href = res.data.url
      })
    },
    // 未绑定代扣通道(订单状态为4)
    getBindcardChannelInfoFn (order) {
      this.$api['borrowHistory/getBindcardChannelInfo']({
        token: this.userToken,
        orderCode: order.orderCode
      }).then(res => {
        let url = res.bindCardUrl.split('/')
        let routerData = JSON.stringify({
          name: this.$route.name,
          path: this.$route.path,
          query: this.$route.query,
          params: this.$route.params
        })
        for (let i = 0; i < url.length; i++) {
          let item = url[i]
          if (item === 'sinaBindCard') {
            this.$router.push({
              name: 'BindCardSina',
              query: {
                orderCode: order.orderCode,
                type: 'router',
                method: 'push',
                routerData: routerData,
                noCache: Date.now()
              }
            })
            return false
          } else if (item === 'bindcardtest' || item === 'bindCard') {
            this.$router.push({
              name: 'BindCardYiBao',
              query: {
                orderCode: order.orderCode,
                type: 'router',
                method: 'push',
                routerData: routerData
              }
            })
            return false
          }
        }
        location.href = res.bindCardUrl
      })
    },
    // 待绑卡未确认取消按钮
    noConfirmationFn () {
      this.confirmationDialogStatus = false
      this.confirmationIndex = null
      this.userInfo = null
    },
    // 待绑卡未确认确定按钮
    confirmationFn () {
      this.$api['borrowHistory/regAndAuth']({
        token: this.userToken,
        orderCode: this.historyList[this.confirmationIndex].orderCode
      }).then(res => {
        this.confirmationDialogStatus = false
        this.confirmationIndex = null
        this.userInfo = null
      })
    }
  },
  components: {
  },
  destroyed () {
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
#app {
  height: 100%;
}
.HistoryPage {
  width: 100%;
  background: #f2f2f2;
  .addPersonageMsg {
    height: 70px;
    line-height: 44px;
    background: #ffefce;
    box-sizing: border-box;
    padding: 13px 30px;
    font-size: 24px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color:#c8732c;
    &__leftIcon {
      height: 44px;
      width: 44px;
      background: url('../../assets/img/list_disclosure_indicator_nol_brown@3x.png') no-repeat;
      background-size: 100%;
      float: left;
      margin-right: 10px;
    }
    &__rightIcon {
      height: 44px;
      width: 44px;
      background: url('../../assets/img/list_disclosure_indicator_nol_zong@3x.png') no-repeat;
      background-size: 100%;
      float: right;
    }
  }
  .cennter {
    .history {
      margin-top: 20px;
      height: 260px;
      &__header {
        background: #fff;
        padding: 20px 30px;
        height: 80px;
        box-sizing: border-box;
        border:1px #EFEFEF solid;
        .header-left {
          width: 75%;
          height: 38px;
          line-height: 38px;
          float: left;
          font-size:28px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(0,0,0,1);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .header-right {
          height: 38px;
          line-height: 38px;
          float: right;
          text-align: right;
          font-size:28px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(237,20,91,1);
        }
      }
      &__center {
        background: #fff;
        height: 180px;
        width: 100%;
        padding: 10px 26px 28px 30px;
        box-sizing: border-box;
        .center-left {
          width: 70%;
          height: 100%;
          float: left;
          div {
            height: 40px;
            line-height: 40px;
            margin-top: 10px;
            font-size:28px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:#636363;
          }
        }
        .center-right {
          width: 30%;
          height: 100%;
          float: left;
          .center-right-txt {
            width: 152px;
            height: 52px;
            margin-top: 90px;
            margin-right: 4px;
            border: 1px solid rgba(147,147,147, 0.6);
            float: right;
            box-sizing: border-box;
            line-height: 52px;
            font-size:28px;
            border-radius: 4px;
            text-align: center;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:#636363;
          }
        }
      }
    }
  }
  .nolistdata {
    width: 100%;
    height: 100%;
    background: #fff;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    .addPersonageMsg {
      height: 88px;
      line-height: 44px;
      margin-top: 18px;
      background: #fff;
      box-sizing: border-box;
      padding: 22px 30px;
      font-size: 28px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color:rgba(51,51,51,1);
      &__leftIcon {
        height: 44px;
        width: 44px;
        background: url('../../assets/img/list_icon_hint_sel@3x.png') no-repeat;
        background-size: 100%;
        float: left;
        margin-right: 10px;
      }
      &__rightIcon {
        height: 44px;
        width: 44px;
        background: url('../../assets/img/list_disclosure_indicator_nol_black@3x.png') no-repeat;
        background-size: 100%;
        float: right;
      }
    }
    .logoImg {
      width: 259px;
      height: 252px;
      margin: 346px auto 0;
      background: url('~@/assets/img/nohistory@3x.png') no-repeat;
      background-size: 100%;
    }
    &__txt {
      height: 28px;
      width: 100%;
      text-align: center;
      margin-top: 46px;
      font-size:28px;
      font-family:PingFang-SC-Medium;
      font-weight:500;
      color:rgba(102,102,102,1);
    }
  }
  .cancel-borrow {
    position: fixed;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background:rgba(0,0,0,0.7);
    &__center {
      width: 550px;
      height: 312px;
      margin: 484px auto;
      background: #fff;
      border-radius: 20px;
      .cancel-borrow-txt {
        height: 223px;
        line-height: 223px;
        width: 100%;
        text-align: center;
        font-family:PingFangSC-Medium;
        font-weight:500;
        font-size:34px;
        color:rgba(0,0,0,1);
      }
      .cancel-borrow-btnbox {
        width: 550px;
        height: 88px;
        box-sizing: border-box;
        border-top: 1px solid #E5E5E5;
        text-align: center;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(0,118,255,1);
        .cancel-left-btn {
          height: 87px;
          line-height: 87px;
          width: 50%;
          float: left;
          border-right: 1px solid #E5E5E5;
          box-sizing: border-box;
        }
        .cancel-right-btn {
          height: 87px;
          line-height: 87px;
          width: 50%;
          float: right;
        }
      }
    }
  }
  .confirmation-msg {
    position: fixed;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background:rgba(0,0,0,0.5);
    &__center {
      width: 540px;
      height: 447px;
      margin: 318px auto;
      background: #ffffff;
      border-radius: 26px;
      .confirmation-msgtxt {
        height: 359px;
        width: 100%;
        text-align: center;
        .confirmation-title1 {
          float: left;
          height: 44px;
          line-height: 44px;
          width: 100%;
          text-align: center;
          margin-top: 42px;
          font-size:34px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#333333;
        }
        .confirmation-title2 {
          float: left;
          height: 44px;
          line-height: 44px;
          width: 100%;
          text-align: center;
          margin-top: 6px;
          margin-bottom: 9px;
          font-size:24px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#939393;
        }
        .msg {
          float: left;
          margin-top: 26px;
          padding-left: 40px;
          height: 28px;
          line-height: 28px;
          font-size:28px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(0,0,0,1);
          width: 100%;
          text-align: left;
          box-sizing: border-box;
          :nth-child(1) {
            float: left;
            width: 168px;
            height: 28px;
            line-height: 28px;
            font-size:28px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            text-align: left;
            color:#333333;
          }
          :nth-child(2) {
            height: 28px;
            line-height: 28px;
            font-size:28px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            text-align: left;
            color:rgba(237,20,91,1);
          }
        }
      }
      .confirmation-btnbox {
        width: 540px;
        height: 88px;
        box-sizing: border-box;
        border-top: 1px solid #d0d0d0;
        text-align: center;
        .confirmation-left-btn {
          height: 87px;
          line-height: 87px;
          width: 50%;
          float: left;
          border-right: 1px solid #d0d0d0;
          box-sizing: border-box;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#636363;
          font-size:34px;
        }
        .confirmation-right-btn {
          height: 87px;
          line-height: 87px;
          width: 50%;
          float: right;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#507daf;
          font-size:34px;
        }
      }
    }
  }
}
</style>
