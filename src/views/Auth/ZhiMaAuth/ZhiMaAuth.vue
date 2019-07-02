<template>
  <div class="zhimaAuth tplRoot">
    <div class="wraper line mt20">
      <div class="icon icon-phone"></div>
      <input class="input" type="text" v-model="mobileNum" readonly>
    </div>
    <div class="wraper">
      <div class="icon icon-msm"></div>
      <input v-model="sms" class="input longerInput" type="text" :placeholder="channelName">
      <button @click="getNextCode" class="btn msm-btn" :disabled="isDisabed" :class="{msmCutdown:isDisabed}">{{!isDisabed ? btnMsg : btnMsg + 'S'}}</button>
    </div>
    <div class="btn auth-btn" @click="submitChannelSms">授权</div>
    <div class="service">
      <span class="checkbox" @click="toggleSelect" :class="{checked:checked,notCheck:!checked}"></span>
      <span @click.self="toggleSelect">我已经阅读并同意<a class="service-link" :href='serviceHref'>《授权服务协议》</a></span>
    </div>
    <div class="modal" v-show="modalIsShow">

      <div class="graphImgWraper" v-show="graphImgWraperIsShow">
        <p class="title">图片验证码</p>
        <p class="sub-title">请输入图片中对应的验证码</p>
        <div class="graph-container">
          <input v-model="cpc" type="text" class="graph-input" placeholder="请输入验证码">
          <div class="graph-img-box" @click="refreshImgCode">
            <img :src=src alt="点击刷新">
          </div>
        </div>
        <div class="submitBtn" @click="getChannelMsm">提交</div>
      </div>

      <div class="msmWraper" v-show="msmWraperIsShow">
        <p class="title">短信验证码</p>
        <p class="sub-title mb16">请输入芝麻信用短信验证码</p>
        <p class="mobile-tip">手机号码：{{zhimaPhoneNum|hidePhoneNum}}</p>
        <div class="msm-input">
          <input v-model="smszhima" type="text" placeholder="请输入验证码">
        </div>
        <div class="submitBtn" @click="submitZhimaSms">提交</div>
      </div>
    </div>

  </div>

</template>

<script>
import { getQueryString } from '@/module/common'
export default {
  name: 'zhimaAuth',
  data () {
    return {
      token: '',
      btnMsg: '获取验证码',
      checked: true,
      isDisabed: false,
      modalIsShow: false,
      graphImgWraperIsShow: false,
      src: '',
      tk: '',
      cpc: '',
      sms: '',
      smszhima: '',
      msmWraperIsShow: false,
      mobileNum: '',
      zhimaPhoneNum: '',
      channel: '',
      channelName: '请输入验证码',
      serviceHref: 'https://cdn.xiaoxiangyoupin.com/dev/zhimaAuth/zhimaAuthService.html',
      timer: null,
      cb: '', // 成功回调地址
      cbMethod: '', // 回跳方式 push/replace 默认replace
      cbType: '', // 回跳类型 router/url 默认url
      cbrouterData: ''// 回跳类型为router时回跳路由数据
    }
  },
  methods: {
    /* 提交芝麻短信验证码 */
    submitZhimaSms () {
      let params = {
        token: this.token,
        sms: this.smszhima,
        tk: this.tk
      }
	    this.$api['bindCardZhiMaAuth/submitZhimaSms'](params).then(res => {
		    this.$toast('授权成功')
		    this.modalIsShow = false
		    this.msmWraperIsShow = false
		    this.backHandle()
      }).catch(err => {
		    this.$toast(err)
	    })
    },
    /* 提交渠道验证码 */
    submitChannelSms () {
      if (!this.checked) {
        this.$toast('请先勾选授权服务协议')
        return
      }
      let params
      if (this.tk) {
        params = {
          token: this.token,
          sms: this.sms,
          tk: this.tk
        }
      } else {
        params = {
          token: this.token,
          sms: this.sms
        }
      }
	    this.$api['bindCardZhiMaAuth/submitChannelSms'](params).then(res => {
		    this.tk = res.tk
		    this.zhimaPhoneNum = res.zhimaMobile
		    if (res.zhimaAuthFlag) {
			    this.$toast('授权成功')
			    this.backHandle()
		    } else {
			    this.modalIsShow = true
			    this.msmWraperIsShow = true
		    }
      }).catch(err => {
		    this.$toast(err)
	    })
    },
    /* 需要通过cpc图形验证码获取渠道验证码 */
    getChannelMsm () {
      let params
      if (!this.cpc) {
        this.$toast('请输入图形验证码')
        return
      }
      if (this.tk) {
        params = {
          token: this.token,
          tk: this.tk,
          cpc: this.cpc
        }
      } else {
        params = {
          token: this.token,
          cpc: this.cpc
        }
      }
	    this.$api['bindCardZhiMaAuth/getChannelSms'](params).then(res => {
        if (res.heads.code === 200) {
          this.tk = res.body.tk || ''
          this.modalIsShow = false
          this.graphImgWraperIsShow = false
          this.cutdown()
        } else {
          this.$toast(res.heads.message)
          this.refreshImgCode()// 图形验证码填写错误后刷新验证码
        }
      }).catch(err => {
		    this.$toast(err)
	    })
    },
    /* 刷新图形验证码 */
    refreshImgCode () {
      this.cpc = ''
	    this.$api['bindCardZhiMaAuth/refreshImgCode']({
		    token: this.token
	    }).then(res => {
        let resdt = res.captcha
		    this.src = `data:image/jpg;base64,${resdt}`
		    this.tk = res.tk
      }).catch(err => {
		    this.$toast(err)
	    })
    },
    /* 获取渠道验证码，判断是否需要提交图形验证码，需要则进入下一步继续获取渠道验证码，否则获取成功 */
    getNextCode () {
      this.cpc = ''
      if (!this.checked) {
        this.$toast('请先勾选授权服务协议')
        return
      }
	    this.$api['bindCardZhiMaAuth/getChannelSms']({
		    token: this.token
	    }).then(res => {
		    if (res.heads.code === 200) {
		      if (res.body.captcha) {
		        let resdt = res.body
		        // let captcha=resdt.captcha
		        this.src = `data:image/jpg;base64,${resdt.captcha}`
		        this.tk = resdt.tk || ''
		        this.modalIsShow = true
		        this.graphImgWraperIsShow = true
		      } else {
		        this.cutdown()
		      }
		    } else {
		      this.$toast(res.heads.message)
		    }
      }).catch(err => {
		    this.$toast(err)
	    })
    },
    getChannel () {
	    this.$api['bindCardZhiMaAuth/channel']({
		    token: this.token
	    }).then(res => {
        let resdt = res.channel
		    this.channelName = `请输入${resdt}验证码`
		    this.serviceHref = `https://cdn.xiaoxiangyoupin.com/dev/zhimaAuth/zhimaAuthService.html?channelName=${resdt}`
      }).catch(err => {
		    this.$toast(err)
	    })
    },
    toggleSelect () {
      this.checked = !this.checked
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
    cutdown () {
      this.isDisabed = true
      let sec = 60
      this.timer = setInterval(() => {
        this.btnMsg = sec--
        if (sec < 0) {
          clearInterval(this.timer)
          this.isDisabed = false
          this.btnMsg = '重新获取'
        }
      }, 1000)
    },
    getPhoneNum () {
	    this.$api['bindCardZhiMaAuth/getPhoneNum']({
		    token: this.token
	    }).then(res => {
		    this.mobileNum = res.data.loginName
      })
    },
    checkZhiMaAuth () {
      this.$api['bindCardZhiMaAuth/checkZhiMaAuth']({
	      token: this.token
      }).then(res => {
	      if (String(res.data) === '1') {
		      this.$toast('您已授权芝麻信用')
	      }
      }).catch(err => {
	      this.$toast(err)
      })
    }
  },
  filters: {
    hidePhoneNum (val) {
      if (val) {
        return val.replace(val.substr(3, 4), '****')
      }
    }
  },
  mounted () {
    this.checkZhiMaAuth()
    this.getPhoneNum()
    this.getChannel()
    this.cb = decodeURIComponent(getQueryString('cb')) // 回跳地址 并解码
    this.cbMethod = getQueryString('method') || 'replace'// 回跳方式 push/replace 默认replace
    this.cbType = getQueryString('type') || 'url' // 回跳类型 router/url 默认url
    this.cbrouterData = getQueryString('routerData')// 回跳类型为router时回跳路由数据
  },
  created () {
	    this.token = this.userToken
  },
  destroyed () {
    clearInterval(this.timer)
  }

}
</script>
<style scoped  lang="scss">
  $base-rem:1rem;
  @function r($n){
    @return ($n/75)*$base-rem
  }
  .spinnerBox{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.5rem;
    height: 1.5rem;
    background: rgba(0, 0, 0, 0.1);
    border-radius: r(6);
  }
  .zhimaAuth {
    background: #f2f2f2;
  }
  .modal{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow-y: scroll;
    background: rgba(0,0,0,.5);
    .msmWraper{
      width: r(590);
      height: r(502);
      background: #fff;
      border-radius: r(24);
      margin: r(288) auto 0;
      overflow: hidden;
      position: relative;
      .msm-input{
        // width: r(470);
        height: r(88);
        background: #f2f2f2;
        border-radius: r(8);
        margin: 0 auto;
        margin: 0 40px;
        input{
          // width: r(470);
          height: r(88);
          font-size: r(30);
          color: #333;
          background: transparent;
          border: none;
          outline: none;
          padding-left: r(30);
        }
        input::-webkit-input-placeholder{
          color: #939393;
        }
      }
      .mb16{
        margin-bottom: r(16);
      }
      .mobile-tip{
        font-size: r(28);
        color: #999999;
        text-align: center;
        margin-bottom: r(40);
      }
    }
    .graphImgWraper{
      width: r(590);
      height: r(446);
      border-radius: r(24);
      background: #fff;
      margin: r(200) auto r(946);
      overflow: hidden;
      position: relative;
      .graph-container{
        position: relative;
        // width: r(470);
        height: r(88);
        margin: 0 auto;
        background: #f2f2f2;
        border-radius: r(8);
        padding-top: 13px;
        box-sizing: border-box;
        margin: 0 40px;
        // display: flex;
        // align-items: center;
        .graph-input{
          position: absolute;
          left: r(28);
          width: r(180);
          height: r(42);
          font-size: r(30);
          color: #333;
          border: none;
          outline: none;
          background: transparent;
          margin-top: 5px;
        }
        input::-webkit-input-placeholder{
          padding-top: 10px;
          color: #939393;
        }
        .graph-img-box{
          position: absolute;
          right: r(10);
          width: r(178);
          height: r(62);
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .service{
    width: 100%;
    height: r(33);
    display: flex;
    align-items: center;
    font-size: r(24);
    color: #333;
    .checkbox{
      display: inline-block;
      width: r(26);
      height: r(26);
      margin-left:r(30);
      margin-right:r(20);
      background-size: contain;
    }
    .service-link{
      color: #507daf;
    }
    .notCheck{
      background-image: url("~@/assets/img/list_rd_select_nol@3x.png");
    }
    .checked{
      background-image: url("~@/assets/img/list_rd_select_sel@3x.png");
    }
  }
  .btn{
  text-align: center;
  }
.wraper{
  width: 100%;
  height: r(88);
  line-height: r(88);
  background: #fff;
  color: #333;
  .msm-btn{
    float: right;
    width: r(160);
    height: r(50);
    margin: r(19) r(20);
    line-height: r(50);
    border: 1px solid #f54b78;
    border-radius: r(6);
    font-size: r(24);
    color: #fff;
    background: #f54b78;
  }
  .msmCutdown{
    background: #d5d5d5;
    color: #fff;
    border: none;
  }
  .input{
      height: .64rem;
      line-height: .64rem;
    border: none;
    outline: none;
    background: transparent;
    font-family: PingFangSC-Regular;
    font-size: r(28);
    color: #333;
  }
  input::-webkit-input-placeholder{
    color: #939393;
  }
  .longerInput{
    width: 55%;
  }
  .icon{
    float: left;
    margin: r(15) r(20);
    width: r(58);
    height: r(58);
    background-size: contain;
  }
  .icon-phone{
    background-image:url("~@/assets/img/list_icon_mobile_number@3x.png");
  }
  .icon-msm{
    background-image:url("~@/assets/img/list_icon_verification_code@3x.png");
  }
}
.auth-btn{
  margin: r(111) auto r(32);
  width: r(710);
  height: r(84);
  line-height: r(88);
  background: #F54B78;
  border-radius: r(4);
  font-size: r(32);
  color: #FFFFFF;
}
  .mt20{
    margin-top: r(20);
  }
  .line{
    border-bottom: r(1)  #e6e6e6 solid;
  }
  .zhimaAuth{
    width: 100%;
    background: #f2f2f2;
  }

  .title{
    height: r(44);
    line-height: r(44);
    font-family: PingFangSC-Medium;
    font-size: r(32);
    color: #333;
    text-align: center;
    margin: r(44) 0 r(50);
  }
  .sub-title{
    height: r(40);
    line-height: r(40);
    font-size: r(28);
    color: #333;
    text-align: center;
    margin-bottom: r(30);
  }
  .submitBtn{
    width: 100%;
    height: r(88);
    border-top: #e6e6e6 r(1) solid ;
    position: absolute;
    bottom: 0;
    font-size: r(32);
    color: #507daf;
    letter-spacing: -0.77px;
    text-align: center;
    line-height: r(88);
  }
  .spinnerModal{
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0);
  }
</style>
