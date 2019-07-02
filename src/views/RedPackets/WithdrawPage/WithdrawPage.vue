<template>
	<div class="wrap border border-top" v-if="pageShow">
		<div class="page">
			<div class="balance">
				<p>账户余额(元)</p>
				<p class="money">{{balance | priceFilter}}</p>
			</div>
			<ul>
				<li class="border border-bottom li1">
					<span>提现方式：</span>
					<span>支付宝</span>
				</li>
				<li class="border border-bottom">
					<label>收款人姓名：</label>
					<input v-model="name" :readonly="realname" ref="name" type="text" placeholder="请输入姓名" @focus="judgeRealName" />
				</li>
				<li class="border border-bottom">
					<label>支付宝账号：</label>
					<input v-model="account" ref="account" type="text" placeholder="请输入支付宝账号" />
				</li>
			</ul>
			<div class="cashTips">
				<div class="cashTips__container">
					<img src="~@/assets/img/list_icon_remind_sel@3x.png" alt="" srcset="">
					<span>请正确填写您本人支付宝，提现发起后，24小时内即可到账</span>
				</div>
			</div>
			<button class="sure" :class="{'cannotWithdraw': !canWithdraw, 'canWithdraw': canWithdraw}" :disabled="!canWithdraw" @click="isPass">确认提现</button>
		</div>
		<pay v-if="passBoxShow && payPwdCount" :payPwdCount="payPwdCount" :showErrorStatus="showErrorStatus" @close="closePayFn" @getPasswordAdd=PasswordAdd @getPasswordDel=PasswordDel :passBoxTip="passBoxTip" :passwrong=passwrong :status=status :value=password></pay>
		<resetpay v-if="resetStatus" @close="closeResetFn"></resetpay>
    <div class="mask" v-if="mask" @click="mask=!mask">
			<div @click.stop>
				<div v-if="!noPassward" class="tip1">
					<h3>请先设置支付密码</h3>
					<p>您还没有设置小象的支付密码，请进入
						<span>"我的-账户管理-支付密码"</span>进行设置</p>
					<span class="border border-top" @click="goMyCenter">确定</span>
				</div>
				<p v-if="noMoney" class="tip2">余额为0，不可提现</p>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import resetpay from './../resetpay/resetpay'
import Pay from './../Pay/Pay'
export default {
  name: 'WithdrawCash',
  props: {},
  data () {
    return {
      isPay: false, // 是否可以支付
      balance: 0, // 余额
      name: '', // 姓名
      account: '', // 支付宝账户
      status: 1, // 支付状态 1 待输入 2 验证中 3 成功
      passwrong: false, // 密码是否错误
      password: '', // 密码
      mask: false, // 弹窗蒙层
      noPassward: true, // 是否设置过支付密码
      noMoney: false, // 余额提示
      pageShow: false,
      passBoxShow: false,
      passBoxTip: '',
      realname: false,
      isSubmit: false, // 是否已经提交过
      payPwdCount: null, // 可输入次数
      showErrorStatus: false, // 输入密码次数显示
      resetStatus: false // 重置弹窗显示
    }
  },
  async created () {
    await this.queryBalance()
    await this.getUserInfo()
    await this.getPayPwdCount()
  },
  computed: {
    canWithdraw () {
      if (this.name && this.account) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    closePayFn () {
      this.passBoxShow = false
      this.isPay = true
      this.status = 1
      this.password = ''
      this.showErrorStatus = false
      this.isSubmit = false
      this.resetStatus = false
    },
    closeResetFn () {
      this.passBoxShow = false
      this.isPay = true
      this.status = 1
      this.password = ''
      this.showErrorStatus = false
      this.isSubmit = false
      this.resetStatus = false
    },
    getPayPwdCount () { // 用户支付密码剩余输入次数接口
      this.$api['user/payPwdCount']({
        token: this.userToken
      }).then(res => {
        console.log(res)
        this.payPwdCount = res.data
        console.log(this.payPwdCount, 'payPwdCount')
      })
    },
    getDialogShow () { // 用户支付密码剩余输入次数接口
      this.$api['user/payPwdCount']({
        token: this.userToken
      }).then(res => {
        this.payPwdCount = res.data
        if (this.payPwdCount) {
          this.passBoxShow = true
        } else {
          this.resetStatus = true
        }
      })
    },
    checktellCancel () {
      let ua = navigator.userAgent
      let reg = /instalment\/(\d+)\.(\d+)\.(\d+)/
      let rets = ua.match(reg)
      if (rets) {
        let rev1 = Number(rets[1])
        let rev2 = Number(rets[2])
        let rev3 = Number(rets[3])
        if (rev1 >= 3 && rev2 >= 7 && rev3 >= 8) { // 主版本号等于3且次版本号大于7 都可以
          return true
        }
      }
      return false
    },
    judgeRealName (ev) {
      if (this.name) {
        ev.target.blur()
      }
    },
    goMyCenter () { // 设置支付密码
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
    },
    isPass () { // 提现时是否输入了姓名账号
      if (this.balance) { // 余额大于0
        if (this.name && this.account) {
          this.juadgePayPassW()
        }
      } else { // 余额为0提示不能提现
        this.$toast('余额为0，不可提现')
      }
    },
    async juadgePayPassW () { // 判断是否设置过支付密码
      if (this.isPay) { // 设置过
        this.passwrong = false
        await this.getDialogShow()
      } else {
        this.mask = true
        this.noMoney = false
        this.noPassward = false
        await this.goMyCenter()
      }
    },
    surePass () { // 输过密码
      console.log('去支付')
      this.isSubmit = true
      this.status = 2 // 支付中
      this.toWithdraw()
    },
    toWithdraw () { // 提现
      this.$api['user/submitWithdrawApply']({
        token: this.userToken,
        subject: 'guess',
        amount: this.balance,
        payPwd: this.password,
        alipayAccount: this.account
      }, {
        headers: {
          appVersion: '3.7.8'
        }
      }).then(res => {
        console.log(res)
        if (res.heads.code === 200) {
          if (res.body.payError && res.body.payError.errorCode === '16019') {
            this.payPwdCount = res.body.payError.lastCount
            this.isPay = true
            this.status = 1
            this.password = ''
            this.showErrorStatus = true
            this.isSubmit = false
            if (this.payPwdCount === 0) {
              this.resetStatus = true
            }
          } else if (res.body.payError && res.body.payError.errorCode === '5003') {
            this.payPwdCount = 0
            this.isPay = true
            this.status = 1
            this.password = ''
            this.showErrorStatus = true
            this.isSubmit = true
            this.resetStatus = true
          } else {
            this.isPay = true
            this.status = 3
            this.isSubmit = true
            setTimeout(() => {
              this.$router.push({ name: 'RedPackets' })
            }, 1000)
          }
        } else {
          if (res.heads.code === 300) {
            this.$toast(res.heads.message)
          }
          this.passBoxTip = res.heads.message
          this.isPay = true
          this.status = 1
          this.password = ''
          this.passwrong = true
          this.isSubmit = false
        }
      })
    },
    PasswordAdd (msg) {
      console.log(msg)
      this.password = (this.password + msg).slice(0, 6)
      if (this.name && this.account && (this.password.length === 6) && !this.isSubmit) {
        this.surePass()
      }
    },
    PasswordDel (msg) {
      console.log(msg)
      this.password = this.password.slice(0, this.password.length - 1)
    },
    getUserInfo () {
      this.$api['user/getUserInfo']({
        token: this.userToken
      }).then(res => {
        this.pageShow = true
        this.name = res.data.realname
        if (this.name) {
          this.realname = true
        }
        // 用户是否设置过支付密码
        if (res.data.isPayPassword) { // 设置过
          this.isPay = true
        } else {
          this.isPay = false
        }
      })
    },
    queryBalance () { // 查询余额
      this.$api['user/getBalanceRedPackets']({
        token: this.userToken
      }).then(res => {
        this.balance = res.balance
      })
    }
  },
  components: {
    Pay,
    resetpay
  }
}
</script>

<style scoped lang="scss">
.wrap {
  height: 100%;
}
.cashTips {
  margin-top: 20px;
  text-align: center;
  &__container {
    display: inline-block;
    img {
      height: 26px;
      width: 26px;
      margin-top: 4px;
      margin-right: 20px;
    }
    span {
      display: inline-block;
      vertical-align: top;
      font-size: 24px;
      font-family: PingFang-SC-regular;
      color: #999;
      line-height: 38px;
    }
  }
}
.page {
  text-align: left;
  width: 100%;
  height: 100%;
  color: #000;
  font-size: 28px;
  background: #f3f4f5;
  box-sizing: border-box;
  .balance {
    height: 180px;
    box-sizing: border-box;
    padding: 30px 30px 24px;
    background: #fff;
    margin-bottom: 22px;
    color: #636363;
    p:nth-child(1) {
      margin-top: 10px;
    }
    .money {
      color: #ed145b;
      font-size: 54px;
      font-weight: 600;
      margin-left: -5px;
      margin-top: 30px;
    }
  }
  ul {
    margin-bottom: 20px;
    li {
      height: 88px;
      background: #fff;
      box-sizing: border-box;
      padding: 24px 30px;
      vertical-align: middle;
      color: #333;
      border-bottom: 1px solid #e6e6e6;
      span {
        display: inline-block;
        vertical-align: middle;
        padding: 2px;
        line-height: 40px;
      }
      span:nth-child(1) {
        margin-right: 10px;
      }
      label {
        display: inline-block;
        vertical-align: middle;
        padding: 2px;
        line-height: 40px;
      }
      input {
        vertical-align: middle;
        line-height: 40px;
      }
      input::-webkit-input-placeholder {
        color: #939393;
      }
    }
    .li1 {
      padding-top: 26px;
      span {
        display: inline-block;
        vertical-align: middle;
        padding: 2px;
        line-height: 28px;
      }
    }
    :nth-child(2) {
      padding-top: 12px;
      span {
        display: inline-block;
        vertical-align: middle;
        padding: 2px;
        line-height: 28px;
      }
    }
    :nth-child(3) {
      border: none;
      padding-top: 12px;
    }
  }
  .sure {
    display: block;
    border: 0;
    width: 710px;
    height: 84px;
    color: #fff;
    font-size: 32px;
    text-align: center;
    line-height: 84px;
    margin: 100px auto 0;
    border-radius: 4px;
  }
}
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 550px;
    height: 300px;
    line-height: 40px;
    border-radius: 16px;
    background: #fff;
    text-align: center;
    color: #666;
    box-sizing: border-box;
    padding-top: 40px;
    .tip2 {
      line-height: 200px;
    }
    .tip1 {
      h3 {
        font-size: 32px;
        font-weight: 600;
        color: #000;
        margin-bottom: 30px;
      }
      p {
        width: 100%;
        box-sizing: border-box;
        padding: 0 40px;
        line-height: 40px;
        margin-bottom: 40px;
        span {
          color: #fa2929;
        }
      }
      > span {
        display: block;
        width: 100%;
        height: 70px;
        line-height: 70px;
        color: #fa2929;
      }
    }
  }
}
.cannotWithdraw {
  background: #ffabc1;
}
.canWithdraw {
  background: #f54b78;
}
</style>
