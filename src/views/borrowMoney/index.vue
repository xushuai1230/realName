<template>
  <div class="borrowMoney">
    <div class="margin-div"></div>
    <div class="borrowMoney-box">
      <p class="borrowMoney-title">
        <span>借款金额 </span>
        <span v-show="showMaxAmount">(可借￥{{maxAmount}})</span>
      </p>
      <div class="money-input">
        <span class="yuan" >￥</span>
        <input class="input-value"  type="text" placeholder="最低借款100,借款金额须为100的整数倍" v-model.trim="amount" @input="inputMoney" @blur="blurInput" ref="amountRef">
        <!-- <p class="placeholder-text" v-show="showPlaceholder">最低借款100,借款金额须为100的整数倍</p> -->
      </div>
      <p class="line"></p>
    </div>
    <div class="staging">
      <ul>
        <li class="stagItem" >
          <div class="stagItem-left">分期期数</div>
          <div class="stagItem-right relative" @click="pickActionsheet">
            <span class="stagItem-number" >{{stagNumber}}期</span>
            <span class="more-icon"></span>
          </div>
        </li>
        <li  class="stagItem">
          <div class="stagItem-left">每期应还</div>
          <div class="stagItem-right" v-show="showSeqAmount">
            <p class="stagItem-right-text stagItem-right-text-top" v-if="NotEachRefund">--</p>
            <p class="stagItem-right-text stagItem-right-text-top" v-else>￥{{ eachRefund | priceFilter}}</p>
            <p class="stagItem-right-text stagItem-right-text-bottom" v-if="NotFee">(含手续费￥--)</p>
            <p class="stagItem-right-text stagItem-right-text-bottom" v-else>(含手续费￥{{fee | priceFilter}})</p>
          </div>
        </li>
        <li  class="stagItem">
          <input type="text" placeholder="请填写您的借款用途(20字以内)" class="reason" maxlength="20" v-model.trim="reasonText" @input="setButtonIsDisable">
        </li>
      </ul>
    </div>
    <div class="borrow-bottom">
      <div class="agree" >
        <span class="agree-icon" :class="{isAgree:isAgree,notAgree:!isAgree}" @click="changeAgree"></span>
        同意<span class="color-red" @click="goOpenProtocol">《小象钱包开通服务协议》</span><span  class="color-red" @click="goBorrowProtocol">、《小象钱包借款服务协议》</span>
        <!-- <span class="agree-icon" :class="{isAgree:isAgree,notAgree:!isAgree}" @click="changeAgree"></span> -->
        <!-- 同意 -->
        <!-- <span class="color-red" @click="goProtocolList">《新浪分期借款信息咨询服务协议》</span> -->
      </div>
      <div class="borrow-button" :class="{borrowButtonDisable:buttonIsDisable,borrowButtonAble:!buttonIsDisable}" @click="clickSubmit">
        立即申请
      </div>
      <div class="borrow-tip-box">
        <div class="borrow-tip">
          <i class="tip-icon"></i>
          查看
          <span class="color-red" @click="goLoseCredit">《失信提醒》</span>
        </div>
        <div class="borrow-tip">
          <i class="tip-icon"></i>
          提现手续费2元；审核通过后不可取消借款
        </div>
      </div>
    </div>

    <van-actionsheet v-model="showActionsheet" :actions="actions" @select="onSelect" cancel-text="取消"/>
    <Rule :showRuleDialog="showPasswordDialog" @closeRule="closePassword" @submitV3="getSubmitV3Data" :orderCode="orderCode" :periods="stagNumber" :noPayCount='noPayCount'></Rule>
    <Loading v-show="loadingStauts"></Loading>
  </div>
</template>

<script>
import Vue from 'vue'
import { api, post, get, fromUrlcode } from '@/module/request'
import { mapMutations, mapGetters } from 'vuex'
import Rule from './rule.vue'
import Loading from '@/components/Loading/Loading'
import { Toast } from 'vant'
Vue.use(Toast)
// 组件引入 用于销毁toast
export default {
  name: 'borrowMoney',
  data () {
    return {
      cardCode: null, // 颜值卡号
      loadingStauts: false, // loading
      showSeqAmount: true, // 是否展示每期应还
      showMaxAmount: false, // 是否展示最大金额
      isAgree: true, // 是否同意协议
      buttonIsDisable: true, // 禁用按钮不可点击
      showActionsheet: false, // 展示选择分期框
      showPasswordDialog: false, // 展示密码框
      stagNumber: '', // 分期数
      amount: '', // 借款金额
      maxAmount: 0, // 最大可借
      reasonText: '', // 借款理由
      fee: '0.00', // 手续费
      eachRefund: '0.00', // 每期应还
      actions: [],
      creditCheckObj: {
        isRealnameApprove: null, // 是否实名
        needIdCardOcr: null, // 是否需要OCR
        dianshangMarkup: null, // 是否需要电商授权
        markUp: null, // 运营商是否需要授权
        gxbZhimaAuthNeed: null, // 是否需要自研芝麻授权
        zhimaAuthUrl: '' // 芝麻信用授权url
      },
      isPayPassword: null, // 是否设置了支付密码
      showPlaceholder: true, // 是否展示placeholder
      orderCode: '',
      NotEachRefund: false, // 展示--
      NotFee: false,
      noPayCount: 0
    }
  },
  created () {
    this.taskCallBack()
    if (this.userToken) {
      this.lookingCardStateServe()
      this.creditCheckV4Serve()
      this.isMarkUpMobileAuthV2()
      this.getUserInfo()
      this.mykloaninfoServe()
    }
  },
  mounted () {

  },
  beforeDestroy () {
    Toast.clear()
  },
  methods: {
    changeAgree () {
      this.isAgree = !this.isAgree
      this.setButtonIsDisable()
    },
    goLoseCredit () {
      let env = process.env.VUE_APP_SERVEN === 'DEV' ? 'dev' : 'prod'
      location.href = `https://cdn.basestonedata.com/${env}/services/critedEdg.html?token=${this.userToken}&userId=${this.userId}`
      // this.$router.push({
      //   path: 'loseCredit'
      // })
    },
    pickActionsheet () {
      this.showActionsheet = true
    },
    onSelect (item) {
      // 选择分期项
      this.stagNumber = item.value
      if (!this.isInteger(Number(this.amount)) && this.amount !== '') {
        this.$toast('最低借款100，借款金额须为100的整数倍')
        this.showActionsheet = false
        return false
      } else if (Number(this.amount) >= 100 && Number(this.amount) <= this.maxAmount) {
        this.calcRefundAmountWithSeq()
      }
      this.showActionsheet = false
    },
    closePassword (val) {
      console.log('val:', val)
      if (val === 'noPayCount') {
        this.noPayCount += 1
      }
      this.showPasswordDialog = false
    },
    calcRefundAmountWithSeq () {
      // 计算每期应还金额
      this.loadingStauts = true
      this.showSeqAmount = true
      post(api.calcRefundAmountWithSeq, fromUrlcode({
        token: this.userToken,
        loanAmount: this.amount + '00',
        seq: this.stagNumber
      })).then(res => {
        this.loadingStauts = false
        this.showSeqAmount = true
        this.eachRefund = res.eachRefund
        this.fee = res.fee
      }).catch(err => {
        this.loadingStauts = false
        let error = err
        if (err.message) {
          error = err.message
        }
        this.$toast(error)
      })
    },
    inputMoney (e) {
      this.showSeqAmount = true
      this.amount = e.target.value.replace(/\D/g, '')
      if (this.amount.length >= 2) {
        this.amount = this.amount.replace(/^0/g, '')
      }
      if (this.amount === '') {
        this.amount = ''
        this.NotEachRefund = true
        this.NotFee = true
      } else if (Number(this.amount) === 0) {
        this.amount = 0
        this.fee = '0.00'
        this.eachRefund = '0.00'
        this.NotEachRefund = false
        this.NotFee = false
      }
      if (Number(this.amount) > this.maxAmount) {
        this.amount = this.maxAmount
        this.$refs.amountRef.blur()
        this.NotEachRefund = false
        this.NotFee = false
        // this.calcRefundAmountWithSeqV3()
      }
      this.setButtonIsDisable()
      if (!this.amount) {
        this.fee = '0.00'
        this.eachRefund = '0.00'
        this.NotEachRefund = false
        this.NotFee = false
        return false
      }
      if (!this.isInteger(Number(this.amount))) {
        // this.$toast('最低借款100，借款金额须为100的整数倍')
        this.NotEachRefund = true
        this.NotFee = true
        return false
      } else if (Number(this.amount) >= 100 && Number(this.amount) <= this.maxAmount) {
        this.NotEachRefund = false
        this.NotFee = false
        this.calcRefundAmountWithSeq()
      }
    },
    blurInput () {
      // 输入金额
      // if (!this.amount) {
      //   this.fee = '0.00'
      //   this.eachRefund = '0.00'
      //   this.NotEachRefund = false
      //   this.NotFee = false
      //   return false
      // }
      // if (!this.isInteger(Number(this.amount))) {
      //   this.$toast('最低借款100，借款金额须为100的整数倍')
      //   this.NotEachRefund = true
      //   this.NotFee = true
      //   return false
      // } else if (Number(this.amount) >= 100 && Number(this.amount) <= this.maxAmount) {
      //   this.NotEachRefund = false
      //   this.NotFee = false
      //   this.calcRefundAmountWithSeq()
      // }
      if (!this.isInteger(Number(this.amount))) {
        this.$toast('最低借款100，借款金额须为100的整数倍')
        this.NotEachRefund = true
        this.NotFee = true
        return false
      }
    },
    isInteger (obj) {
      let result = typeof obj === 'number' && (obj / 100) % 1 === 0
      if (obj < 100) {
        return false
      }
      return result
    },
    clickSubmit () {
      // 立即申请
      // 禁用时不可点击
      const envs1 = {
        'DEV': 'h5-dev',
        'PROD': 'h5'
      }
      const envPath1 = envs1[process.env.VUE_APP_SERVEN]
      if (this.buttonIsDisable) {
        return false
      } else {
        // if (!this.creditCheckObj.isRealnameApprove) {
        // 未实名 或者 活体补偿
        // this.$dialog.confirm({
        //   message: '您需要进行"实名信息补偿",补偿该信息后才可继续分期申请!',
        //   confirmButtonText: '立即加速',
        //   cancelButtonText: '放弃',
        //   className: 'borrowDialog'
        // }).then(() => {
        //   this.$router.push({
        //     name: 'UserCardAuth',
        //     query: {
        //       type: 'router',
        //       method: 'replace',
        //       routerData: JSON.stringify({
        //         name: 'BorrowMoney'
        //       })
        //     }
        //   })
        // }).catch(() => {
        //   this.$router.replace({
        //     name: 'Facescard'
        //   })
        // })
        // } else
        this.$tj('clickycardcash')
        if (this.creditCheckObj.dianshangMarkup) {
          // 电商授权
          this.$dialog.confirm({
            message: '您需要进行"电商信息补偿",补偿该信息,可以帮您提升额度，并且还为您加速审核分期订单哦!',
            confirmButtonText: '立即加速',
            cancelButtonText: '放弃',
            className: 'borrowDialog'
          }).then(() => {
            location.href = `https://open.shujumohe.com/box/tb?box_token=061D17B5FE9447348C98A2247961BDF0&cb=https://${envPath1}.xiaoxiangyoupin.com/purse/borrowMoney`
          }).catch(() => {
            this.$router.replace({
              name: 'Facescard'
            })
          })
        } else if (this.creditCheckObj.gxbZhimaAuthNeed) {
          // 芝麻信用
          this.$dialog.confirm({
            message: '您需要进行"芝麻信用补偿",补偿该信息,可以帮您提升额度，并且还为您加速审核分期订单哦!',
            confirmButtonText: '立即加速',
            cancelButtonText: '放弃',
            className: 'borrowDialog'
          }).then(() => {
            // 跳转芝麻信用授权页
            this.$router.push({
              name: 'ZhiMaAuth',
              query: {
                type: 'router',
                method: 'replace',
                routerData: JSON.stringify({
                  name: 'BorrowMoney'
                })
              }
            })
            // location.href = this.creditCheckObj.zhimaAuthUrl
          }).catch(() => {
            this.$router.replace({
              name: 'Facescard'
            })
          })
        } else if (this.creditCheckObj.markUp) {
          // 运营商授权
          this.$dialog.confirm({
            message: '您需要进行"运营商信息补偿",补偿该信息,可以帮您提升额度，并且还为您加速审核分期订单哦!',
            confirmButtonText: '立即加速',
            cancelButtonText: '放弃',
            className: 'borrowDialog'
          }).then(() => {
            this.$router.push({
              name: 'OperatorAccredit',
              query: {
                type: 'router',
                method: 'replace',
                routerData: JSON.stringify({
                  name: 'BorrowMoney'
                }),
                noCache: Date.now()
              }
            })
          }).catch(() => {
            this.$router.replace({
              name: 'Facescard'
            })
          })
        } else if (this.creditCheckObj.needIdCardOcr) {
          // OCR授权
          console.log('OCR授权')
          this.$dialog.confirm({
            message: '您需要进行"身份信息补偿",补偿该信息后才可继续分期申请!',
            confirmButtonText: '立即加速',
            cancelButtonText: '放弃',
            className: 'borrowDialog'
          }).then(() => {
            this.$router.push({
              name: 'IdCardAuth',
              query: {
                type: 'router',
                method: 'replace',
                routerData: JSON.stringify({
                  name: 'BorrowMoney'
                })
              }
            })
          }).catch(() => {
            this.$router.replace({
              name: 'Facescard'
            })
          })
        } else if (!this.isPayPassword) {
          // 去设置密码
          this.$dialog.confirm({
            message: '您还未设置支付密码',
            confirmButtonText: '去设置',
            cancelButtonText: '放弃提现',
            className: 'borrowDialog'
          }).then(() => {
            this.$router.push({
              name: 'GetCode',
              query: {
                type: 'router',
                method: 'replace',
                routerData: JSON.stringify({
                  name: 'BorrowMoney'
                }),
                noCache: Date.now()
              }
            })
          }).catch(() => {
            this.$router.replace({
              name: 'Facescard'
            })
          })
        } else {
          if (this.noPayCount) {
            this.noPayCount += 1
            return false
          }
          this.submitV3()
          // this.showPasswordDialog = true
        }
      }
    },
    setButtonIsDisable () {
      if (this.isAgree && this.isInteger(Number(this.amount)) && this.stagNumber && this.reasonText) {
        this.buttonIsDisable = false
      } else {
        this.buttonIsDisable = true
      }
    },
    goOpenProtocol () {
      // 去开通服务协议
      let env = process.env.VUE_APP_SERVEN === 'DEV' ? 'dev' : 'prod'
      location.href = `https://cdn.basestonedata.com/${env}/services/dredegmoneyproto.html?token=${this.userToken}&userId=${this.userId}`
    },
    goBorrowProtocol () {
      // 去借款服务协议
      let env = process.env.VUE_APP_SERVEN === 'DEV' ? 'dev' : 'prod'
      location.href = `https://cdn.basestonedata.com/${env}/services/borrowmoney.html?goodsCode=103166&seq=3&token=${this.userToken}&userId=${this.userId}`
    },
    isMarkUpMobileAuthV2 () {
      // 信息补偿2
      this.loadingStauts = true
      post(api.isMarkUpMobileAuthV2 + '?token=' + this.userToken).then(res => {
        // this.getUserInfo()
        this.loadingStauts = false
        this.creditCheckObj.dianshangMarkup = res.dianshangMarkup // 是否需要电商授权
        this.creditCheckObj.markUp = res.markUp // 运营商是否需要授权
        this.creditCheckObj.gxbZhimaAuthNeed = res.gxbZhimaAuthNeed // 是否需要自研芝麻授权
        this.creditCheckObj.zhimaAuthUrl = res.zhimaAuthUrl.replace('bsdlks', 'https') // 芝麻信用授权的跳转地址
      }).catch(err => {
        this.loadingStauts = false
        let error = err
        if (err.message) {
          error = err.message
        }
        this.$toast(error)
      })
    },
    creditCheckV4Serve () {
      // 信息补偿1
      this.loadingStauts = true
      post(api.userCreditV4 + '?token=' + this.userToken + '&orderCodeOrPrefix=27').then(res => {
        this.loadingStauts = false
        // this.maxAmount = res.data.usable / 100
        this.creditCheckObj.isRealnameApprove = res.data.isRealnameApprove // 是否需要实名认证
        // 是否需要芝麻信用授权
        this.creditCheckObj.needIdCardOcr = res.data.needIdCardOcr // 是否需要OCR补偿
      }).catch(err => {
        this.loadingStauts = false
        let error = err
        if (err.message) {
          error = err.message
        }
        this.$toast(error)
      })
    },
    getUserInfo () {
      // 用户信息查询--是否有支付密码
      this.loadingStauts = true
      get(api.getUserInfo + '?token=' + this.userToken).then(res => {
        this.loadingStauts = false
        this.isPayPassword = res.data.isPayPassword
      }).catch(err => {
        this.loadingStauts = false
        let error = err
        if (err.message) {
          error = err.message
        }
        this.$toast(error)
      })
    },
    submitV3 () {
      // 提交借款
      this.showPasswordDialog = false
      this.loadingStauts = true
      post(api.createLoanOrder, fromUrlcode({
        token: this.userToken,
        loanAmount: Number(this.amount) * 100,
        loanReason: this.reasonText,
        typeIndex: 2,
        source: 8
      })).then(res => {
        this.loadingStauts = false
        this.showPasswordDialog = true
        this.orderCode = res.data
        // 借款申请跳转
        // this.$router.push({
        //   path: 'borrowSubmit'
        // })
      }).catch(err => {
        this.loadingStauts = false
        let error = err
        if (err.message) {
          error = err.message
        }
        this.$toast(error)
      })
    },
    getSubmitV3Data () {
      console.log('getSubmitV3Data')
      this.showPasswordDialog = false
      this.orderCode = ''
      // this.submitV3()
      // 借款申请跳转
      this.$router.replace({
        path: 'borrowSubmit'
      })
    },
    limitAmountServe () {
      post(api.limitAmount + '?token=' + this.userToken + '&cardCode=' + this.cardCode).then(res => {
        this.showMaxAmount = true
        this.maxAmount = res.maxAmount / 100
      }).catch(err => {
        let error = err
        if (err.message) {
          error = err.message
        }
        this.$toast(error)
      })
    },
    lookingCardStateServe () {
      post(api.lookingCardState + '?token=' + this.userToken).then(res => {
        if (res.data === 'noopencard') {
          // 未开卡
          this.showMaxAmount = false
          this.maxAmount = 0
          this.$toast('尚未开通颜值卡，请开通颜值卡再来借款！')
        } else {
          this.cardCode = res.data.cardCode
          this.setUserId(res.data.userId)
          this.limitAmountServe()
        }
      }).catch(err => {
        this.showMaxAmount = false
        let error = err
        if (err.message) {
          error = err.message
        }
        this.$toast(error)
      })
    },
    async taskCallBack () {
      let taskId = this.getQueryString('task_id')
      if (taskId) {
        try {
          global.vbus.$emit('loading_show', true)
          await this.$api['auth/submitDianshangTaskId']({
            token: this.userToken,
            taskId
          })
          global.vbus.$emit('loading_show', false)
          this.$router.replace({
            name: 'Facescard'
          })
        } catch (error) {
          global.vbus.$emit('loading_show', false)
          this.$toast(error)
        }
      }
    },
    mykloaninfoServe () {
      post(api.mykloaninfo + '?token=' + this.userToken).then(res => {
        let loanList = res.loanList[0]
        let seqs = loanList.seqs.split(',')
        this.actions = []
        for (let i = 0; i < seqs.length; i++) {
          this.actions.push({
            name: seqs[i] + '期',
            value: seqs[i]
          })
        }
        this.stagNumber = this.actions[0].value
      })
    },
    goProtocolList () {
      // this.$router.push({
      //   name: 'protocolList'
      // })
      location.href = `https://cdn.basestonedata.com/app/service/sinafenqi.html`
    },
    ...mapMutations(['setUserId'])
  },
  computed: {
    ...mapGetters(['userToken', 'userId'])
  },
  components: {
    Rule,
    Loading
  },
  watch: {
    amount () {
      if (this.amount.toString().length > 0) {
        this.showPlaceholder = false
      } else {
        this.showPlaceholder = true
      }
    },
    userToken (val) {
      if (val) {
        this.lookingCardStateServe()
        this.creditCheckV4Serve()
        this.isMarkUpMobileAuthV2()
        this.getUserInfo()
        this.mykloaninfoServe()
      }
    }
  }
}
</script>

<style scoped>
.borrowMoney {
  height: 100%;
  /* background-color: #f2f2f2; */
  text-align: left;
}
.margin-div {
  height: .28rem;
  background-color: #f2f2f2;
}
.borrowMoney-box {
  background-color: #FFF;
  padding: .613333rem .666667rem;
}
.borrowMoney-title {
  font-size: .373333rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:#333;
}
.money-input {
  margin-top: .5rem;
  position: relative;
}
.yuan {
  font-size: .666667rem;
  font-family:PingFangSC-Medium;
  font-weight:500;
  color:#333;
  vertical-align: 0.1em;
}
.input-value {
  font-size: 1.066667rem;
  font-family:PingFangSC-Medium;
  font-weight:500;
  color:#333;
  width: 6.726667rem;
  height: 1.5rem;
  line-height: 1.5rem;
  margin: 0;
  padding: 0;
}

.input-value::-webkit-input-placeholder { /* WebKit browsers */
  font-size: .373333rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(153,153,153,1);
}
.input-value:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  font-size: .373333rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(153,153,153,1);
}
.input-value::-moz-placeholder { /* Mozilla Firefox 19+ */
  font-size: .373333rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(153,153,153,1);
}
.input-value:-ms-input-placeholder { /* Internet Explorer 10+ */
  font-size: .373333rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(153,153,153,1);
}
.line {
  margin-top: .2rem;
  border-bottom: .013333rem solid #e6e6e6;
}
.staging {
  margin-top: .266667rem;
  background-color: #FFF;
}
.staging ul {
  padding: 0 .4rem;
}
.stagItem {
  height: 1.173333rem;
  line-height: 1.19rem;
  border-bottom: .013333rem solid #e6e6e6;
}
.stagItem:nth-last-child(1) {
    border-bottom: none;
}
.stagItem::after {
  content: '';
  display: block;
  clear: both;
}
.stagItem-left {
  float: left;
  font-size: .373333rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(0,0,0,1);
}
.stagItem-right {
  float: right;
}
.stagItem-right-text {
  /* height: .4rem; */
}
.stagItem-right-text-top {
  margin-top: .133333rem;
  height: .533333rem;
  line-height: .533333rem;
  font-size: .373333rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(237,20,91,1);
  text-align: right;
}
.stagItem-right-text-bottom {
  height: .4rem;
  line-height: .4rem;
  font-size: .266667rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(147,147,147,1);
}
.more-icon {
  display: inline-block;
  width: .586667rem;
  height: .586667rem;
  background-image: url("../../assets/img/list_icon_enter_nol@2x.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  top: 0.3rem;
  right: 0;
}
.stagItem-number {
  position: absolute;
  width: 0.9rem;
  /* top: 0.3rem; */
  right: .586667rem;
  font-size: .373333rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(237,20,91,1);
  text-align: right;
}
.relative {
  position: relative;
  display: inline-block;
  width: 2.333333rem;
  height: 100%;
}
.reason {
  width: 8rem;
  font-size: .373333rem;
  height: 0.8rem;
  line-height: 0.8rem;
  color: #333;
  margin: 0;
  padding: 0;
}
.reason::-webkit-input-placeholder { /* WebKit browsers */
  font-size: .373333rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:#939393;
}
.reason:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  font-size: .373333rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:#939393;
}
.reason::-moz-placeholder { /* Mozilla Firefox 19+ */
  font-size: .373333rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:#939393;
}
.reason:-ms-input-placeholder { /* Internet Explorer 10+ */
  font-size: .373333rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:#939393;
}
.borrow-bottom {
  margin: .76rem .28rem 0;
}
.agree {
  margin-left: .133333rem;
  font-size: .32rem;
  color: #333;
}
.color-red {
  font-family:PingFangSC-Regular;
  font-weight:400;
  color: #507DAF;
}
.agree-icon {
  display: inline-block;
  width: .356667rem;
  height: .356667rem;
  vertical-align: sub;
  margin-right: .166667rem;
  margin-bottom: 0.01rem;
}
.notAgree {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
   background-image: url("../../assets/img/notChecked.png");
}
.isAgree {
  background-image: url("../../assets/img/list_rd_select_sel@2x.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.borrow-button {
  margin: .4rem auto 0;
  width: 9.466667rem;
  height: 1.12rem;
  line-height: 1.12rem;
  border-radius: .053333rem;
  text-align: center;
  font-size: .426667rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(255,255,255,1);
}
.borrowButtonDisable {
  background-color: #FFABC1;
}
.borrowButtonAble {
  background-color: #F54B78;
}
.borrow-tip-box {
  margin-top: .4rem;
}
.tip-icon {
  display: inline-block;
  width: .346667rem;
  height: .346667rem;
  background-image: url("../../assets/img/list_icon_remind_sel@2x.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  vertical-align: sub;
  margin-right: .066667rem;
  margin-left: .133333rem;
}
.borrow-tip {
  font-size: .32rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(147,147,147,1);
  margin-top: .186667rem;
}
.passwordDialog {
  width: 8rem;
  height: 4rem;
  border-radius: .106667rem;
}
.placeholder-text {
  position: absolute;
  left: 0.8rem;
  top: 0.45rem;
  font-size: .373333rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(153,153,153,1);
  pointer-events: none;
}
</style>
<style>
.borrowDialog {
  font-family:PingFangSC-Medium;
}
.borrowDialog .van-dialog__message {
  text-align: center;
  font-size: .373333rem;
  font-weight:500;
  color: #333;
}
.borrowDialog .van-dialog__cancel .van-button__text {
  color: #636363;
  font-size: .426667rem;
}
.borrowDialog .van-dialog__confirm .van-button__text {
  color: #507daf;
  font-size: .426667rem;
}
.borrowMoney .van-actionsheet .van-hairline--bottom .van-actionsheet__item span.van-actionsheet__name {
  color: #333;
}
.borrowMoney .van-actionsheet .van-actionsheet__cancel {
  color: #333;
}
</style>
