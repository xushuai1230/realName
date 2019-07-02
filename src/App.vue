<template>
	<div id="app">
		<div>
			<keep-alive ref="aliveIns" v-if="alive" :exclude="excludeArr">
				<router-view v-if='$route.meta.keepAlive'></router-view>
			</keep-alive>
			<router-view v-if='!$route.meta.keepAlive'></router-view>
		</div>
    <!-- 老还款弹窗 -->
    <OldEntery></OldEntery>
		<!-- 登录弹层 -->
		<Login :registerType="loginChannel"></Login>
		<!-- 加载弹层 -->
		<Loading v-if="loadingStauts"></Loading>
		<!-- 实名提示弹框 -->
		<div class="mask" v-if="closeRealName" @click="closeRealName=false">
			<div class="con" v-if="true">
				<div class="img">
					<img src="./assets/img/facecard/popup_img03@3x.png" alt="">
				</div>
				<h3>实名提示</h3>
				<p>实名一下，开通免审额度</p>
				<div class="bottom bt1">
					<p @click="closeRealName=false" class="br1">取消</p>
					<p @click="routerRealName">
						<span v-if="RealNameStatus===0">去实名</span>
						<span v-else-if="RealNameStatus===1">去补偿实名</span>
					</p>
				</div>
			</div>
		</div>
		<!-- 电商补偿信息弹层 -->
		<div class="mask" v-if="dsWarrant" @click="dsWarrant=false">
			<div class="ds-con dianshang" v-if="dsWarrant">
				<p class="ds-context">您需要进行"电商信息补偿"，补偿该信息，可以帮您提升额度，并且还为您加速审核分期订单哦！</p>
				<div class="bottom bt1">
					<p @click="dsWarrant=false" class="br1">放弃</p>
					<p @click="goToDsWarrant">
						<span>立即加速</span>
					</p>
				</div>
			</div>
		</div>
		<!-- 运营商授权 -->
		<div class="mask" v-if="showOperator" @click="showOperator=false">
			<div class="ds-con operator-con" v-if="showOperator">
				<h3>运营商授权</h3>
				<p class="operator-context">您需要进行运营商实名认证授权，授权后才可开通颜值卡，并且还可为您加速审核分期订单哦！</p>
				<div class="bottom bt1">
					<p @click="showOperator=false" class="br1">取消</p>
					<p @click="goToOperator">
						<span>立即授权</span>
					</p>
				</div>
			</div>
		</div>
		<!-- 支付宝弹层 -->
		<div class="mask" v-if="showAilpay" @click="showAilpay=false">
			<div class="ds-con alipay-con zhifub" v-if="showAilpay">
				<h3>支付宝授权</h3>
				<p class="operator-context">您需要进行支付宝授权，授权后可以提升额度，并且还可为您加速审核分期订单哦！</p>
				<div class="bottom bt1">
					<p @click="showAilpay=false" class="br1">取消</p>
					<p @click="goToAilpay">
						<span>立即授权</span>
					</p>
				</div>
			</div>
		</div>
		<!-- 上传身份证 -->
		<div class="mask" v-if="shoIdCardDialog" @click="shoIdCardDialog=false">
			<div class="ds-con alipay-con id-card-upload" v-if="shoIdCardDialog">
				<h3>上传身份证</h3>
				<p class="operator-context">您需要完成身份证补偿流程，完成后可以为您加速审核哦！</p>
				<div class="bottom bt1">
					<p @click="shoIdCardDialog=false" class="br1">取消</p>
					<p @click="goToUploadIdCard">
						<span> 立即前往</span>
					</p>
				</div>
			</div>
		</div>
		<!-- 紧急联系人补偿 -->
		<div class="mask" v-if="showEmergencyDialog" @click="showEmergencyDialog=false">
			<div class="ds-con alipay-con" v-if="showEmergencyDialog">
				<h3>紧急联系人补偿</h3>
				<p class="operator-context">您需要完成紧急联系人补偿流程，完成后可以为您加速审核哦！</p>
				<div class="bottom bt1">
					<p @click="showEmergencyDialog=false" class="br1">取消</p>
					<p @click="goToContacts">
						<span>立即前往</span>
					</p>
				</div>
			</div>
		</div>
		<!-- 提示更新版本 -->
		<div class="mask" @click="versionUpdate=false" v-if="versionUpdate">
			<div class="updatehints">
				<img src="~@/assets/img/facecard/win_img_shengji_nor@3x.png" alt="">
				<div class="text">
					<h3>升级提示</h3>
					<p>小主，APP版本升级后,才能进行下一步</p>
					<div class="btn" @click="versionUpdate=false">我知道了</div>
				</div>
			</div>
		</div>
		<!-- 拍照 -->
		<div class="mask" v-if="showPhotograph===1 || showPhotograph===2" @click="showPhotograph=0">
			<div class="con Photograph" v-if="showPhotograph===1 || showPhotograph===2">
				<div class="img">
					<img src="./assets/img/facecard/yanzhi_popup_img03@3x.png" alt="">
				</div>
				<h2>美美的照片有利于额度提升哦！</h2>
				<p>您需要先秀一下您的颜值，拍照或者上传都可以，越好看的照片审核通过率越高哦</p>
				<div class="bottom bt1">
					<p @click="showPhotograph=0" class="br1">稍后</p>
					<p @click="goPhotographJump()">
						<span>去秀颜值</span>
					</p>
				</div>
			</div>
		</div>
		<!-- 公信宝芝麻授权 -->
		<div class="mask" v-if="showGxbZhimaAuthNeed" @click="showGxbZhimaAuthNeed=false">
			<div class="ds-con operator-con zhifub">
				<h3>芝麻信用授权</h3>
				<p class="operator-context">您需要进行"芝麻信用授权"补充，补充该信息可以帮您提升额度，并且为您加速审核分期订单哦！</p>
				<div class="bottom bt1">
					<p @click="showGxbZhimaAuthNeed=false" class="br1">取消</p>
					<p @click="goGxbZhimaAuthNeed">
						<span>立即授权</span>
					</p>
				</div>
			</div>
		</div>
		<!-- 3.7.1新增选择相册和拍照start -->
		<div class="mask" v-if="showPhotograph2">
			<div class="photoAndPhotograph">
				<div class="option">
					<p @click="goPhotograph(2)">从相册选择</p>
					<p class="bt1" @click="goPhotograph(3)">拍照</p>
				</div>
				<div class="cancel" @click="showPhotograph2=false">
					<p>取消</p>
				</div>
			</div>
		</div>
		<!-- 3.7.1新增选择相册和拍照end -->
    <hadNewUserCoupon :showNewUserDialog="showHadCouponDialog"></hadNewUserCoupon>
	</div>
</template>

<script>
import { isRegisterOk, registerWxSdk } from 'wxjssdk'
import { mapMutations, mapGetters, mapState } from 'vuex'
import Login from '@/components/Login/Login'
import OldEntery from '@/components/oldEntry/oldEntry'
import Loading from '@/components/Loading/Loading'
import shareGuideModel from '@/components/WxGuideModel/WxGuideModel'
import initLinkme from '@/module/initLinkme'
import hadNewUserCoupon from '@/views/ShoppingMall/hadNewUserCoupon'

export default {
  name: 'App',
  data () {
    return {
      loadingStauts: 0,
      wxGuideModelStatus: true,
      closeRealName: false, // 实名弹框
      RealNameStatus: 0,
      dsWarrant: false, // 电商授权弹层
      versionUpdate: false, // 版本提示弹层
      showOperator: false, // 运营商弹层
      showAilpay: false, // 支付宝弹层
      shoIdCardDialog: false, // 提示身份证弹层
      showEmergencyDialog: false, // 紧急联系人弹层
      showPhotograph: 0, // 拍照
      showGxbZhimaAuthNeed: false, // 公信宝授权
      zhimaAuthUrl: '', // 芝麻授权跳转地址
      showPhotograph2: false,
      alive: true,
      excludeArr: []
    }
  },
  mounted () {
    var u = navigator.userAgent
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    if (isIOS) {
      console.log(screen.height, 22222)
      if ((screen.height === 812 && screen.width === 375) || (screen.height === 896 && screen.width === 414)) {
        // 是iphoneX或者xs
        // let tab = document.getElementsByClassName('tabColumn')[0]
        // tab.style.paddingBottom = '20px'
        // this.isIphoneX = true
        this.setIphoneX(true)
      }
    }
  },
  created () {
    this.setLinkMeLoadStatus(false)
    this.watchCommonEvent()
    this.bindEvent()
    this.setUserInfo()
    this.registerLinkMe()
    this.setChannel()
    if (process.env.VUE_APP_SERVEN === 'DEV') {
      this.registerVconsole()
    }
    global.appIns = this
  },
  computed: {
    ...mapState(['loginChannel', 'oldEntryChannel', 'showHadCouponDialog']),
    ...mapGetters(['userToken', 'userId'])
  },
  methods: {
    bindEvent () {
      global.vbus.$on('toast_show', resData => {
        this.$toast(resData)
      })
      global.vbus.$on('loading_show', status => {
        if (status) {
          this.loadingStauts += 1
        } else {
          if (this.loadingStauts > 0) {
            this.loadingStauts -= 1
          }
        }
      })
      global.vbus.$on('wxGuideModel_show', status => {
        this.wxGuideModelStatus = status
      })
    },
    setChannel () {
      let channelOrigin = this.getQueryString('ADTAG')
      let channelArr = channelOrigin && channelOrigin.split('.')
      let channel = (channelArr && channelArr[channelArr.length - 1])
      if (parseInt(channel) === Number(channel)) {
        sessionStorage.channel = channel
        this.setLoginChannel(channel)
      } else if (sessionStorage.channel) {
        this.setLoginChannel(sessionStorage.channel)
      } else {
        this.setLoginChannel('339') // 最后的默认渠道
      }
    },
    setUserInfo () {
      let token = this.getQueryString('token')
      if (token) {
        if (token.indexOf('WB_FQSC_') !== -1) {
          this.muUserMetaInfo({ token: null, userId: null })
          this.muUserMark(token)
        } else {
          this.muUserMetaInfo({
            token
          })
          this.muUserMark(null)
        }
      }
    },
    registerWxSdk () {
      if (!isRegisterOk) {
        const s = document.createElement('script')
        s.type = 'text/javascript'
        s.src = 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js'
        document.getElementsByTagName('head')[0].appendChild(s)
        s.onload = function () {
          registerWxSdk(wx, ['onMenuShareTimeline', 'onMenuShareAppMessage'], false)
        }
      }
    },
    registerLinkMe () {
      const s = document.createElement('script')
      let ctx = this
      s.type = 'text/javascript'
      s.src = 'https://static.lkme.cc/linkedme.min.js'
      document.getElementsByTagName('head')[0].appendChild(s)
      s.onload = function () {
        ctx.setLinkMeLoadStatus(true)
        initLinkme({ feature: 'bargain' })
      }
    },
    registerVconsole () {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://cdn.basestonedata.com/jlib/vconsole.last.min.js'
      document.getElementsByTagName('body')[0].appendChild(script)
      script.onload = () => {
        new VConsole() // eslint-disable-line
      }
    },
    /**
     * 颜值卡开通 用户授权
     *
     */
    watchCommonEvent () {
      global.vbus.$on('setRealName', status => {
        this.RealNameStatus = status
        this.closeRealName = true
      })
      global.vbus.$on('setDsDialog', status => {
        this.dsWarrant = status
      })
      global.vbus.$on('setUpdateDialog', status => {
        this.versionUpdate = status
      })
      global.vbus.$on('setOperatorDialog', status => {
        this.showOperator = status
      })
      global.vbus.$on('setAilpayDialog', status => {
        this.showAilpay = status
      })
      global.vbus.$on('setIdCardDialog', status => {
        this.shoIdCardDialog = status
      })
      global.vbus.$on('setEmergencyDialog', status => {
        this.showEmergencyDialog = status
      })
      global.vbus.$on('setGxbZhimaAuthNeed', status => {
        // 芝麻授权
        this.showGxbZhimaAuthNeed = true
        this.zhimaAuthUrl = status
      })
    },
    // 实名认证
    routerRealName () {
      this.$router.push({
        name: 'UserCardAuth',
        query: {
          routerData: JSON.stringify({
            name: 'Facescard'
          }),
          method: 'replace',
          type: 'router',
          noCache: Date.now()
        }
      })
    },
    // 跳转电商授权
    goToDsWarrant () {
      this.dsWarrant = false
      let envDomain = ''
      if (process.env.VUE_APP_SERVEN === 'PROD') {
        envDomain = 'h5'
      } else {
        envDomain = 'h5-dev'
      }
      global.vbus.$emit('loading_show', true)
      let jumpUrl = `https://open.shujumohe.com/box/tb?box_token=061D17B5FE9447348C98A2247961BDF0&cb=https://${envDomain}.xiaoxiangyoupin.com/purse/home/facescard`
      location.href = jumpUrl
    },
    // 跳转运营商授权
    goToOperator () {
      this.showOperator = false
      this.$router.push({
        name: 'OperatorAccredit',
        query: {
          routerData: JSON.stringify({
            name: 'Facescard'
          }),
          method: 'replace',
          type: 'router',
          noCache: Date.now()
        }
      })
    },
    // 跳转身份证上传
    goToUploadIdCard () {
      this.shoIdCardDialog = false
      this.$router.push({
        name: 'IdCardAuth',
        query: {
          routerData: JSON.stringify({
            name: 'Facescard'
          }),
          method: 'replace',
          type: 'router',
          noCache: Date.now()
        }
      })
    },
    goToContacts () {
      // 跳转紧急联系人补偿
      this.showEmergencyDialog = false
      this.$router.push({
        name: 'EmergencyContact',
        query: {
          routerData: JSON.stringify({
            name: 'Facescard'
          }),
          method: 'replace',
          type: 'router',
          noCache: Date.now()
        }
      })
    },
    // 公信宝芝麻授权
    goGxbZhimaAuthNeed () {
      this.showGxbZhimaAuthNeed = false
      this.$router.push({
        name: 'ZhiMaAuth',
        query: {
          routerData: JSON.stringify({
            name: 'Facescard'
          }),
          method: 'replace',
          type: 'router',
          noCache: Date.now()
        }
      })
    },
    ...mapMutations(['setLinkMeLoadStatus', 'muUserMetaInfo', 'setIphoneX', 'muUserMark', 'setLoginChannel', 'setYoumenChannel'])
  },
  components: {
    Login,
    Loading,
    shareGuideModel,
    OldEntery,
    hadNewUserCoupon
  },
  beforeRouteEnter (to, from, next) {
    next()
  }
}
</script>
<style lang='scss'>
@import "assets/scss/base.scss";
@import "assets/scss/border.scss";
</style>
<style lang="scss">
#app {
  font-family: "PingFangSC-Regular", "miui", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body.modal-open {
  position: fixed;
  width: 100%;
}
body {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  width: 100%;
}
img {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  height: 100%;
}
.pb68 {
  padding-bottom: 68px;
}

.mb68 {
  margin-bottom: 68px;
}

.clearfix:after {
  content: "";
  display: block;
  visibility: hidden;
  height: 0;
  clear: both;
}
.an-left-right {
  animation: left-right 0.6s;
}
@keyframes left-right {
  0% {
    transform: translateX(-20px);
  }
  20% {
    transform: translateX(20px);
  }
  40% {
    transform: translateX(-20px);
  }
  60% {
    transform: translateX(20px);
  }
  80% {
    transform: translateX(-20px);
  }
  100% {
    transform: translateX(20px);
  }
}
.loading,
.login {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 110%;
  z-index: 1999;
  overflow-y: scroll;
}
.login {
  background:rgba(255,255,255,1);
}
.loading__container {
  background:rgba(255,255,255,1);
}
.loading__container,
.login__container {
  margin: 80px auto 0;
  top: 80px;
  width: 100%;
  display: table;
  height: 100%;
  padding: 60px 60px 0 60px;
  border-radius: 0.066667rem;
  color: white;
  box-sizing: border-box;
  text-align: center;
  background: #fff;
  z-index: 1;
}
body {
  [class*="van-hairline"]::after {
    border-color: #e6e6e6;
  }
  .van-dialog {
    width: 540px;
    border-radius: 24px;
    top: 40%;
    [class*="van-hairline"]::after {
      border-color: #d0d0d0;
    }
    &__header {
      font-size: 34px;
      font-weight: 500;
    }
    &__confirm, &__confirm:active{
      color: #507DAF;
    }
    &__cancel {
      color: #636363;
    }
    &__message {
      color: #333;
      font-size: 28px;
      border-radius: 24px;
      text-align: center;
    }
    .van-button {
      &::before {
        border-color: #d0d0d0;
      }
      .van-button__text {
        font-size: 32px;
      }
    }
    .van-button--large {
      height: 88px;
      line-height: 88px;
    }
    .van-dialog__cancel {
      .van-button__text {
        color: #636363;
      }
    }
  }
  .van-picker-column__item {
    color: #939393;
  }
  .van-picker-column__item--selected {
    color: #333;
  }
  .van-popup {
    border-radius: 24px;
  }
}

</style>
<style lang="scss" scoped>
.tab-column {
  position: fixed;
  width: 100%;
  background: #eee;
  bottom: 0;
  left: 0;
  ul {
    font-size: 0;
  }
  li {
    display: inline-block;
    font-size: 0.266667rem;
    width: 25%;
    text-align: center;
    line-height: 1.066667rem;
  }
}
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99999;
  text-align: center;
  // 3.7.1新增相册和拍照
  .photoAndPhotograph {
    font-size: 0.426667rem;
    font-family: PingFangSC-Regular;
    color: #0076ff;
    position: absolute;
    bottom: 0;
    width: 100%;
    .option {
      background: #fff;
      width: 9.466667rem;
      border-radius: 0.266667rem;
      margin: 0 auto;

      p:first-child {
        position: relative;
        height: 1.333333rem;
        line-height: 1.333333rem;
      }
      p:nth-child(2) {
        height: 1.32rem;
        line-height: 1.32rem;
      }
    }
    .cancel {
      background: #fff;
      width: 9.466667rem;
      border-radius: 0.266667rem;
      height: 1.333333rem;
      margin: 0.266667rem auto;
      line-height: 1.333333rem;
    }
  }
  .con {
    width: 7.866667rem;
    height: 7.16rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: #fff;
    border-radius: .32rem;
    .img {
      width: 100%;
      height: 3.2rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    h3 {
      margin: 0.733333rem 0 0.48rem;
      color: #333;
      font-size: 0.426667rem;
      font-weight: 600;
    }
    > p {
      font-size: 0.426667rem;
      margin-bottom: 0.8rem;
      color: #333;
    }
    .bottom {
      height: 1.173333rem;
      line-height: 1.173333rem;
      width: 100%;
      font-size: 0.4rem;
      position: absolute;
      bottom: 0;
      left: 0;
      .centerLine {
        position: absolute;
        height: 100%;
        width: 0.013333rem;
        background: #e5e5e5;
        left: 50%;
        top: 0;
      }
      p:first-child {
        width: 50%;
        float: left;
        color: #636363;
        font-size: 32px;
        &:after {
          border-color: #d0d0d0;
        }
      }
      p:nth-child(2) {
        width: 50%;
        color: #507daf;
        float: left;
        font-size: 32px;
      }
      &:before {
        border-color: #d0d0d0;
      }
    }
  }

  .ds-con {
    width: 7.866667rem;
    height: 4.7rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%,-50%,0);
    // margin: auto;
    background: #fff;
    border-radius: .32rem;
    h3 {
      margin: 0.733333rem 0 0.48rem;
      color: #333;
      font-size: 0.426667rem;
      font-weight: 600;
    }
    .ds-context {
      font-size: 0.373333rem;
      padding: 1rem .533333rem;
      line-height: 0.5rem;
      border-radius: 24px;
      font-size: 30px;
      color: #333;
      text-align: justify;
    }
    .bottom {
      height: 1.173333rem;
      line-height: 1.173333rem;
      width: 100%;
      font-size: 0.4rem;
      position: absolute;
      bottom: 0;
      .centerLine {
        position: absolute;
        height: 100%;
        width: 0.04rem;
        background: #e5e5e5;
        left: 50%;
        top: 0;
        -webkit-transform: scaleX(0.5);
        transform: scaleX(0.5);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
      }
      p:first-child {
        width: 50%;
        float: left;
        color: #636363;
        height: 100%;
        &:after {
          border-color: #d0d0d0;
        }
      }
      p:nth-child(2) {
        width: 50%;
        color: #507daf;
        float: left;
        height: 100%;
      }
      &:before {
        border-color: #d0d0d0;
      }
    }
  }
  .operator-con {
    height: 4.91rem;
    .operator-context {
      font-size: 0.373333rem;
      padding: 0rem 0.533333rem 0.6rem;
      line-height: 0.5rem;
      text-align: justify;
    }
  }
  .alipay-con {
    .operator-context {
      font-size: 0.373333rem;
      padding: 0rem .533333rem .666667rem;
      line-height: 0.5rem;
      text-align: justify;
      color: #333;
    }
  }
  .id-card-upload {
    height: 350px;
    box-sizing: border-box;
  }
  .zhifub {
    height: 380px;
    box-sizing: border-box;
  }
}
// 升级提示
.updatehints {
  width: 7.866667rem;
  height: 7.706667rem;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -3.853333rem;
  margin-left: -3.933333rem;
  img {
    width: 100%;
    height: 3.186667rem;
  }
  .text {
    background: #fff;
    width: 100%;
    height: 4.786667rem;
    border-bottom-left-radius: 0.266667rem;
    border-bottom-right-radius: 0.266667rem;
    h3 {
      font-size: 0.426667rem;
      color: #333;
      font-weight: 600;
      padding: 0.533333rem 0 0.586667rem 0;
    }
    p {
      font-size: 0.373333rem;
      color: #636363;
      line-height: 0.533333rem;
    }
    .btn {
      width: 6.533333rem;
      height: 1.066667rem;
      background: linear-gradient(
        180deg,
        rgba(245, 75, 120, 1),
        rgba(237, 20, 86, 1)
      );
      border-radius: 0.106667rem;
      margin: 0.8rem auto;
      color: #fff;
      line-height: 1.066667rem;
      font-size: 0.4rem;
    }
  }
}
.Photograph {
  height: 7.546667rem !important;
  h2 {
    padding: 0.613333rem 0 0.48rem;
    font-size: 0.426667rem;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #333;
  }
  > p:nth-child(3) {
    font-size: 0.373333rem;
    font-family: PingFangSC-Regular;
    color: rgba(51, 51, 51, 1);
    line-height: 0.533333rem;
    padding: 0 0.533333rem 0.8rem;
    box-sizing: border-box;
    margin-bottom: 0 !important;
    text-align: left;
    span {
      color: #333;
    }
  }
  > p:nth-child(4) {
    font-family: PingFangSC-Medium;
    font-size: 0.346667rem;
    color: #ed145b;
    text-align: center;
    margin-bottom: 0 !important;
    padding-bottom: 0.533333rem;
  }
}
</style>
