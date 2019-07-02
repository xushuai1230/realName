<template>
  <div class="blankpage">
      <div class="bankImg">
          <img src="~@/assets/img/facecard/blankpage_img_waitpay@3x.png" alt="">
      </div>
      <slot name="prompt"></slot>
      <slot name="goInvitation"></slot>
  </div>
</template>

<script>
export default {
  name: 'vipCard',
  data () {
    return {}
  }
}
</script>

<style scoped lang="scss">
.bankImg {
  width: 4.8rem;
  height: 4.8rem;
  margin: 0 auto;
  padding-top: 4rem;
}
.prompt{
font-size: .373333rem;
color: #636363;
text-align: center;
margin-top:.12rem;
font-family:PingFangSC-Regular;
}
.goInvitation{
  font-size: .373333rem;
  color:#ED145B;
  font-family:PingFangSC-Regular;
  text-align: center;
  margin-top:.68rem;
}
</style>
