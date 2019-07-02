<template>
	<!-- 商品属性 -->
	<div class="goods van-hairline--top">
		<div class="goods__wrap clearfix">
			<div class="goodsImg fl">
				<img class="img-sm" :src="goodsImg">
			</div>
			<div class="goodsInfo fr">
				<div class="goodsInfo__name">{{goodsName}}</div>
				<div class="goodsInfo__sku">{{skuFillStr}}</div>
				<div class="goodsInfo__payDesc clearfix">
					<span class="fl instalment">
						月供:<i>&yen;{{instalmentAmount | priceFilter}}</i>起
					</span>
					<span class="goodsCount fr">&yen;{{promotionPrice | priceFilter}}x{{goodsNum}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  props: ['goodsName', 'goodsNum', 'goodsImg', 'promotionPrice', 'instalmentAmount', 'skuFillStr'],
  data () {
    return {}
  },
  components: {}
}
</script>

<style scoped lang="scss">
.goods {
  padding: 36px 30px 0;
  background-color: #fff;
}
.goodsImg {
  /* display: inline-block;
  vertical-align: top; */
  margin-right: 20px;
}
.goodsImg img {
  width: 180px;
  height: 180px;
}
.timeOut {
  left: 0;
  top: 0;
  position: absolute;
  text-align: center;
  width: 1.866667rem;
  height: 1.866667rem;
  /* z-index: 10; */
  font-size: 0.346667rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #fff;
  line-height: 1.866667rem;
  background: rgba(0, 0, 0, 0.5);
}
.goodsInfo {
  /* display: inline-block;
  vertical-align: top; */
  position: relative;
  width: 490px;
  height: 1.866667rem;
}
.goodsInfo__name {
  font-size: 0.373333rem;
  line-height: 0.533333rem;
  height: 0.533333rem;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
  /*盒子模型*/
  display: -webkit-box;
  /*显示的文本行数*/
  -webkit-line-clamp: 1;
  /*子元素的垂直排列方式*/
  -webkit-box-orient: vertical;
}
.goodsInfo__sku {
  font-size: 24px;
  height: 33px;
  line-height: 33px;
  margin-bottom: 56px;
  color: #939393;
  overflow: hidden;
  text-overflow: ellipsis;
  /*盒子模型*/
  display: -webkit-box;
  /*显示的文本行数*/
  -webkit-line-clamp: 2;
  /*子元素的垂直排列方式*/
  -webkit-box-orient: vertical;
}
.goodsInfo__payDesc {
  // position: absolute;
  // bottom: 0;
  // left: 0;
  width: 100%;
  font-size: 0.346667rem;
  line-height: 0.493333rem;
}
.goodsCount {
  color: #939393;
}
.instalment {
  font-size: 24px;
  color: #636363;
  i {
    font-size: 28px;
    color: #ed145b;
  }
}
</style>
