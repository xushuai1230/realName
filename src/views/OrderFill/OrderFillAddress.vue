<template>
	<div class="OrderFill__address" @click="jumpToAddress">
		<div class="no clearfix" v-if="!curAdreess">
			<div class="left">
				<img src="~@/assets/img/list_address_white@3x.png" alt="">
				<span>请填写收货人信息</span>
			</div>
			<div class="right">
				<img src="~@/assets/img/list_disclosure_indicator_nol_white@3x.png" alt="">
			</div>
		</div>
		<div class="addressInfo" v-else>
			<!-- 商品订单 收货人，手机号，收货地址  -->
			<div class="addressInfo__name">
				<span>{{curAdreess && curAdreess.person}}</span>
				<span>{{curAdreess && curAdreess.mobilePhone}}</span>
				<span v-if="curAdreess && curAdreess.isDefault">默认</span>
			</div>
			<div class="addressInfo__address">
				<img src="~@/assets/img/list_icon_address_red@3x.png">
				<span>{{curAdreess | addressFilter}}</span>
			</div>
			<div class="addressInfo__arrow">
				<img src="~@/assets/img/list_icon_enter_nol@3x.png" alt="">
			</div>
		</div>
	</div>
</template>
<script>
export default {
  props: ['curAdreess'],
  computed: {
    person () {
      return this.curAdreess && this.curAdreess.person
    },
    mobilePhone () {
      return this.curAdreess && this.curAdreess.mobilePhone
    },
    address () {
      return this.curAdreess && this.curAdreess.address
    }
  },
  methods: {
    jumpToAddress () {
      this.$router.push({
        'name': 'Address',
        'query': {
          from: 'OrderFill'
        }
      })
    }
  },
  filters: {
    addressFilter (val) {
      if (val) return `${val.province}${val.city}${val.county}${val.address}`
      else return ''
    }
  }
}
</script>
<style lang="scss" scoped>
.addressInfo {
  position: relative;
  margin-top: .266667rem;
  padding: 0.293333rem 0.4rem 0.293333rem 0.666667rem;
  background-color: #fff;
  &__name {
    height: 0.533333rem;
    font-size: 0.373333rem;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    line-height: 0.533333rem;
    margin-bottom: 0.173333rem;
    span {
      margin-right: 40px;
      &:nth-of-type(3) {
        height: 30px;
        background: rgba(245, 75, 120, 1);
        border-radius: 4px;
        color: #fff;
        font-size: 24px;
        font-weight: 400;
        line-height: 30px;
        padding: 0 11px;
      }
    }
  }
  &__address {
    position: relative;
    // height: 0.44rem;
    font-size: 0.32rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 0.44rem;
    img {
      position: absolute;
      left: -0.48rem;
      top: 0;
      width: 0.426667rem;
      height: 0.426667rem;
    }
    span {
      display: inline-block;
      width: 600px;
    }
  }
  &__arrow {
    position: absolute;
    top: 0.573333rem;
    right: 0.4rem;
    img {
      display: block;
      width: 0.586667rem;
      height: 0.586667rem;
    }
  }
}
.no {
  height: 88px;
  background: rgba(245, 75, 120, 1);
  padding: 14px 20px;
  box-sizing: border-box;
  .left {
    float: left;
    img {
      width: 60px;
      height: 60px;
      margin-right: 20px;
    }
    span {
      height: 60px;
      font-size: 28px;
      font-weight: 400;
      color: #fff;
      line-height: 60px;
    }
  }
  .right {
    float: right;
    img {
      width: 44px;
      height: 44px;
      margin-top: 8px;
    }
  }
}
</style>
