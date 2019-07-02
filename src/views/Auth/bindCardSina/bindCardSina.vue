<template>
  <div id="Main">
    <div class="part1">
      <div class="inputContainer lineh color93">
        <span class="userName">{{userName | hideName}}</span>
      </div>
      <div class="inputContainer lineh color93">
        <span class="userIdCardNum">{{userIdCardNum | hideInfo(11)}}</span>
      </div>
      <div class="inputContainer lineh color93">
        <span class="phoneNumBox">{{userPhoneNum}}</span>
      </div>
    </div>
    <div class="part2">
      <!--选择省市地区-->
      <div class="infobox" style="margin-top: 20px;">
        <div class="chooseArea" @click="getProvince">
          <input type="tel" placeholder="请选择开户省" v-model="provinceSina" onfocus="this.blur()">
          <div class="rightIcon"></div>
        </div>
        <div class="chooseArea" @click="getCity">
          <input type="tel" placeholder="请选择开户市" v-model="citySina" onfocus="this.blur()">
          <div class="rightIcon"></div>
        </div>
      </div>
      <div class="inputContainer">
        <span class="inputBox">
          <input type="number" class="inputStyle" v-model.trim="bankCardNum" placeholder="请输入银行卡号">
        </span>
      </div>
      <div class="inputContainer" @click="toBankList">
        <span class="bankName">
          <input type="text" class="inputStyle" v-model="bankNameSina" placeholder="请选择开户行" onfocus="this.blur()">
        </span>
      </div>
    </div>
    <div class="part3">
      <div class="inputContainer">
        <span class="phoneNumBox">
          <input type="number" class="inputStyle" v-model.trim="phoneNum" placeholder="请输入银行预留手机号"/>
        </span>
      </div>
      <div class="inputContainer">
        <span class="msgNumBox">
          <input type="number" class="inputStyle msg" style="width: 40%;" v-model.trim="msg" placeholder="请输入验证码"/>
        </span>
        <button class="btn" @click="getSMSCode" v-bind:class="{ gray: isDisabled }" :disabled="isDisabled">{{btntext}}</button>
      </div>
    </div>
    <div class="applyBox" style="margin-top: .4rem ">
      <span @click="confirmToggleSelect" class="icon" :class="{'iconChecked':confirmIsChecked,'iconNotChecked': !confirmIsChecked}"></span>
      <div class="serviceBox">
        <a @click="confirmToggleSelect">阅读并同意</a>
        <a @click="toService('1')" class="service">《新浪支付用户服务协议》</a>
        <a @click="toService('2')" class="service">《新浪支付快捷支付协议》</a>
      </div>
    </div>
    <div class="submit">
      <button class="submitBtn" :disabled="subtnDisabled" @click="submitInfo">信息提交</button>
    </div>
    <div class="modal spinnerModal" v-show="spinnerIsShow">
      <div class="spinnerBox">
        <van-loading type="spinner" color="white" />
      </div>
    </div>
  </div>
</template>

<script>
// import { getQueryString } from '../modules/common'
// import { interfaces, ajaxReq } from '../modules/api'
// import { apthis.$toast, apSetTitle, backApp } from '../modules/appbridge'
import { getQueryString } from '@/module/common'
import { mapState } from 'vuex'
// import { this.$toast } from 'vant'
export default {
  name: 'BindCardSina',
  data () {
    return {
      token: '',
      userName: '',
      userIdCardNum: '',
      userPhoneNum: '',
      bankCardNum: '',
      phoneNum: '',
      msg: '',
      btntext: '获取验证码',
      isDisabled: false,
      subtnDisabled: false,
      spinnerIsShow: false,
      confirmIsChecked: true,
      timer: null,
	    cb: '', // 成功回调地址
	    cbMethod: '', // 回跳方式 push/replace 默认replace
	    cbType: '', // 回跳类型 router/url 默认url
	    cbrouterData: ''// 回跳类型为router时回跳路由数据
    }
  },
  methods: {
    toService (serverNum) {
      let url
      if (serverNum === '1') {
        url = 'https://cdn.xiaoxiangyoupin.com/dev/sinaBindCard/static/sinaPayUserService.html'
        location.href = url
      } else {
        url = 'https://cdn.xiaoxiangyoupin.com/dev/sinaBindCard/static/sinaPayService.html'
	      location.href = url
      }
    },
    confirmToggleSelect () {
      this.confirmIsChecked = !this.confirmIsChecked
    },
    countDown () {
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
    getSMSCode () {
      if (!this.confirmIsChecked) {
        this.$toast('请勾选下方协议')
      } else if (!this.provinceSina) {
        this.$toast('请选择开户省份')
      } else if (!this.citySina) {
        this.$toast('请选择开户城市')
      } else if (this.bankCardNum.length < 16) {
        this.$toast('请输入正确的银行卡号')
      } else if (!this.bankNameSina) {
        this.$toast('请选择开户行')
      } else if (!this.phoneNum) {
        this.$toast('请输入手机号')
      } else {
        let params = {
          token: this.token,
          bankCode: this.bankCodeSina,
          bankName: this.bankNameSina,
          bankAccountNo: this.bankCardNum,
          phoneNo: this.phoneNum,
          provinceName: this.provinceSina,
          cityName: this.citySina,
          provinceCode: this.provinceCodesSina,
          cityCode: this.cityCodesSina
        }
	      this.$api['bindCardZhiMaAuth/bindingBankCard'](params).then(res => {
		      this.$toast('短信发送成功')
		      this.countDown()
	      }).catch((err) => {
		      this.$toast(err)
	      })
      }
    },
    submitInfo () {
      if (!this.confirmIsChecked) {
        this.$toast('请勾选上方协议')
      } else if (!this.msg) {
        this.$toast('请输入短信验证码')
      } else {
        let reqdata = {
          token: this.token,
          validCode: this.msg
        }
	      this.$api['bindCardZhiMaAuth/bindingBankCardAdvance'](reqdata).then(res => {
		      this.$toast('绑卡成功')
          this.backHandle()
	      }).catch((err) => {
		      this.$toast(err)
	      })
      }
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
    toBankList () {
      this.$router.push({ name: 'BankListSina' })
    },
    getProvince () {
      this.$router.push({ name: 'ProvinceSina' })
    },
    getCity () {
      if (this.provinceSina) {
        this.$router.push({ name: 'CitySina' })
      } else {
        this.$toast('请先选择省份')
      }
    },
    getUserInfo () {
      this.$api['bindCardZhiMaAuth/getAuthInfo']({
	        token: this.token || this.userToken
      }).then(res => {
        this.userName = res.name
        this.userIdCardNum = res.idcard
        this.userPhoneNum = res.phone
      }).catch((err) => {
        this.$toast(err)
      })
    }

  },
  computed: {
    ...mapState(['bankNameSina', 'bankCodeSina', 'provinceSina', 'citySina', 'provinceCodesSina', 'cityCodesSina'])
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
    hideInfo (vals, m) {
      if (vals) {
        return vals.replace(vals.substr(3, m), '***********'.substring(0, m))
      }
    }
  },
  mounted () {
    this.token = this.userToken
    this.getUserInfo()
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
  .icon{
    display: inline-block;
    width: .3466rem;
    height: .3466rem;
    margin:.066rem .26667rem 0 .4rem;
  }
  .iconChecked{
    background: url("~@/assets/img/list_rd_select_sel@3x.png") no-repeat 0 0 ;
    background-size: contain;
  }
  .iconNotChecked{
    background: url("~@/assets/img/list_rd_select_nol@3x.png") no-repeat 0 0 ;
    background-size: contain;
  }
  .applyBox{
    width: 100%;
    display: flex;
    align-items: flex-start;
    margin-top: .4rem;
  }
  .serviceBox{
    // width: 8.5866rem;
    height: 1.3333rem;
    font-size: .32rem;
    color: #333;
    line-height: 1.5;
  }
  .service{
    color: #576daf;
  }
  .rightIcon {
    position: absolute;
    top: 24px;
    right: .2rem;
    width: 44px;
    height: 44px;
    background: url("~@/assets/img/list_icon_enter_nol@3x.png") no-repeat;
    background-size: contain;
  }
  .chooseArea {
    float: left;
    width: 45%;
    height: 84px;
    line-height: 84px;
    background: #FFFFFF;
    position: relative;
    padding-left: .5rem;
      font-size: .373rem;
  }
  .chooseArea input {
    height: 1.2rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 0;
    border: 0;
    -webkit-user-modify: read-write-plaintext-only;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    outline: 0;
    line-height: 1.2rem;
    font-size: inherit;
    width: 100%;
    padding: 0;
    color: inherit;
    font: inherit;
    margin: 0;
  }
  .infobox {
    position: relative;
    width: 100%;
    background: #FFFFFF;
    border-bottom: 1px solid #e6e6e6;
    overflow: hidden;
  }
  .submit {
    width: 9.46rem;
    height: 1.173rem;
    margin: 1rem auto;
    line-height: 1.173rem;
    text-align: center;
    background: #F54B78;
    color: #fff;
    border-radius: 4px;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  .btn {
    width: 180px;
    height: 0.6667rem;
    line-height: 0.6667rem;
    float: right;
    margin: .26666rem;
    border: solid 1px #f54b78;
    outline: none;
    border-radius: 4px;
    color: #fff;
    font-size: .32rem;
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
    font-size: 32px;
  }
  span::before {
    content: '';
    width: .773rem;
    height: .773rem;
    display: inline-block;
    float: left;
    margin: .2rem .2rem 0 .2rem;
  }
  .bankName::before {
    background: url("~@/assets/img/bindcard/list_icon_choose_bank@3x.png") no-repeat 0 0;
    background-size: contain;
  }
  .inputBox::before {
    background: url("~@/assets/img/bindcard/list_icon_card_number@3x.png") no-repeat 0 0;
    background-size: contain;
  }
  .userName::before {
    background: url("~@/assets/img/bindcard/list_icon_name@3x.png") no-repeat 0 0;
    background-size: contain;
  }
  .userIdCardNum::before {
    background: url("~@/assets/img/bindcard/list_icon_identity_card@3x.png") no-repeat 0 0;
    background-size: contain;
  }
  .msgNumBox::before {
    background: url("~@/assets/img/bindcard/list_icon_verification_code@3x.png") no-repeat 0 0;
    background-size: contain;
  }
  .phoneNumBox::before {
    background: url("~@/assets/img/bindcard/list_icon_card_phone_number@3x.png") no-repeat 0 0;
    background-size: contain;
  }
  .bankName::after {
    content: '';
    width: 44px;
    height: 44px;
    display: inline-block;
    background: url("~@/assets/img/list_icon_enter_nol@3x.png") no-repeat 0 0;
    background-size: contain;
    float: right;
    margin: .3rem 20px 0 0;
  }
  .lineh{
    line-height: 1.173rem;
    color: #999999;
  }
  .inputStyle {
    width: 70%;
    height: .64rem;
    border: none;
    outline: none;
    font-size: .36rem;
    background: transparent;
    padding: .2667rem 0;
  }
  .msg {
    width: 50%;
  }
  .part2, .part3 {
    margin-top: .266rem;
  }
  .inputContainer {
    height: 1.173rem;
    line-height: 1.173rem;
    border-bottom: 1px solid #e6e6e6;
    background: #fff;
    font-size: .373rem;
    color: #333;
  }
  ::-webkit-input-placeholder{
    color: #939393;
    font-size: .373rem;
  }
#Main {
  background: #f2f2f2;
  .part1 {
    margin-top: 20px;
    float: left;
    width: 100%;
    margin-bottom: 20px;
  }
  .part2 {
    margin-top: 0;
  }
  .spinnerModal {
    height: 84px;
    line-height: 84px;
    margin-top: 120px;
  }
}
.color93 {
  color: #939393;
}
</style>
