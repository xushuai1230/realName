<template>
<div class="password-component">
  <div class="bg" v-show="showRuleDialog" >
    <div class="rule" v-show="showRuleDialog"  @click.stop="stop">
      <div class="content">
        <p class="title">请输入支付密码</p>
        <i class="close-icon" @click.stop="close"></i>
        <van-password-input :value="value" @focus="showKeyboard = true"/>
        <div class="dialog-bottom">
          <div class="password-error">
            <span v-show="showErrorPassword">密码错误！{{errorCountMessage}}</span>
          </div>
          <div class="password-forget" @click="goForgetPassword">忘记密码？</div>
        </div>
      </div>
    </div>
  </div>
  <van-number-keyboard :show="showKeyboard" @input="onInput" @delete="onDelete" @blur="showKeyboard = false"/>
  <Loading v-show="loadingStauts"></Loading>
  <resetpay v-if="resetStatus" @close="closeResetFn"></resetpay>
</div>
</template>
<script>
import { api, post, fromUrlcode } from '@/module/request'
import { mapGetters } from 'vuex'
import Loading from '@/components/Loading/Loading'
import resetpay from './borrowResetPay'

export default {
  name: 'rule',
  data () {
    return {
      isClose: false,
      bodyEl: null,
      top: 0,
      showKeyboard: false,
      value: '',
      showErrorPassword: false, // 密码错误提示
      debounceFn: null,
      commitLock: true, // 提交锁
      loadingStauts: false,
      errorCountMessage: '',
      resetStatus: false // 密码锁定弹框
    }
  },
  props: ['showRuleDialog', 'orderCode', 'periods', 'noPayCount'],
  mounted () {
    this.bodyEl = document.body
    this.debounceFn = this.throttle((key) => {
      if (this.value.length === 6 && this.orderCode && this.commitLock) {
        // 校验密码
        this.loadingStauts = true
        this.matchPassword()
      }
    }, 1500)
  },
  destroyed () {
    this.debounceFn = null
  },
  methods: {
    close () {
      this.$emit('closeRule')
      this.showErrorPassword = false
      this.value = ''
    },
    stop () {},
    stopBodyScroll (isFixed) {
      if (isFixed) {
        this.top = window.scrollY
        this.bodyEl.style.position = 'fixed'
        this.bodyEl.style.top = -this.top + 'px'
      } else {
        this.bodyEl.style.position = ''
        this.bodyEl.style.top = ''
        window.scrollTo(0, this.top) // 回到原先的top
      }
    },
    onInput (key) {
      this.value = (this.value + key).slice(0, 6)
      // if (this.value.length === 6 && this.orderCode) {
      //   // 校验密码
      //   this.matchPassword()
      // }
      this.debounceFn(key)
    },
    onDelete () {
      this.value = this.value.slice(0, this.value.length - 1)
    },
    matchPassword () {
      this.commitLock = false
      this.loadingStauts = true
      post(api.checkPassword, fromUrlcode({
        token: this.userToken,
        payPwd: this.value,
        orderCode: this.orderCode,
        periods: this.periods
      }), {
        headers: {
          appVersion: '3.7.8'
        }
      }).then(res => {
        // this.loadingStauts = false
        // this.showKeyboard = false
        // this.showErrorPassword = false
        // this.value = ''
        console.log(res)
        if (res.payError) {
          if (res.payError.errorCode === '16019') {
            this.showErrorPassword = true
            if (res.payError.lastCount === 0) {
              this.resetStatus = true
              this.$emit('closeRule', 'noPayCount')
              this.showKeyboard = false
              this.showErrorPassword = false
              this.errorCountMessage = ''
              this.loadingStauts = false
              this.value = ''
              this.commitLock = true
            } else {
              this.errorCountMessage = '还可尝试' + res.payError.lastCount + '次'
              this.loadingStauts = false
              this.value = ''
              this.showKeyboard = false
              this.commitLock = true
            }
          } else if (res.payError.errorCode === '5003') {
            this.showKeyboard = false
            this.commitLock = true
            this.resetStatus = true
            this.$emit('closeRule', 'noPayCount')
            this.showErrorPassword = false
            this.errorCountMessage = ''
            this.loadingStauts = false
            this.value = ''
          }
        } else {
          this.loadingStauts = false
          this.value = ''
          this.showKeyboard = false
          this.commitLock = false
          this.$emit('submitV3')
        }
      }).catch(err => {
        this.loadingStauts = false
        this.value = ''
        this.showKeyboard = false
        // this.showErrorPassword = true
        this.$toast(err)
        this.commitLock = true
        this.$emit('closeRule')
      })
    },
    closeResetFn () {
      this.resetStatus = false
    },
    goForgetPassword () {
      this.$emit('closeRule')
      this.value = ''
      this.showKeyboard = false
      // 跳转忘记密码页
      this.$router.push({
        name: 'GetCode',
        query: {
          type: 'router',
          method: 'replace',
          routerData: JSON.stringify({
            name: 'BorrowMoney'
          }),
          noCache: Date.now()
        }
      })
    },
    throttle (fn, threshhold) {
      // 记录上次执行的时间
      var last
      // 定时器
      var timer
      // 默认间隔为 250ms
      threshhold || (threshhold = 250)
      // 返回的函数，每过 threshhold 毫秒就执行一次 fn 函数
      return function () {
        // 保存函数调用时的上下文和参数，传递给 fn
        var context = this
        var args = arguments
        var now = +new Date()
        // 如果距离上次执行 fn 函数的时间小于 threshhold，那么就放弃
        // 执行 fn，并重新计时
        if (last && now < last + threshhold) {
          clearTimeout(timer)
          // 保证在当前时间区间结束后，再执行一次 fn
          timer = setTimeout(function () {
            last = now
            fn.apply(context, args)
          }, threshhold)
          // 在时间区间的最开始和到达指定间隔的时候执行一次 fn
        } else {
          last = now
          fn.apply(context, args)
        }
      }
    }
  },
  beforeDestroy () {
    this.stopBodyScroll(false)
  },
  watch: {
    showRuleDialog (newValue) {
      this.stopBodyScroll(newValue)
    },
    noPayCount (val) {
      if (val > 0) {
        this.resetStatus = true
      }
    }
  },
  computed: {
    ...mapGetters(['userToken'])
  },
  components: {
    Loading,
    resetpay
  }
}
</script>
<style scoped>
.bg {
  position: fixed;
  bottom: 0;
  z-index: 100;
  height: 100%;
  background: rgba(0, 0, 0, 0.76);
  width: 100%;
  font-family: PingFang-SC-Regular;
}

.rule-title {
  font-size: 0.453333rem;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: #fff;
  /* margin-top: 1.2rem;
  margin-bottom: 0.493333rem; */
}

.rule.normal {
  height: 14.186667rem;
}
.rule.tabview {
  height: 100%;
}
.password-component .title {
  font-size: .426667rem;
  text-align: center;
  /* padding-top: .266667rem;
  margin-bottom: .266667rem; */
  padding: 0.5rem;
  color: #333;
  font-weight: 500;
  width: auto;
  line-height: inherit;
}
.content {
  width: 8rem;
  height: 4.186667rem;
  background: #fff;
  margin: 4rem auto;
  border-radius: .106667rem;
  position: relative;
}
.close-icon {
  display: inline-block;
  width: .666667rem;
  height: .666667rem;
  background-image: url("../../assets/img/share_icon_close_nor@3x.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  right: 0.2rem;
  top: 0.4rem;
}
.dialog-bottom {
  margin: .4rem .3rem;
}
.password-error {
  display: inline-block;
  width: 70%;
  color: #e14123;
  font-size: .373333rem;
}
.password-forget {
  display: inline-block;
  width: 30%;
  text-align: right;
  color: #333;
  font-size: .373333rem;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(100%);
  opacity: 0;
}
</style>
<style>
.password-component .content [class*=van-hairline]::after  {
  border-color: rgba(147,147,147,0.6) !important;
}
</style>
