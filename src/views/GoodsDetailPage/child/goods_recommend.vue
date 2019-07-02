<template>
	<div class="recommend" v-show="recommendShow">
		<ul class="recommend__list clearfix" :style="'width:' + goodsList.length * 3.5 + 'rem'">
        <router-link :to="{path:`/detail/${item.goodsCode}/${item.goodSource}`}" tag="li" v-for="(item,index) in goodsList" class="recommend__good good fl" :key="index">
          <img v-lazy="item.thumbnailUrl" class="good__img">
          <p class="good__name">{{item.subTitle}}</p>
          <p class="good__ins">
            <span>&yen;<i>{{(item.originalPrice/12) | priceFilter}}</i></span>
            <span>x{{item.instalmentPeriods}}期</span>
          </p>
        </router-link>
      </ul>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  props: ['goodsList'],
  data () {
    return {}
  },
  computed: {
    recommendShow () {
      let ret = false
      if (this.goodsList && this.goodsList.length) {
        ret = true
      }
      return ret
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/scss/mixin.scss';
.recommend::-webkit-scrollbar {
  display: none;
}
.recommend {
  width: 750px;
  min-height: 380px;
  overflow-y: hidden;
  overflow-x: scroll;
  background-color: #fff;
  margin-bottom: 20px;
  -webkit-overflow-scrolling: touch;
  &__list {
    position: relative;
  }
  .good {
    padding: 20px 0;
    margin-left: 20px;
    &__img {
      width: 240px;
      height: 240px;
      margin-bottom: 20px;
    }
    &__name {
      max-width: 240px;
      font-size: 24px;
      font-family: PingFangSC-Regular;
      color: #333;
      line-height: 28px;
      margin-bottom: 12px;
      height: 52px;
      @include text-overflow(2);
    }
    &__ins {
      font-family: PingFangSC-Regular;
      color: #939393;
      line-height: 28px;
      font-size: 0;
      text-align: center;
      span {
        display: inline-block;
        font-size: 20px;
        &:first-child {
          color: #ed145b;
          i {
            font-size: 28px;
          }
        }
      }
    }
  }
}
</style>
