<template>
	<div class="myBill" v-extend-height>
		<!-- <div class="tips clearfix" v-if="isFeizuxia" @click="lookDetail()">
			<span class="fl">还款抵扣金：¥{{deductAmount | priceFilters}}</span>
			<span class="fr">查看详情>></span>
		</div> -->
		<div class="order-tab">
			<div class="order-tab__left" @click="changeTab('orderBill',0)">
				<div class="btn1">
					<p :style="iscomponents==='orderBill'?{color:'#ED145B'} : ''">未结清</p>
					<div class="line" :style="iscomponents==='orderBill'?{background:'#ED145B'} : ''"></div>
				</div>
			</div>
			<div class="order-tab__right" @click="changeTab('orderAlreadyBill',1)">
				<div class="btn2">
					<p :style="iscomponents==='orderAlreadyBill'?{color:'#ED145B'} : ''">已结清</p>
					<div class="line" :style="iscomponents==='orderAlreadyBill'?{background:'#ED145B'} : ''"></div>
				</div>
			</div>
		</div>
		<div :is="iscomponents"></div>
	</div>
</template>

<script>
import orderBill from '@/views/MyBill/OrderBill' // 账单 未结清
import orderAlreadyBill from '@/views/MyBill/OrderAlreadyBill' // 账单 已结清
export default {
  name: 'myBill',
  data () {
    return {
      iscomponents: 'orderBill',
      deductAmount: ''
    }
  },
  computed: {
    isFeizuxia () {
      let ua = navigator.userAgent.toLocaleLowerCase()
      if (ua.match(/feizuxia/)) {
        return false
      }
      return true
    }
  },
  components: {
    orderBill,
    orderAlreadyBill
  },
  async created () {
    // this.getDeduct()
  },
  mounted () {
  },
  methods: {
    catchErr (promise) {
      return promise.then(data => {
        return [null, data]
      }).catch(err => [err])
    },
    /**
     * 查询还款抵扣金
     */
    async getDeduct () {
      let err, res
      [err, res] = await this.catchErr(this.$api['myBill/getDeductByUserId']({ token: this.userToken }))
      if (err) {
        let error = err
        if (err.message) {
          error = err.message
        }
        this.$toast(error)
        return
      }
      if (res) {
        this.deductAmount = res.deductAmount
      }
    },
    lookDetail () {
      this.$router.push({
        name: 'Deduction',
        params: { deductAmount: this.deductAmount },
        query: { token: this.userToken }
      })
    },
    changeTab (name, index) {
      this.iscomponents = name
      let titleArr = ['未结清', '已结清']
      document.title = titleArr[index]
    }
  }

}
</script>

<style scoped lang="scss">
.myBill{
  background: #f2f2f2;
}
.order-tab {
   height: 1.066667rem;
   margin-bottom: 0.266667rem;
  &__left,
  &__right {
    width: 50%;
    float: left;
    text-align: center;
    background: #fff;
    .btn1 {
      display: inline-block;
      position: relative;
    }
    .btn2 {
      display: inline-block;
      position: relative;
    }
    p {
      font-size: .373333rem;
      font-family: SFNSDisplay;
      line-height: 1.066667rem;
      color: #636363;
    }
    .line {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0.066667rem;
    }
  }
}
.tips {
  width: 100%;
  padding: 0.373333rem 0.4rem;
  background: #fff7de;
  font-size: 0.346667rem;
  color: #6a5829;
  height: 1.2rem;
  z-index: 111;
  box-sizing: border-box;
}
</style>
