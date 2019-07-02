<template>
	<div class="ground">
		<div class="home-banner" v-if="bannerUrl">
			<img v-lazy="bannerUrl">
		</div>
		<div class="ground__tabs">
			<Goods :childGoods="goods" :lineShow="lineShow"></Goods>
		</div>
	</div>
</template>
<script type="text/javascript">
import Goods from './Goods'

export default {
  name: 'GroundNormal',
  data () {
    return {
      goods: [],
      lineShow: false,
      shareTitle: '',
      shareBannerUrl: '',
      isFirstEnter: false
    }
  },
  computed: {
    bannerUrl () {
      return this.goods && this.goods.bannerUrl
    }
  },
  created () {
    // let id = this.$route.params.id
    this.isFirstEnter = true
  },
  async activated () {
    if (!this.$route.meta.isBack || this.isFirstEnter) {
      let id = this.$route.params.id
      this.$tj(`enterparty`, {
        id
      })
      await this.fetchGoods(id)
    }
    this.$route.meta.isBack = false
    this.isFirstEnter = false
  },
  methods: {
    fetchGoods (id) {
      return this.$api['goods/queryGoodsByBannerIdV2']({
        childId: id
      }).then(async res => {
        let displayColumns = res.data && res.data.displayColumns
        if (!displayColumns) displayColumns = 2
        this.goods = res.data
        this.lineShow = displayColumns !== 2
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'GoodsDetail') {
      to.meta.isBack = true
    }
    next()
  },
  filters: {
    payByMonth (value) { // 分期金额
      var payPrice = (value / 100).toFixed(2)
      return `${payPrice}`
    },
    directPay (value) { // 直付立减
      return `直付立减${(value / 100).toFixed(2)}`
    }
  },
  components: {
    Goods
  }
}
</script>
<style lang="scss">
.ground {
  .van-tab--active {
    color: #ed145b !important;
  }
  .van-tabs--line {
    padding-top: 1.013333rem;
    .van-tabs__wrap {
      height: 1.013333rem;
      .van-tab {
        font-family: PingFangSC-Regular;
        font-size: 0.346667rem;
        color: #636363;
        letter-spacing: 0;
        text-align: center;
        height: 1.013333rem;
        line-height: 1.013333rem;
      }
    }
  }
  .van-tabs__line {
    height: 0.053333rem;
    background: rgba(245, 75, 120, 1);
    border-radius: 0.053333rem;
  }
}
</style>
<style lang="scss" scoped>
.home-banner {
  // height: 380px;
}
</style>
