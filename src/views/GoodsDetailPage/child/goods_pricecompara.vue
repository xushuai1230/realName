<template>
	<div class="comparePrice" v-if="goodsDetailData && goodsDetailData.comparePrices">
		<div class="comparePrice__title van-hairline--bottom">
			<span>全网比价</span>
		</div>
    <router-link :to="{path:`/detail/${item.goodsCode}/${item.goodSource}`}" tag="div" v-for="(item, index) in goodsDetailData.comparePrices" :key="index" class="comparePrice__item" :class="index < (goodsDetailData.comparePrices.length - 1) ?'van-hairline--bottom': ''" >
			<img :src="item.piconUrl">
			<span>{{item.pname}}</span>
			<span class="fr img">
				<img src="~@/assets/img/list_icon_enter_nol@3x.png" alt="">
			</span>
			<span class="fr fq">(月供仅&yen;{{item.instalmentAmount | priceFilter}})</span>
			<span class="fr price">&yen;{{item.originalPrice | priceFilter}}&nbsp;</span>
			<span v-if="index === 0" class="min fr">最低</span>
    </router-link>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  props: [
    'goodsDetailData', 'linkHref'
  ],
  data () {
    return {}
  },
  components: {}
}
</script>

<style scoped lang="scss">
.comparePrice {
  padding-left: 30px;
  background-color: #fff;
  text-align: left;
  margin-bottom: 20px;
  font-family: PingFangSC-Regular;
  &__title {
    height: 37px;
    font-size: 28px;
    font-family: PingFangSC-Medium;
    color: rgba(51, 51, 51, 1);
    line-height: 37px;
    padding: 25px 0;
  }
  &__item {
    letter-spacing: 0;
    font-size: 0;
    padding: 25px 30px 25px 0;
    img {
      width: 32px;
      height: 32px;
      display: inline-block;
      margin: 2px 10px 0 0;
    }
    span {
      display: inline-block;
      font-size: 28px;
      line-height: 37px;
      &.img {
        img {
          width: 44px;
          height: 44px;
          margin: -4px 0 0;
        }
      }
      .van-icon {
        margin-top: 5px;
        margin-left: 10px;
      }
      &.price {
        color: #ed145b;
      }
      &.min {
        background-color: #F54B78;
        color: #fff;
        padding: 1px 5px;
        border-radius: 4px;
        font-size: 20px;
        line-height: 28px;
        margin: 3.5px 30px 0 0;
      }
      &.fq {
        color: #636363;
        padding: 0 5px;
      }
    }
  }
}
</style>
