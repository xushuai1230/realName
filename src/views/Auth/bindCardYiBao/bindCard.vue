<template>
  <div id="Main">
    <div class="part1">
        <div class="inputContainer lineh  mt20"  :style="{'display': 'inline-block','width': '100%'}">
            <span class="userName">{{name | hideName}}</span>
        </div>
        <div class="inputContainer lineh">
            <span class="userIdCardNum">{{idNum | hideInfo(11)}}</span>
        </div>
        <div class="inputContainer mt20 bordertop1">
            <span class="inputBox">
              <input type="number" class="inputStyle" v-model.trim="cardNum" placeholder="请输入银行卡号">
            </span>
        </div>
    </div>
    <div class="part2">
        <div class="inputContainer" @click.stop.prevent="chooseBank">
            <span class="bankName">
              <input type="text" class="inputStyle" v-model="bankYibao" placeholder="请选择开户行" onfocus="this.blur()">
            </span>
        </div>
    </div>
    <div class="part3">
      <div class="inputContainer">
        <span class="phoneNumBox">
          <input type="tel" class="inputStyle" v-model.trim="phone" placeholder="请输入银行预留手机号" :readonly="isReadonly"/>
        </span>
      </div>
      <div class="inputContainer">
        <span class="msgNumBox">
          <input type="number" class="inputStyle msg" style="width: 40%;" v-model.trim="msgCode" placeholder="请输入验证码"/>
        </span>
        <button class="btn" @click="getMsg" v-bind:class="{ gray: isDisabled }" :disabled="isDisabled">{{btnText}}</button>
      </div>
    </div>
    <div class="submit">
        <button class="submitBtn" @click="infoSubmit">信息提交</button>
    </div>
  </div>
</template>

<script >
import { getQueryString } from '@/module/common'
import { bankMap } from '@/module/yiBaoBankMap'
import { mapMutations } from 'vuex'
export default {
  name: 'BindCard',
  data () {
    return {
      token: '',
      name: '',
      idNum: '',
      relname: '',
      relidNum: '',
      cardNum: '',
      phone: '',
      isReadonly: false,
      msgCode: '',
      sceconds: '',
      btnText: '获取验证码',
      isDisabled: false,
      timer: null,
      cb: '', // 成功回调地址
      cbMethod: '', // 回跳方式 push/replace 默认replace
	  cbType: '', // 回跳类型 router/url 默认url
	  cbrouterData: ''// 回跳类型为router时回跳路由数据
    }
  },
  computed: {
	  bankYibao () {
		  return this.$store.state.bankYibao
	  }
  },
  methods: {
    ...mapMutations([
      'backYiBaoBindCard'
    ]),
    getMsg () {
      if (!this.cardNum) {
        this.$toast('请填写银行卡号')
      } else if (!this.bankYibao) {
        this.$toast('请选择开户行')
      } else if (!this.phone) {
        this.$toast('请填写银行预留手机号')
      } else {
        /// 获取验证码
        let smbank = this.$store.state.bankYibao
        let qData = {
          token: this.token,
          cardno: this.cardNum,
          idcardno: this.relidNum,
          username: this.relname,
          phone: this.phone,
          bankName: smbank,
          bankCode: bankMap[smbank]
        }
        this.$api['bindCardZhiMaAuth/getsmsCode'](qData).then((res) => {
          this.countDown()
        })
      }
    },
    // 提交绑卡信息
    infoSubmit () {
      if (this.msgCode) {
        let smbank = this.$store.state.bankYibao
        let subData = {
          token: this.token,
          cardno: this.cardNum,
          idcardno: this.relidNum,
          username: this.relname,
          phone: this.phone,
          validatecode: this.msgCode,
          bankName: smbank,
          bankCode: bankMap[smbank]
        }
        this.$api['bindCardZhiMaAuth/signAdvance'](subData).then((res) => {
          this.$toast('绑卡成功')
          this.backHandle()
        })
      } else {
        this.$toast('请输入验证码')
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
    countDown () {
      this.$toast('短信发送成功')
      this.isDisabled = true
      let count = 60
      this.timer = setInterval(() => {
        if (count > 1) {
          count--
          this.btnText = count + 's'
        } else {
          clearInterval(this.timer)
          this.btnText = '重新获取'
          this.isDisabled = false
        }
      }, 1000)
    },
    chooseBank () {
      this.$router.push({ name: 'BankList' })
    },
    getUserInfo () {
      this.$api['bindCardZhiMaAuth/getAuthInfo']({
        token: this.token || this.userToken
      }).then(res => {
        this.name = res.name
        this.idNum = res.idcard
        this.relname = res.name
        this.relidNum = res.idcard
      }).catch((err) => {
        this.$toast(err)
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
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'HistoryPage') {
      this.backYiBaoBindCard({ value: null })
      global.appIns.alive = false
      from.meta.keepAlive = false
      this.$nextTick(() => {
        global.appIns.alive = true
      })
    }
    next()
  }
  // beforeRouteEnter (to, from, next) {
  //   to.meta.keepAlive = true
  //   next()
  // }
}
</script>

<style scoped lang="scss">
.Main{
  background: #f2f2f2;
  display: inline-block;
}
.mt20 {
  margin-top: 20px;
}

.bordertop1 {
  border-top: 1px solid #e6e6e6;
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
    font: inherit;
    margin: 0;
}
.submit {
    width: 9.46rem;
    height: 84px;
    margin: 110px 20px 0 20px;
    line-height: 84px;
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
    width: 176px;
    height: 0.6667rem;
    line-height: 0.6667rem;
    float: right;
    margin: .26666rem;
    border: solid 1px #f54b78;
    outline: none;
    border-radius: 4px;
    color: #fff;
    font-size: 24px;
    background: #f54b78;
    text-align: center;
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
.inputBox{
    height: 100%;
    width: 100%;
    display: inline-block;
    line-height: 1.173rem
}
.bankName::before {
    background: url("~@/assets/img/bindcard/list_icon_choose_bank@3x.png") no-repeat 0 0;
    background-size: 100%;
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
     background: url('~@/assets/img/list_icon_enter_nol@3x.png') no-repeat;
    background-size: 100% 100%;
    float: right;
    margin: 22px 30px 0 0;
}
.lineh{
    line-height: 1.173rem;
    color: #939393;
}
.inputStyle {
    width: 70%;
    height: .64rem;
    line-height: .64rem;
    border: none;
    outline: none;
    font-size: 28px;
    background: transparent;
    padding: 0 0;
    color: #333;
}
.msg {
    width: 50%;
}
.inputContainer {
    height: 1.173rem;
    border-bottom: 1px solid #eaeaea;
    background: #fff;
    font-size: .36rem;
    line-height: 1.173rem;
}
::-webkit-input-placeholder{
    font-size: .373rem;
    color: #939393;
}
</style>
