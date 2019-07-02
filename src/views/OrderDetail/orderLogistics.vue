<template>
	<div class="orderLogistics" ref="orderLogistics">
		<div class="logistics-empty"></div>
		<div class="logistics-title">
			<div class="logistics-title-box">
				<span>订单号:</span>
				<span class="text-left">{{order.orderCode}}</span>
			</div>
		</div>
		<!-- <div class="logistics-empty"></div> -->
		<div class="good-detail">
			<goodComponent :order="order" :goods="orderItem" :instalment="order.instalment" type="detail"></goodComponent>
			<!-- <div class="good-detail-box">
           <img src="" alt="" class="good-img">
           <div class="good-right">
             <p class="good-right-title">XXXXXXXXXXXXX</p>
             <p class="good-right-sku"></p>
           </div>
         </div> -->
		</div>
		<div class="logistics-empty" v-show="showLogisticsMessage"></div>
		<div class="logistics-message" v-show="showLogisticsMessage">
			<div class="logistics-message-box">
				<p class="logistics-message-item">
					<span>信息来源:</span>
					<span class="text-left">{{shipperCode}}</span>
				</p>
				<p class="logistics-message-item">
					<span>货运单号:</span>
					<span class="text-left">{{logisticCode}}</span>
				</p>
			</div>
		</div>
		<div class="logistics-empty"></div>
		<div class="logistics-steps-empty" v-if="isEmpty">
			<div class="empty-box">
				<!-- <img src="~@/assets/img/order/blankpage_img_search@2x.png" alt="" class="empty-img"> -->
				<div class="empty-img"></div>
				<p class="empty-text">亲，您的商品暂无物流信息哦~</p>
			</div>
		</div>
		<div class="logistics-steps" v-else>
			<div class="logistics-steps-box">
				<ul class="tracesList">
					<div class="tracesList-div" v-for="(item,index) in traces" :key="index" :class="{'lasttraceslist': index + 1 === traces.length}">
						<div class="circleItem-box">
							<span class="circleItem" ></span>
              <div class="active-circleItem" v-if="index === activeIndex">
              </div>
						</div>
						<div class="tracesList-box">
							<li class="tracesItem">
								<p>{{item.acceptStation}}</p>
								<p class="tracesItem-acceptTime">{{item.acceptTime}}</p>
							</li>
						</div>
					</div>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import goodComponent from './goodComponent.vue'
import { mapGetters } from 'vuex'
import { Step, Steps } from 'vant'
import Vue from 'vue'

Vue.use(Step).use(Steps)
export default {
  name: 'orderLogistics',
  data () {
    return {
      order: {},
      logisticCode: '',
      shipperCode: '',
      traces: [], // 物流变化信息数组
      showLogisticsMessage: false // 展示物流信息 单号
    }
  },
  mounted () {
    let bodyHeight = document.documentElement.clientHeight
    this.$refs.orderLogistics.style.minHeight = bodyHeight + 'px'
    this.orderDetailServe()
  },
  components: {
    goodComponent
  },
  methods: {
    orderDetailServe () {
      let orderCode = this.$route.params.orderCode
      this.$api['order/getOrderDetail']({
        code: orderCode,
        token: this.userToken
      }).then(res => {
        this.order = res.order
      }).then(() => {
        this.getLogisticsGoldServe()
      })
    },
    getLogisticsGoldServe () {
      let orderItemCode = this.order.orderItems[0].orderItemCode
      this.$api['order/getLogisticsGold']({
        orderItemCode: orderItemCode
      }).then(res => {
        this.logisticCode = res.data.logisticCode // 物流号
        this.shipperCode = res.data.shipperCode // 物流公司
        this.traces = res.data.traces // 物流变化信息数组
        this.showLogisticsMessage = true
      }).catch(() => {
        this.traces = []
        this.showLogisticsMessage = false
      })
    }
  },
  computed: {
    orderItem () {
      if (this.order.orderItems) {
        return this.order.orderItems[0]
      } else {
        return {}
      }
    },
    isEmpty () {
      if (this.traces.length > 0) {
        return false
      } else {
        return true
      }
    },
    activeIndex () {
      if (this.traces.length > 0) {
        return 0
      } else {
        return null
      }
    },
    ...mapGetters(['userToken', 'userId'])
  },
  watch: {
    userToken (val) {
      if (val) {
        this.orderDetailServe()
      }
    }
  }
}
</script>
<style scoped>
.orderLogistics {
  background-color: #fff;
  height: 100%;
  color: #333;
}
.text-left {
  margin-left: 0.133333rem;
  color: #333;
}
.logistics-empty {
  height: 0.266667rem;
  background-color: #f2f2f2;
}
.logistics-title {
  height: 1.173333rem;
  width: 100%;
  background-color: #fff;
  line-height: 1.173333rem;
  border-bottom: 1px solid #e6e6e6;
}
.logistics-title-box {
  font-size: 0.373333rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #333;
  margin: 0 0.4rem;
}
.good-detail {
  height: 2.96rem;
  background-color: #fff;
}
.good-detail-box {
  margin: 0.12rem 0.4rem 0.266667rem 0.053333rem;
  height: 100%;
}
.good-img,
.good-right {
  display: inline-block;
}
.good-img {
  width: 2.8rem;
  height: 2.586667rem;
}
.empty-img {
  display: inline-block;
  width: 4.8rem;
  height: 4.8rem;
  background-image: url('~@/assets/img/order/blankpage_img_search@2x.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.logistics-message {
  height: 2rem;
  width: 100%;
  background-color: #fff;
  /* margin-top: 0.266667rem; */
  /* margin-bottom: 0.266667rem; */
}
.logistics-message-box {
  margin: 0 0.4rem;
  box-sizing: border-box;
  padding: 0.4rem 0;
  font-size: .373333rem;
}
.logistics-message-item {
  margin-bottom: 0.4rem;
  font-size: 0.373333rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #333;
}
.logistics-steps {
  height: auto;
  width: 100%;
  background-color: #fff;
  line-height: 1rem;
  margin-top: 0.4rem;
}
.logistics-steps-empty {
  background-color: #fff;
  height: 8rem;
}
.empty-box {
  width: 5.226667rem;
  height: auto;
  margin: 0 auto;
  text-align: center;
}
.empty-text {
  font-size: 0.373333rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #636363;
}
.logistics-steps-box {
  margin: 0.4rem;
}
 .circleList,
.tracesList {
  display: inline-block;
  height: 100%;
  width: 100%;
  vertical-align: text-top;
}
.circleList {
}
.circleItem-box {
  width: 0.4rem;
  display: inline-block;
  position: relative;
  top: 0.15rem;
}
.circleItem {
  display: inline-block;
  border: 0.12rem solid #d8d8d8;
  width: 0;
  height: 0;
  border-radius: 50%;
  vertical-align: 1em;
  margin-left: 0rem;
  position: relative;
  z-index: 2;
}
.tracesList-box::before {
  content: '';
  display: inline-block;
  width: .026667rem;
  height: 70%;
  position: absolute;
  left: -0.83rem;
  top: -0.64rem;
  background-color: #d8d8d8;
}

.tracesList-div:nth-child(1) .tracesList-box::before {
  content: '';
  display: inline-block;
  width: .026667rem;
  height: 70%;
  position: absolute;
  left: -0.83rem;
  top: -0.6rem;
  background-color: #fff;
  z-index: 1;
}
.tracesList-box::after {
  content: '';
  display: inline-block;
  width: .026667rem;
  height: 100%;
  position: absolute;
  left: -0.83rem;
  top: 0.2rem;
  background-color: #d8d8d8;
  z-index: 1;
}
.lasttraceslist .tracesList-box::after {
  content: '';
  display: inline-block;
  width: .026667rem;
  height: 70%;
  position: absolute;
  left: -0.83rem;
  top: 0.2rem;
  background-color: #fff;
  z-index: 0;
}
.tracesList-box {
  position: relative;
  width: 88%;
  /* padding-left: 3%; */
  margin-left: .533333rem;
  display: inline-block;
  padding-bottom: 0.346667rem;
  border-bottom: 0.013333rem solid #e6e6e6;
}
.tracesItem {
  /* padding-left: 20px; */
   display: inline-block;
  vertical-align: top;
  font-size: 0.346667rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #333;
}
.tracesItem p {
  line-height: 1.5em;
  font-size: .373333rem;
  color: #939393;
}
.tracesItem-acceptTime {
  margin-top: 0.16rem;
  font-size: .32rem;
  color: #939393;
}
.tracesList-div:nth-child(1) .tracesItem p {
  line-height: 1.5em;
  font-size: .373333rem;
  color: #333;
}
.tracesList-div:nth-child(1) .tracesItem-acceptTime {
  margin-top: 0.16rem;
  font-size: .32rem;
  color: #939393;
}
.tracesList-div {
  margin-top: 0.373333rem;
}
.tracesList-div:nth-child(1) {
  margin-top: 0;
}
.tracesList-div.active .circleItem {
  display: inline-block;
  border: 0.16rem solid #f54b78;
  width: 0;
  height: 0;
  border-radius: 50%;
  vertical-align: 0.5em;
  margin: 0;
}
.active-circleItem {
  width: .4rem;
  height: .4rem;
  background: #FBC0C0;
  border-radius: 50%;
  position: absolute;
  z-index: 3;
  top: 0;
  left: -0.09rem;
}
.active-circleItem::after {
  content: '';
  width: .32rem;
  height: .32rem;
  background: #F54B78;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  right: 50%;
  z-index: 4;
  -webkit-transform: translate(50%,-50%);
  -ms-transform: translate(50%,-50%);
  transform: translate(50%,-50%);
}
</style>
