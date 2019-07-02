<template>
  <div class="deductible-gold">
    <div class="shadow" v-show="show" @click.self="close" @touchmove.prevent>
      <div class="rule">
        <img @click="close" class="del" src="~@/assets/img/userOrder/list_btn_delete_nol@3x.png" alt="">
        <dl>
          <dt>抵扣金使用规则</dt>
          <dd>1、您可以通过参加活动来获取还款抵扣金。</dd>
          <dd>2、抵扣金可在还款支付时使用，可抵消您的部分账单金额或全部账单金额。</dd>
          <dd>3、抵扣金不可提现，只能用于还款时抵扣使用。</dd>
          <dd>4、抵扣金暂时不支持每月的合并账单使用，小象正在努力。</dd>
        </dl>
      </div>
    </div>
    <div class="swipe-default-height" v-if="pages.length > 0">
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item,index) in pages" :key="index">
        <img class="swipe-inner-img" :src="item.thumbnailUrl" @click="jumpTarPage(item.gotoUrl)">
      </van-swipe-item>
    </van-swipe>
    </div>
    <div class="balance">
      <div class="clearfix mt25">
        <span class="fl ml28">抵扣金余额(元)</span>
        <span class="fr mr30" @click="open">使用规则</span>
      </div>
      <div class="use">还款时抵扣使用</div>
      <div class="sum">
        <span>&yen;</span>
        <span>{{deductAmount | priceFilters}}</span>
      </div>
      <div class="get-money" @click="gotoActivity()">下载app获取更多抵扣金</div>
    </div>
    <div class="content" v-if="deductData">
      <div v-if="packDeductData.length > 0" class="have">
        <div>
          <h3 class="detailed">收支明细</h3>
          <ul class="list">
            <li class="clearfix" v-for="(item,index) in packDeductData" :key="index">
              <span class="fl date">{{item.rewardTime | mdFilter}}</span>
              <span class="type">{{item.rewardType | rewardTypeFilter}}</span>
              <span class="fr amount">{{item.reward | priceFilters}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="nothing">
        <img src="~@/assets/img/userOrder/blankpage_img_waitpay@2x.png" alt="">
        <div>暂无收支明细</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      pages: [],
      show: false,
      deductData: null,
      deductAmount: '',
      DEDUCT_TYPE: {
        '11': '实名奖励（收入）',
        '12': '购物奖励（收入）',
        '14': '抵扣金还款返还（收入）',
        '22': '使用抵扣金还款（支出）',
        '15': '活动收入'
      }
    }
  },
  computed: {
    packDeductData () {
      if (!this.deductData) return []
      return this.deductData
    }
  },
  async created () {
    this.deductAmount = this.$route.params.deductAmount
    this.fetchBanners()
    this.fetchDetail()
  },
  beforeMount () {},
  mounted () {},
  methods: {
    gotoActivity () {
      location.href = 'https://api.xiaoxiangyoupin.cn/portal/download'
    },
    open () {
      this.show = true
    },
    close () {
      this.show = false
    },
    /**
     * 查询抵扣金详情
     */
    fetchDetail () {
      global.vbus.$emit('loading_show', true)
      this.$api['myBill/getDeductDetails']({ token: this.userToken })
        .then(data => {
          global.vbus.$emit('loading_show', false)
          this.deductData = data.rewards
        }).catch(err => {
          console.log(err)
          this.deductData = []
          global.vbus.$emit('loading_show', false)
        })
    },
    /**
     * 查询banner
     */
    fetchBanners () {
      // 10 抵扣金里面的类型
      this.$api['myBill/getBannersByType']({ type: 10 })
        .then(res => {
          this.pages = res.banners
        }).catch(err => {
          this.$toast(err)
        })
    },
    jumpTarPage (url) {
      location.href = url
    }
  },
  filters: {
    rewardTypeFilter (typeCode) {
      const typeText = this.DEDUCT_TYPE[typeCode]
      if (typeText) return typeText
      return ''
    },
    /**
     * 将复杂的格式 2018-03-01 17:13:31.0 转换为简单的格式
     */
    mdFilter (date) {
      let md = date.match(/\d{4}-(\d{2}-\d{2})/)
      if (md) return md[1]
      return ''
    }
  },
  components: {
  }
}
</script>
<style scoped>
.slider {
  height: 4.133333rem !important;
}
.balance {
  overflow: hidden;
  background: #fff;
  position: relative;
}
.mt25 {
  margin-top: 0.333333rem;
}
.ml28 {
  margin-left: 0.373333rem;
  font-family: PingFangSC-Regular;
  font-size: 0.4rem;
  color: #333;
  line-height: 0.346667rem;
}
.mr30 {
  margin-right: 0.4rem;
  font-family: PingFangSC-Regular;
  font-size: 0.346667rem;
  color: #999999;
  line-height: 0.346667rem;
}
.use {
  font-family: PingFangSC-Regular;
  font-size: 0.32rem;
  color: #999999;
  line-height: 0.346667rem;
  margin-left: 0.373333rem;
  margin-top: 0.133333rem;
}
.sum {
  margin-top: 0.4rem;
  text-align: center;
  font-family: PingFangSC-Semibold;
  font-size: 1.146667rem;
  color: #ff5767;
}
.get-money {
  width: 5.08rem;
  line-height: 0.8rem;
  margin: 0 auto;
  margin-top: 0.413333rem;
  text-align: center;
  border: 0.026667rem solid #f54b78;
  border-radius: 1.106667rem;
  font-family: PingFangSC-Regular;
  font-size: 0.373333rem;
  color: #ed145b;
  margin-bottom: 0.533333rem;
}
.line {
  height: 0.266667rem;
  background: #f6f6f6;
}
.detailed {
  font-family: PingFangSC-Regular;
  font-size: 0.346667rem;
  color: #333;
  letter-spacing: 0;
  line-height: 0.346667rem;
  margin-bottom: 0.333333rem;
}
.content {
  margin-top: 0.266667rem;
}
.list {
  text-align: center;
}
.list li {
  border-top: 0.026667rem solid #e7e7e7;
  line-height: 1.173333rem;
}
.date {
  font-family: PingFangSC-Regular;
  font-size: 0.346667rem;
  color: #333;
}
.type {
  font-family: PingFangSC-Regular;
  font-size: 0.373333rem;
  color: #333;
}
.amount {
  font-family: PingFangSC-Regular;
  font-size: 0.346667rem;
  color: #ed145b;
}
.shadow {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: rgba(0, 0, 0, 0.5);
}
.rule {
  background: #ffffff;
  border-radius: 0.266667rem;
  width: 7.333333rem;
  height: 7.586667rem;
  margin: 3.4rem auto;
  overflow: hidden;
  position: relative;
}
dt {
  text-align: center;
  font-family: PingFangSC-Regular;
  font-size: .453333rem;
  color: #333;
  padding: .746667rem 0 .533333rem;
  line-height: .64rem;
}
dd {
  width: 6rem;
  margin-left: 0.666667rem;
  font-family: PingFangSC-Regular;
  font-size: .373333rem;
  line-height: .533333rem;
  color: #333;
}
.del {
  position: absolute;
  right: 0.266667rem;
  top: 0.266667rem;
  width: 0.586667rem;
  height: 0.586667rem;
}
.have {
  background: #fff;
  padding: 0.533333rem;
}
.nothing {
  text-align: center;
}
.nothing img {
  display: block;
  margin: 0 auto;
  width: 4.8rem;
  height: 4.8rem;
}
.nothing div {
  background: #f2f2f2;
  font-family: PingFangSC-Regular;
  font-size: 0.346667rem;
  color: #636363;
  letter-spacing: 0;
}
.swipe-default-height {
  height: 5rem;
  overflow: hidden;
}
.swipe-inner-img {
  display: block;
  width: 100%;
}
</style>
