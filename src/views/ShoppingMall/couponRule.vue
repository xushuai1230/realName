<template>
  <div class="couponRule" ref="couponRule">
    <div class="couponRule-text">
      <p>1、各类卡券限量50万份大放送，先到先得，领完为止；</p>
      <p>2、现金红包为新人专享福利，领取后可在“微博-我的-微博钱包-分期商城”中“我的”页面进行支付宝提现，提现需成功授信，每位新用户限领1次；</p>
      <p>3、10元优惠券，仅限在分期商城分期购物使用，不限商品，单个用户1次只能使用一张；</p>
      <p>4、20元优惠券，仅限在分期商城分期购物使用，单个用户1次只能使用一张；</p>
      <p>5、100元优惠券，仅限在分期商城分期购物使用，仅限数码类部分商品，单个用户1次只能使用一张；</p>
      <p>6、新浪分期商城保留对本次活动所涉及卡券的最终解释权。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'couponRule',
  mounted () {
    let bodyHeight = document.documentElement.clientHeight
    this.$refs.couponRule.style.minHeight = bodyHeight + 'px'
  }
}
</script>

<style scoped>
.couponRule {
  background: #fff;
  padding: 40px;
}
.couponRule-text p {
  font-size: 28px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:#636363;
  line-height: 40px;
  margin-bottom: 24px;
}
</style>
