<template>
	<div @click="handleOpenModel" class="dragBtn">
		<img src="~@/assets/img/dragBtn@3x.png" alt="">
	</div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: '',

  watch: {
    getShowCouponDialogStatus (val) {
      this.dragShow = !val
    }
  },

  methods: {
    handleOpenModel (ev) {
      this.$tj('floverlayclick')
      this.setShowCouponDialogStatus(true)
      this.setDragStatus(false)

      console.log('打开立即兑换弹窗')
    },

    ...mapMutations(['setShowCouponDialogStatus', 'setDragStatus'])
  }

}

</script>

<style scoped lang="scss">
.dragBtn {
  position: fixed;
  bottom: 148px;
  right: 0;
  img {
    width: 170px;
    height: 160px;
  }
}
</style>
