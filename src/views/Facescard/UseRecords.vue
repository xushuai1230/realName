<template>
  <div class="main">
    <div v-if="isEmpty">
      <blank-page>
        <p slot="prompt" class="prompt">暂无使用记录</p>
      </blank-page>
    </div>
    <div class="content-wrap"  ref="wrapper" v-else :style="{height: this.wrapperHeight + 'px'}">
      <!-- <mt-loadmore
            @bottom-status-change="handleBottomChange"
            :bottom-all-loaded="allLoaded"
            :bottom-method="loadBottom"
            :auto-fill="false"
            ref="loadmore"
            > -->
            <van-list
              v-model="loading"
              :finished="allLoaded"
              @load="loadBottom"
            >
        <div class="use" v-for="(item, i) in dataList" :key="i">
          <div class="img" :data-log-type="item.logType">
            <img v-if="item.logType === 5" src="~@/assets/img/facecard/icon_laidian@3x.png" alt="">
            <img v-else-if="item.logType === 1" src="~@/assets/img/facecard/icon_xiaofei@3x.png" alt="">
            <img v-else-if="(item.logType === 2) || (item.logType === 4)" src="~@/assets/img/facecard/icon_huankuan@3x.png" alt="">
            <img v-else-if="item.logType === 7 || item.logType === 10" src="~@/assets/img/facecard/icon_huankuan@3x.png" alt="">
            <img v-else src="~@/assets/img/facecard/icon_jiekuan@3x.png" alt="">
          </div>
          <div class="content">
            <div class="top">
              <span v-text="text(item.logType)"></span>
              <span class="fr">{{limitType(item.logType)}}{{item.recordAmount | priceFilter}}元</span>
            </div>
            <div class="bottom">{{item.createTime | timeFilter}}</div>
          </div>
        </div>
        <div class="useRecirds-noMore" v-if="noMore">没有更多数据</div>
      <!-- </mt-loadmore> -->
      </van-list>
    </div>
  </div>
</template>
<script>
import { apSetTitle } from '../../module/appbridge'
import { post, api, fromUrlcode } from '../../module/request'
import { mapGetters, mapState, mapMutations } from 'vuex'
import blankPage from '@/components/blankPage/blankPage.vue'
export default {
  name: 'UseRecords',
  data () {
    return {
      pageSize: 10, // 页长度
      pageNum: 1, // 页码
      // targetNum: 1, // 当前页码
      totalNum: null,
      allLoaded: false,
      bottomStatus: '',
      noMore: false,
      wrapperHeight: null,
      dataList: [],
      isEmpty: false,
      cardCode: null, // 情侣卡编号
      loading: false
    }
  },
  computed: {
    ...mapGetters(['userId', 'userToken']),
    ...mapState(['listHeight', 'nextTickListHeight'])
  },
  created () {
    apSetTitle('额度明细')
    this.cardCode = this.$route.query.cardCode || this.getQueryString('cardCode')
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapMutations(['muListHeight', 'muNextTickListHeight']),
    limitType (type) { // 额度类似
      switch (type) {
        case 0:
        case 2:
        case 4:
        case 5:
        case 7:
        case 8:
        case 10:
          return '+'
        case 1:
        case 3:
        case 6:
        case 9:
          return '-'
        default:
          return ''
      }
    },
    init () {
      let h =
        document.documentElement.clientHeight -
        this.$refs.wrapper.getBoundingClientRect().bottom
      this.wrapperHeight = this.listHeight ? this.listHeight : h
      this.muListHeight(h)
      this.useList()
    },
    useList () {
      this.loading = true
      console.log(this.$refs.wrapper.scrollTop, this.nextTickListHeight)
      this.muNextTickListHeight(this.$refs.wrapper.scrollTop)
      global.vbus.$emit('setloadingStatus', true)
      post(api.useLog, fromUrlcode({
        token: this.userToken,
        cardCode: this.cardCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }))
        .then(res => {
          this.loading = false
          console.log(res)
          global.vbus.$emit('setloadingStatus', false)
          this.totalNum = res.data.total
          this.targetNum = res.data.nextPage
          this.dataList = this.dataList.concat(res.data.list)
          // this.$refs.loadmore.onBottomLoaded()
          if (this.dataList.length === 0) {
            this.isEmpty = true
          } else {
            this.$nextTick(function () {
              this.$refs.wrapper.scrollTop = this.nextTickListHeight
            })
          }
        }).catch(err => {
          console.log('使用记录获取失败', err)
          global.vbus.$emit('setloadingStatus', false)
          this.$toast(err)
          this.loading = false
        })
    },
    text (a) {
      switch (a) {
        case 0:
          return '开卡成功'
        case 1:
          return '支出'
        case 2:
          return '返还'
        case 3:
          return '借款支出'
        case 4:
          return '借款返还'
        case 5:
          return '"来电"被TA喜欢'
        case 6:
          return '降额'
        case 7:
          return '邀请好友开卡成功'
        case 8:
          return '临时提额'
        case 9:
          return '临时降额'
        case 10:
          return '奖品提额'
        default:
          return ''
      }
    },
    handleBottomChange (status) {
      this.bottomStatus = status
    },
    loadBottom () {
      if (this.noMore) return
      console.log('调用分页加载', this.totalNum, this.pageNum)
      if (this.totalNum >= 0) {
        if (this.pageNum >= this.totalNum || this.targetNum === 0) {
          this.noMore = true
          this.allLoaded = true
          this.loading = false
          // this.$refs.loadmore.onBottomLoaded()
        } else {
          this.pageNum += 1
          this.useList()
        }
      }
    }
  },
  components: {
    blankPage
  }

}
</script>
<style scoped lang='scss'>
.content-wrap {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.main {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: .266667rem;
  background: #f2f2f2;
  .use {
    width: 100%;
    height: 2.04rem;
    background: #fff;
    box-sizing: border-box;
    margin-bottom: .266667rem;
    padding: .4rem .586667rem .4rem .32rem;
    border-radius: .106667rem;
    .img {
      width: .506667rem;
      height: .506667rem;
      margin-right: .266667rem;
      float: left;
    }
    .content {
      width: 7.7rem;
      height: 100%;
      float: left;
      .top {
        font-size: .373333rem;
        color: #333;
        margin-top: .08rem;
      }
      .bottom {
        margin-top: .4rem;
        font-size: 28px;
        color: #939393;
      }
    }
  }
  // .noMore {
  //   text-align: center;
  //   font-size: .373333rem;
  //   color: #636363;
  //   height: 1.333333rem;
  //   margin-top: .133333rem;
  // }
}
.bg-red {
  background: #FF4B45;
}
.bg-blue {
  background: #499AFF;
}
</style>
<style scoped>
.useRecirds-noMore {
  text-align: center;
  font-size: .373333rem;
  color: #636363;
  height: 1.333333rem;
  margin-top: .133333rem;
}
.top span:nth-child(1) {
  font-size: 30px;
  color: #333;
}
.top span:nth-child(2) {
  font-size: 28px;
  color: #333;
}
.useRecirds-noMore {
  margin-top: 40px;
  color: #939393;
}
</style>
