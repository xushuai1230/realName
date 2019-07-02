<template>
	<div class="ground">
		<div class="home-banner" v-if="bannerUrl">
			<img v-lazy="bannerUrl">
		</div>
		<div class="ground__tabs">
			<van-tabs v-model="active" sticky swipeable :line-width="Number(60)" v-if="goodsGroup && goodsGroup.childBanners">
				<van-tab v-for="(item, index) in goodsGroup.childBanners" :key="index" :title="item.title || '实例标题'">
					<Goods :childGoods="currentGoods" :lineShow="currentLineShow"></Goods>
				</van-tab>
			</van-tabs>
		</div>
	</div>
</template>
<script type="text/javascript">
import Goods from './Goods'

export default {
  name: 'Ground',
  data () {
    return {
      goods: [],
      goodsGroup: null,
      lineShow: false,
      shareTitle: '',
      shareBannerUrl: '',
      currentId: 0,
      navId: 0,
      active: 0,
      isFirstEnter: false
    }
  },
  computed: {
    bannerUrl () {
      if (this.goodsGroup) {
        return this.goodsGroup && this.goodsGroup.bannerUrl
      } else {
        return this.goods && this.goods.bannerUrl
      }
    },
    currentGoods () {
      return this.goods[this.currentId]
    },
    currentLineShow () {
      let displayColumns = this.currentGoods && this.currentGoods.displayColumns
      if (!displayColumns) displayColumns = 2
      return displayColumns === 3
    }
  },
  created () {
    this.isFirstEnter = true
    // this.navId = this.$route.params.id
  },
  async activated () {
    if (!this.$route.meta.isBack || this.isFirstEnter) {
      this.navId = this.$route.params.id
      this.active = this.$route.params.category === 'pv' ? 0 : this.$route.params.category
      this.$tj(`enterparty`, {
        id: this.navId
      })
      await this.fetchGoodsGroup()
      await this.fetchGoods(this.currentId)
    }
    this.$route.meta.isBack = false
    this.isFirstEnter = false
  },
  methods: {
    async changeActive (index) {
      this.currentId = this.goodsGroup.childBanners[index].id
      this.fetchGoods()
    },
    fetchGoods (id) {
      if (this.goods[id]) return

      return this.$api['goods/queryGoodsByBannerIdV2']({
        childId: id
      }).then(async res => {
        this.$set(this.goods, id, res.data)
        this.goods[id] = res.data
      })
    },
    fetchGoodsGroup () {
      return this.$api['goods/childBanners']({
        id: this.navId
      }).then(res => {
        this.goodsGroup = res.banner
        this.currentId = this.goodsGroup.childBanners[this.active].id
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
  watch: {
    active: {
      immediate: true,
      handler: async function (newV) {
        if (!this.goodsGroup) return
        this.currentId = this.goodsGroup.childBanners[newV].id
        await this.fetchGoods(this.currentId)
      }
    }
  },
  components: {
    Goods
  }
}
</script>
<style lang="scss">
.ground {
  .van-tab {
    min-width: 1.8rem;
    flex: none;
  }
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
