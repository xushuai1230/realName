<template>
  <div class="OffenUseAccredit">
    <div class="header">
      提示：授权成功最高可提额5000元！
    </div>
    <div class="oftenUsePhone">
      <div class="left-icon"></div>
      <form>
        <input type="text" placeholder="请输入常用手机号"  v-model="phone" />
      </form>
    </div>
    <div class="password">
      <div class="left-icon"></div>
      <form>
        <input :type="isPasswordType ? 'password' : 'text'" placeholder="请输入服务密码"  v-model="postpassword" />
      </form>
      <div class="show-password-icon" :class="!isPasswordType ? 'hidden-password-icon' : '' "  @click="showPasswordFn"></div>
      <div class="close-icon" v-if="closeIconStatus" @click="closeFn"></div>
    </div>
    <div class="forget">
      <div class="forget__password" @click="forgetFn">忘记服务密码？</div>
    </div>
    <div class="affirm">
      <div class="affirm__btn"
          :class="actionAffirmStatus && phone.length === 11 ? 'btn-action-bg' : ''"
          @click="postMsgFn(actionAffirmStatus)">确认授权</div>
    </div>
    <div class="consent">
      <!-- <div class="consent-icon-box">
        <div class="consent-action-icon"
             :class="!consentStatus ? 'consent-unaction-icon' : ''"
             @click="changeConsentFn">
        </div>
      </div> -->
      <!-- <div class="consent-txt">
        同意<span @click="goprotocol(1)">《运营商实名认证授权协议》</span>
        <span @click="goprotocol(2)">《用户信息收集授权协议》</span>
      </div> -->
    </div>
    <div class="footer">
      <div>温馨提示：</div>
      <div>
        1.确认授权后将收到运营商验证码，请及时填入。<br />
        2.若忘记服务密码，请至相应运营商网站或营业厅重置。
      </div>
    </div>
    <div class="affirm-dialog" v-if="affirmDialogStatus">
      <div class="affirm-dialog-centter">
        <div class="affirm-dialog-txt" :style="{'padding': !dialogTxt ? (30 / 75) + 'rem': (50 / 75) + 'rem'}">
          {{dialogTxt}}
        </div>
        <div class="affirm-dialog-input">
          <form>
            <input type="text"  placeholder="请输入动态密码"  v-model="shortMessageCode" />
          </form>
        </div>
        <div class="affirm-dialog-btn">
          <div @click="dialognopost">取消</div>
          <div @click="rePostFn">确定</div>
        </div>
      </div>
    </div>
     <safeTitle></safeTitle>
  </div>
</template>

<script>
import safeTitle from '@/components/safeTitle'
export default {
  name: 'OffenUseAccredit',
  data () {
    return {
      isPasswordType: true,
      closeIconStatus: false,
      consentStatus: true,
      affirmDialogStatus: false,
      phone: '',
      postpassword: '',
      shortMessageCode: '',
      postType: '',
      regMobileFlag: 'N',
      dialogTxt: ''
    }
  },
  watch: {
    shortMessageCode (val) {
      if (val) {
        this.closeIconStatus = true
        let temp = val.replace(/[^0-9]/ig, '')
        this.shortMessageCode = temp
        if (temp.length > 6) {
          this.shortMessageCode = temp.slice(0, 6)
        }
      } else {
        this.closeIconStatus = false
      }
    },
    phone (val) {
      let temp = val.replace(/[^0-9]/ig, '')
      this.phone = temp
      if (temp.length > 11) {
        this.phone = temp.slice(0, 11)
      }
    },
    postpassword (val) {
      if (val) {
        this.closeIconStatus = true
        let temp = val.replace(/[^0-9]/ig, '')
        this.postpassword = temp
        if (temp.length > 6) {
          this.postpassword = temp.slice(0, 6)
        }
      } else {
        this.closeIconStatus = false
      }
    }
  },
  computed: {
    actionAffirmStatus () {
      if (this.postpassword && this.consentStatus) {
        return true
      } else {
        return false
      }
    },
    hiddenphone () {
      let temp = ''
      if (this.phone) {
        let reg = /^(\d{3})\d*(\d{4})$/
        temp = String(this.phone).replace(reg, '$1****$2')
      }
      return temp
    }
  },
  async mounted () {
  },
  async created () {
  },
  methods: {
    dialognopost () {
      this.affirmDialogStatus = false
    },
    closeFn () {
      this.postpassword = ''
    },
    showPasswordFn () {
      this.isPasswordType = !this.isPasswordType
    },
    changeConsentFn () {
      this.consentStatus = !this.consentStatus
    },
    goprotocol (val) {
      if (val === 1) {
        location.href = 'http://cdn.xiaoxiangyoupin.com/app/service/operatorproto.html'
      } else if (val === 2) {
        location.href = 'http://cdn.xiaoxiangyoupin.com/app/service/usermsg.html'
      }
    },
    rePostFn () {
      console.log(this.shortMessageCode)
      if (!this.shortMessageCode) {
        return this.$toast('请输入短信验证码')
      }
      this.$api['borrowHistory/submitNetOperatorAuth']({
        token: this.userToken,
        account: this.phone,
        password: this.postpassword,
        type: this.postType,
        captcha: this.shortMessageCode,
        regMobileFlag: this.regMobileFlag
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.code) {
          switch (res.code) {
            case 9910001:
              this.dialogTxt = '再次输入短信验证码'
              this.postType = 'RESEND_CAPTCHA'
              this.shortMessageCode = ''
              this.affirmDialogStatus = true
              return
            case 9910002:
              this.dialogTxt = '输入短信验证码'
              this.postType = 'SUBMIT_CAPTCHA'
              this.shortMessageCode = ''
              this.affirmDialogStatus = true
              return
            case 10003:
              return
            case 10004:
              return
            case 10006:
              return
            case 10007:
              return
            case 9910008:
              this.$toast('正在授权中')
              this.affirmDialogStatus = false
              this.postpassword = ''
              this.shortMessageCode = ''
              this.postType = ''
              this.backfn()
              return
            case 9910017:
              this.dialogTxt = '请用本机发送CXXD至10001获取查询详单的验证码 第一次提交服务密码后返回这个信息则需求用户发送短信到网络运营商获取短信验证码'
              this.postType = 'SUBMIT_CAPTCHA'
              this.shortMessageCode = ''
              this.affirmDialogStatus = true
              return
            case 9910018:
              this.dialogTxt = '短信码失效请用本机发送CXXD至10001获取查询详单的验证码'
              this.postType = 'SUBMIT_CAPTCHA'
              this.shortMessageCode = ''
              this.affirmDialogStatus = true
              return
            default:
              return ''
          }
        }
      }).catch(err => {
        if (err) {
        }
      })
    },
    backfn () {
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
    },
    postMsgFn (status) {
      if (!status) return false
      if (this.phone.length < 11) {
        return this.$toast('请输入正确手机号')
      }
      this.$api['borrowHistory/submitNetOperatorAuth']({
        token: this.userToken,
        account: this.phone,
        password: this.postpassword,
        regMobileFlag: this.regMobileFlag
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.code) {
          switch (res.code) {
            case 9910001:
              this.dialogTxt = '再次输入短信验证码'
              this.postType = 'RESEND_CAPTCHA'
              this.shortMessageCode = ''
              this.affirmDialogStatus = true
              return
            case 9910002:
              this.dialogTxt = '输入短信验证码'
              this.postType = 'SUBMIT_CAPTCHA'
              this.shortMessageCode = ''
              this.affirmDialogStatus = true
              return
            case 10003:
              return
            case 10004:
              return
            case 10006:
              return
            case 10007:
              return
            case 9910008:
              this.$toast('正在授权中')
              this.affirmDialogStatus = false
              this.postpassword = ''
              this.shortMessageCode = ''
              this.postType = ''
              this.backfn()
              return
            case 9910017:
              this.dialogTxt = '请用本机发送CXXD至10001获取查询详单的验证码 第一次提交服务密码后返回这个信息则需求用户发送短信到网络运营商获取短信验证码'
              this.postType = 'SUBMIT_CAPTCHA'
              this.shortMessageCode = ''
              this.affirmDialogStatus = true
              return
            case 9910018:
              this.dialogTxt = '短信码失效请用本机发送CXXD至10001获取查询详单的验证码'
              this.postType = 'SUBMIT_CAPTCHA'
              this.shortMessageCode = ''
              this.affirmDialogStatus = true
              return
            default:
              return ''
          }
        }
      }).catch(err => {
        if (err) {
        }
      })
    },
    forgetFn () {
      this.$router.push({
        name: 'ForgetPassword',
        params: {
          phone: this.phone
        },
        query: {
          noCache: Date.now()
        }
      })
    }
  },
  components: {
    safeTitle
  },
  destroyed () {
  }
}
</script>

<style lang="scss" scoped>
.OffenUseAccredit {
  height: 100%;
  background: #f2f2f2;
  .header {
    height: 70px;
    line-height: 70px;
    width: 100%;
    box-sizing: border-box;
    padding: 0px 0 0px 30px;
    font-size:28px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:#c8742c;
    background:rgba(255,245,217,1);
    border-top: 1px solid #E5E5E5;
    margin-bottom: 20px;
  }
  .phone {
    width: 100%;
    height:88px;
    padding: 30px 24px;
    box-sizing: border-box;
    font-size:28px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:40px;
    border-top:1px solid #EFEFEF;
  }
  .oftenUsePhone {
    width: 100%;
    height:88px;
    padding: 15px 20px;
    box-sizing: border-box;
    background:rgba(255,255,255,1);
    border-top:1px solid #e6e6e6;
    .left-icon {
      float: left;
      height: 58px;
      width: 58px;
      background: url('~@/assets/img/bindcard/list_icon_card_phone_number@3x.png') no-repeat;
      background-size: 100%;
    }
    input {
      font-size: 28px;
      padding-top: 15px;
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
  .password {
    width: 100%;
    height:88px;
    padding: 15px 20px;
    box-sizing: border-box;
    background:rgba(255,255,255,1);
    border-top:1px solid #e6e6e6;
    border-bottom:1px solid #e6e6e6;
    .left-icon {
      float: left;
      height: 58px;
      width: 58px;
      background: url('~@/assets/img/bindcard/list_icon_password@3x.png') no-repeat;
      background-size: 100%;
    }
    input {
      font-size: 28px;
      padding-top: 15px;
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
    .show-password-icon {
      float: right;
      height: 58px;
      width: 58px;
      background: url('~@/assets/img/list_icon_close_password@3x.png') no-repeat;
      background-size: 100%;
    }
    .hidden-password-icon {
      background: url('~@/assets/img/list_icon_open_password@3x.png') no-repeat;
      background-size: 100%;
    }
    .close-icon {
      float: right;
      margin-right: 15px;
      margin-top: 15px;
      height: 28px;
      width: 28px;
      background: url('~@/assets/img/list_icon_delelt@3x.png') no-repeat;
      background-size: 100%;
    }
  }
  .forget {
    height: 110px;
    width: 100%;
    padding: 25px 19px 45px 30px;
    box-sizing: border-box;
    line-height: 33px;
    &__password {
      float: right;
      height:33px;
      font-size:24px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:#507daf;
      line-height:33px;
    }
  }
  .affirm {
    width: 100%;
    height: 84px;
    box-sizing: border-box;
    padding: 0 20px;
    &__btn {
      width: 100%;
      height: 84px;
      line-height: 84px;
      text-align: center;
      background:rgba(255,171,193,1);
      border-radius:4px;
      font-size:32px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(255,255,255,1);
    }
    .btn-action-bg {
      background: #F54B78;
    }
  }
  .consent {
    // height: 116px;
    height: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 32px 0 0 30px;
    .consent-icon-box {
      width: 26px;
      height: 84px;
      float: left;
      margin-right: 20px;
      .consent-action-icon {
        width: 26px;
        height: 26px;
        background: url('~@/assets/img/list_rd_select_sel@3x.png') no-repeat;
        background-size: 26px;
      }
      .consent-unaction-icon {
        background: url('~@/assets/img/list_rd_select_nol@3x.png') no-repeat;
        background-size: 26px;
      }
    }
    .consent-txt {
      margin-top: 30px;
      font-size:24px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:#333333;
      line-height:26px;
      span {
        font-size:24px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:#507daf;
        line-height:26px;
      }
    }
  }
  .footer {
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
      color:rgba(0,0,0,1);
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
  .affirm-dialog {
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,0.5);
    position: fixed;
    left: 0;
    top: 0;
    .affirm-dialog-centter {
      margin: 318px auto;
      width:540px;
      background:#ffffff;
      border-radius: 24px;
      .affirm-dialog-txt {
        padding: 40px;
        text-align: center;
        font-size:32px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(0,0,0,1);
        line-height:48px;
        box-sizing: border-box;
      }
      .affirm-dialog-input {
        width: 100%;
        padding: 0 50px;
        box-sizing: border-box;
        margin-bottom: 20px;
        height: 74px;
        background: rgba(255,255,255,0);
        margin-bottom: 50px;
        input {
          width:400px;
          height: 28px;
          padding: 23px 20px;
          border-radius: 4px;
          font-size: 28px;
          background: #f2f2f2;
          border: none;
        }
        input::-webkit-input-placeholder{
          font-size: 28px;
          line-height:normal;
          color: #939393;
        }
      }
      .affirm-dialog-btn {
        width: 100%;
        height: 88px;
        border-top: 1px solid #D0D0D0;
        :nth-child(1) {
          width: 50%;
          height: 88px;
          float: left;
          box-sizing: border-box;
          border-right: 1px solid #D0D0D0;
          font-size:34px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#636363;
          line-height:88px;
          text-align: center;
        }
        :nth-child(2) {
          width: 50%;
          height: 88px;
          float: right;
          box-sizing: border-box;
          font-size:34px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#507daf;
          line-height:88px;
          text-align: center;
        }
      }
    }
  }
}
</style>
