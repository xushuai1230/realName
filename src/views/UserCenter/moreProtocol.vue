<template>
  <div class="moreProtocol">
    <div class="empty-protocolList"></div>
		<div class="MyinfoList">
			<ul>
				<li class="border" @click="goJelly">
					<p>《水母平台注册服务协议》</p>
					<div class="arrow"><img src="@/assets/img/nav_icon_back_nor@3x.png" alt=""></div>
				</li>
				<li class="border" @click="goJellyAdvisory">
					<p>《水母借款信息咨询服务协议》</p>
					<div class="arrow"><img src="@/assets/img/nav_icon_back_nor@3x.png" alt=""></div>
				</li>
        <li class="border" @click="goJellyBorrow">
					<p>《借款协议》</p>
					<div class="arrow"><img src="@/assets/img/nav_icon_back_nor@3x.png" alt=""></div>
				</li>
        <li @click="goJellyPay">
					<p>《代偿协议》</p>
					<div class="arrow"><img src="@/assets/img/nav_icon_back_nor@3x.png" alt=""></div>
				</li>
			</ul>
		</div>
  </div>
</template>

<script>
export default {
  name: 'moreProtocol',
  methods: {
    goJelly () {
      location.href = `https://cdn.basestonedata.com/app/service/jelly.html`
    },
    goJellyAdvisory () {
      location.href = `https://cdn.basestonedata.com/app/service/jellyAdvisory.html`
    },
    goJellyBorrow () {
      location.href = `https://cdn.basestonedata.com/app/service/jellyBorrow.html`
    },
    goJellyPay () {
      location.href = `https://cdn.basestonedata.com/app/service/jellyPay.html`
    }
  }
}
</script>

<style scoped lang="scss">
.empty-protocolList {
  width: 100%;
  height: .266667rem;
}
.MyinfoList {
  background: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  li {
    height: 1.28rem;
    position: relative;
    line-height: 1.28rem;
    p {
      display: inline-block;
      color: #333;
      font-size: 0.373333rem;
      margin-left: .4rem;
      font-family:PingFangSC-Regular;
    }
    span {
      display: inline-block;
      color: #939393;
      font-size: 0.373333rem;
      line-height: 1.386667rem;
      margin-left: 4.066667rem;
    }
    .arrow {
      height: 0.586667rem;
      width: 0.586667rem;
      position: absolute;
      right: 0.4rem;
      top: 0.346667rem;
    }
  }
}
.border {
  position: relative;
}

.border::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  border-bottom: 1px solid #e6e6e6;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  pointer-events: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
