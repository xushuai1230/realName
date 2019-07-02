<template>
	<div class="ClassifyList">
		<div class="ClassifyList__index fl">
			<ul class="wrap" v-if="indexList">
				<li v-for="(item, index) in indexList" :class="{active: index === currentIndex}" :key="item.brandId" @click="changeBrandId(item.brandId, index)">
					<div></div>
					<span>{{item.brandName}}</span>
				</li>
			</ul>
		</div>
		<div class="ClassifyList__loading fl" v-if="!reqReady">
			<img src="~@/assets/img/loadding.gif" alt="">
		</div>
		<div class="ClassifyList__list fl" v-else-if="reqReady && currentData">
			<div class="recommend" v-if="currentData && currentData.imageList && currentData.imageList.length">
				<van-swipe :autoplay="3000">
					<van-swipe-item v-for="(image, index) in currentData.imageList" :key="index">
						<img v-lazy="image.imageUrl" />
					</van-swipe-item>
				</van-swipe>
			</div>
			<div class="ground van-hairline--bottom" v-for="ground in currentData.secondClass" :key="ground.secondId">
				<div class="title">{{ground.secondName}}</div>
				<div class="goodsWrap clearfix">
					<div class="goods" v-for="goods in ground.goodsInfo" :key="goods.goodsId" @click="jumpRank(goods.goodsId)">
						<img :src="goods.imageUrl" alt="">
						<div>{{goods.goodsName}}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'ClassifyList',
  props: {},
  data () {
    return {
      indexList: null,
      childData: null,
      currentBrandId: '',
      currentIndex: 0,
      reqReady: false
    }
  },
  computed: {
    currentData () {
      if (!this.childData) return []
      return this.childData[this.currentIndex]
    }
  },
  async created () {
    await this.getBrandClassify()
    await this.getGoodsClassName()
  },
  methods: {
    jumpRank (id) {
      this.$router.push({
        name: 'ClassifyRank',
        params: {
          id: id
        }
      })
    },
    changeBrandId (id, index) {
      this.currentBrandId = id
      this.currentIndex = index
      if (this.childData && this.childData[index]) return
      this.reqReady = false
      this.getGoodsClassName(index)
    },
    getBrandClassify () {
      return this.$api['classify/brandClassify']({}, {
        noShowLoading: true,
        headers: {
          token: this.userToken
        }
      }).then(res => {
        this.indexList = res.data
        this.currentBrandId = this.indexList[0].brandId
      })
    },
    getGoodsClassName (index) {
      this.$api['classify/goodsClassName']({
        brandId: this.currentBrandId
      }, {
        noShowLoading: true
      }).then(res => {
        if (!index) {
          this.childData = []
          this.$set(this.childData, 0, res)
        } else {
          this.$set(this.childData, index, res)
        }
        this.reqReady = true
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/scss/mixin.scss';
.ClassifyList {
  height: 100%;
  &__index,
  &__list {
    position: static;
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  &__index::-webkit-scrollbar {
    display:none;
    width: 0;
  }
  &__list::-webkit-scrollbar {
    display:none;
    width: 0;
  }
  &__loading {
    width: 570px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 300px;
      height: 300px;
    }
  }
  &__index {
    background: rgba(248, 249, 250, 1);
    width: 180px;
    li {
      position: relative;
      height: 88px;
      text-align: center;
      &.active {
        background-color: #fff;
        div {
          position: absolute;
          top: 19px;
          left: 0;
          width: 6px;
          height: 50px;
          background: rgba(237, 20, 91, 1);
          border-radius: 3px;
        }
        span {
          color: rgba(237, 20, 91, 1);
        }
      }
      span {
        font-size: 28px;
        font-weight: 500;
        color: #777777;
        line-height: 88px;
      }
    }
  }
  &__list {
    padding: 30px;
    background-color: #fff;
    width: 570px;
    box-sizing: border-box;
    .recommend {
      width: 510px;
      height: 230px;
      img {
        width: 510px;
        height: 230px;
      }
    }
    .ground {
      .title {
        margin: 36px 0;
        height: 40px;
        font-size: 28px;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 40px;
      }
      .goodsWrap {
        padding: 0 14px;
        .goods {
          margin: 0 73px 40px 0;
          font-size: 0;
          text-align: center;
          width: 112px;
          float: left;
          &:nth-of-type(3n + 3) {
            margin-right: 0;
          }
          img {
            display: block;
            width: 112px;
            height: 112px;
            background: rgba(244, 244, 244, 1);
            border-radius: 60px;
            margin-bottom: 30px;
          }
          div {
            height: 37px;
            font-size: 28px;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 37px;
            width: 112px;
            @include text-overflow(1);
          }
        }
      }
    }
  }
  &__index::-webkit-scrollbar,
  &__list::-webkit-scrollbar {
    display: none;
  }
}
</style>
