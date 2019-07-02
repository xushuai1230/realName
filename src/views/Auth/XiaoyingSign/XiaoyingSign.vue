<template>
  <div class="tplRoot maxHeight" id="Main">
    <div class="part1">
      <div class="inputContainer mt20 firstInput">
        <span class="userName">{{userName | hideName}}</span>
      </div>
      <div class="inputContainer firstInput">
        <span class="userIdCardNum">{{userIdCardNum | hideInfo(4,10)}}</span>
      </div>
    </div>
    <div class="part2">
      <div class="inputContainer firstInput">
        <span class="phoneNumBox">{{userPhoneNum}}</span>
      </div>
    </div>
    <div class="part3">
      <div class="inputContainer firstInput">
        <span class="inputBox">{{bankCardNum | hideInfo(4,8)}}</span>
      </div>
      <div class="inputContainer firstInput">
        <span class="msgNumBox">
          <input type="number" class="inputStyle msg" style="width: 40%;" v-model.trim="msg" placeholder="请输入验证码"/>
        </span>
        <button class="btn" @click="getSMSCode" v-bind:class="{ gray: isDisabled }" :disabled="isDisabled">{{btntext}}</button>
      </div>
    </div>
    <div class="applyBox">
      <span @click="toggleSelect" class="icon" :class="{'iconChecked':isChecked,'iconNotChecked': !isChecked}"></span>
      <div class="serviceBox">
        <a @click="toggleSelect">注册即同意</a>
        <a @click="toFirstPageService(1)" class="service">《借款合同》</a>
        <a @click="toFirstPageService(2)" class="service">《小赢咨询服务协议》</a>
        <a @click="toFirstPageService(3)" class="service">《个人信息查询及使用授权书》</a>
        <a @click="toFirstPageService(4)" class="service">《授权委托书》</a>
        <a @click="toFirstPageService(5)" class="service">《委托扣款授权书》</a>
        <a @click="toJeKuanQueRenShu" class="service">《借款确认书》</a>
      </div>
    </div>

    <div class="submit">
      <button class="submitBtn" :disabled="subtnDisabled" @click="submitInfo">确定</button>
    </div>
    <div class="modal confirmModal" v-show="confirmModalShow">
      <div class="confirmBox">
        <h3 class="cofirmTitle">确认借款并投保</h3>
        <div class="confirmContent">
          <div class="item">
            <p class="itemLeft">借款本金 (元):</p>
            <p class="itemRight">{{bystagesAmount | exchangeFilter}}元</p>
          </div>
          <div class="item">
            <p class="itemLeft">借款期限:</p>
            <p class="itemRight">{{bystagesMonth}}个月</p>
          </div>
          <div class="item">
            <p class="itemLeft">每月还款 (元)：</p>
            <p class="itemRight">{{repaymentAmount | exchangeFilter}}元</p>
          </div>
          <div class="item mb24">
            <p class="itemLeft">预计还款日：</p>
            <p class="itemRight">{{repaymentDate}}</p>
          </div>
        </div>
        <div class="confirmTips">
          为保障贷款人的利益，申请借款需投保个人借款保证保险。
        </div>
        <div class="confirmContent confirmContent2">
          <div class="item">
            <p class="itemLeft">保险金额 (元):</p>
            <p class="itemRight">{{insuranceAmount | exchangeFilter}}元</p>
          </div>
          <div class="item">
            <p class="itemLeft">保费 (元):</p>
            <p class="itemRight">{{premiumFee | exchangeFilter}}元</p>
          </div>
          <div class="item mb24">
            <p class="itemLeft">保险期限:</p>
            <p class="itemRight">{{insuranceMonth}}个月</p>
          </div>
        </div>
        <div class="confirmTips">
          <div class="remind">特别提醒：以上保险要素中的保险金额、保险期限将根据实际放款金额及放款时间确定，最终信息以保单载明为准。</div>
        </div>
        <div class="applyBox mt20" style="width: 7.1rem; float:left;">
          <span @click="confirmToggleSelect" class="icon" :class="{'iconChecked':confirmIsChecked,'iconNotChecked': !confirmIsChecked}"></span>
          <div class="serviceBox">
            <a @click="confirmToggleSelect">阅读并同意</a>
            <a @click="toService" class="service">《投保协议》</a>
            <a href="https://cdn.xiaoxiangyoupin.com/dev/xiaoyingSign/personalLoanStipulation.html" class="service">《个人借款保证保险条款》</a>
            <a href="https://cdn.xiaoxiangyoupin.com/dev/xiaoyingSign/ZApolicy.html" class="service">《保险单》</a>
            <a href="https://cdn.xiaoxiangyoupin.com/dev/xiaoyingSign/ensureNotify.html" class="service">《个人借款保证保险投保须知及投保声明》</a>
          </div>
        </div>
        <div class="btnBox">
          <div class="cancelBtn false-font-color" @click="backHandle">取消</div>
          <div class="confirmBtn true-font-color" :style="{'color': '#507daf'}" @click="closeModal">确定</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { getQueryString } from '@/module/common'
import formChecker from '@/module/formChecker'
export default {
  name: 'XiaoyingSign',
  data () {
    return {
      token: '',
      userName: '',
      userIdCardNum: '',
      userPhoneNum: '',
      bankCardNum: '',
      msg: '',
      btntext: '获取验证码',
      isDisabled: false,
      subtnDisabled: false,
      spinnerIsShow: false,
      confirmModalShow: true,
      isChecked: true,
      confirmIsChecked: true,
      timer: null,
      orderCode: '', // 订单号
      bystagesAmount: '', // 借款本金
      bystagesMonth: '', // 借款期限
      insuranceMonth: '', // 保险期限
      repaymentAmount: '', // 每月还款金额
      repaymentDate: '', // 预计还款日
      insuranceAmount: '', // 保险金额
      premiumFee: '', // 保费
      type: null, // type=1 小赢资金方 type=2小赢独立资金方
      cb: '', // 成跳回调地址
      cbMethod: '', // 回跳方式 push/replace 默认replace
      cbType: '', // 回跳类型 router/url 默认url
      cbrouterData: ''// 回跳类型为router时回跳路由数据
    }
  },
  methods: {
    toggleSelect () {
      this.isChecked = !this.isChecked
    },
    confirmToggleSelect () {
      this.confirmIsChecked = !this.confirmIsChecked
    },
    backHandle () {
      if (this.cbType === 'router') { // vue-router 跳转
        if (this.cbMethod === 'push') {
          this.$router.push(JSON.parse(this.cbrouterData))
        } else {
          this.$router.replace(JSON.parse(this.cbrouterData))
        }
      } else { // location url 跳转
        if (this.cbMethod === 'push') {
          location.href = this.cb
        } else {
          location.replace(this.cb)
        }
      }
    },
    closeModal () {
      this.confirmIsChecked ? this.confirmModalShow = false : this.$toast('请阅读并同意下方相关合同')
    },
    toService () {
      window.location.href = 'https://cdn.xiaoxiangyoupin.com/dev/xiaoyingSign/ensureService.html?token=' + this.token + '&orderCode=' + this.orderCode + '&env=' + process.env.VUE_APP_SERVEN + '&' + new Date()
    },
    toJeKuanQueRenShu () {
      this.$router.push({ name: 'JieKuanQueRenShu', params: { token: this.token, orderCode: this.orderCode } })
    },
    toFirstPageService (serverNum) {
      let url
      if (serverNum === 1) {
        url = 'https://cdn.xiaoxiangyoupin.com/dev/xiaoyingSign/jiekuanHetong.html'
      } else if (serverNum === 2) {
        url = 'https://cdn.xiaoxiangyoupin.com/dev/xiaoyingSign/XYzixunFuwuXieyi.html'
      } else if (serverNum === 3) {
        url = 'https://cdn.xiaoxiangyoupin.com/dev/xiaoyingSign/personalInfoAuth.html'
      } else if (serverNum === 4) {
        url = 'https://cdn.xiaoxiangyoupin.com/dev/xiaoyingSign/shouQuanWeiTuoShu.html'
      } else {
        url = 'https://cdn.xiaoxiangyoupin.com/dev/xiaoyingSign/weiTuoKouKuanShouQuanShu.html'
      }
      this.$router.push({ name: 'ShowHtml', params: { url: url } })
    },
    countDown () {
      this.$toast('短信发送成功')
      this.isDisabled = true
      let count = 60
      this.timer = setInterval(function () {
        if (count > 1) {
          count--
          this.btntext = count + 's'
        } else {
          clearInterval(this.timer)
          this.btntext = '重新获取'
          this.isDisabled = false
        }
      }.bind(this), 1000)
    },
    getInsureInfo () {
      let params = {
        token: this.token,
        orderCode: this.orderCode
      }
      this.$api['bindCardZhiMaAuth/checkInsureInfo'](params).then(res => {
					  this.bystagesAmount = res.bystagesAmount// 借款本金
					  this.bystagesMonth = res.bystagesMonth// 借款期限
					  this.insuranceMonth = res.insuranceMonth// 保险期限
					  this.repaymentAmount = res.repaymentAmount// 每月还款金额
					  this.repaymentDate = res.repaymentDate// 预计还款日
					  this.insuranceAmount = res.insuranceAmount// 保险金额
					  this.premiumFee = res.premiumFee// 保费
      }).catch(err => {
                	this.$toast(err)
      })
    },
    getSMSCode () {
      if (!this.isChecked) {
        this.$toast('请阅读并同意下方相关合同')
      } else {
        let params = {
          token: this.token,
          orderCode: this.orderCode
        }
        this.$api['bindCardZhiMaAuth/signRequest'](params).then(res => {
          if (String(res.heads.code) === '44198') {
            this.$toast('该账户已认证')
            this.backHandle()
          } else if (res.heads.code === 200) {
            this.countDown()
          } else {
            this.$toast(res.heads.message)
          }
        }).catch(err => {
          this.$toast(err)
        })
      }
    },
    submitInfo () {
      if (!formChecker.checkVerCode(this.msg)) {
        this.$toast('请输入正确的短信验证码')
      } else if (!this.isChecked) {
        this.$toast('请阅读并同意以上相关合同')
      } else {
        let reqdata = {
          token: this.token,
          validateCode: this.msg,
          orderCode: this.orderCode
        }
        this.$api['bindCardZhiMaAuth/signAdvanceSina'](reqdata).then(res => {
          this.$toast(' 签约成功')
          this.backHandle()
        }).catch(err => {
          this.$toast(err)
        })
      }
    },
    getCardInfo () {
      let userdata = {
        token: this.token
      }
      this.$api['bindCardZhiMaAuth/getUserCard'](userdata).then(res => {
        this.userName = res.realName
        this.userIdCardNum = res.papersCode
        this.userPhoneNum = res.bindPhone
        this.bankCardNum = res.bankCardCode
      })
    }
  },
  filters: {
    hideName (val) {
      let newVal
      if (val) {
        if (val.length === 2) {
          newVal = val.replace(val.substr(1), '*')
        } else if (val.length === 3) {
          newVal = val.replace(val.substr(1), '**')
        } else {
          newVal = val.replace(val.substr(2), '**')
        }
        return newVal
      }
    },
    hideInfo (vals, n, m) {
      if (vals) {
        return vals.replace(vals.substr(n, m), '***********'.substring(0, m))
      }
    },
    exchangeFilter (val) {
      if (val) {
        return val / 100
      }
    }
  },
  mounted () {
    this.token = this.userToken
    this.orderCode = getQueryString('orderCode')
    this.getCardInfo()
    this.type = getQueryString('assetstype')// type=1 小赢资金方 type=2小赢独立资金方
    console.log(this.orderCode, 'orderCode')
    if (String(this.type) === '1') {
      this.getInsureInfo()
    } else {
      this.confirmModalShow = false
    }
    this.cb = decodeURIComponent(getQueryString('cb')) // 回跳地址 并解码
    this.cbMethod = getQueryString('method') || 'replace'// 回跳方式 push/replace 默认replace
    this.cbType = getQueryString('type') || 'url' // 回跳类型 router/url 默认url
    this.cbrouterData = getQueryString('routerData')// 回跳类型为router时回跳路由数据
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang="scss">
  $base-rem:1rem;
  @function r($n){
  @return ($n/75)*$base-rem
  }
  .applyBox{
    width: 100%;
    display: flex;
    align-items: flex-start;
    margin-top: r(30);
    float: left;
    .icon{
      display: inline-block;
      width: r(26);
      height: r(26);
      margin:r(5) r(20) 0 r(30);
    }
    .iconChecked{
      background: url("~@/assets/img/list_rd_select_sel@3x.png") no-repeat 0 0 ;
      background-size: contain;
    }
    .iconNotChecked{
      background: url("~@/assets/img/list_rd_select_nol@3x.png") no-repeat 0 0 ;
      background-size: contain;
    }
    .serviceBox{
      width: r(644);
      height: r(100);
      line-height: .5rem;
      font-size: r(24);
      color: #333;
      .service{
      color: #507DAF;
      /*margin-left: r(10);*/
      }
    }
  }
  ::-webkit-input-placeholder{
    font-size: r(28);
    color: #999999;
  }
  .submit {
    display: inline-block;
    width: 9.46rem;
    height: 1.173rem;
    margin: 70px auto;
    line-height: 1.173rem;
    text-align: center;
    // background: #ED145B;
    color: #fff;
    border-radius: 6px;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    padding: 0 20px;
  }
  .btn {
    height:50px;
    line-height: 50px;
    float: right;
    margin: 20px;
    border: solid 1px #f54b78;
    outline: none;
    border-radius: r(6);
    color: #fff;
    font-size: 26px;
    background: #f54b78;
  }
  .gray {
    background-color: #f5f5f5;
    border: none;
    color: #999;
  }
  .submitBtn {
    outline: none;
    background: none;
    border: none;
    width: 100%;
    height: 100%;
    color: #fff;
    font-size: .4rem;
    background: #F54B78;
    border-radius: r(8);
  }
  span::before {
    content: '';
    width: .773rem;
    height: .773rem;
    display: inline-block;
    float: left;
    margin: .2rem .2rem 0 .2rem;
  }
  .inputBox::before {
    background: url("~@/assets/img/wallet_list_icon_card_number@3x.png") no-repeat 0 0;
    background-size: contain;
  }
  .userName::before {
    background: url("~@/assets/img/wallet_list_icon_name@3x.png") no-repeat 0 0;
    background-size: contain;
  }
  .userIdCardNum::before {
    background: url("~@/assets/img/wallet_list_icon_identity_card@3x.png") no-repeat 0 0;
    background-size: contain;
  }
  .msgNumBox::before {
    background: url("~@/assets/img/wsllet_list_icon_verification_code@3x.png") no-repeat 0 0;
    background-size: contain;
  }
  .phoneNumBox::before {
    background: url("~@/assets/img/wallet_list_icon_mobile_number_bank@3x.png") no-repeat 0 0;
    background-size: contain;
  }
  .inputStyle {
    width: 70%;
    height: inherit;
    border: none;
    outline: none;
    font-size: .36rem;
    background: transparent;
    color: #333;
  }
  .msg {
    width: 50%;
    height: .64rem;
    line-height: .64rem;
  }
  .inputContainer {
    height: 1.173rem;
    border-bottom: 1px solid #e6e6e6;
    line-height: 1.27rem;
    background: #fff;
    font-size: r(28);
    color: #939393;
  }
  .modal{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0,0,0,.5);
  }
  .confirmModal{
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,.7);
  }
  .confirmBox{
    width: r(590);
    height: r(1035);
    background: rgba(255,255,255,0.80);
    background: #FFFFFF;
    border-radius: 24px;
    position: relative;
    .cofirmTitle{
      font-family: PingFangSC-Medium;
      font-size: 34px;
      color: #333;
      letter-spacing: -0.82px;
      text-align: center;
      line-height: r(44);
      margin: r(40) auto r(40);
    }
    .confirmContent{
      // display: flex;
      // flex-direction: column;
      // justify-content: space-between;
      padding: 0 40px;
      width: r(530);
      // height: r(239);
      margin: 0 auto;
      border: 1px solid #F2F2F2;
      background: #F2F2F2;
      box-sizing: border-box;
      border-radius: 10px;
      .item{
        display: flex;
        justify-content: space-between;
        // padding: 0 r(20);
        margin-top: 24px;
      }
      .itemLeft{
        font-size: r(26);
        color: #636363;
        letter-spacing: -0.63px;
      }
      .itemRight {
        color: #ED145B;
      }
    }
    .confirmTips{
      width: 100%;
      // height: r(104);
      padding: 20px 30px;
      opacity: 0.8;
      font-size: r(26);
      color: #333;
      letter-spacing: -0.63px;
      text-align: justify;
      line-height: r(36);
      box-sizing: border-box;
    }
    .confirmTips1{
      font-family: PingFangSC-Medium;
      font-size: r(24);
      color: #333;
      text-align: justify;
      height: r(139);
    }
    .confirmContent2 {
      // height: r(183);
    }
    .btnBox{
      width: 100%;
      height: r(88);
      line-height: r(88);
      display: flex;
      justify-content: center;
      text-align: center;
      position: absolute;
      bottom: 0;
      border-top: r(1) solid #e6e6e6;
      font-size: 32px;
      letter-spacing: -0.82px;
      .cancelBtn{
        width: 50%;
        height: 100%;
        color: #636363;
        font-size: 32px;
        border-right: r(1) solid #e6e6e6;
      }
      .confirmBtn{
        font-size: 32px;
        width: 50%;
        height: 100%;
        color: #507daf;
      }
    }
  }
  .spinnerModal{
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0);
  }
  .spinnerBox{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.5rem;
    height: 1.5rem;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
  }
  .mt20 {
    margin-top: 20px;
  }
  .mb24 {
    margin-bottom: 24px;
  }
  .firstInput {
    width: 100%;
    display: inline-block;
    float: left;
    // margin-bottom: 0;
    // box-sizing: border-box;
  }
  .remind {
    font-weight: 100;
  }
  .remind{
    width: 100%;
    // opacity: 0.8;
    font-size: r(26);
    color: #333;
    float: left;
    margin-bottom: 20px;
  }
  .true-font-color {
    color: #507daf
  }
  .false-font-color {
    color: #636363
  }
</style>
