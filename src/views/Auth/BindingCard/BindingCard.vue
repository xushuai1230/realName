<template>
  <div class="BindingCard">
    <div class="persion">
      <div class="persion__name">
        <div class="left-icon"></div>{{name}}
      </div>
      <div class="persion__idcard">
        <div class="left-icon"></div>{{idcard}}
      </div>
      <div class="persion__phone">
        <div class="left-icon"></div>{{userinfoPhone}}
      </div>
    </div>
    <div class="area">
      <div class="area__box rightborder" :class="!provinceFullName ? 'noareacolor' : ''" @click="areaSelectFn">
        {{provinceFullName ? provinceFullName : '请选择开户省'}}
        <div class="right-icon"></div>
      </div>
      <div class="area__box" :class="!propCityFullName ? 'noareacolor' : ''" @click="areaSelectFn">
        {{propCityFullName ? propCityFullName : '请选择开户市'}}
        <div class="right-icon"></div>
      </div>
    </div>
    <div class="bank">
      <div class="bank__box">
        <div class="left-icon"></div>
        <form>
          <input type="text" v-model="getShortMsg.accountNo" placeholder="请输入银行卡号" />
        </form>
      </div>
      <div class="bank__box" @click="bankSelectShowFn" :class="!bankName ? 'nobankcolor' : ''">
        <div class="left-icon"></div>
        <div class="txt">{{bankName ? bankName : '请选择开户行'}}</div>
        <div class="right-icon"></div>
      </div>
      <div class="bank__box">
        <div class="left-icon"></div>
        <form>
          <input type="text" v-model="getShortMsg.branchName" placeholder="请输入支行名称" />
        </form>
      </div>
      <div class="bank__box">
        <div class="left-icon"></div>
        <form>
          <input type="text" v-model="getShortMsg.bindPhone" placeholder="请输入预留手机号码" />
        </form>
      </div>
      <div class="bank__box">
        <div class="left-icon"></div>
        <form>
          <input type="text" v-model="shortMsg" placeholder="请输入验证码" />
        </form>
        <div class="shortMsg" v-if="!sendMsgStatus" @click="getShortMsgFn">
          获取验证码
        </div>
        <div class="countdDown" v-if="sendMsgStatus" @click="getShortMsgFn">
          {{countdown + 'S'}}
        </div>
      </div>
    </div>
    <div class="post-btn-box">
      <div class="post-btn" :class="postDataStatus? '': 'post-disclick'" @click="postDataFn">
        提交信息
      </div>
    </div>
    <div class="footer">
      <div>温馨提示：</div>
      <div>
        1、如对开户支行名称有疑问，请咨询相关银行<br />
        2、只支持绑定借记卡（储蓄卡）
      </div>
    </div>
    <address-area v-if="areaStatus"
                  :show="areaStatus"
                  :propProvince="propProvince"
                  :propCity="propCity"
                  @select-submit="handleAreaSelect">
    </address-area>
    <div class="bank-select-dialog" v-if="bankListShow">
      <div class="bank-box">
        <div v-for="(bankItem, index) in bankList" :key="index" @click="selectBankFn(bankItem.bankName)">
          {{bankItem.bankName}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getQueryString } from '@/module/common'
import addressArea from './AddressArea'
export default {
  name: 'BindingCard',
  data () {
    return {
      userInfo: null,
      areaStatus: false,
      propProvince: null,
      propCity: null,
      bankListShow: false,
      bankList: [],
      // 获取短信验证码数据
      getShortMsg: {
        prov: '',
        city: '',
        accountNo: '',
        bankName: '',
        branchName: '',
        bindPhone: ''
      },
      shortMsg: '',
      sendMsgStatus: false,
      countdown: 60,
      timer: null,
      orderCode: ''
    }
  },
  watch: {
  },
  computed: {
    postDataStatus () {
      let temp = Object.keys(this.getShortMsg)
      for (let i = 0; i < temp.length; i++) {
        let objKey = temp[i]
        if (!this.getShortMsg[objKey]) {
          return false
        }
      }
      if (!this.shortMsg) return false
      return true
    },
    bankName () {
      return this.getShortMsg.bankName
    },
    provinceFullName () {
      return this.propProvince && this.propProvince.fullName
    },
    propCityFullName () {
      return this.propCity && this.propCity.fullName
    },
    name () {
      let temp = ''
      if (this.userInfo && this.userInfo.name) {
        temp = this.userInfo.name.substring(1, 0) + Array(this.userInfo.name.length).join('*')
      }
      return temp
    },
    idcard () {
      let temp = ''
      if (this.userInfo && this.userInfo.idcard) {
        let reg = /^(\d{3})\d*(\d{4})$/
        temp = this.userInfo.idcard.replace(reg, '$1***********$2')
      }
      return temp
    },
    userinfoPhone () {
      return this.userInfo && this.userInfo.phone
    }
  },
  async mounted () {
  },
  async created () {
    console.log(this.$route.params.orderCode)
    this.orderCode = getQueryString('orderCode')
    await this.queryMsg()
    await this.getBankList()
  },
  methods: {
    postDataFn () {
      if (!this.postDataStatus) return false
      this.$api['borrowHistory/bindcardadvance']({
        verifyCode: this.shortMsg,
        orderCode: this.orderCode,
        token: this.userToken
      }).then(res => {
        const type = this.getQueryString('type') || 'url'
        const routerData = this.getQueryString('routerData')
        const method = this.getQueryString('method') || 'replace'
        const cb = this.getQueryString('cb')
        if (cb || routerData) {
          if (type === 'router') {
            this.$router[method](JSON.parse(routerData))
          } else {
            if (method === 'push') {
              location.href = decodeURIComponent(cb)
            } else if (method === 'replace') {
              location.replace(decodeURIComponent(cb))
            }
          }
        }
      })
    },
    countdownMins () {
      this.timer = setInterval(() => {
        this.countdown--
        if (this.countdown < 0) {
          clearInterval(this.timer)
          this.countdown = 60
          this.sendMsgStatus = false
        }
      }, 1000)
    },
    // 获取短信验证码
    async getShortMsgFn () {
      // 判断获取短信的必填信息校验
      let temp = Object.keys(this.getShortMsg)
      for (let i = 0; i < temp.length; i++) {
        let objKey = temp[i]
        if (!this.getShortMsg[objKey]) {
          switch (objKey) {
            case 'prov':
              return this.$toast('请选择开户省')
            case 'city':
              return this.$toast('请选择开户市')
            case 'accountNo':
              return this.$toast('请填写银行卡号')
            case 'bankName':
              return this.$toast('请选择开户行')
            case 'branchName':
              return this.$toast('请填写支行名称')
            case 'bindPhone':
              return this.$toast('请填写预留手机')
          }
        }
      }
      this.countdownMins()
      await this.$api['borrowHistory/regAndAuth']({
        orderCode: this.orderCode,
        token: this.userToken
      }).then(res => {
      })
      this.$api['borrowHistory/bindcard']({
        prov: this.getShortMsg.prov,
        city: this.getShortMsg.city,
        accountNo: this.getShortMsg.accountNo,
        bankName: this.getShortMsg.bankName,
        branchName: this.getShortMsg.branchName,
        bindPhone: this.getShortMsg.bindPhone,
        orderCode: this.orderCode,
        token: this.userToken
      }).then(res => {
      })
    },
    // 选择开户行
    selectBankFn (bankName) {
      this.getShortMsg.bankName = bankName
      this.bankListShow = false
    },
    bankSelectShowFn () {
      this.bankListShow = true
    },
    // 获取银行列表
    getBankList () {
      this.$api['borrowHistory/getsupportbanks']({
        token: this.userToken
      }).then(res => {
        this.bankList = res.data.banks
      })
    },
    queryMsg () {
      this.$api['borrowHistory/getAuthInfo']({
        token: this.userToken
      }).then(res => {
        this.userInfo = res
      })
    },
    areaSelectFn () {
      this.areaStatus = true
    },
    handleAreaSelect (cb) {
      console.log(cb, 'callback')
      if (!cb) {
        this.areaStatus = false
        return false
      } else {
        this.propProvince = cb.province
        this.propCity = cb.city
        this.getShortMsg.prov = this.provinceFullName
        this.getShortMsg.city = this.propCityFullName
      }
      this.areaStatus = false
    }
  },
  components: {
    addressArea
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.BindingCard {
  background: #f2f2f2;
  .persion {
    &__name {
      width: 100%;
      padding: 15px 0 15px 20px;
      height: 88px;
      box-sizing: border-box;
      font-size:28px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(153,153,153,1);
      line-height:58px;
      border-bottom:1px solid #efefef;
      background:rgba(255,255,255,1);
      .left-icon {
        height: 58px;
        width: 58px;
        float: left;
        margin-right: 10px;
        background: url('~@/assets/img/bindcard/list_icon_name@3x.png') no-repeat;
        background-size: 100%;
      }
    }
    &__idcard {
      width: 100%;
      padding: 15px 0 15px 20px;
      height: 88px;
      box-sizing: border-box;
      font-size:28px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(153,153,153,1);
      line-height:58px;
      border-bottom:1px solid #efefef;
      background:rgba(255,255,255,1);
      .left-icon {
        height: 58px;
        width: 58px;
        float: left;
        margin-right: 10px;
        background: url('~@/assets/img/bindcard/list_icon_identity_card@3x.png') no-repeat;
        background-size: 100%;
      }
    }
    &__phone {
      width: 100%;
      padding: 15px 0 15px 20px;
      height: 88px;
      box-sizing: border-box;
      font-size:28px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(153,153,153,1);
      line-height:58px;
      border-bottom:1px solid #efefef;
      background:rgba(255,255,255,1);
      .left-icon {
        height: 58px;
        width: 58px;
        float: left;
        margin-right: 10px;
        background: url('~@/assets/img/bindcard/list_icon_card_phone_number@3x.png') no-repeat;
        background-size: 100%;
      }
    }
  }
  .area {
    height: 88px;
    margin-top: 21px;
    background: #fff;
    border-bottom: 1px solid #efefef;
    border-top: 1px solid #efefef;
    box-sizing: border-box;
    .noareacolor {
      color:rgba(153,153,153,1);
    }
    .rightborder {
      border-right: 1px solid #efefef;
    }
    &__box {
      box-sizing: border-box;
      width: 50%;
      height: 88px;
      float: left;
      padding: 23px 30px;
      font-size:28px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:40px;
      .right-icon {
        height: 44px;
        width: 44px;
        float: right;
        background: url('~@/assets/img/list_icon_enter_nol@3x.png') no-repeat;
        background-size: 100%;
      }
    }
  }
  .bank {
    .nobankcolor {
      color:rgba(153,153,153,1);
    }
    &__box {
      border-bottom: 1px solid #efefef;
      height: 88px;
      width: 100%;
      box-sizing: border-box;
      padding: 15px 0 15px 20px;
      background: #fff;
      .left-icon {
        height: 58px;
        width: 58px;
        float: left;
        margin-right: 10px;
      }
      .right-icon {
        margin-top: 7px;
        height: 44px;
        width: 44px;
        float: right;
        background: url('~@/assets/img/list_icon_enter_nol@3x.png') no-repeat;
        background-size: 100%;
        margin-right: 30px;
      }
      input {
        padding-top: 15px;
        padding-bottom: 15px;
        font-size: 28px;
        height: 28px;
        width: 70%;
        float: left;
        color: #333333;
      }
      input::-webkit-input-placeholder{
        font-size: 28px;
        line-height:normal;
        color: #939393;
      }
    }
    :nth-child(1) {
      .left-icon {
        background: url('~@/assets/img/bindcard/list_icon_card_number@3x.png') no-repeat;
        background-size: 100%;
      }
    }
    :nth-child(2) {
      .txt {
        height: 58px;
        line-height: 58px;
        width: 70%;
        float: left;
        padding-left: 10px;
        box-sizing: border-box;
        font-size: 28px;
      }
      .left-icon {
        background: url('~@/assets/img/bindcard/list_icon_choose_bank@3x.png') no-repeat;
        background-size: 100%;
      }
    }
    :nth-child(3) {
      input {
        width: 85%;
      }
      .left-icon {
        background: url('~@/assets/img/bindcard/list_icon_subbranch_name@3x.png') no-repeat;
        background-size: 100%;
      }
    }
    :nth-child(4) {
      border-top: 1px solid #efefef;
      margin-top: 18px;
      input {
        width: 85%;
      }
      .left-icon {
        background: url('~@/assets/img/bindcard/list_icon_card_phone_number@3x.png') no-repeat;
        background-size: 100%;
      }
    }
    :nth-child(5) {
      .left-icon {
        background: url('~@/assets/img/bindcard/list_icon_verification_code@3x.png') no-repeat;
        background-size: 100%;
      }
      input {
        width: 60%;
      }
      .shortMsg {
        width: 160px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-radius:4px;
        margin: 4px 0;
        margin-right: 20px;
        float: right;
        color: #fff;
        font-size: 24px;
        background: #f54b78;
      }
      .countdDown {
        width: 160px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-radius:4px;
        // border:1px solid #ccc;
        margin: 4px 0;
        margin-right: 20px;
        float: right;
        color: #939393;
        font-size: 24px;
        background: #f2f2f2;
      }
    }
  }
  .post-btn-box {
    margin-top: 110px;
    height: 88px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    .post-btn {
      width: 100%;
      height: 84px;
      line-height: 84px;
      font-size:32px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(255,255,255,1);
      background: #F54B78;
      text-align: center;
      border-radius: 4px;
    }
    .post-disclick {
      background: #FFABC1;
    }
  }
  .footer {
    margin-top: 30px;
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
    height: 118px;
    :nth-child(1) {
      margin-bottom: 19px;
      height:33px;
      font-size:24px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:#333333;
      line-height:33px;
    }
    :nth-child(2) {
      font-size:24px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:#939393;
      line-height:33px;
    }
  }
  .bank-select-dialog {
    width: 100%;
    height: 100%;
    overflow: scroll;
    position: fixed;
    left: 0;
    top: 0;
    background: #efefef;
    box-sizing: border-box;
    .bank-box {
      position: relative;
      left: 0;
      top: 0;
      width: 100%;
      margin-top: 20px;
      margin-bottom: 20px;
      div {
        color: #333333;
        height: 88px;
        width: 100%;
        background: #fff;
        box-sizing: border-box;
        padding: 15px 0 15px 30px;
        line-height: 58px;
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        border-bottom: 1px solid #efefef;
      }
    }
  }
}
</style>
