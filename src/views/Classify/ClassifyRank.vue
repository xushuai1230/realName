<template>
	<div class="ClassifyRank">
		<div class="ClassifyRank__top van-hairline--top-bottom">
			<div class="topWrap clearfix">
				<div class="shopName fl" :class="{active: from !== '全部平台'}" @click="openShopNameModel">
					<span>{{from}}</span>
					<img src="~@/assets/img/classify/Triangle_grace_oa_down@3x.png" alt="" v-if="!shopNameModel && from === '全部平台'">
					<img src="~@/assets/img/classify/Triangle_grace_oa@3x.png" alt="" v-if="shopNameModel && from === '全部平台'">
					<img src="~@/assets/img/classify/Triangle_grace_red_oa_up@3x.png" alt="" v-if="shopNameModel && from !== '全部平台'">
					<img src="~@/assets/img/classify/Triangle_grace_red_oa_down@3x.png" alt="" v-if="!shopNameModel && from !== '全部平台'">
				</div>
				<div class="style fr" @click="changeStyleType">
					<img src="~@/assets/img/classify/search_change_col@3x.png" alt="" v-show="!styleType">
					<img src="~@/assets/img/classify/search_change_row@3x.png" alt="" v-show="styleType">
				</div>
				<div class="price fr" @click="changeSort">
					<span>价格</span>
					<img src="~@/assets/img/classify/Triangle_grance_0a@3x.png" alt="" v-show="sort === ''">
					<img src="~@/assets/img/classify/Triangle_grance_0b@3x.png" alt="" v-show="sort === 'asc'">
					<img src="~@/assets/img/classify/Triangle_grance_0c@3x.png" alt="" v-show="sort === 'desc'">
				</div>
			</div>
		</div>
		<div class="ClassifyRank__loading" v-if="!reqReady">
			<img src="~@/assets/img/loadding.gif" alt="">
		</div>
		<div class="ClassifyRank__list" :class="{type: styleType}" v-else-if="reqReady && goodsData && goodsData.length">
			<van-pull-refresh v-model="pullRefreshLoading" @refresh="onRefresh">
				<van-list class="list clearfix" v-model="loading" :finished="finished" @load="onLoad" :immediate-check="false">
					<div class="listItem fl" :class="styleType && index !==0 ? 'van-hairline--top' : ''" v-for="(item,index) in goodsData" :key="item.g_Id" @click="goDetail(item.g_Id, item.p_id)">
						<img v-lazy="item.g_img" alt="">
						<div class="info">
							<div class="name">{{item.g_title}}</div>
							<div class="bottom" v-if="!styleType">
								<div class="instalmentAmount clearfix">
									<span class="fl">{{item.p_from}}</span>
									<span class="fr">月供仅&yen;{{item.g_price | instalmentAmountFilter}}</span>
								</div>
								<div class="price clearfix">
									<span class="fl"><i>&yen;</i>{{item.g_price | directAmountFilter}}</span>
									<span class="fr" v-if="item.goodsComparPriceDtoList && item.goodsComparPriceDtoList.length">{{item.goodsComparPriceDtoList.length}}个比价</span>
								</div>
							</div>
							<div class="bottom" v-else>
								<!-- 有比价 -->
								<div class="compare" v-if="item.goodsComparPriceDtoList && item.goodsComparPriceDtoList.length">
									<div class="compareAmount clearfix">
										<span class="fl"><i>&yen;</i>{{item.g_price | directAmountFilter}}</span>
										<span class="fl">(月供仅&yen;{{item.g_price | instalmentAmountFilter}})</span>
										<span class="fr">{{item.p_from}}</span>
									</div>
									<div class="compareAmount clearfix">
										<span class="fl"><i>&yen;</i>{{item.goodsComparPriceDtoList[0]['price'] | directAmountFilter}}</span>
										<span class="fl">(月供仅&yen;{{item.goodsComparPriceDtoList[0]['price'] | instalmentAmountFilter}})</span>
										<span class="fr">{{item.goodsComparPriceDtoList[0]['p_from']}}</span>
									</div>
									<div class="btn">
										共{{item.goodsComparPriceDtoList.length}}个商城比价
									</div>
								</div>
								<!-- 无比价 -->
								<div class="noCompare" v-else>
									<div class="instalmentAmount">
										月供仅&yen;{{item.g_price | instalmentAmountFilter}}
									</div>
									<div class="directAmount clearfix">
										<span class="fl"><i>&yen;</i>{{item.g_price | directAmountFilter}}</span>
										<span class="fr">{{item.p_from}}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</van-list>
			</van-pull-refresh>
		</div>
		<div class="ClassifyRank__noData" v-else>
			<img src="~@/assets/img/blankpage_img_search@3x.png" alt="">
			<p>亲，您要的商品不在地球上哦~</p>
		</div>
		<div class="shopNameFixed" v-if="shopNameModel" @click="openShopNameModel">
			<ul class="clearfix" v-if="froms && froms.length">
				<li class="fl clearfix" :class="{active: from === item}" v-for="(item, index) in froms" :key="index" @click="changeShopName(item)">
					<span class="fl">{{item}}</span>
					<img class="fr" src="~@/assets/img/classify/Group 4@3x.png" alt="" v-if="from === item">
				</li>
			</ul>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'ClassifyRank',
  props: {},
  data () {
    return {
      froms: null,
      sk: '',
      brandId: '',
      sort: '',
      from: '全部平台',
      pageNum: 1,
      goodsData: null,
      pullRefreshLoading: false, // 下拉刷星
      loading: false,
      finished: false,
      shopNameModel: false,
      styleType: false,
      priceStatus: '',
      reqReady: false,
      isFirstEnter: false
    }
  },
  created () {
    this.$tj('entersearchresult')
    this.isFirstEnter = true
  },
  async activated () {
    if (!this.$route.meta.isBack || this.isFirstEnter) {
      try {
        await this.initPageData()
      } catch (error) {
        this.reqReady = true
      }
    }
    this.$route.meta.isBack = false
    this.isFirstEnter = false
  },
  methods: {
    async initPageData () {
      this.brandId = this.$route.params.id
      this.sk = this.$route.query.sk
      this.searchType = this.$route.query.searchType

      this.froms = null
      this.finished = false
      this.loading = false
      this.pageNum = 1
      this.pageCount = 0
      this.sort = ''
      this.from = '全部平台'
      this.goodsData = null
      this.shopNameModel = false
      this.styleType = false
      this.priceStatus = ''
      this.reqReady = false
      document.title = this.sk || '搜索结果'
      await this.selectQuery()
      window.scrollTo(0, 0)
    },
    changeStyleType () {
      this.styleType = !this.styleType
    },
    openShopNameModel () {
      this.shopNameModel = !this.shopNameModel
    },
    goDetail (id, source) {
      this.$router.push({
        name: 'GoodsDetail',
        params: {
          id: id,
          goodSource: source
        }
      })
    },
    reqReset () {
      this.pageNum = 1
      this.goodsData = null
      this.reqReady = false
    },
    async onRefresh () {
      // 下拉刷新
      this.reqReset()
      await this.selectQuery()
      this.pullRefreshLoading = false
    },
    async onLoad () {
      // 上拉加载
      this.pageNum++
      await this.selectQuery()
    },
    async changeSort () {
      if (this.sort === 'asc') {
        this.sort = 'desc'
      } else if (this.sort === 'desc') {
        this.sort = ''
      } else {
        this.sort = 'asc'
      }
      this.reqReset()
      await this.selectQuery()
      window.scrollTo(0, 0)
    },
    async changeShopName (name) {
      if (name !== this.from) {
        this.from = name
        this.reqReset()
        await this.selectQuery()
        window.scrollTo(0, 0)
      }
      this.shopNameModel = false
    },
    async selectQuery () {
      try {
        if (!this.searchType) {
          await this.getQueryGoods()
        } else {
          await this.getQuerySkGoods()
        }
      } catch (error) {
        this.reqReady = true
      }
    },
    getQueryGoods () {
      return this.$api['classify/queryGoods']({
        brandId: this.brandId ? this.brandId : '',
        sort: this.sort,
        from: this.from === '全部平台' ? '' : this.from,
        pageNum: this.pageNum
      }, {
        noShowLoading: true
      }).then(res => {
        this.pageCount = res.data.pageCount
        this.froms = res.data.froms
        this.finished = this.pageCount <= this.pageNum
        if (!this.goodsData) this.goodsData = res.data.items
        else this.goodsData = [...this.goodsData, ...res.data.items]
        this.loading = false
        if (!this.reqReady) this.reqReady = true
      })
    },
    getQuerySkGoods () {
      return this.$api['classify/searchGoods']({
        'app_params': {
          'from': this.from === '全部平台' ? '' : this.from,
          'deviceNo': '',
          'pageSize': 10,
          'userId': '',
          'sk': this.sk,
          'page': this.pageNum,
          'skId': this.brandId ? this.brandId : '',
          'priceSort': this.sort
        }
      }, {
        noStringify: true,
        noShowLoading: true
      }).then(res => {
        this.pageCount = res.data.pageCount
        this.froms = res.data.froms
        this.finished = this.pageCount <= this.pageNum
        if (!this.goodsData) this.goodsData = res.data.items
        else this.goodsData = [...this.goodsData, ...res.data.items]
        this.loading = false
        if (!this.reqReady) this.reqReady = true
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'GoodsDetail') {
      to.meta.isBack = true
    } else {
      to.meta.isBack = false
    }
    next()
  },
  filters: {
    instalmentAmountFilter (val) {
      let ret = Number(val)
      ret = (ret / 12 / 100).toFixed(2)
      return ret
    },
    directAmountFilter (val) {
      let ret = Number(val)
      ret = (ret / 100).toFixed(2)
      return ret
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/mixin.scss";
.ClassifyRank {
  &__top {
    position: fixed;
    top: 108px;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 88px;
    padding: 17px 69px;
    background-color: #fff;
    box-sizing: border-box;
    .shopName,
    .price {
      // width: 170px;
      height: 54px;
      background: rgba(240, 240, 240, 1);
      border-radius: 4px;
      text-align: center;
      padding: 0 18px;
      box-sizing: border-box;
      span {
        display: inline-block;
        height: 54px;
        font-size: 28px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 54px;
      }
      img {
        display: inline-block;
      }
    }
    .shopName {
      min-width: 160px;
      &.active {
        span {
          color: #f54b78;
        }
      }
      img {
        margin: 23px 6px;
        width: 13px;
        height: 8px;
      }
    }
    .price {
      width: 160px;
      margin-right: 120px;
      img {
        margin: 18px 5px;
        width: 13px;
        height: 18px;
      }
    }
    .style {
      img {
        margin: 1px 0;
        width: 52px;
        height: 52px;
      }
    }
  }
  &__list {
    &.type {
      padding: 0;
    }
    margin-top: 88px;
    padding: 20px;
  }
  &__noData {
    text-align: center;
    img {
      margin: 216px 0 6px 0;
      width: 380px;
      height: 380px;
    }
    p {
      height: 40px;
      font-size: 28px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #636363;
      line-height: 40px;
    }
  }
  &__loading {
    text-align: center;
    img {
      margin-top: 416px;
      width: 300px;
      height: 300px;
    }
  }
}
.type {
  .list {
    .listItem {
      position: relative;
      background-color: #fff;
      width: 100%;
      height: 280px;
      padding: 20px;
      box-sizing: border-box;
      margin: 0;
      img {
        position: absolute;
        top: 20px;
        left: 20px;
        width: 240px;
        height: 240px;
        margin: 0;
      }
      .info {
        position: relative;
        margin-left: 260px;
        padding-top: 11px;
        width: 440px;
        height: 229px;
      }
      .name {
        height: 72px;
        font-size: 28px;
        font-weight: 400;
        color: #333;
        line-height: 36px;
        @include text-overflow(2);
      }
      .instalmentAmount {
        height: 24px;
        font-size: 24px;
        font-weight: 400;
        color: #939393;
        line-height: 24px;
        margin-bottom: 15px;
      }
      .bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        .noCompare {
          .instalmentAmount {
            margin-bottom: 20px;
          }
          .directAmount {
            margin-bottom: 16px;
            span {
              color: #939393;
              &:first-of-type {
                height: 30px;
                i {
                  font-size: 24px;
                }
                font-size: 28px;
                font-weight: 400;
                color: rgba(237, 20, 91, 1);
                line-height: 30px;
              }
            }
          }
        }
        .compare {
          .compareAmount {
            margin-bottom: 16px;
            span {
              font-size: 24px;
              line-height: 30px;
              height: 30px;
              color: #999999;
              &:first-of-type {
                i {
                  font-size: 24px;
                }
                font-size: 28px;
                font-weight: 400;
                color: #ed145b;
              }
            }
          }
          .btn {
            width: 190px;
            height: 46px;
            line-height: 46px;
            background: rgba(245, 75, 120, 1);
            border-radius: 4px;
            color: #fff;
            text-align: center;
          }
        }
      }
    }
  }
}
.list {
  .listItem {
    background-color: #fff;
    width: 345px;
    height: 536px;
    padding: 10px;
    box-sizing: border-box;
    margin-bottom: 20px;
    &:nth-of-type(2n + 1) {
      margin-right: 20px;
    }
    img {
      width: 325px;
      height: 325px;
      margin-bottom: 20px;
    }
    .info {
      margin: 0 10px;
    }
    .name {
      height: 60px;
      font-size: 24px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 32px;
      @include text-overflow(2);
      margin-bottom: 20px;
    }
    .instalmentAmount {
      height: 24px;
      font-size: 24px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      margin-bottom: 15px;
    }
    .price {
      height: 40px;
      font-size: 28px;
      color: #ed145b;
      .fl {
        margin-top: 5px;
        height: 30px;
        i {
          font-size: 24px;
        }
      }
      .fr {
        width: 116px;
        height: 40px;
        background: rgba(245, 75, 120, 1);
        border-radius: 4px;
        color: #fff;
        font-size: 24px;
        line-height: 40px;
        font-weight: 400;
        text-align: center;
      }
    }
  }
}
.shopNameFixed {
  position: fixed;
  top: 196px;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  ul {
    padding: 15.5px 30px;
    box-sizing: border-box;
    background-color: #fff;
  }
  li {
    width: 320px;
    height: 40px;
    padding: 32.5px 0;
    font-size: 0;
    &:nth-of-type(2n + 1) {
      margin-right: 47px;
    }
    &.active {
      span {
        color: #f54b78;
      }
    }
    span {
      display: inline-block;
      font-size: 28px;
      font-weight: 400;
      color: #333;
      line-height: 40px;
    }
    img {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
