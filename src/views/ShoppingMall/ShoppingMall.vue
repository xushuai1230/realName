<template>
  <div class="shoppingmall" ref="shoppingmall">
    <van-pull-refresh v-model="refreshIsLoading" @refresh="onRefresh" ref="refresh">
      <van-list v-model="loading" :finished="finished" @load="onLoad" class="list">
        <div class="shoppingmall__thumbnailImg">
          <div class="search" @click="goSearch">
            <img src="~@/assets/img/search_bar_icon@3x.png" alt="">
            <span>{{placeholder}}</span>
          </div>
        </div>
        <div class="shoplist"
            v-for="(listItem, listindex) in shopList"
            :class="{'pt20': listItem.subject.hasLeading && listItem.subject.hasLeading === '1' && listindex !== 0 ? true : false}"
            :key="listindex">
          <div class="display-type-zero"
              v-if="listItem.subject.displayType === 0">
            <div class="display-type-zero__banner">
              <img v-lazy="listItem.subject.thumbnailUrl"
                   @click="toBannerGround(listItem.subject)"/>
              <div class="triangle"></div>
            </div>
            <div class="display-type-zero__scroll"
                v-if="listItem.slideGoods && listItem.slideGoods.length > 0"
                :class="listItem.slideGoods[0].openType === 1 ? 'openType1height' : ''">
              <div class="scroll-box-openType1"
                  v-if="listItem.slideGoods[0].openType === 1"
                  :style="{'width': (260 * listItem.slideGoods.length) / 75 + 'rem'}">
                <div class="openType1parent"
                    v-for="(goods, index) in listItem.slideGoods"
                    v-show="!goods.isNew"
                    @click="shopClick(goods, index)"
                    :key="'zeroGood1&' + index">
                  <div class="openType1img">
                    <img v-lazy="goods.thumbnailUrl" />
                    <div class="isNew" v-if="goods.isNew"></div>
                    <img class="labelImgUrl"
                         v-if="goods.labelImgUrl"
                         :src="goods.labelImgUrl" />
                  </div>
                  <div class="openType1txt1">
                    {{goods.subTitle}}
                  </div>
                  <div class="openType1txt2">
                    <span>¥</span>
                    <span>{{goods.peroidInstalmentAmount | priceFilter}}</span>
                    <span>{{'x' + goods.instalmentPeriods + '期'}}</span>
                  </div>
                </div>
              </div>
              <div class="scroll-box-openType2"
                  v-if="listItem.slideGoods[0].openType === 2"
                  :style="{'width': (236 * listItem.slideGoods.length) / 75 + 'rem'}">
                <div v-for="(goods, index) in listItem.slideGoods"
                    @click="shopClick(goods, index)"
                    :key="'zeroGood2&' + index">
                  <img class="openType2img" v-lazy="goods.thumbnailUrl" />
                </div>
              </div>
            </div>
          </div>
          <div class="display-type-two" v-if="listItem.subject.displayType === 2">
            <div class="display-type-two__banner"  @click="toBannerGround(listItem.subject)">
              <div class="left-img"
                  :style="{'background': `url(${listItem.subject.thumbnailUrl}) no-repeat`, 'background-size': '100% 100%'}">
              </div>
              <div class="banner-txt">
                <div class="firstTitle">
                  {{listItem.subject.mainTitle}}
                </div>
                <div class="secondTitle">
                  {{listItem.subject.subTitle}}
                </div>
              </div>
              <div class="banner-right">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div class="display-type-two__scroll"
                v-if="listItem.slideGoods && listItem.slideGoods.length > 0"
                :class="listItem.slideGoods[0].openType === 1 ? 'openType1height' : ''">
              <div class="scroll-box-openType1"
                  v-if="listItem.slideGoods[0].openType === 1"
                  :style="{'width': (260 * listItem.slideGoods.length) / 75 + 'rem'}">
                <div class="openType1parent"
                    v-for="(goods, index) in listItem.slideGoods"
                    @click="shopClick(goods, index)"
                    v-show="!goods.isNew"
                    :key="'twoGood1&' + index">
                  <div class="openType1img">
                    <img v-lazy="goods.thumbnailUrl" />
                    <div class="isNew" v-if="goods.isNew"></div>
                    <img class="labelImgUrl"
                         v-if="goods.labelImgUrl"
                         v-lazy="goods.labelImgUrl" />
                  </div>
                  <div class="openType1txt1">
                    {{goods.subTitle}}
                  </div>
                  <div class="openType1txt2">
                    <span>¥</span>
                    <span>{{goods.peroidInstalmentAmount | priceFilter}}</span>
                    <span>{{'x' + goods.instalmentPeriods + '期'}}</span>
                  </div>
                </div>
              </div>
              <div class="scroll-box-openType2"
                  v-if="listItem.slideGoods[0].openType === 2"
                  :style="{'width': (236 * listItem.slideGoods.length) / 75 + 'rem'}">
                <div v-for="(goods, index) in listItem.slideGoods"
                    @click="shopClick(goods, index)"
                    :key="'twoGood2&' + index">
                  <img class="openType2img" v-lazy="goods.thumbnailUrl" />
                </div>
              </div>
            </div>
          </div>
          <div class="display-type-three" v-if="listItem.subject.displayType === 3">
            <div class="shoppingmall__nav">
              <ul class="list">
                <li v-for="(threeItem, threeIndex) in listItem.slideGoods"
                    :key="'three' + threeIndex"
                    @click="shopClick(threeItem)">
                  <img v-lazy="threeItem.thumbnailUrl" alt="">
                  <img v-if="threeItem.hotImgUrl" class="hot-img" :src="threeItem.hotImgUrl" alt="">
                </li>
              </ul>
            </div>
          </div>
          <div class="display-type-fifteen" v-if="listItem.subject.displayType === 15">
            <div class="shoppingmall__boxContent">
              <div class="boxItem" v-for="(obj, ins) in listItem.slideGoods"
                   :style="{ width: (100 / listItem.slideGoods.length) + '%'}"
                   :key="ins" @click="shopClick(obj)">
                <img v-lazy="obj.thumbnailUrl" alt="">
              </div>
            </div>
          </div>
          <div class="display-type-eleven" v-if="listItem.subject.displayType === 11">
            <div class="shoppingmall__thumbnailImg" v-if="listItem.slideGoods && listItem.slideGoods.length > 0">
              <!-- <van-swipe :autoplay="3000">
                <van-swipe-item v-for="(image, index) in listItem.slideGoods" :key="index">
                  <img v-lazy="image.thumbnailUrl" @click="shopClick(image)" />
                </van-swipe-item>
              </van-swipe> -->
              <swiper :options="swiperOption" ref="FaceCardSwiper">
                <swiper-slide v-for="(image, index) in listItem.slideGoods" :key="index">
                  <img :src="image.thumbnailUrl"/>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
              </swiper>
            </div>
          </div>
        </div>
        <div class="footer" v-if="isEnd">
          <!-- <img src="~@/assets/img/img_recommend_for_you@3x.png" alt=""> -->
          <div>本产品为第三方合作，服务由小象优品提供，暂不对学生开放</div>
        </div>
      </van-list>
    </van-pull-refresh>
    <coupon :showCouponDialog="getShowCouponDialogStatus" :prizeCode="getCouponPrizeCode"></coupon>
    <newUserDialog :showNewUserDialog="showNewUserDialogStatus"></newUserDialog>
    <couponToUse :showCouponToUseDialog="showCouponToUseDialog"></couponToUse>
  </div>
</template>

<script type="text/ecmascript-6">
import coupon from './coupon'
import newUserDialog from '@/views/ShoppingMall/newUserDialog'
import couponToUse from '@/views/ShoppingMall/couponToUse'
import { CHANNEL_WEIBOBIND } from '@/const/constdata'
import { mapState, mapMutations, mapGetters } from 'vuex'
let vm = null // eslint-disable-line
export default {
  name: 'shopHome',
  props: {},
  data () {
    return {
      homeData: null,
      titleId: '',
      placeholder: '',
      shopList: null,
      shopPageNum: 1, // 页数
      loading: false,
      finished: false,
      pages: null,
      refreshIsLoading: false,
      refreStatus: false.pageNum,
      swiperOption: {
        loop: true,
        autoplay: true,
        touchRatio: 0.8,
        // shortSwipes: false,
        preventLinksPropagation: true,
        pagination: {
          el: '.swiper-pagination',
          bulletElement: 'span'
        },
        on: {
          click: function (params) {
            let slideGoods = vm.swiperData
            let realIndex = this.realIndex
            if (Array.isArray(slideGoods)) {
              let image = slideGoods[realIndex]
              vm.shopClick(image)
            }
          }
        }
      },
      getHongbaofeiSuccess: false,
      newUserSuccess: false
    }
  },
  watch: {
  },
  computed: {
    ...mapState([
      'VuexShopHomeScrollTop',
      'loginChannel',
      'showNewUserDialogStatus',
      'showCouponToUseDialog',
      'firstOpenFlag'
    ]),
    ...mapGetters(['userToken', 'userId', 'userWeiboMark', 'getCouponPrizeCode', 'getShowCouponDialogStatus']),
    isEnd () {
      if (this.pages && this.shopPageNum > this.pages) {
        return true
      }
      return false
    },
    carousels () {
      return this.homeData && this.homeData.carousels
    },
    freshUserBanners () {
      return this.homeData && this.homeData.freshUserBanners
    },
    activityBanners () {
      return this.homeData && this.homeData.activityBanners
    },
    swiper () {
      return this.$refs.FaceCardSwiper && this.$refs.FaceCardSwiper.swiper
    },
    swiperData () {
      return this.shopList.filter(item => item.subject.displayType === 11)[0].slideGoods
    }
  },
  components: {
    coupon,
    newUserDialog,
    couponToUse
  },
  mounted () {
    // 初始化日期
    this.initLocalStorage()
    let targetPage = this.$route.query.toPage
    if (targetPage) {
      return this.$router.push(JSON.parse(targetPage))
    }
    let bodyHeight = document.documentElement.clientHeight
    this.$refs.shoppingmall.style.minHeight = bodyHeight + 'px'
    this.$tj('enterhome')
    // 【红包飞】推广奖品数量查询接口
    let redpacketChannels = ['353', '354', '355', '356']
    let isRedPacketChannel = redpacketChannels.indexOf(this.loginChannel) > -1
    this.getHongbaofeiSuccess = false
    if (isRedPacketChannel && !this.getHongbaofeiSuccess) {
      this.setCouponPrizeCode(String(this.loginChannel))
      this.hongbaofeiPrizeNumServe()
    }
    // 用户未绑定手机号且非353、354、355、356渠道中的任意一个
    this.newUserSuccess = false
    if (!isRedPacketChannel && !this.newUserSuccess) {
      console.log('mounted newUser')
      this.newUser(() => {})
    }
  },
  created () {
    vm = this
  },
  activated () {
    this.isShowEntryDialog()
    // 从其他tab回来的时候，需要修复位置
    this.defaultSearchGoods()
    if (this.VuexShopHomeScrollTop) {
      const scrollTop = this.VuexShopHomeScrollTop
      this.$nextTick(() => {
        window.scrollTo(0, scrollTop)
        this.setVuexShopHomeScrollTop(0) // 清除本次位置
      })
    }
    // let query = this.getQueryString('token')
    // if (query) {
    //   this.$router.replace({
    //     name: 'shopHome'
    //   })
    // }
    // 【红包飞】推广奖品数量查询接口
    let redpacketChannels = ['353', '354', '355', '356']
    let isRedPacketChannel = redpacketChannels.indexOf(this.loginChannel) > -1
    let getHongbaofeiSuccess = this.getHongbaofeiSuccess
    if (isRedPacketChannel && getHongbaofeiSuccess) {
      this.setCouponPrizeCode(String(this.loginChannel))
      console.log('actived----hongbaofeiPrizeNumServe')
      this.hongbaofeiPrizeNumServe()
    }

    if (!isRedPacketChannel && this.newUserSuccess) {
      this.newUser(() => { this.matchDateFn() })
    }
  },
  methods: {
    ...mapMutations([
      'setVuexShopHomeScrollTop',
      'setOldEntryStatus',
      'setOldDialogEntryStatus',
      'setOldEntryStatus',
      'setSinaFenqiH5Url',
      'setCouponPrizeCode',
      'setShowCouponDialogStatus',
      'setDragStatus',
      'setNewUserDragStatus',
      'setShowNewUserDialogStatus',
      'setshowCouponToUseDialog'
    ]),
    // 传入毫秒数转为年月日
    dateConvert (time) {
      let date = new Date(time)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = date.getDate()
      console.log(Y + M + D)
      let cb = Y + M + D
      return cb
    },
    // 判断在贷状态
    async isShowEntryDialog () {
      let token = this.userToken || this.userWeiboMark
      if (token) {
        let res = await this.$api['myBill/checkOldZaidai']({ token })
        console.log(res, 'res')
        if (res.sinaFenqiH5Url) {
          this.setSinaFenqiH5Url(res.sinaFenqiH5Url)
          if (res.oldRepayStatus === 'ARREARS') {
            this.setOldEntryStatus(3)
            this.setOldDialogEntryStatus(true)
          } else if (res.sinaFenqiH5Url && res.oldRepayStatus === 'LOANING') {
            let tempdate = res.recentRepayTime - res.systemTime
            let threeDayTime = 86400000 * 3
            let nowDay = this.dateConvert(Number(res.systemTime))
            let isLocalstorage = window.localStorage.getItem(nowDay)
            if (tempdate > threeDayTime) {
              this.setOldEntryStatus(1)
              if (!isLocalstorage) {
                window.localStorage.setItem(nowDay, 1)
                this.setOldDialogEntryStatus(true)
              }
            } else if (tempdate <= threeDayTime && tempdate > 0) {
              this.setOldEntryStatus(2)
              this.setOldDialogEntryStatus(true)
            }
          }
        }
      }
    },
    async onRefresh () {
      if (this.refreStatus) {
        return
      }
      this.shopPageNum = 1
      // await this.getRefreshFn('first')
      if (this.pages && this.pages >= this.shopPageNum) {
        this.refreStatus = true
        // await this.getRefreshFn('second')
        this.firstRefresh()
      } else {
        await this.getRefreshFn('first')
      }
    },
    // 下拉刷新请求
    getRefreshFn (status) {
      if (this.refreStatus) return
      return this.$api['shopHome/getBannerGoodsByPage']({
        pageNum: this.shopPageNum
      }, {
        noShowLoading: true
      }).then(res => {
        this.pages = res.pageInfo.pages
        this.shopPageNum += 1
        this.refreshIsLoading = false
        if (status === 'first') {
          this.shopList = res.goodGroups
          console.log(this.shopList, 'orederList1')
        } else if (status === 'second') {
          this.shopList = [...this.shopList, ...res.goodGroups]
          this.refreStatus = false
          console.log(this.orderList, 'orederList2')
        }
      }).catch(err => {
        console.log(err)
        this.refreshIsLoading = false
      })
    },
    firstRefresh () {
      return this.$api['shopHome/getBannerGoodsByPage']({
        pageNum: this.shopPageNum
      }, {
        noShowLoading: true
      }).then(res => {
        this.pages = res.pageInfo.pages
        this.shopPageNum += 1
        this.shopList = res.goodGroups
        this.refreshIsLoading = false
      }).then(res => {
        this.secondRefresh()
      }).catch(err => {
        console.log(err)
        this.refreshIsLoading = false
      })
    },
    secondRefresh () {
      return this.$api['shopHome/getBannerGoodsByPage']({
        pageNum: this.shopPageNum
      }, {
        noShowLoading: true
      }).then(res => {
        this.pages = res.pageInfo.pages
        this.shopPageNum += 1
        this.refreshIsLoading = false
        this.shopList = [...this.shopList, ...res.goodGroups]
        this.refreStatus = false
        this.finished = res.goodGroups.length === 0
      }).catch(err => {
        console.log(err)
        this.refreshIsLoading = false
      })
    },
    toBannerGround (item) {
      // setTimeout(() => {
      if (item.gotoUrl) {
        let data = item.gotoUrl.match(/bsd:\/\/goodsList(2*).*bannerId=(\d*)[.&]*[position=]*(\d*)/)
        console.log(data)
        if (!data[1]) {
          this.$router.push({
            name: 'GroundNormal',
            params: {
              id: data[2]
            }
          })
        } else {
          this.$router.push({
            name: 'Ground',
            params: {
              id: data[2],
              category: data[3]
            }
          })
        }
      } else {
        if (item.bannerOpenType === 2) {
          this.$router.push({
            name: 'Ground',
            params: {
              id: item.goodsCode,
              category: 'pv'
            }
          })
        } else {
          this.$router.push({
            name: 'Ground',
            params: {
              id: item.parendBannerId,
              category: 'pv'
            }
          })
        }
      }
      this.$tj('clickhomebanner')
    },
    shopClick (item, index) {
      // setTimeout(() => {
      if (item.openType === 1) {
        this.$router.push({
          name: 'GoodsDetail',
          params: {
            id: item.goodsCode,
            goodSource: item.goodSource
          }
        })
      } else if (item.openType === 2) {
        if (item.gotoUrl) {
          if (item.gotoUrl === 'yanzhika') {
            this.$router.push({
              path: `/home/facescard`
            })
            return
          }
          let data = item.gotoUrl.match(/bsd:\/\/goodsList(2*).*bannerId=(\d*)[.&]*[position=]*(\d*)/)
          console.log(data)
          if (!data[1]) {
            this.$router.push({
              name: 'GroundNormal',
              params: {
                id: data[2]
              }
            })
          } else {
            this.$router.push({
              name: 'Ground',
              params: {
                id: data[2],
                category: data[3]
              }
            })
          }
        } else {
          if (item.bannerOpenType === 2) {
            this.$router.push({
              name: 'Ground',
              params: {
                id: item.goodsCode,
                category: 'pv'
              }
            })
          } else {
            let targetIndex
            if (index === undefined) {
              targetIndex = item.index
            } else {
              targetIndex = index
            }
            this.$router.push({
              name: 'Ground',
              params: {
                id: item.parendBannerId,
                category: targetIndex
              }
            })
          }
        }
      }
      // }, 300)
      this.$tj('clickhomebanner')
    },
    async onLoad () {
      await this.getBannerGoodsByPage()
    },
    goSearch () {
      console.log(this.placeholder)
      this.$router.push({
        name: 'ClassifySearch',
        query: {
          placeholder: this.placeholder
        }
      })
    },
    defaultSearchGoods () {
      this.$api['classify/defaultSearchGoods'](
        {}, {
          noShowLoading: true
        }
      ).then(res => {
        this.placeholder = res.data[0]
      })
    },
    getHotBanner () {
      return this.$api['shopHome/hotBanners']()
        .then(res => {
          this.homeData = res
        })
    },
    getAppHomePageImgV2 () {
      return this.$api['shopHome/getAppHomePageImgV2']()
        .then(res => {
          this.titleId = res.homeIcon[0].pageId
        })
    },
    getBannerByPage () {
      return this.$api['shopHome/getBannerByPage']({
        titleId: this.titleId,
        pageNum: 1
      })
        .then(res => {
          console.log(res)
        })
    },
    // 获取首页商品信息
    getBannerGoodsByPage () {
      return this.$api['shopHome/getBannerGoodsByPage']({
        pageNum: this.shopPageNum
      }, {
        noShowLoading: true
      }).then(res => {
        this.pages = res.pageInfo.pages
        this.shopPageNum += 1
        this.finished = res.goodGroups.length === 0
        this.refreshIsLoading = false
        if (!this.shopList) this.shopList = res.goodGroups
        else this.shopList = [...this.shopList, ...res.goodGroups]
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.refreshIsLoading = false
      })
    },
    // 【红包飞】推广奖品数量查询接口
    hongbaofeiPrizeNumServe () {
      this.$api['shopHome/hongbaofeiPrizeNum']({
        token: this.userToken || '',
        prizeCode: this.loginChannel
      }).then(res => {
        let result = res.data
        // 领取过不显示
        if (result.hasRecive) {
          // 领取弹窗,小把手 隐藏
          this.setShowCouponDialogStatus(false)
          this.setDragStatus(false)
        } else {
          // 红包数量
          if (result.prizeNum < 1) {
            this.setCouponPrizeCode('nocoupon')
          }
          // 弹窗展示, 小把手隐藏
          let couponFirstOpen = window.localStorage.getItem('couponFirstOpen')
          if (couponFirstOpen === '1') {
            this.setShowCouponDialogStatus(false)
            this.setDragStatus(true)
          } else {
            window.localStorage.setItem('couponFirstOpen', '1')
            this.setShowCouponDialogStatus(true)
            this.setDragStatus(false)
          }
          // 埋点
          let redpacketChannels = ['353', '354', '355', '356']
          let tjString = ['hbfalertshow1', 'hbfalertshow2', 'hbfalertshow3', 'hbfalertshow4']
          let isRedPacketChannel = redpacketChannels.indexOf(this.loginChannel)
          this.$tj(tjString[isRedPacketChannel])
        }
        this.getHongbaofeiSuccess = true
        console.log('getHongbaofeiSuccess:', this.getHongbaofeiSuccess)
      }).catch(err => {
        this.getHongbaofeiSuccess = false
        let couponFirstOpen = window.localStorage.getItem('couponFirstOpen')
        if (couponFirstOpen === '1') {
          this.setShowCouponDialogStatus(false)
          this.setDragStatus(true)
        } else {
          window.localStorage.setItem('couponFirstOpen', '1')
          this.setShowCouponDialogStatus(true)
          this.setDragStatus(false)
        }
        console.log(err)
      })
    },
    // 新用户福利
    matchDateFn () {
      let matchDateResult = this.matchDate()
      if (matchDateResult) {
        this.$tj('welfarenewshow')
        this.setShowNewUserDialogStatus(true)
        this.setNewUserDragStatus(false)
      } else {
        this.setShowNewUserDialogStatus(false)
        this.setNewUserDragStatus(true)
      }
    },
    newUser (callback) {
      let firstOpen = localStorage.getItem('firstOpen')
      if (!this.userToken) {
        // 每天一次弹框
        callback()
        this.newUserSuccess = true
      } else if (this.userToken && firstOpen === 'true' && this.loginChannel === CHANNEL_WEIBOBIND) {
        // 有token 且 第一次打开 且 在326渠道
        this.$api['shopHome/newUserPrizeCheck']({
          token: this.userToken
        }).then(res => {
          this.newUserSuccess = true
          console.log(res)
          // 奖励是否还有效
          let active = res.data.mianxiActive
          if (active && this.firstOpenFlag) {
            this.$tj('welfaretobeusedshow')
            localStorage.setItem('firstOpen', 'false')
            this.setshowCouponToUseDialog(true)
          } else {
            this.setshowCouponToUseDialog(false)
          }
        })
      }
    },
    initLocalStorage () {
      // 初始化日期
      let newUserDate = localStorage.getItem('newUserDate')
      if (newUserDate === null) {
        let nowdate = new Date()
        nowdate.setDate(nowdate.getDate() - 1)
        localStorage.setItem('newUserDate', nowdate.toJSON())
      }
      let firstOpen = localStorage.getItem('firstOpen')
      if (firstOpen === null) {
        localStorage.setItem('firstOpen', 'true')
      }
    },
    matchDate () {
      let recommendDate = new Date(localStorage.getItem('newUserDate'))
      let nowDate = new Date()
      if (nowDate.getFullYear() > recommendDate.getFullYear()) {
        localStorage.setItem('newUserDate', nowDate.toJSON())
        return true
      } else {
        if (nowDate.getMonth() > recommendDate.getMonth()) {
          localStorage.setItem('newUserDate', nowDate.toJSON())
          return true
        } else {
          if (nowDate.getDate() > recommendDate.getDate()) {
            localStorage.setItem('newUserDate', nowDate.toJSON())
            return true
          } else {
            return false
          }
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    // 从首页二次进入专场页时，由于上次的缓存的存在，导致页面闪屏的现象, 所以进入首页后，将专场的缓存去掉
    if (from.name === 'GroundNormal' || from.name === 'Ground') {
      let name = from.name
      let appIns = global.appIns
      appIns.excludeArr.push(name)
      appIns.$nextTick(() => {
        let index = appIns.excludeArr.indexOf(name)
        if (index !== -1) {
          appIns.excludeArr.splice(index, 1)
        }
      })
    }
    next()
  }
}
</script>

<style scoped lang="scss">
.mb20 {
  margin-bottom: 20px;
}
.pt20 {
  padding-top: 20px;
}
.shoppingmall {
  width: 100%;
  padding-bottom: 100px;
  -webkit-overflow-scrolling: touch;
  &__thumbnailImg {
    position: relative;
    img {
      width: 100%;
      height: 326px;
    }
    .search {
      position: absolute;
      top: 10px;
      left: 30px;
      padding: 6px 20px;
      z-index: 300;
      background: rgba(255,255,255, 0.8);
      width: 690px;
      box-sizing: border-box;
      border-radius:30px;
      img {
        width: 48px;
        height: 48px;
        opacity: 1;
      }
      span {
        display: inline-block;
        height: 48px;
        font-size: 28px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 48px;
      }
    }
  }
  &__nav {
    background-color: #fff;
    padding: 24px 0 36px 0;
    .list {
      display: inline-block;
      padding: 0 57px;
      li {
        float: left;
        margin-right: 65px;
        position: relative;
        &:nth-of-type(4) {
          margin-right: 0;
        }
        img {
          width: 110px;
          height: 150px;
        }
        .hot-img {
          position: absolute;
          top: -20px;
          right: -20px;
          height: 60px;
          width: 60px;
        }
      }
    }
  }
  &__boxContent {
    display: flex;
    .boxItem {
      flex: 1;
      font-size: 0;
      line-height: 0;
      img {
        vertical-align: middle;
        display:block;
      }
    }
  }
  .shoplist {
    .display-type-zero {
      &__banner {
        // height: 380px;
        position: relative;
        .triangle {
          position: absolute;
          left: 50%;
          margin-left: -7px;
          bottom: 0;
          border-top:14px solid transparent;
          border-left:14px solid transparent;
          border-right:14px solid transparent;
          border-bottom:14px solid #fff;
          width: 0;
          height: 0;
        }
      }
      .openType1height {
        height: 401px;
      }
      &__scroll {
        width: 100%;
        height: 256px;
        background: #fff;
        overflow-x: scroll;
        overflow-y: hidden;
        white-space:nowrap;
        .scroll-box-openType1 {
          overflow-x: scroll;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          .openType1parent {
            height: 381px;
            width: 240px;
            margin: 20px 0 20px 20px;
            float: left;
            .openType1img{
              float: left;
              height: 240px;
              width: 240px;
              margin-bottom: 20px;
              position: relative;
              .labelImgUrl {
                position: absolute;
                left: 0;
                top: 0;
                width: 80px;
                height: 80px;
                background-size: 100% 100%;
              }
              .isNew {
                position: absolute;
                left: 0;
                top: 0;
                width: 80px;
                height: 80px;
                background: url('~@/assets/img/img_goods_lable_min@3x.png') no-repeat;
                background-size: 100% 100%;
              }
            }
            .openType1txt1 {
              float: left;
              width: 240px;
              height: 56px;
              text-align: center;
              font-size:24px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(0,0,0,1);
              line-height:30px;
              white-space:normal;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              margin-bottom: 8px;
            }
            .openType1txt2 {
              float: left;
              text-align: center;
              height: 37px;
              width: 240px;
              :nth-child(1) {
                font-size:20px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(237,20,91,1);
                line-height:28px;
              }
              :nth-child(2) {
                font-size:28px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(237,20,91,1);
                line-height:37px;
              }
              :nth-child(3) {
                font-size:20px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:#939393;
                line-height:37px;
              }
            }
          }
        }
        .scroll-box-openType2 {
          height: 256px;
          .openType2img{
            float: left;
            height: 216px;
            width: 216px;
            margin: 20px 0 20px 20px;
          }
        }
      }
    }
    .display-type-two {
      &__banner{
        height: 133px;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #efefef;
        padding: 26px 36px 26px 19px;
        background: #fff;
        .left-img {
          height: 80px;
          width: 80px;
          float: left;
        }
        .banner-txt {
          float: left;
          box-sizing: border-box;
          padding-left: 20px;
          width: 77%;
          height: 80px;
          .firstTitle {
            margin: 2px 0 4px 0;
            width: 100%;
            height: 42px;
            font-size:30px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(51,51,51,1);
            line-height:42px;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            white-space: nowrap;
          }
          .secondTitle {
            width: 100%;
            height:30px;
            font-size:24px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:#939393;
            line-height:30px;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            white-space: nowrap;
          }
        }
        .banner-right {
          width: 30px;
          height: 80px;
          float: right;
          div {
            float: left;
            width: 6px;
            height: 6px;
            margin-top: 37px;
            margin-right: 6px;
            background:#999999;
            border-radius: 50%;
          }
          :nth-child(3) {
            margin-right: 0;
          }
        }
      }
      .openType1height {
        height: 401px;
      }
      &__scroll {
        width: 100%;
        height: 256px;
        background: #fff;
        overflow-x: scroll;
        overflow-y: hidden;
        white-space:nowrap;
        .scroll-box-openType1 {
          overflow-x: scroll;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          .openType1parent {
            height: 381px;
            width: 240px;
            margin: 20px 0 20px 20px;
            float: left;
            .openType1img{
              float: left;
              height: 240px;
              width: 240px;
              margin-bottom: 20px;
              position: relative;
              .labelImgUrl {
                position: absolute;
                left: 0;
                top: 0;
                width: 80px;
                height: 80px;
                background-size: 100% 100%;
              }
              .isNew {
                position: absolute;
                left: 0;
                top: 0;
                width: 80px;
                height: 80px;
                background: url('~@/assets/img/img_goods_lable_min@3x.png') no-repeat;
                background-size: 100%;
              }
            }
            .openType1txt1 {
              float: left;
              width: 240px;
              height: 56px;
              text-align: center;
              font-size:24px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(0,0,0,1);
              line-height:30px;
              white-space:normal;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              margin-bottom: 8px;
            }
            .openType1txt2 {
              float: left;
              text-align: center;
              height: 37px;
              width: 240px;
              :nth-child(1) {
                font-size:20px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(237,20,91,1);
                line-height:28px;
              }
              :nth-child(2) {
                font-size:28px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(237,20,91,1);
                line-height:37px;
              }
              :nth-child(3) {
                font-size:20px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:#939393;
                line-height:37px;
              }
            }
          }
        }
        .scroll-box-openType2 {
          height: 256px;
          .openType2img{
            float: left;
            height: 216px;
            width: 216px;
            margin: 20px 0 20px 20px;
          }
        }
      }
    }
  }
  .footer {
    width: 100%;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    img {
      display: inline-block;
      margin: 0 auto;
      height: 90px;
    }
    div {
      height: 90px;
      line-height: 90px;
      text-align: center;
      color: #939393;
      text-align: center;
      font-size: 24px;
    }
  }
}
</style>
<style lang="scss">
.shoppingmall {
  .van-swipe__indicator{
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background: rgba(255,255,255, 0.5);
  }
  .van-swipe__indicator--active {
    background: rgba(255,255,255, 1);
  }
  .van-swipe__indicator:not(:last-child) {
    margin-right: 20px;
  }
  .van-pull-refresh__track .van-pull-refresh__head .van-pull-refresh__text {
    color: #636363;
  }
  .van-pull-refresh__track .van-pull-refresh__head .van-pull-refresh__loading span {
    color: #636363;
  }
}
.shoppingmall {
  .swiper-pagination-bullet {
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background: rgba(255,255,255, 0.5);
  }
  .swiper-pagination-bullet:not(:last-child) {
    margin-right: 20px;
  }
  .swiper-pagination-bullet-active {
    background: rgba(255,255,255, 1);
  }
}
</style>
