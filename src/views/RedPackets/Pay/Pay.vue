<template>
  <div class="pay">
    <div class="password" v-if="status===1" @click.stop>
      <div class="close" @click="close"></div>
      <h3>请输入支付密码</h3>
      <van-password-input
        :value="value"
        info=""
        @focus="showKeyboard = true"
      />
      <div class="wrongbox">
        <div class="wrong newwrongleft" v-if="showErrorStatus && payPwdCount">密码错误！还可尝试{{payPwdCount}}次</div>
        <div class="wrong newwrongright" @click="resetpassword">忘记密码?</div>
      </div>
    </div>
    <div class="password" v-if="status===2">
      <h4>支付密码验证中</h4>
      <van-loading type="spinner" color="black" />
    </div>
    <div class="password" v-if="status===3">
      <h4>提交成功</h4>
      <span class="imgBox">
        <img src="~@/assets/img/Oval@3x.png" alt="">
      </span>
    </div>
    <!-- 数字键盘 -->
    <div @click.stop>
      <van-number-keyboard class="numberKeyBoard"
        :show="showKeyboard"
        @input="onInput"
        @delete="onDelete"
        @blur="showKeyboard = false"
      />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  name: '',
  props: ['passwrong', 'status', 'value', 'passBoxTip', 'payPwdCount', 'showErrorStatus'],
  data () {
    return {
      showKeyboard: true
    }
  },
  methods: {
    resetpassword () {
      this.$emit('close')
      setTimeout(() => {
        this.$router.push({ // 重置密码
          name: 'GetCode',
          query: {
            type: 'router',
            method: 'replace',
            routerData: JSON.stringify({
              name: 'WithdrawPage'
            }),
            noCache: Date.now()
          }
        })
      }, 300)
    },
    close () {
      this.$emit('close')
    },
    onInput (key) {
      this.$emit('getPasswordAdd', key)
    },
    onDelete () {
      this.$emit('getPasswordDel')
    }
  },
  watch: {
    passwrong (val) {
      return this.passwrong
    },
    status (val) {
      return this.status
    }
  }
}
</script>

<style lang="scss" scoped>
.pay {
  width: 100%;
  height: 100%;
  background: rgba(00, 00, 00, .5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}
.password {
  background: #fff;
  position: absolute;
  width: 550px ;
  height: 314px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 40px 38px 36px;
  bottom: 620px;
  left: 0;
  right: 0;
  border-radius: 16px;
  .close {
    background: url('~@/assets/img/list_btn_delete_nol.png') no-repeat center;
    background-size: 100% 100%;
    width: 44px;
    height: 44px;
    position:absolute;
    right: 20px;
    top: 20px;
  }
  h3, h4 {
    text-align: center;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 48px;
    font-family:PingFangSC-Medium;
  }
  .van-password-input {
    margin: 0;
    ul {
      height: 40px;
      border: 1px solid #A0A0A1;
      border-radius: 8px;
    }
  }
  p {
    width: 100%;
    height: 38px;
    margin-top: 40px;
    font-size: 26px;
    text-align: center;
    .wrong {
      display: block;
      width: 100%;
      color: #FA2929;
    }
    .forget {
      color: #999;
    }
  }
  .wrongbox {
    width: 100%;
    height: 38px;
    margin-top: 40px;
    font-size: 26px;
    text-align: center;
    .wrong {
      display: block;
      width: 100%;
      color: #ed145b;
    }
    .newwrongleft {
      width: 70%;
      float: left;
      text-align: left;
    }
    .newwrongright {
      float: right;
      width: 30%;
      color:#939393;
    }
  }

  h4 {
    margin-bottom: 60px;
  }
  .van-loading {
    width: 40px;
    height: 40px;
    margin: 20px auto;
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
</style>

<style lang="scss">
.pay {
  .van-password-input__security {
    height: 80px !important;
    border-color:#d0d0d0;
    li {
      width: 80px !important;
      border-color:#d0d0d0;
    }
  }
}
</style>
