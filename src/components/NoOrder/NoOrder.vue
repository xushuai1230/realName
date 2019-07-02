<template>
	<div class="NoOrder">
		<div class="img-md">
      <img src="~@/assets/img/order/blankpage_img_search@2x.png">
    </div>
		<div class="empty-list-prompt-wrapper">
			<span class="empty-list-prompt">您还没有相关订单，可以去看看想买的商品哦！</span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  props: {},
  data () {
    return {}
  },
  components: {}
}
</script>

<style scoped lang="scss">
.NoOrder {
  text-align: center;
  .empty-list-promp {
    color: #939393;
    font-size: 28px;
  }
  .img-md {
    padding-top: 3.2rem;
    img {
      width: 4.8rem;
      height: 4.8rem;
    }
  }
}
</style>
