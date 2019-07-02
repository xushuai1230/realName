<template>
	<!-- 商品属性 -->
	<div class="goodsSku" v-if="skuShow">
		<ul class="goodsSku__list" ref="list">
			<li class="goodsSku__item " :class="{'van-hairline--bottom': index !== propertyValues.length - 1}" v-for="(item, index) in propertyValues" :key="index">
				<span>{{item.property.name}}</span>
				<span>{{item.option.propertyOptionsValue}}</span>
			</li>
		</ul>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  props: ['goodsDetailData'],
  computed: {
    skuShow () {
      let ret = false
      if (this.goodsDetailData && this.goodsDetailData.propertyValues) {
        ret = true
      }
      return ret
    },
    propertyValues () {
      return this.goodsDetailData && this.goodsDetailData.propertyValues
    }
  },
  mounted () {
    // if (this.$refs.list) {
    //   let bodyHeight = document.documentElement.clientHeight
    //   this.$refs.list.style.minHeight = bodyHeight + 'px'
    // }
  }
}
</script>

<style scoped lang="scss">
.goodsSku {
  padding:0 30px;
  color: #636363;
  font-size: 24px;
  background-color: #fff;
  &__item {
    padding: 20px 0;
    text-align: left;
    display: flex;
    span {
      display: inline-block;
      line-height: 40px;
      word-wrap:break-word;
      &:first-child {
				min-width: 200px;
				max-width: 200px;
      }
      &:last-child {
        width: 490px;
        text-indent: 20px;
      }
    }
  }
}
</style>
