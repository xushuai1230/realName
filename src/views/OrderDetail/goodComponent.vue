<template>
	<div class="orderHeader-goods" @click="goGoodsDetail">
		<div class="orderHeader-goods_wrapper clearfix">
			<div class="goodsImg fl">
				<img class="img-sm" :src="goods.goodsImageUrl">
			</div>
			<div class="goodsInfo fr">
				<div class="goodsInfo__name">{{goods.goodsName}}</div>
				<div class="goodsInfo__sku">{{goods.skuProps | skuPropsFilter}}</div>
				<div class="goodsInfo__payDesc clearfix">
					<template >
						<span class="fl instalment recoveryMoney">
							&yen;{{order.goodsTotalMoney | priceFilter}}
						</span>
					</template>
					<span class="goodsCount fr">x{{goods.goodsCount}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
export default {
  name: '',
  props: {
    goods: {
      type: Object,
      default: null
    },
    instalment: {
      type: Boolean,
      default: null
    },
    order: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: 'detail'
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['userId', 'userToken'])
  },
  methods: {
    goGoodsDetail () {
    }
  }
}
</script>

<style scoped>
.orderHeader-goods {
  padding: 0.466667rem 0.4rem 0;
  /* padding: .12rem .053333rem; */
  background-color: #fff;
  box-sizing: border-box;
}
.orderHeader-goods_wrapper {
  /* padding-bottom: 0.4rem; */
}
.goodsImg {
  width: 2.106667rem;
  height: 2.106667rem;
}
.goodsImg img {
  width: 100%;
  height: auto;
}
.timeOut {
  left: 0;
  top: 0;
  position: absolute;
  text-align: center;
  width: 1.866667rem;
  height: 1.866667rem;
  z-index: 10;
  font-size: 0.346667rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #fff;
  line-height: 1.866667rem;
  background: rgba(0, 0, 0, 0.5);
}
.goodsInfo {
  position: relative;
  width: 6.8rem;
  height: 1.866667rem;
}
.goodsInfo__name {
  font-size: 0.373333rem;
  line-height: 0.533333rem;
  height: 0.533333rem;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.026667rem;
  /*盒子模型*/
  display: -webkit-box;
  /*显示的文本行数*/
  -webkit-line-clamp: 1;
  /*子元素的垂直排列方式*/
  -webkit-box-orient: vertical;
  color: #333;
}
.goodsInfo__sku {
  font-size: .32rem;
  height: 2.4em;
  line-height: 0.4rem;
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
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 0.346667rem;
  line-height: 0.493333rem;
}
.goodsCount {
  color: #939393;
  font-size: .373333rem;
}
.instalment {
  font-size: .426667rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(237,20,91,1);
}
.scale-1px-bottom {
  border: none;
  position: relative;
}
.scale-1px-bottom:before {
  content: '';
  position: absolute;
  display: block;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
.f666 {
  color: #636363;
}
</style>
