<template>
  <div class="getcode">
    <p class="phone">请对绑定手机号码 {{secrestPhone}} 进行安全验证</p>
    <div class="code">
      <div class="field border border-top border-bottom">
        <div class="input__wrap">
          <img class="img" src="../../assets/img/bindcard/list_icon_verification_code@3x.png" alt="">
          <input v-model="sms" type="number" placeholder="请输入短信验证码" onfocus="this.style.color='#333'">
          <div class="text" @click="sendSms(0)" :class="{disabled: verCodeStatus === 1}">
            <span>{{btnDesc}}</span>
          </div>
        </div>
      </div>
      <div class="mask" v-show="imgAuthCodeShow" @click="imgAuthCodeShow=false">
        <div class="imgSms" @click.stop>
          <div class="field">
            <div class="inputWrap">
              <input v-model="imgSms" type="text" placeholder="请输入图形验证码" onfocus="this.style.color='#333'">
              <div class="imgContent">
                <img :src="imgAuthCodeSrc" alt="">
              </div>
            </div>
          </div>
          <div class="confirm1" :class="{canNologin: !canCloseImgAuth}" @click="imgValidate">
            确定
          </div>
        </div>
      </div>
      <p class="yuyin fr" :class="{gray: verCodeStatus === 1}" @click="sendSms(1)">获取语音验证码</p>
      <button class="confirm" :class="{canNologin: !canSetPassword}" :disabled=!canSetPassword @click="phoneValidate">
        <span>下一步</span>
      </button>
      <div class="tip">
        <p class="img">
          <img src="../../assets/img/list_icon_remind_sel@3x.png" alt="">
        </p>
        手机丢失或无法收到手机验证码，
        <span @click="linkService">请联系小象客服</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import formChecker from '@/module/formChecker'
import { getQueryString } from '@/module/common'

export default {
  name: '',
  data () {
    return {
      phone: '', // 手机号
      secrestPhone: '', // 加密手机号
      sms: '', // 短信验证码
      smsErrorMsg: '', // 短信验证码输入错误提示
      imgErrorMsg: '', // 图形验证码错误提示
      imgAuthCodeSrc: '', // 图形验证码
      verCodeStatus: 0, // 0 获取验证码 1 倒计时 2 重新获取
      btnDesc: '获取验证码', // 按钮文字
      timer: null,
      imgSms: '', // 图形验证码
      imgAuthCodeShow: false, // 是否显示图形弹层
      messageCode: '', // 得到的验证码
      cb: '',
      cbMethod: '',
      cbType: '',
      cbrouterData: '',
      getType: 0 // 获取验证码的方式   0 短信    1 语音
    }
  },
  computed: {
    canSetPassword () {
      return formChecker.checkPassword(this.sms)
    },
    canCloseImgAuth () {
      return formChecker.checkAuthCode(this.imgSms)
    }
  },
  mounted () {
    this.getUserInfo()
    this.sms = this.getQueryString('sms') || null
    this.cb = decodeURIComponent(getQueryString('cb')) // 回跳地址 并解码
    this.cbMethod = getQueryString('method') || 'replace'// 回跳方式 push/replace 默认replace
    this.cbType = getQueryString('type') || 'url' // 回跳类型 router/url 默认url
    this.cbrouterData = getQueryString('routerData')// 回跳类型为router时回跳路由数据
  },
  methods: {
    // 倒计时
    countDown () {
      this.btnDesc = '60S'
      this.timer = setInterval(() => {
        let seconds = this.btnDesc.replace('S', '')
        seconds--
        this.btnDesc = seconds + 'S'
        if (seconds === 0) {
          clearInterval(this.timer)
          this.verCodeStatus = 2
          this.btnDesc = '重新获取'
        }
      }, 1000)
    },
    getUserInfo () {
      global.vbus.$emit('setloadingStatus', true)
      this.$api['mine/getUserInfo']({
        token: this.userToken
      }).then(res => {
        global.vbus.$emit('setloadingStatus', false)
        this.phone = res.data.mobilePhone
        this.secrestPhone = res.data.mobilePhone.replace(/^(\w{3})(\w{4})(\w*)$/, '$1****$3')
      })
    },
    // 短信验证码验证
    phoneValidate () {
      global.vbus.$emit('loading_show', true)
      this.$api['mine/checkVerCode']({
        mobile: this.phone,
        verCode: this.sms
      }).then(async res => {
        global.vbus.$emit('loading_show', false)
        const code = res.heads.code
        if (code === 200) {
          this.$router.push({
            name: `SetPassword`,
            query: {
              type: this.cbType,
              sms: this.sms,
              methods: this.cbMethod,
              routerData: this.cbrouterData
            }
          })
        } else {
          this.$toast(res.heads.message)
        }
      })
    },
    // 图形验证码验证
    imgValidate () {
      // 验证图形验证码
      if (!this.canCloseImgAuth) {
        this.$toast('亲，请输入四位图形验证码')
      } else {
        // 获取登录结果
        this.sendSms(this.getType, 1)
      }
    },
    // 发送短信验证码
    sendSms (getType, isImgSms) {
      // 1.判断是否为倒计时状态
      if (this.verCodeStatus === 1) {
        return false
      }
      this.getType = getType
      let smsBody = {
        mobile: this.phone
      }
      if (getType === 1) {
        smsBody.type = 1
      }
      if (isImgSms === 1) {
        smsBody.authCodeName = this.imgSms
      }
      return global.ajax.post('v2/sms/getLoginSmsCode.json', smsBody)
        .then(async res => {
          const code = res.heads.code
          if (code === 200) { // 短信发送成功
            this.verCodeStatus = 1
            this.$toast('短信发送成功')
            if (isImgSms) {
              this.imgAuthCodeShow = false
              this.imgSms = ''
              this.imgAuthCodeSrc = ''
            }
            this.countDown()
          } else if (code === 1003) { // 获取图像验证码
            await this.getImgAuthCode()
            this.imgAuthCodeShow = true
          } else if (code === 1002) { // 图片验证码错误
            this.$toast('图片验证码错误')
            await this.getImgAuthCode()
            this.imgAuthCodeShow = true
          } else {
            this.$toast(res.heads.message)
          }
        }).catch(err => {
          this.$toast(err)
        })
    },
    // 获取图形验证码
    getImgAuthCode () {
      return global.ajax.get('v2/writeImages', { params: { mobile: this.phone }, responseType: 'blob' })
        .then(response => {
          console.log(response instanceof Blob)
          if (response instanceof Blob) {
            let imgUrl = window.URL.createObjectURL(response)
            this.imgAuthCodeSrc = imgUrl
          }
        })
    },
    linkService () { // 联系客服
      let env = process.env.VUE_APP_SERVEN === 'PROD' ? 'prod' : 'dev'
      location.href = `https://cdn.basestonedata.com/${env}/services/cs2.html`
    }
  },
  watch: {
    sms (val) {
      if (val && val.length > 6) {
        this.sms = val.slice(0, 6)
      }
    },
    imgSms (val) {
      if (val && val.length > 4) {
        this.imgSms = val.slice(0, 4)
      }
    }
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss">
.disabled {
  background:rgba(205, 205, 205, .5) !important;
  span {
    color: #636363 !important;
    opacity: 0.5;
  }
}
.mask {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .7);
  position: fixed;
  top: 0;
  left: 0;
}
.getcode {
  height: 100%;
  .phone {
    font-size: .373333rem;
    color: #636363;
    text-align: center;
    padding: .933333rem 0;
  }
  .code {
    // border-radius: 20px;
    .field {
      position: relative;
      padding: 15px 20px;
      text-align: left;
      background: #fff;
      overflow: hidden;
      .input__wrap {
        position: relative;
        height: 58px;
        background-color: #fff;
        white-space: nowrap;
        .img {
          width: 58px;
          height: 58px;
          margin-right: 10px;
        }
        input {
          display: inline-block;
          width: 100%;
          height: 100%;
          line-height: 38px;
          font-size: 28px;
          padding: 0;
          font-family: PingFangSC-Regular;
          color: #939393;
        }
        .text {
          position: absolute;
          top: 4px;
          right: 0;
          width: 176px;
          background: #F54B78;
          border-radius: 4px;
          color: #fff;
          height: 50px;
          line-height: 50px;
          text-align: center;
          span {
            display: inline-block;
            height: 33px;
            font-size: 24px;
            font-family: PingFangSC-Regular;
            color: #fff;
            line-height: 33px;
          }
        }
      }
    }
    .tip {
      font-size: .32rem;
      color: #636363;
      margin: .333333rem 0 .693333rem;
      .img {
        width: .32rem;
        height: .32rem;
        display: inline-block;
        margin: 0 5px 0 .4rem;
      }
      span {
        color: #507DAF;
      }
    }
    .confirm {
      width: 94%;
      background-color: #F54B78;
      border-radius: 4px;
      padding: 20px 0;
      margin: auto;
      text-align: center;
      border: 0;
      display: block;
      &.canNologin {
        background: #ffabc1;
      }
      span {
        display: inline-block;
        height: 45px;
        font-size: 32px;
        font-family: PingFangSC-Regular;
        color: #fff;
        line-height: 45px;
      }
    }
  }
  .imgSms {
    width: 70%;
    height: 250px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding: 50px;
    border-radius: 24px;
    background-color: #fff;
    .field {
      position: relative;
      padding: 25px 10px;
      text-align: left;
      border-bottom: 1px solid #e6e6e6;
      .inputWrap {
        position: relative;
        height: 50px;
        input {
          display: inline-block;
          margin-top: 1px;
          height: 40px;
          font-size: 28px;
          font-family: PingFangSC-Regular;
          color: #939393;
          line-height: 40px;
        }
        .imgContent {
          position: absolute;
          right: 0;
          top: -10px;
          width: 2.773333rem;
          height: 60px;
        }
      }
    }
    .confirm1 {
      background-color: #F54B78;
      border-radius: 4px;
      padding: 20px 0;
      margin-top: 50px;
      text-align: center;
      height: 45px;
      font-size: 32px;
      font-family: PingFangSC-Regular;
      color: #fff;
      line-height: 45px;
      &.canNologin {
        background: #ffabc1;
      }
    }
  }
  .yuyin {
    font-size: 24px;
    margin-top: 20px;
    color: #507DAF;
    display: inline-block;
    margin-right: 30px;
    margin-bottom: 98px;
  }
  .gray {
    color: #939393;
  }
  .border {
  position: relative;
}

.border::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  -webkit-transform: scale(.5);
  transform: scale(.5);
  pointer-events: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.border-bottom::after {
  border-bottom: 1px solid #e6e6e6;
}
.border-top::after {
  border-top: 1px solid #e6e6e6;
}
}
</style>
