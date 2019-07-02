<template>
	<div v-if="seckillShow" class="seckill" :class="[secKillStatus? 'seckill__wait': 'seckill__ing']">
		<!-- 秒杀价格 -->
		<p v-if="secKillStatus" class="seckill__price">秒杀价:&nbsp;&yen;{{secKillPrice | priceFilter}}</p>
		<!-- 秒杀中 抢购百分比 -->
		<div v-else class="seckill__loading">
			<span class="loading-box">
				<span class="loading-line" :style="{'width':setPercent + '%' }"></span>
			</span>
			<span>已抢{{seckillData.soldCount}}件</span>
		</div>
		<!-- 秒杀倒计时 -->
		<div class="seckill__time">
			<span>距{{secKillStatus |statusFilter}}还有</span>
			<span class="time-box">{{h}}</span>
			<span>:</span>
			<span class="time-box">{{m}}</span>
			<span>:</span>
			<span class="time-box">{{s}}</span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  props: ['goodsDetailData', 'secKillStatus', 'systemTime'],
  data () {
    return {
      timer: null,
      startTime: null,
      endTime: null,
      h: null,
      m: null,
      s: null
    }
  },
  computed: {
    seckillShow () {
      return this.goodsDetailData && this.systemTime
    },
    secKillPrice () {
      return this.goodsDetailData.originalPrice * (this.seckillData.discount / 10000)
    },
    seckillData () {
      if (this.goodsDetailData && this.goodsDetailData.seckillGoodsDetail) {
        return this.goodsDetailData.seckillGoodsDetail
      } else {
        return null
      }
    },
    setPercent () {
      let f = Number(this.seckillData.inventory)
      let c = Number(this.seckillData.soldCount)
      let result = (c / f).toFixed(2)
      console.log('这是百分比', c, f, result * 100)
      return result * 100
    }
  },
  methods: {
    // 秒杀设置
    setSecKill () {
      console.log('秒杀设置')
      let st = this.seckillData.startTime
      let et = this.seckillData.endTime
      let change
      // 现在时间小于开始时间 距开始
      if (this.systemTime < st) {
        this.$emit('changeStatus', true)
        this.startTime = this.systemTime
        this.endTime = st
      } else if (this.systemTime > st && this.systemTime < et) {
        this.$emit('changeStatus', false)
        this.startTime = this.systemTime
        this.endTime = et
      }
      change = this.endTime - this.startTime
      this.init(change)
    },
    init (time) {
      let t = time
      if (t <= 0) {
        if (this.secKillStatus) {
          this.$emit('changeStatus', false)
        } else {
          this.$emit('closeSecKill')
        }
      }
      this.h = Math.floor(t / 1000 / 60 / 60) > 99 ? 99 : Math.floor(t / 1000 / 60 / 60)
      this.m = Math.floor(t / 1000 / 60 % 60)
      this.s = Math.floor(t / 1000 % 60)
      if (this.h < 10) {
        this.h = '0' + this.h
      }
      if (this.m < 10) {
        this.m = '0' + this.m
      }
      if (this.s < 10) {
        this.s = '0' + this.s
      }
      this.setCountDown(t)
    },
    setCountDown (time) {
      let t = time
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (t <= 0) {
          clearInterval(this.timer)
          if (this.secKillStatus) {
            this.$emit('changeStatus', false)
          } else {
            this.$emit('closeSecKill')
          }
        }
        this.h = Math.floor(t / 1000 / 60 / 60) > 99 ? 99 : Math.floor(t / 1000 / 60 / 60)
        this.m = Math.floor(t / 1000 / 60 % 60)
        this.s = Math.floor(t / 1000 % 60)
        if (this.h < 10) {
          this.h = '0' + this.h
        }
        if (this.m < 10) {
          this.m = '0' + this.m
        }
        if (this.s < 10) {
          this.s = '0' + this.s
        }
        t -= 1000
      }, 1000)
    }
  },
  filters: {
    statusFilter (val) {
      if (val) {
        return '开始'
      } else {
        return '结束'
      }
    }
  },
  watch: {
    systemTime (val) {
      if (val) {
        this.setSecKill()
      }
    }
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang="scss">
.seckill {
  width: 100%;
  height: 110px;
  position: relative;
  &__ing {
    background: url('~@/assets/img/img_datail_mini_banner_ing@3x.png') no-repeat;
    background-size: 100% 100%;
  }
  &__wait {
    background: url('~@/assets/img/img_datail_mini_banner_ready@3x.png')
      no-repeat;
    background-size: 100% 100%;
  }
  &__price {
    height: 0.493333rem;
    font-size: 0.346667rem;
    color: #ffffff;
    position: absolute;
    bottom: 0.133333rem;
    left: 0.4rem;
    font-family: PingFangSC-Medium;
    line-height: 0.493333rem;
    font-weight: bold;
    > span {
      display: inline-block;
    }
  }
  &__time {
    position: absolute;
    top: 50%;
    right: 0.4rem;
    -webkit-transform: translate(0, -50%);
    transform: translate(0, -50%);
    span {
      font-family: PingFangSC-Medium;
      font-weight: bold;
      display: inline-block;
      font-size: 0.346667rem;
      color: #ffffff;
      vertical-align: middle;
      &.time-box {
        width: 0.56rem;
        height: 0.613333rem;
        line-height: 0.613333rem;
        background: #ffffff;
        border-radius: 0.053333rem;
        color: #ed145b;
        margin: 0 5px;
        text-align: center;
      }
    }
  }
  &__loading {
    height: 0.493333rem;
    font-size: 0.346667rem;
    color: #ffffff;
    position: absolute;
    bottom: 0.133333rem;
    left: 0.4rem;
    span {
      vertical-align: middle;
      display: inline-block;
      font-family: PingFangSC-Medium;
      font-weight: bold;
    }
    .loading-box {
      width: 2.4rem;
      height: 0.213333rem;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 100px;
      position: relative;
      vertical-align: middle;
      .loading-line {
        display: block;
        height: 0.213333rem;
        background: #ffffff;
        border-radius: 100px;
      }
    }
  }
}
</style>
