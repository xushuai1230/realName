<template>
	<div class="redpackets" ref="redpackets">
    <img class="bannerImg" src="~@/assets/img/redpackets/bg@3x.png" alt="">
    <div class="title">—— 恭喜您获得 ——</div>
    <div class="money">¥{{money | priceFilter}}</div>
    <div class="notGetMoney" v-if="showRecord" :class="{'showRecord': showRecord }"  @click="getMoneyFn">
			<div></div>
      <div class="showRecord-text">
        <span>{{recordMsg}}
        </span>
      </div>
		</div>
		<div class="gotx" @click="getMoneyFn" v-else-if="canGetMoney && !SXfail">
			<div></div>
      <div class="sxfail-text mb-text">
        <span>提现人数过多，请耐心等待
        </span>
      </div>
		</div>
		<div class="notGetMoney" v-else-if="!canGetMoney && !SXfail" >
      <div></div>
      <div class="sxfail-text">
        <span>提现人数过多，请耐心等待
        </span>
      </div>
		</div>
    <div class="notGetMoney" v-else-if="SXfail && creditCode === '0' " :class="{'SXfail': SXfail && creditCode === '0'}">
			<div></div>
      <div class="sxfail-text">
        <span>请尝试在“我的”页面补充授权
        </span>
      </div>
		</div>
    <div class="notGetMoney"  v-else-if="SXfail && creditCode === '2' " :class="{'SXing': SXfail && creditCode === '2'}">
			<div></div>
		</div>
		<div class="ruletitle"></div>
		<div class="rule">
			<div>1.限2019年1月16日至2019年3月16日参与微博红包飞活动的新用户，过期未提现，视为自动放弃红包奖励！</div>
			<div>2.现金奖励可直接提现，限提现支付宝真实姓名与本平台实名认证一致。</div>
			<div>您还可以在“微博-我的-微博钱包-分期商城”提现</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'RedPackets',
  props: {},
  data () {
    return {
      money: '',
      canGetMoney: false,
      realname: false,
      totalCredit: 0, // 小象额度
      SXfail: false, // 授信失败
      creditCode: '',
      showRecord: false, // 展示再次提现
      recordMsg: '' // 提现失败原因
    }
  },
  mounted () {
    let bodyHeight = document.documentElement.clientHeight
    this.$refs.redpackets.style.minHeight = bodyHeight + 'px'
  },
  async created () {
    await this.getUserInfo()
    await this.getUserInfoFn()
    await this.getBalanceRedPacketsFn()
    await this.getWithdrawList()
  },
  watch: {
  },
  computed: {
  },
  methods: {
    getUserInfoFn (status) {
      if (this.refreStatus) return
      return this.$api['user/getUserInfo']({
        token: this.userToken
      }).then(res => {
        this.realname = res.data.isRealnameApprove
        console.log(this.realname, this.totalCredit)
        if (this.realname && this.totalCredit <= 0) {
          this.SXfail = true
        }
      }).catch(err => {
        console.log(err)
        this.refreshIsLoading = false
      })
    },
    getBalanceRedPacketsFn (status) {
      if (this.refreStatus) return
      return this.$api['user/getBalanceRedPackets']({
        token: this.userToken
      }).then(res => {
        this.money = res.balance
        if (!res.balance) {
          this.canGetMoney = false
        } else {
          this.canGetMoney = true
        }
      }).catch(err => {
        console.log(err)
        this.refreshIsLoading = false
      })
    },
    getMoneyFn () {
      this.$tj('txofhbylq')
      if (!this.realname) {
        this.$router.push({ // 实名
          name: 'UserCardAuth',
          query: {
            type: 'router',
            method: 'replace',
            routerData: JSON.stringify({
              name: 'RedPackets'
            }),
            redpackets: true,
            noCache: Date.now()
          }
        })
      } else {
        this.$router.push({ // 提现
          name: 'WithdrawPage'
        })
      }
    },
    getUserInfo () {
      return this.$api['borrowHistory/getUserCreditV3']({
        token: this.userToken
      }).then(res => {
        // 小象额度
        this.totalCredit = res.data.totalCredit
        this.creditCode = res.data.creditCode
      })
    },
    getWithdrawList () {
      // 提现记录
      return this.$api['user/withdrawList']({
        token: this.userToken,
        subject: 'guess'
      }).then(res => {
        let record = res.record
        if (record.length >= 1) {
          let recordIndex = record[0]
          if (recordIndex.status === 2) {
            this.showRecord = true
            this.recordMsg = recordIndex.msg
          }
        } else {
          this.showRecord = false
          this.recordMsg = ''
        }
      }).catch(err => {
        console.log(err)
        this.showRecord = false
        this.recordMsg = ''
      })
    }
  },
  components: {
  }
}
</script>

<style>
  html, body {
    height: 100%;
  }
</style>
<style scoped lang="scss">
.redpackets {
  width: 100%;
  height: 100%;
  background: rgba(195, 49, 48, 1);
  .bannerImg {
    width: 100%;
  }
  .title {
    position: absolute;
    top: 351px;
    height: 28px;
    font-size: 28px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(167, 82, 5, 1);
    line-height: 28px;
    width: 100%;
    text-align: center;
  }
  .money {
    position: absolute;
    top: 410px;
    height: 88px;
    font-size: 88px;
    font-family: PingFang HK;
    font-weight: bold;
    color: rgba(249, 42, 47, 1);
    line-height: 88px;
    text-align: center;
    width: 100%;
  }
  .canGetMoney {
    width: 100%;
    height: 142px;
    box-sizing: border-box;
    padding: 27px 85px;
    background: url("~@/assets/img/redpackets/tixian_btn@3x.png") no-repeat;
    background-size: 100% 100%;
    :nth-child(1) {
      width: 100%;
      height: 88px;
    }
  }
  .gotx {
    width: 100%;
    height: 142px;
    padding: 27px 85px;
    box-sizing: border-box;
    background: url("~@/assets/img/redpackets/tixian_btn@3x.png") no-repeat;
    background-size: 100% 100%;
    :nth-child(1) {
      width: 100%;
      height: 88px;
    }
  }
  .notGetMoney {
    width: 100%;
    height: 142px;
    padding: 27px 85px;
    box-sizing: border-box;
    background: url("~@/assets/img/redpackets/tixian2_btn@3x.png") no-repeat;
    background-size: 100% 100%;
    :nth-child(1) {
      width: 100%;
      height: 88px;
    }
  }
  .SXfail {
    width: 100%;
    // height: 142px;
    padding: 27px 85px;
    box-sizing: border-box;
    background: url("~@/assets/img/redpackets/tixian3_btn@3x.png") no-repeat;
    background-size: 100% 100%;
    :nth-child(1) {
      width: 100%;
      height: 88px;
    }
  }
  .SXing {
    width: 100%;
    // height: 142px;
    padding: 27px 85px;
    box-sizing: border-box;
    background: url("~@/assets/img/redpackets/tixian4_btn@3x.png") no-repeat;
    background-size: 100% 100%;
    :nth-child(1) {
      width: 100%;
      height: 88px;
    }
  }
  .showRecord {
    width: 100%;
    // height: 142px;
    padding: 27px 85px;
    box-sizing: border-box;
    background: url("~@/assets/img/redpackets/tixian5_btn@3x.png") no-repeat;
    background-size: 100% 100%;
    :nth-child(1) {
      width: 100%;
      height: 88px;
    }
  }
  .ruletitle {
    width: 470px;
    height: 40px;
    margin: 27px auto 37px;
    background: url("~@/assets/img/redpackets/rule@3x.png") no-repeat;
    background-size: 100% 100%;
  }
  .rule {
    width: 100%;
    padding: 0 85px;
    box-sizing: border-box;
    :nth-child(1) {
      font-size: 26px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(218, 156, 102, 1);
      line-height: 40px;
    }
    :nth-child(2) {
      margin-top: 27px;
      font-size: 26px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(218, 156, 102, 1);
      line-height: 40px;
    }
    :nth-child(3) {
      margin-top: 27px;
      font-size: 26px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(248, 187, 144, 1);
      line-height: 40px;
    }
  }
}
.sxfail-text {
  width:446px;
height:42px;
background:rgba(0,0,0,0.1);
border-radius:21px;
margin: 0 auto;
  margin-top: 30px;
  text-align: center;
span {
  font-size:26px;
font-family:Adobe Heiti Std R;
font-weight:normal;
color:rgba(248,187,144,1);
line-height:40px;
}
}
.showRecord-text {
    width:446px;
height:42px;
background:rgba(0,0,0,0.1);
border-radius:21px;
margin: 0 auto;
  margin-top: 30px;
  text-align: center;
span {
  font-size:26px;
font-family:Adobe Heiti Std R;
font-weight:normal;
color:rgba(248,187,144,1);
line-height:40px;
}
}

@media only screen and (min-device-width: 375px) and (min-device-height: 812px) {
  .canGetMoney {
    margin-top: 69px;
    margin-bottom: 110px;
  }
  .notGetMoney {
    margin-top: 69px;
    margin-bottom: 110px;
  }
  .gotx {
    margin-top: 69px;
    margin-bottom: 110px;
  }
  .SXfail,.SXing,.showRecord {
    margin-bottom: 102px;
  }
}
@media only screen and (min-device-width: 375px) and (max-device-height: 750px) {
  .redpackets .ruletitle {
    width: 470px;
    height: 40px;
    margin: 27px auto 37px;
    background: url("~@/assets/img/redpackets/rule@3x.png") no-repeat;
    background-size: 100% 100%;
    margin-top: 1rem;
  }
}
@media only screen and (max-device-width: 375px) and (max-device-height: 700px) {
  .redpackets .ruletitle {
    width: 470px;
    height: 40px;
    margin: 27px auto 37px;
    background: url("~@/assets/img/redpackets/rule@3x.png") no-repeat;
    background-size: 100% 100%;
    margin-top: 1rem;
  }
}
@media only screen and (max-device-width: 400px) and (max-device-height: 800px) {
  .redpackets .ruletitle {
    width: 470px;
    height: 40px;
    margin: 27px auto 37px;
    background: url("~@/assets/img/redpackets/rule@3x.png") no-repeat;
    background-size: 100% 100%;
    margin-top: 1rem;
  }
}
</style>
