<template>
	<div class="productDetail">
		<!-- 商品图片介绍 -->
		<div v-if="imageShow" class="productDetail__image">
			<img v-for="(item,index) in goodsDetailData.images" v-lazy="item.imageUrl" :key="index">
		</div>

		<!-- 品牌故事 -->
		<div v-if="brandShow" class="productDetail__brand brand">
			<div class="areaTitle">
				<span class="van-hairline--right">品牌故事</span>
				<span>Brand story</span>
			</div>
			<div class="brand__img">
				<img :src="goodsDetailData.brand.logo" />
			</div>
			<div class="brand__intro">
				{{goodsDetailData.brand.introduce}}
			</div>
		</div>
		<!-- 售后 -->
		<div v-if="platforminfo && platforminfo.length>0" class="productDetail__platform">
			<div class="areaTitle">
				<span class="van-hairline--right">售后与平台介绍 </span>
				<span>After sale and platform</span>
			</div>
			<div class="platformInfo" v-for="(item,index) in platforminfo" :key="index">
				<p class="platformInfo__title">{{item.title}}</p>
				<p class="platformInfo__desc">{{item.context}}</p>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  props: ['goodsDetailData', 'platforminfo'],
  data () {
    return {}
  },
  computed: {
    imageShow () {
      let ret = false
      if (this.goodsDetailData && this.goodsDetailData.images && this.goodsDetailData.images.length > 0) {
        ret = true
      }
      return ret
    },
    brandShow () {
      let ret = false
      if (this.goodsDetailData && this.goodsDetailData.brand && this.goodsDetailData.brand.logo) {
        ret = true
      }
      return ret
    },
    platforminfoShow () {
      let ret = false
      if (this.firstPlatforminfo && this.firstPlatforminfo.length > 0) {
        ret = true
      }
      return ret
    }
  }
}
</script>

<style scoped lang="scss">
.p30 {
  padding: 20px 30px !important;
}
.productDetail {
  background-color: #f2f2f2;
  &__image,
  &__brand {
    margin-bottom: 20px;
    background-color: #fff;
  }
	&__image {
    padding: 20px 0;
	}
  &__platform {
    padding: 20px 30px;
    font-size: 28px;
    text-align: left;
    background-color: #fff;
  }
}
.brand {
	padding: 20px 30px;
  &__img {
    text-align: center;
    img {
      width: 220px;
      height: 220px;
      margin: 0 auto;
    }
  }
  &__intro {
    padding: 20px 0;
		text-align: left;
		line-height: 36px;
		color: #636363;
  }
}
.areaTitle {
  padding: 20px 0;
  line-height: 40px;
  text-align: left;
  background: #fff;
  font-size: 0;
  span {
    display: inline-block;
    font-size: 28px;
    &:first-child {
      padding-right: 20px;
      font-size: 30px;
      color: #333;
    }
    &:last-child {
      padding-left: 20px;
      color: #636363;
    }
  }
}
.platformInfo {
  line-height: 2;
  color: #636363;
  margin-bottom: 20px;
	font-size: 24px;
  &__title {
    margin-bottom: 30px;
  }
	&__desc {
		line-height: 36px;
	}
}
</style>
