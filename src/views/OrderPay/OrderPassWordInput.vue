<template>
	<div class="OrderPassWordInput">
		<!-- 密码输入框 -->
		<div class="password">
			<div class="statusBox" v-if="payPassWordStatus === 1">
				<h3>请输入支付密码</h3>
				<van-password-input :value="value" @focus="showKeyboard = true" />
        <div class="passwordText">
          <slot></slot>
          <!-- <span class="errorText" v-show="showErrorText">{{errorText}}</span> -->
				  <div class="forgetPassword" @click="GetPassword">忘记密码?</div>
        </div>
				<div class="close" @click="close">
					<img src="~@/assets/img/share_icon_close_nor@3x.png" alt="">
				</div>
			</div>
			<div class="statusBox" v-else-if="payPassWordStatus === 2">
				<h4>支付密码验证中</h4>
				<van-loading type="spinner" color="black" />
			</div>
			<div class="statusBox" v-else-if="payPassWordStatus === 3">
				<h4>提交成功</h4>
				<span class="imgBox">
					<img src="~@/assets/img/pay/Oval@3x.png" alt="">
				</span>
			</div>
		</div>
		<!-- 数字键盘 -->
		<div @click.stop>
			<van-number-keyboard class="numberKeyBoard" :show="showKeyboard" @input="onInput" @delete="onDelete" @blur="showKeyboard = false" />
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'OrderPassWord',
  props: {
    payPassWordStatus: {
      default: false
    },
    passWordError: {
      default: false
    },
    passwordErrCount: {
      default: 0
    }
  },
  data () {
    return {
      value: '',
      showKeyboard: true,
      infoTip: '请输入6位支付密码'
    }
  },
  methods: {
    onInput (key) {
      this.value = (this.value + key).slice(0, 6)
      this.$emit('changePassWord')
    },
    onDelete () {
      this.value = this.value.slice(0, this.value.length - 1)
      this.$emit('changePassWord')
    },
    payReq (val) {
      this.$emit('payApply', val)
    },
    close () {
      console.log('changeOrderPayInputShow')
      this.$emit('changeOrderPayInputShow', false)
    },
    GetPassword () {
      let routerData = JSON.stringify({
        name: this.$route.name,
        query: this.$route.query,
        params: this.$route.params
      })
      // 跳转设置支付密码页面
      this.$router.push({
        name: 'GetCode',
        query: {
          type: 'router',
          routerData: routerData,
          noCache: Date.now()
        }
      })
    }
  },
  watch: {
    value (val) {
      if (val && val.length >= 6) {
        this.payReq(val)
      }
    },
    passWordError (val) {
      this.value = ''
    },
    passwordErrCount (val) {
      this.value = ''
    }
  }
}
</script>
<style lang="scss">
.OrderPassWordInput {
  .van-password-input {
    width: 480px;
    margin: 0 auto;
    &__security {
      height: 80px;
    }
  }
  .password,.numberKeyBoard  {
    [class*="van-hairline"]::after {
      border-color: #d0d0d0;
    }
  }
  .van-loading {
    width: 80px;
    height: 80px;
    margin: 40px auto;
  }
}
</style>
<style scoped lang="scss">
.OrderPassWordInput {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  z-index: 300;
  background-color: #f2f2f2;
  background: rgba(00, 00, 00, 0.5);
  .forgetPassword {
    // margin-top: 32px;
    font-size: 28px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #939393;
    line-height: 37px;
    text-align: right;
    display: inline-block;
    float: right;
  }
  .close {
    position: absolute;
    top: 12px;
    right: 12px;
    img {
      width: 58px;
      height: 58px;
    }
  }
  .password {
    background: #fff;
    position: absolute;
    width: 550px;
    height: 314px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 40px 38px 36px;
    bottom: 620px;
    left: 0;
    right: 0;
    border-radius: 24px;
    h3,
    h4 {
      text-align: center;
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 48px;
      font-family: PingFangSC-Medium;
      color: #333;
    }
    h4 {
      margin-bottom: 60px;
    }
    .imgBox {
      display: block;
      margin: 0 auto;
      width: 100px;
      height: 100px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.passwordText {
  width: 100%;
  display: inline-block;
  margin-top: 0.42667rem;
}
.errorText {
  font-size: 0.37333rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #e14123;
  line-height: 0.49333rem;
  text-align: right;
}
.passwordText::after {
  display: inline-block;
  clear: both;
  content: '';
}
</style>
