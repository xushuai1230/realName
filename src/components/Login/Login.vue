<template>
	<div class="login" v-if="loginStatus">
		<div class="login__container">
      <div class="title">{{'绑定手机号'}}</div>
			<div class="sms" v-show="loginShow">
				<div class="field van-hairline--bottom">
					<div class="input__wrap">
						<input v-model="phone" type="number" placeholder="请输入手机号">
					</div>
				</div>
				<div class="field van-hairline--bottom">
					<div class="input__wrap">
						<input v-model="sms" type="number" placeholder="请输入短信验证码">
						<div @click="sendSms" :class="{disabled: verCodeStatus === 1}">
							<span>{{btnDesc}}</span>
						</div>
					</div>
				</div>
				<div class="confirm" :class="{canNologin: !canLogin}" @click="phoneValidate">
					<span>确定</span>
				</div>
			</div>
			<div class="imgSms" v-show="imgAuthCodeShow">
				<div class="field van-hairline--bottom">
					<div class="input__wrap">
						<input v-model="imgSms" type="text" placeholder="请输入图形验证码">
						<div class="imgContent">
							<img :src="imgAuthCodeSrc" alt="">
						</div>
					</div>
				</div>
				<div class="confirm" :class="{canNologin: !canCloseImgAuth}" @click="imgValidate">
					<span>确定</span>
				</div>
			</div>
		</div>
    <div class="tips" v-if="isRedPacketChannel">
      您可在"微博-我的-微博钱包-分期商城"管理卡券
    </div>
    <div class="close"  @click.stop="resetLoginData"></div>
	</div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapGetters, mapMutations } from 'vuex'
import formChecker from '@/module/formChecker'
import { ModalHelper } from '@/module/common'
import { CHANNEL_WEIBOBIND, CHANNEL_BOBO } from '@/const/constdata'
import redPacket from '@/mixins/redPacket'
import newUser from '@/mixins/newUser'

export default {
  name: '',
  props: ['registerType'],
  mixins: [redPacket, newUser],
  data () {
    return {
      loginShow: false, // 是否显示登录弹层
      imgAuthCodeShow: false, // 是否显示图形验证码弹层
      phone: '', // 手机号
      sms: '', // 短信验证码
      imgSms: '', // 短信验证码
      phoneErrorMsg: '', // 手机号输入错误提示
      smsErrorMsg: '', // 短信验证码输入错误提示
      imgErrorMsg: '', // 图形验证码输入错误提示
      verCodeStatus: 0, // 0 获取验证码 1 倒计时 2 重新获取
      imgAuthCodeSrc: '', // 图形验证码url
      btnDesc: '获取验证码', // 按钮文字
      timer: null,
      isRedPacketChannel: false
    }
  },
  mounted () {
  },
  created () {
    let redpacketChannels = ['353', '354', '355', '356']
    this.isRedPacketChannel = redpacketChannels.indexOf(this.loginChannel) > -1
  },
  computed: {
    canLogin () {
      return formChecker.checkPhoneAndVerCode(this.phone, this.sms)
    },
    canCloseImgAuth () {
      return formChecker.checkAuthCode(this.imgSms)
    },
    ...mapState(['loginStatus', 'loginChannel', 'couponDialogLogin', 'loginFlag']),
    ...mapGetters(['userWeiboMark', 'getCouponPrizeCode'])
  },
  methods: {
    // 重置登录框
    resetLoginData () {
      // this.phone = ''
      this.sms = ''
      this.imgSms = ''
      this.imgAuthCodeSrc = ''
      // this.verCodeStatus = 0
      this.loginShow = false
      this.imgAuthCodeShow = false
      // window.clearInterval(this.timer)
      // this.btnDesc = '获取验证码'
      this.setLoginStatus(false)
      this.setCouponDialogLogin(false) // 红包登录控制状态
      this.setLoginFlag('')
    },
    // 倒计时
    countDown () {
      this.btnDesc = '60s'
      this.timer = setInterval(() => {
        let seconds = this.btnDesc.replace('s', '')
        seconds--
        this.btnDesc = seconds + 's'
        if (seconds === 0) {
          clearInterval(this.timer)
          this.verCodeStatus = 2
          this.btnDesc = '重新获取'
        }
      }, 1000)
    },
    // 短信验证码验证
    async phoneValidate () {
      this.setHadCouponFlag('hadCouponLogin')
      try {
        if (!this.canLogin) return
        if (/WeiBo/i.test(navigator.userAgent)) {
          if ((this.loginChannel === CHANNEL_WEIBOBIND || this.loginChannel === CHANNEL_BOBO) && this.userWeiboMark) {
            await this.weiboBindLogin()
          } else if (this.isRedPacketChannel && this.couponDialogLogin) {
            await this.redPacketsLogin()
          } else {
            await this.login()
          }
        } else {
          await this.login()
        }
        this.$emit('loginGo')
        this.resetLoginData()
      } catch (error) {
        this.$toast(error)
      }
    },
    // 图形验证码验证
    imgValidate () {
      // 验证图形验证码
      if (!this.canCloseImgAuth) {
        this.$toast('亲，请输入四位图形验证码')
      } else {
        // 获取登录结果
        this.sendSms(1)
      }
    },
    // 发送短信验证码
    sendSms (isImgSms) {
      // 1.判断是否为倒计时状态
      if (this.verCodeStatus === 1) {
        return false
      }
      // 2.判断是否有手机号
      if (!this.phone) {
        this.$toast('手机号不能为空')
        return false
      }
      if (!formChecker.checkPhone(this.phone)) {
        this.$toast('手机号输入有误,请重新输入')
        return false
      }
      let smsBody = {
        mobile: this.phone
      }
      if (isImgSms) smsBody.authCodeName = this.imgSms
      return global.ajax.post('v2/sms/getLoginSmsCode.json', smsBody)
        .then(async res => {
          const code = res.heads.code
          if (code === 200) { // 短信发送成功
            this.verCodeStatus = 1
            this.$toast('短信发送成功')
            if (isImgSms) {
              this.imgAuthCodeShow = false
              this.loginShow = true
              this.imgSms = ''
              this.imgAuthCodeSrc = ''
            }
            this.countDown()
          } else if (code === 1003) { // 获取图像验证码
            await this.getImgAuthCode()
            this.loginShow = false
            this.imgAuthCodeShow = true
          } else if (code === 1002) { // 图片验证码错误
            this.$toast('图片验证码错误')
            await this.getImgAuthCode()
            this.loginShow = false
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
    // 普通方式登录
    login () {
      let params
      params = { mobile: this.phone, verCode: this.sms, registerType: this.registerType || 503 }

      return this.$api['user/gustLogin'](params)
        .then(res => {
          this.muUserMetaInfo(res)
          global.vbus.$emit('setBindUser', false) // 颜值卡里面使用
          this.afterLogin(() => {
            if (!res.reciveFlag) {
              this.$toast('您已领取过该福利，不能重复领取')
            }
          })
          this.setFirstOpenFlag(false)
        }).then(res => {
          this.newUserPrizeCheck()
        }).then(res => {
          this.setLoginFlag('')
          // 新人奖品优惠券是否有效 用于商品详情字段展示
          this.detailNewUserPrizeCheck()
        })
    },
    // 微博绑定登录
    weiboBindLogin () {
      const params = { mobile: this.phone, verCode: this.sms, tmpToken: this.userWeiboMark, registerType: this.registerType || 503 }
      // 测试
      // 测试
      // 测试
      return this.$api['user/weiboBind'](params).then(res => {
        this.muUserMetaInfo(res)
        this.muUserMark(null)
        global.vbus.$emit('setBindUser', false) // 颜值卡里面使用
        this.setFirstOpenFlag(false)
        this.setCouponDialogLogin(false)
        this.afterLogin(() => {
          if (!res.reciveFlag) {
            this.$toast('您已领取过该福利，不能重复领取')
          }
        })
      }).then(res => {
        this.newUserPrizeCheck()
      }).then(res => {
        this.setLoginFlag('')
        // 新人奖品优惠券是否有效 用于商品详情字段展示
        this.detailNewUserPrizeCheck()
      })
    },
    ...mapMutations(['setLoginStatus', 'muUserMark', 'setCouponDialogLogin', 'setLoginFlag'])
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
    },
    phone (val) {
      val = val || ''
      let mobile = val.toString()
      if (mobile && mobile.length > 11) {
        this.phone = Number.parseInt(mobile.slice(0, 11))
      }
    },
    loginStatus (val) {
      if (val && !this.loginShow && !this.imgAuthCodeShow) {
        this.loginShow = true
        ModalHelper.afterOpen()
      } else {
        ModalHelper.beforeClose()
      }
    }
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.tips {
  // position: fixed;
  // bottom: 40px;
  // display: flex;
  width: 100%;
  justify-content: center;
  position: fixed;
  bottom: 40px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 550px;
  font-size:24px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(147,147,147,1);
  line-height:33px;
  text-align: center;
  @media screen and (max-height: 400Px){
    display: none;
  }
}
.close {
  width: 58px;
  height: 58px;
  background: url('~@/assets/img/icon_close@3x.png') no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
}

.disabled {
  background: #f2f2f2 !important;
  color: #939393 !important;
}
.title {
  height:65px;
  font-size:46px;
  font-family:PingFangSC-Medium;
  font-weight:500;
  color:rgba(51,51,51,1);
  line-height:65px;
  width: 100%;
  text-align: center;
}

.login {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1999;
  background-color: rgba(0, 0, 0, 0.5);
  background-color: #fff;
}
.sms {
  padding-top: 50px;
  width: 100%;
  // height: 100%;
  border-radius: 20px;
  // background-color: blue;
  .field {
    position: relative;
    padding: 15px 10px 0px 10px;
    text-align: left;
    .input__wrap {
      position: relative;
      height: 112px;
      input {
        margin: 36px 0;
        width: 100%;
        display: inline-block;
        margin-top: 1px;
        height: 101px;
        font-size: 28px;
        font-family: PingFangSC-Regular;
        color: #333333;
        line-height: 40px;
      }
      input::-webkit-input-placeholder{
        line-height:normal;
        color: #939393;
      }
      div {
        position: absolute;
        top: 32px;
        right: 0;
        width: 176px;
        background: #F54B78;
        border-radius: 4px;
        // color: #fff;
        padding: 9px 0;
        text-align: center;
        span {
          display: inline-block;
          height: 33px;
          font-size: 24px;
          font-family: PingFangSC-Regular;
          // color: #fff;
          line-height: 33px;
        }
      }
    }
  }
  .confirm {
    width: 100%;
    background-color: #F54B78;
    border-radius: 4px;
    margin-top: 120px;
    height: 84px;
    line-height: 84px;
    &.canNologin {
      background: #FFABC1;
    }

    span {
      display: inline-block;
      height: 45px;
      font-size: 32px;
      font-family: PingFangSC-Regular;
      color: #fff;
    }
  }
  .footer {
    font-size:24px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color: #939393;
    text-align: left;
    margin-top: 20px;
  }
}
.imgSms {
  padding-top: 50px;
  width: 100%;
  .field {
    position: relative;
    text-align: left;
    .input__wrap {
      position: relative;
      height: 112px;
      input {
        padding: 20px 10px 30px 10px;
        width: 100%;
        display: inline-block;
        margin-top: 1px;
        height: 91px;
        font-size: 28px;
        font-family: PingFangSC-Regular;
        color: #333333;
        line-height: 40px;
      }
      input::-webkit-input-placeholder{
        line-height:normal;
        color: #939393;
      }
      .imgContent {
        position: absolute;
        right: 0;
        top: 36px;
        width: 2.773333rem;
        height: 60px;
      }
    }
  }
  .confirm {
    width: 100%;
    background-color: #F54B78;
    border-radius: 4px;
    padding: 22px 0;
    margin-top: 84px;
    &.canNologin {
      background: #FFABC1;
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
</style>
