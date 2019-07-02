<template>
	<div v-cloak class="MyBillPaySuccess" v-extend-height>
		<div class="MyBillPaySuccess__image">
			<img src="~@/assets/img/userOrder/img_repay_success.png" alt="">
		</div>
		<div :class="{isTrue:isTrue}" v-show="hasData" class="MyBillPaySuccess__info">
			<p  v-html="title"></p>
			<p  v-html="tip"></p>
		</div>
		<div class="MyBillPaySuccess__btn" v-show="hasData">
			<button @click="goShopping" class="goshopping">{{leftBtnTxt}}</button>
			<button @click="payNow" class="paynow">{{rightBtnTxt}}</button>
		</div>
	</div>
</template>

<script>
export default {
  data () {
    return {
      hasData: false,
      isTrue: true,
      title: {
        titleOne: '还款成功',
        titleTwo: '还款抵扣金可以直接<span class="title">抵扣账单金额</span>!'
      },
      tip: {
        tipOne: '按期进行账单还款会获得更高的信用额度',
        tipTwo: '点击"<span class="tip">立赚还款金</span>"可抢千元还款抵扣金!'
      },
      btnOne: {
        btn1: '继续逛逛',
        btn2: '查看账单'
      },
      btnTwo: {
        btn1: '立赚还款金',
        btn2: '查看账单'
      },
      leftBtnTxt: '',
      rightBtnTxt: '',
      repaySite: ''
    }
  },
  async created () {
    this.hasData = true
    this.isTrue = this.isTrue
    this.title = this.title.titleOne
    this.tip = this.tip.tipOne
    this.leftBtnTxt = this.btnOne.btn2
    this.rightBtnTxt = this.btnOne.btn1
    // this.getparamValue()
  },
  methods: {
    // 获取参数
    getparamValue () {
      this.$api['myBill/getParamValue']()
        .then(res => {
          if (res.paramValue !== undefined) {
            this.hasData = true
          }
          if (res.paramValue === '') {
            this.isTrue = this.isTrue
            this.title = this.title.titleOne
            this.tip = this.tip.tipOne
            this.leftBtnTxt = this.btnOne.btn2
            this.rightBtnTxt = this.btnOne.btn1
          } else {
            this.repaySite = res.paramValue
            this.isTrue = false
            this.title = this.title.titleTwo
            this.tip = this.tip.tipTwo
            this.leftBtnTxt = this.btnTwo.btn2
            this.rightBtnTxt = this.btnTwo.btn1
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    goShopping () {
      this.$router.push({ name: 'myBill' })
    },
    payNow () {
      let href = this.repaySite
      if (href) {
        location.href = href
      } else {
        this.$router.push({ name: 'shopHome' })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.MyBillPaySuccess {
  padding-top: 1.613333rem;
   background: #f2f2f2;
}
.MyBillPaySuccess__image {
  width: 4.8rem;
  height: 4.8rem /* 402/40 */;
  margin: 0 auto;
  background-size: 100%;
  /* margin-top: 1rem; */
}
.iMyBillPaySuccess__image img {
  width: 100%;
  height: 100%;
}
/* 字体颜色  */
.isTrue {
  color: rgb(94, 94 94);
  font-size: 0.3rem /* 28/40 */;
}
.MyBillPaySuccess__info p:first-child {
  font-size: .453333rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: .64rem;
  text-align: center;
  padding: .186667rem 0 .28rem 0;
}
.MyBillPaySuccess__info p:nth-child(2) {
  font-size: .373333rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(147, 147, 147, 1);
  line-height: .533333rem;
  text-align: center;
}
.title {
  color: rgb(240, 8, 89);
}
.tip {
  color: rgb(233, 36, 38);
}
.MyBillPaySuccess__btn {
  margin-top: 1.2rem;
  text-align: center;
  white-space: nowrap;
}
.MyBillPaySuccess__btn button {
  display: inline-block;
  width: 4.133333rem;
  line-height: 1.12rem;
  border: none;
  border-radius:.053333rem;
  font-size: 0.426667rem;
  color: #fff;
  font-size: .426667rem;
}
.MyBillPaySuccess__btn .goshopping {
  background-color: #ff9450;
  margin-right: 0.5rem;
}
.MyBillPaySuccess__btn .paynow {
  background-color: #f54b78;
}
</style>
