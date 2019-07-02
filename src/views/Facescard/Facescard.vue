<template>
  <div class="HomePage" v-extend-height>
    <!-- 颜值卡上半部分start -->
    <div class="loveCardTop" :class="openCardState=== 1? 'loveCardTop1' : 'loveCardTop2'">
      <!-- 文字轮播 -->
      <div class="carousel">
        <marquee>
          <marquee-item v-for="(item, index) in carouselList" :key="index">
            <span>{{item.userName}}使用颜值卡购买商品，节约了{{ item.saveMoney/100 }}元</span>
          </marquee-item>
        </marquee>
      </div>
      <!-- 颜值卡信息start -->
      <div class="mycard">
        <div class="userInfo">
          <div class="userImage" :class="openCardState !== 1 && 'isBorder' ">
            <img :src="userImgAndName.userPhoto" v-if="userImgAndName.userPhoto">
            <img :src="userInfo.ext1" alt="" v-else-if="userInfo.ext1">
            <img src="~@/assets/img/yanzhi_card_logo@3x.png" v-else>
          </div>
          <span v-if="userImgAndName.username">{{userImgAndName.username}}</span>
          <span v-else-if="userInfo.realName">{{userInfo.realName}}</span>
          <span v-else class="textShadow">颜值卡</span>
        </div>
        <template v-if="openCardState !== 4">
          <p>最高免审额度(元)</p>
          <p>
            <span class="money-txt">12999</span>
          </p>
          <p>邀好友，免费开通颜值卡，立享尊贵特权!</p>
        </template>
        <!-- 提额规则按钮start -->
        <div class="amountRule">
          <img v-if="openCardState === 4"  @click="gotoUseRecords()" src="~@/assets/img/facecard/detailme.png">
          <img v-else @click="isHowOpenCard = true" src="~@/assets/img/facecard/howKar.png">
        </div>
        <!-- 提额规则按钮end -->
        <!-- 用户已开通, 额度显示 -->
        <div class="quotaInfo" v-if="openCardState === 4">
          <div class="quotaInfo_left">
            <p>可用额度(元)</p>
            <p>
              <span>{{userInfo.remainAmount / 100 | noHasZero}}</span>
            </p>
          </div>
          <div class="bottomInfo">我的额度{{userInfo.totalAmount / 100 | noHasZero}}元，今日提额{{userInfo.todayAdjustmentAmount / 100}}元</div>
        </div>
      </div>
    </div>
    <!-- 颜值卡上半部分end -->
    <!-- 进度轴start -->
    <div class="progressAxis" v-if="openCardState!==4 && isprogressAxis">
      <!-- 免费开通图片 -->
      <div class="title">
        <img src="~@/assets/img/line02@x.png">
      </div>
      <div class="progressAxis_Exhibition">
        <div class="Exhibition_img">
          <img :src="changeImg(progressState[0])" :class="changeClass(progressState[0])">
        </div>
        <div class="Exhibition_line">
          <div :class="changeAxis(progressState[1])"></div>
        </div>
        <div class="Exhibition_img">
          <img :src="changeImg(progressState[1])" alt="" :class="changeClass(progressState[1])">
        </div>
        <div class="Exhibition_line">
          <div :class="changeAxis(progressState[2])"></div>
        </div>
        <div class="Exhibition_img">
          <img :src="changeImg(progressState[2])" alt="" :class="changeClass(progressState[2])">
        </div>
      </div>
      <div class="progressAxis_title">
        <ul>
          <li v-for="(item,index) in verificationMsg" :key="index">{{item}}</li>
        </ul>
      </div>
      <p v-if="openCardState === 1 && perationNum > 0">还差{{perationNum}}步就可以开通颜值卡了！</p>
      <p v-else-if="openCardState === 2">正为您加速审核中，通过后会有短信提示哦，请随时关注进度</p>
      <p v-else-if="openCardState === 3">开通失败了！可以在小象app里提交更多信息，可以提高审核通过率哦</p>
      <p v-else-if="openCardState === 111">哎呀，刚刚没认出你的脸，赶紧再试一次吧！</p>
      <p v-else-if="openCardState === 5">您的颜值卡已经被冻结，如有任何疑问，请联系我们的在线客服或拨打客服电话（0510）85387756</p>

      <div class="btn" @click="iOpenCard('continue')" v-if="openCardState===1">继续开通</div>
      <div class="btnAudit" v-else-if="openCardState === 2">审核中</div>
      <div class="btn" v-else-if="openCardState === 3" @click="goHome">再试一次</div>
      <div class="btnAudit" v-else-if="openCardState === 5">冻结中</div>
    </div>
    <!-- 进度轴end -->
    <div class="inviteFriends" v-if="openCardState !== 4 && isprogressAxis" style="marginBottom:0.4rem">
      <p @click="getXxypSecretUserId(1)" class="invitation">邀请好友开通颜值卡，立即提额1999元</p>
    </div>
    <div class="line" v-if="openCardState !== 4 && isprogressAxis"></div>
    <!-- 开通状态的借还款入口start -->
    <div class="about_money_entry" v-if="openCardState === 4">
      <div @click="goToUrl(2)">去还款</div>
      <ul>
        <li v-for="(item,index) in aboutMoneyEntry" :key="index" @click="goToUrl(index)">
          <img :data-item="index" :src="item.img">
        </li>
      </ul>
    </div>
    <!-- 开通状态的借还款入口end -->
    <!-- 以开通状态邀请按钮start -->
    <div class="already_openCard_center" v-if="openCardState === 4">
      <div class="goAmount" @click="getXxypSecretUserId(2)">邀请好友开通颜值卡，立即提额1999元</div>
      <p v-if="hasWeiboBindChannel" class="already-card-notic">您可以在“微博-我的-微博钱包-分期商城“管理您的颜值卡</p>
      <div class="greyLine"></div>
    </div>
    <!-- 以开通状态邀请按钮end -->
    <!-- 尊享3大特权start -->
    <div class="cardWelfare">
      <h3>
        <p v-if="openCardState === 4" style="height:.053333rem"></p>
        <img src="~@/assets/img/line@x.png">
      </h3>
      <ul v-if="openCardState !== 4">
        <li v-for="(item,index) in privilegeList1" :key="index">
          <img :src="item.img">
          <p>{{item.text}}</p>
        </li>
      </ul>
      <ul v-else>
        <li v-for="(item,index) in privilegeList1" :key="index">
          <img :src="item.img">
          <p>{{item.text}}</p>
        </li>
      </ul>
    </div>
    <!-- 尊享3大特权end -->
    <!-- 邀请好友免费开通情侣卡strart -->
    <div class="inviteFriends" v-if="openCardState !== 4 && !isprogressAxis">
      <p @click="iOpenCard()" class="iOpenCard">我要开卡</p>
      <p @click="getXxypSecretUserId(1)" class="invitation">邀请好友开通颜值卡，立即提额1999元</p>
      <p v-if="hasWeiboBindChannel" class="notic-user">您可以在“微博-我的-微博钱包-分期商城“管理您的颜值卡</p>
    </div>
    <div class="un-user">本产品为第三方合作，服务由小象优品提供，暂不对学生开放</div>
    <!-- 怎样开卡弹窗start -->
    <div v-if="isHowOpenCard">
      <how-open-card @isCard="isHowOpenCard = false"></how-open-card>
    </div>
  </div>
</template>

<script>
import { api, post, fromUrlcode } from '@/module/request'
import Marquee from '@/components/Marquee/Marquee'
import MarqueeItem from '@/components/Marquee/Marquee-item'
import howOpenCard from '@/views/Facescard/HowOpenCard'
import { getAppVersion } from '@/module/common.js'
import { mapState, mapMutations } from 'vuex'
import { initLink } from 'insfns'
import { CHANNEL_WEIBOBIND } from '@/const/constdata'
export default {
  name: 'FacesCard',
  data () {
    return {
      aboutMoneyEntry: [
        { img: require('@/assets/img/facecard/non_trial_withdrawals_a@3x.png') },
        { img: require('@/assets/img/facecard/non_trial_withdrawals_c@3x.png') },
        { img: require('@/assets/img/facecard/non_trial_withdrawals_b@3x.png') }
      ],
      privilegeList1: [
        { img: require('@/assets/img/facecard/home_list_icon01@3x.png'), text: '购物97折' },
        { img: require('@/assets/img/facecard/icon3_mianshen@3x.png'), text: '免审可提现' },
        { img: require('@/assets/img/facecard/icon4_zhuanshu@3x.png'), text: '¥12999免审' }
      ],
      privilegeList2: [
        { img: require('@/assets/img/facecard/home_list_img_a@3x.png') },
        { img: require('@/assets/img/facecard/home_list_img_b@3x.png') },
        { img: require('@/assets/img/facecard/home_list_img_c@3x.png') }
      ],
      closeVoucher: false, // 领券弹框
      voucherText: '领取成功, 可下载小象优品APP使用哦',
      isHowOpenCard: false, // 控制如何开卡显示隐藏
      openCardState: 1, // 控制首页未开卡 ，审核中，审核失败，已开通，冻结中，重新秀颜值的状态显示，依次是1，2，3，4，5，111
      isprogressAxis: false, // 1不显示进度轴2是显示
      cardCode: null, // 如果已开卡,传递给使用记录，卡全局唯一编号
      carouselList: [],
      userInfo: {}, // 用户图像及姓名和另一个人的
      giftList: [], // 礼品列表
      cardAmount: null, // 免审额度
      verificationMsg: [],
      progressState: [],
      perationNum: null,
      userImgAndName: {}, // 未开卡查询用户图像和姓名
      progressImg: {
        img1: require('../../assets/img/yanzhi_icon_undo@3x.png'), // 未开通
        img2: require('../../assets/img/yanzhi_icon_ing@3x.png'), // 开通中
        img3: require('../../assets/img/yanzhi_icon_success@3x.png') // 已开通
      },
      downAppLink: 'javascript:;'
    }
  },
  async created () {
    if (this.userToken) {
      this.init()
    }
    if (this.linkMeLoadStatus) {
      this.downAppLink = await initLink('bsd://xxyp/main/tab?tabIndex=0')
    }
    this.upZhimaTaskId()
    this.$tj('enterycard')
    this.cardListCarousel()
  },
  components: {
    howOpenCard,
    Marquee,
    MarqueeItem
  },
  computed: {
    ...mapState(['linkMeLoadStatus', 'loginChannel']),
    userToken () {
      return this.$store.state.userIdentity.token
    },
    hasWeiboBindChannel () { // 是否是微博渠道
      return this.loginChannel !== CHANNEL_WEIBOBIND
    }
  },
  watch: {
    userToken (val) {
      if (val) {
        this.init()
      }
    },
    async linkMeLoadStatus (val) {
      if (val && this.downAppLink === 'javascript:;') {
        this.downAppLink = await initLink('bsd://xxyp/main/tab?tabIndex=0')
      }
    }
  },
  methods: {
    ...mapMutations([
      'setLoginStatus'
    ]),
    /**
     * 查询用户拍照，开卡信息配置页面状态
     *
     */
    init () {
      // 查询情侣卡信息，未开通、已开通，审核中,审核失败等信息，未登录状态下也能查询出情侣卡相关信息
      global.vbus.$emit('loading_show', true)
      return post(api.lookingCardState + '?token=' + this.userToken)
        .then(({ data }) => {
          if (data === 'noopencard') {
            // 未开卡
            this.openCardState = 1
            this.fetchUserCardState() // 查询授权相关状态
          } else {
            this.cardAmount = data.cardAmount
            this.userInfo = data
            this.cardCode = data.cardCode
            const status = Number(data.status)
            if (status !== 2) {
              this.fetchUserCardState() // 查询授权相关状态
            }
            if (status === 1) {
              // 审核中
              this.openCardState = 2
            } else if (status === -2) {
              // 开卡失败
              this.openCardState = 3
            } else if (status === 2) {
              // 审核通过
              this.openCardState = 4
            } else if (status === -3) {
              // 卡冻结
              this.openCardState = 5
            }
          }
          global.vbus.$emit('loading_show', false)
        })
        .catch(err => {
          global.vbus.$emit('loading_show', false)
          this.$toast(String(err))
        })
    },
    /**
     * 跳转借还款入口
     *
     */
    goToUrl (i) {
      if (i === 0) { // 提现
        this.$tj('clickycardcash')
        this.$router.push({ name: 'BorrowMoney' })
      } else if (i === 1) { // 借款记录
        this.$tj('clickycardrecord')
        this.$router.push({ name: 'HistoryPage', query: { noCache: Date.now() } })
      } else { // 还款
        this.$tj('clickycardreturn')
        this.$router.push({ name: 'myBill', query: { noCache: Date.now() } })
      }
    },
    /**
     * 获取拍照状态，开通状态配置页面显示
     *
     */
    async fetchUserCardState () {
      global.vbus.$emit('loading_show', true)
      let realNameFlag
      this.checkReceiverRealName()
        .then(data => {
          realNameFlag = data.isRealnameApprove && !data.isAddRealnameApprove
          return this.queryMyMarkUpMobileAuthV2()
        })
        .then(body => {
          global.vbus.$emit('loading_show', false)
          body.realNameFlag = realNameFlag
          if (!body.success || body.dianshangMarkup === undefined || body.alipayMarkup === undefined || body.alipayMarkup === undefined || body.realNameFlag === undefined) {
            return Promise.reject(new Error('数据请求错误，请联系客服！'))
          }
          // 电商(dianshangMarkup)、公信宝(gxbZhimaAuthNeed)授权，在页面上都是作为芝麻分展示这里统一成一个zhimaAuth
          body.zhimaAuth = body.gxbZhimaAuthNeed || body.dianshangMarkup
          // 未拍照、芝麻分待授权、运营商待授权、未实名 则不显示授权进度条
          if (body.zhimaAuth && body.markUp && !body.realNameFlag) {
            return
          }
          const sortList = [
            { name: '实名认证', value: !body.realNameFlag },
            { name: '电商授权', value: body.zhimaAuth },
            { name: '运营商认证', value: body.markUp }
          ]
          // 通过判断前后两项授权的状态来进行排序
          sortList.sort((a, b) => {
            if (a.value && !b.value) {
              return 1
            } else if (!a.value && b.value) {
              return -1
            } else {
              return 0
            }
          })
          this.verificationMsg = []
          this.progressState = []
          sortList.forEach(item => {
            this.verificationMsg.push(item.name)
            this.progressState.push(item.value)
          })
          // 统计剩余的授权步骤
          let perationNum = 0
          this.progressState.forEach(item => {
            if (item) {
              perationNum += 1
            }
          })
          this.perationNum = perationNum
          this.isprogressAxis = true
          // 秀颜值、实名认证、芝麻分、运营商授权都完成后检查判断直接检查是否需要其他补偿授权
          let fourAuthComplete = true
          for (let item of this.progressState) {
            if (item) {
              fourAuthComplete = false
              break
            }
          }
          if (fourAuthComplete && this.openCardState === 1) {
            this.openUpCard()
          }
        })
        .catch(err => {
          global.vbus.$emit('loading_show', false)
          this.$toast(String(err))
        })
    },
    /**
     * 颜值卡使用轮播信息,顶部滚动显示
     *
     */
    cardListCarousel () {
      post(api.cardUseList, fromUrlcode({ typeIndex: 2 }))
        .then(res => {
          this.carouselList = res.data
        })
        .catch(err => {
          this.$toast(String(err))
        })
    },
    /**
     * 用户提额列表,顶部列表滚动
     *
     */
    async queryLookingCardIncreaseAmountList () {
      let err, res;
      [err, res] = await this.catchErr(post(api.queryLookingCardIncreaseAmountList))
      if (err) {
        let error = err
        if (err.message) {
          error = err.message
        }
        this.$toast(error)
      }
      if (res && res.data) {
        console.log(res)
        this.carouselList = res.data
      }
    },
    /**
     * 用户开通后可选择去借款，购物
     *
     */
    jumpPrivilege (i) {
      // 去提现
      if (i === 0) {
        this.goLoan()
      } else { // 去购物
        this.goShopping(i)
      }
    },
    /**
     * 查询用户拍照状态
     *
     */
    queryPhotoState () {
      return post(api.photoStatus + '?token=' + this.userToken)
        .then(res => {
          let data = res.data
          this.userImgAndName = data
          return data
        })
    },
    /**
     * 查询用户礼品列表
     *
     */
    myGiftList () {
      post(api.giftList + '?token=' + this.userToken + '&cardType=2')
        .then(res => {
          this.giftList = res.data
        })
        .catch(err => {
          this.$toast(String(err))
        })
    },
    /**
     * 查询用户授权认证状态
     *
     */
    queryMyMarkUpMobileAuthV2 (realNameFlag) {
      let params = {
        token: this.userToken,
        orderCode: '511111111111111111111'
      }
      let ua = navigator.userAgent
      let reg = /instalment\/([\d]+)\.([\d]+)\.([\d]+)/
      let rets = ua.match(reg)
      let version = ''
      if (rets) {
        version = `${rets[1]}.${rets[2]}.${rets[3]}`
      } else {
      }
      return post(api.isMarkUpMobileAuthV2, fromUrlcode(params), {
        headers: { appVersion: version }
      })
    },
    /**
     * 开通进度条，是否授权切换两种状态的Class
     *
     */
    changeClass (state) {
      return state ? 'iconDefault' : 'iconSucces'
    },
    /**
     * 开通进度条，是否授权切换两种状态的图片
     *
     */
    changeImg (state) {
      return state ? this.progressImg.img1 : this.progressImg.img3
    },
    /**
     * 开通进度条，是否授权切换两种状态的连线Class
     *
     */
    changeAxis (state) {
      return state ? 'lineDefault' : 'lineSucces'
    },
    /**
     * 用户开卡
     *
     */
    iOpenCard (state) {
      if (!this.userToken) {
        this.setLoginStatus(true)
        return false
      }
      this.$tj('clickycardopen')
      this.userAuthStep()
    },
    /**
     * 配置用户分享信息
     *
     */
    guideUserShare (encryptUserId) {
      // TODO: 是否外接微信一样的分享配置功能
      // 分享数据，其他web平台无法达到微信的功能
      // let shareData = {
      //   title: '您的好友邀请您一起开通小象颜值卡',
      //   text: `解锁小象颜值卡，立即获得最高8999元免审额度，额度可提现，全场商品97折起购！`,
      //   messageContent: `老铁，我悄悄为你开通了一张小象颜值卡。卡内最高8999元免审信用，额度可提现，专享全场97折起特惠等特权，领取链接`,
      //   imgurl: 'https://cdn.basestonedata.com/app/share/img/xiaoxiangyoupin.png'
      // }
      localStorage.guideUserShare = 'share'
      this.$router.push({
        name: 'InvitationOther',
        query: {
          inviteId: encryptUserId,
          pagestate: 1
        }
      })
    },
    /**
     * TODO: 邀请逻辑 在普通web平台暂时走不通
     *
     */
    getXxypSecretUserId (num) {
      // 加密userId
      if (!this.userToken) {
        this.setLoginStatus(true)
        return false
      }
      if (num === 1) {
        // this.$tj('invitationBtn')
      } else if (num === 2) {
        // this.$tj('alreadyInvitationBtn')
      }
      post(api.getXxypSecretUserId + '?token=' + this.userToken)
        .then(res => {
          if (num === 1 || num === 2) {
            this.guideUserShare(res.data)
          }
        })
        .catch(err => {
          this.$toast(String(err))
        })
    },
    /**
     * 授权验证通过后，执行的动作
     *
     */
    openUpCard (img = null) {
      global.vbus.$emit('loading_show', true)
      post(api.openUpCard, fromUrlcode({ token: this.userToken, headUrl: img }))
        .then(res => {
          global.vbus.$emit('loading_show', false)
          if (res.data) {
            this.openCardState = 2
          }
        })
        .catch(err => {
          global.vbus.$emit('loading_show', false)
          this.$toast(String(err))
        })
    },
    RecordingHints (num) {
      if (num === 1) {
        this.isGuide = 0
        this.recordUserTips()
      } else if (num === 2) {
        this.isGuide = 2
        this.recordUserTips()
      }
    },
    recordUserTips () {
      // 记录用户看过蒙城
      post(api.recordUserWatchTips, fromUrlcode({ token: this.userToken, version: 1 }))
        .then(res => {
          console.log('记录看过蒙层', res)
        })
        .catch(err => {
          this.$toast(String(err))
        })
    },
    ReceiveCoupon (id, index) {
      // 领取礼品
      this.closeVoucher = true
      post(api.takeGift + '?token=' + this.userToken + '&giftId=' + id)
        .then(res => {
          this.closeVoucher = true
          this.giftList[index].giftStatus = 2
        })
        .catch(err => {
          this.$toast(String(err))
        })
    },
    /**
     * 开卡失败，发送请求改变状态
     *
     */
    goHome () {
      post(api.reOpenCard + '?token=' + this.userToken)
        .then(res => {
          if (res.data) {
            this.init()
          } else {
            this.$toast(res.data)
          }
        })
        .catch(err => {
          this.$toast(String(err))
        })
    },
    /**
     * 点击左上角图像去来电个人资料
     *
     */
    goEditData () {
      // this.$tj('goUsetData')
      // 调用开卡接口才可以跳来电
      if (this.openCardState === 2 || this.openCardState === 3 || this.openCardState === 4) {
        location.href = `bsd://xxyp/ld/detail?liked=0`
      }
    },
    goLoan () {
      // 去借款
      // this.$tj('goLoan')
      if (getAppVersion([3, 6, 9])) {
        location.href = 'bsd://xxyp/loan/card?cardCode=' + this.cardCode + '&cardType=2'
      } else {
        global.vbus.$emit('setUpdateDialog', true)
      }
    },
    goShopping (index) {
      // 去购物
      // this.$tj('goShopping')
      if (index === 1) {
        location.href = 'bsd://goodsList2?bannerId=1763&&position=0'
      } else {
        location.href = 'bsd://xxyp/goods/category?typeId=53&title=%e7%bd%91%e6%98%93%e8%80%83%e6%8b%89%e6%ad%a3%e5%93%81%e6%b5%b7%e6%b7%98'
      }
    },
    /**
     * 获取用户实名状态
     *
     */
    checkReceiverRealName () {
      let param = { token: this.userToken }
      return post(api.userCreditV4, fromUrlcode(param))
        .then(body => {
          if (body.data) {
            return body.data
          } else {
            throw new Error('获取用户数据错误')
          }
        })
    },
    /**
     * 获取用户授权状态，逐步引导用户完成授权
     *
     */
    userAuthStep () {
      global.vbus.$emit('loading_show', true)
      let needUpdateEmergency, needUploadIdCard
      console.log(needUpdateEmergency)
      this.checkReceiverRealName()
        .then(data => {
          if (!data.isRealnameApprove) {
            // 未实名
            global.vbus.$emit('loading_show', false)
            global.vbus.$emit('setRealName', 0)
            return Promise.reject(new Error('auth:end'))
          } else if (data.isRealnameApprove && data.isAddRealnameApprove) {
            // 实名 但需补偿
            global.vbus.$emit('loading_show', false)
            global.vbus.$emit('setRealName', 1)
            return Promise.reject(new Error('auth:end'))
          } else if (data.isRealnameApprove && !data.isAddRealnameApprove) {
            // 实名 且无需补偿 判断电商授权
            needUpdateEmergency = data.needUpdateEmergency
            needUploadIdCard = data.needUploadIdCard
            return this.queryMyMarkUpMobileAuthV2()
          }
        })
        .then(body => {
          global.vbus.$emit('loading_show', false)
          if (!body.success || body.dianshangMarkup === undefined || body.alipayMarkup === undefined || body.alipayMarkup === undefined) {
            return Promise.reject(new Error('数据请求错误，请联系客服！'))
          }
          if (body.dianshangMarkup) { // 电商授权判断
            global.vbus.$emit('setDsDialog', true) // 需要电商授权，显示提示弹层
            return Promise.reject(new Error('auth:end'))
          } else if (needUploadIdCard) {
            // 身份证上传
            global.vbus.$emit('setIdCardDialog', true)
            return Promise.reject(new Error('auth:end'))
          } else if (body.gxbZhimaAuthNeed) { // 需要公信宝芝麻授权，显示提示弹层
            if (body.zhimaAuthUrl) {
              global.vbus.$emit('setGxbZhimaAuthNeed', body.zhimaAuthUrl)
            } else {
              this.$toast('芝麻授权地址错误')
            }
            return Promise.reject(new Error('auth:end'))
          } else if (body.markUp) { // 运营商授权
            global.vbus.$emit('setOperatorDialog', true)
            return Promise.reject(new Error('auth:end'))
          }
        })
        .then(body => {
          if (this.openCardState === 1) {
            this.openUpCard()
          }
        })
        .catch(err => {
          global.vbus.$emit('loading_show', false)
          if (err.message && err.message !== 'auth:end') {
            this.$toast(err.message || String(err))
          } else if (typeof err === 'string' && err !== 'auth:end') {
            this.$toast(err)
          }
        })
    },
    /**
     * 上报电商授权的taskId
     *
     */
    async upZhimaTaskId () {
      let taskId = this.getQueryString('task_id')
      if (taskId) {
        try {
          global.vbus.$emit('loading_show', true)
          await this.$api['auth/submitDianshangTaskId']({
            token: this.userToken,
            taskId
          })
          global.vbus.$emit('loading_show', false)
          this.$router.replace({
            name: 'Facescard'
          })
        } catch (error) {
          global.vbus.$emit('loading_show', false)
          this.$toast(error)
        }
      }
    },
    /**
     * 将promise的返回结果转换promise的格式
     *
     */
    catchErr (promise) {
      return promise
        .then(data => {
          return [null, data]
        })
        .catch(err => [err])
    },
    /**
     * 查看额度明细
     *
     */
    gotoUseRecords (title) {
      this.$router.push({
        name: 'UseRecords',
        query: { cardCode: this.cardCode }
      })
    }
  },
  filters: {
    noHasZero (num) {
      return num < 0 ? 0 : num
    }
  }
}
</script>

<style scoped lang="scss">
img {
  width: 100%;
  height: 100%;
}
.HomePage {
  background: #fff;
  text-align: center;
  padding-bottom: 1.333333rem;
  overflow: hidden;
  .mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
  }

  // 领券弹框
  .voucher {
    width: 7.866667rem;
    height: 6.6rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -3.653333rem;
    margin-left: -3.933333rem;
    img {
      width: 100%;
      height: 2.933333rem;
    }
    .voucherPrompt {
      background: #fff;
      width: 100%;
      border-bottom-left-radius: 0.266667rem;
      border-bottom-right-radius: 0.266667rem;
      h3 {
        font-size: 0.426667rem;
        font-weight: 600;
        padding: 0.666667rem 0;
        font-family: PingFangSC-Medium;
      }
      .btn {
        height: 1.066667rem;
        margin: 0 auto;
        color: #232aee;
        line-height: 1.066667rem;
        font-size: 0;
        white-space: nowrap;
        span{
          display: inline-block;
          width: 50%;
          font-size: 0.4rem;
        }
      }
    }
  }
  // 升级提示
  .updatehints {
    width: 7.866667rem;
    height: 7.706667rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -3.853333rem;
    margin-left: -3.933333rem;
    img {
      width: 100%;
      height: 3.186667rem;
    }
    .text {
      background: #fff;
      width: 100%;
      height: 4.786667rem;
      border-bottom-left-radius: 0.266667rem;
      border-bottom-right-radius: 0.266667rem;
      h3 {
        font-size: 0.426667rem;
        color: #333;
        font-weight: 600;
        padding: 0.533333rem 0 0.586667rem 0;
      }
      p {
        font-size: 0.373333rem;
        color: #636363;
        line-height: 0.533333rem;
      }
      .btn {
        width: 6.533333rem;
        height: 1.066667rem;
        background: linear-gradient(
          180deg,
          rgba(245, 75, 120, 1),
          rgba(237, 20, 86, 1)
        );
        border-radius: 0.106667rem;
        margin: 0.8rem auto;
        color: #fff;
        line-height: 1.066667rem;
        font-size: 0.4rem;
      }
    }
  }
}
// card上半部分start
.loveCardTop1 {
  background: url("~@/assets/img/facecard/bg_img1@3x.png") no-repeat;
}
.loveCardTop2 {
  background: url("~@/assets/img/facecard/yanzhi_banner_bg01@3x.png") no-repeat;
}
.loveCardTop {
  width: 100%;
  background-size: 100%;
  padding-top: 0.4rem;
  box-sizing: border-box;
  .card2 {
    padding: 1.413333rem 0.813333rem 0 !important;
  }
  .mycard {
    width: 8.133333rem;
    background: url("~@/assets/img/facecard/img_card@3x.png") no-repeat;
    height: 5.066667rem;
    background-size: 100%;
    margin: 0 auto;
    padding-top: 0.4rem;
    box-sizing: border-box;
    position: relative;
    .amountRule {
      position: absolute;
      top: .453333rem;
      right: -0.283333rem;
      font-size: 0.32rem;
      font-family: PingFangSC-Regular;
      color: #fff;
      img {
        display: inline-block;
        width: 2.773333rem;
        height: .906667rem;
      }
      span {
        line-height: 0.373333rem;
        display: inline-block;
      }
    }
    .quotaInfo {
      margin-top: 0.4rem;
      width: 100%;
      font-size: 0;
      .quotaInfo_left {
        display: inline-block;
        width: 100%;
        p:last-child {
          padding-bottom: .74rem;
          span {
            position: relative;
            color: #ffd799;
            font-size: 1.066667rem;
            font-weight: 600;
          }
          span:before {
            content: attr(data-text);
            color: #fff3d5;
            position: absolute;
            left: 0;
            z-index: 100;
            -o-mask-image: linear-gradient(to bottom, #ffd799, transparent);
            -moz-mask-image: linear-gradient(to bottom, #ffd799, transparent);
            -ms-mask-image: -linear-gradient(to bottom, #ffd799, transparent);
            mask-image: linear-gradient(to bottom, #ffd799, transparent);
          }
        }
        p:first-child {
          font-size: .32rem;
          font-family: PingFangSC-Regular;
          color: #fff;
          opacity: 0.7;
          padding: 0 0 .266667rem;
        }
      }

      .bottomInfo {
        background: url("~@/assets/img/facecard/Shape01@3x.png") no-repeat;
        background-size: 100%;
        width: 5.6rem;
        height: 0.693333rem;
        margin: 0 auto;
        color: #ffd79a;
        font-size: .32rem;
        text-align: center;
        line-height: 0.693333rem;
      }
    }
    .isBorder {
      border: 0.03rem solid #fff;
      border-radius: 50%;
    }
    .userInfo {
      text-align: left;
      height: 0.666667rem;
      position: relative;
      > span {
        color: #fff;
        padding-left: 1.346667rem;
        box-sizing: border-box;
        font-size: 0.373333rem;
        line-height: 0.666667rem;
        display: inline-block;
        font-family: PingFangSC;
      }
      .textShadow {
        font-weight: 600;
        text-shadow: 0.013333rem 0.013333rem 0.013333rem rgba(57, 69, 145, 44);
      }
    }
    .userImage {
      width: 0.666667rem;
      height: 0.666667rem;
      position: absolute;
      top: 50%;
      left: 0.52rem;
      margin-top: -0.333333rem;
      box-sizing: border-box;
      overflow: hidden;
      img {
        border-radius: 50%;
        width: 100%;
      }
    }
    > p:nth-child(2) {
      color: #fff;
      box-sizing: border-box;
      font-size: 0.32rem;
      opacity: 0.7;
      font-family: PingFangSC-Regular;
      padding-top: 0.346667rem;
    }
    > p:nth-child(3) {
      font-size: 1.2rem;
      font-weight: 600;
      padding: 0.293333rem 0 0.8rem;
      span {
        position: relative;
        font-size: 1.2rem;
        font-weight: 600;
        background-image: linear-gradient(180deg,rgba(255,243,213,1) 0%,rgba(255,215,153,1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    > p:nth-child(4) {
      color: #fff;
      font-size: .373333rem;
    }
  }
}

.carousel {
  width: 9.2rem;
  height: 0.72rem;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  border-radius: .053333rem;
  padding: 0 0.4rem;
  box-sizing: border-box;
  overflow: hidden;
  margin-bottom: 0.533333rem;
  position: relative;
  li {
    font-family: PingFangSC-Regular;
    color: #fff;
    font-size: 0.32rem;
    height: 100%;
    line-height: 0.72rem;
    text-align: left;
  }
  .goAmount {
    font-size: 0.32rem;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    position: absolute;
    top: 50%;
    margin-top: -0.18rem;
    right: 0.4rem;
    color: #fff3b5;
  }
}

// card上半部分end

// 开卡福利start
.cardWelfare {
  padding: .4rem 0 .8rem;
  box-sizing: border-box;
  background: #fff;
  h3 {
    font-family: PingFangSC-Medium;
    font-size: 0.4rem;
    color: #333;
    width: 3.04rem;
    height: 0.426667rem;
    margin: 0 auto;
    img {
      width: 100%;
    }
  }
  ul {
    font-size: 0;
    padding-top: 0.6rem;
  }
  li {
    width: 2.72rem;
    display: inline-block;
    img {
      width: 106px;
      height: auto;
    }
    p {
      margin-top: 18px;
      font-size: 28px;
      color: #333;
    }
  }
  li:nth-child(2) {
    margin: 0 0.386667rem;
  }
}
// 开卡福利end

// 邀请好友免费开卡
.inviteFriends {
  background: #fff;
  p {
    width: 9.2rem;
    height: 1.12rem;
    margin: 0 auto;
    color: #fff;
    text-align: center;
    font-size: 0.4rem;
    line-height: 84px;
    box-sizing: border-box;
    border-radius: 4px;
  }
  .iOpenCard {
    background: url("~@/assets/img/yanzhi_img_button@3x.png") no-repeat;
    background-size: 100%;
    margin-bottom: 0.4rem;
    border-radius: 4px;
    font-size: 32px;
  }
  .invitation {
    border-radius: .053333rem;
    border: 1PX solid;
    color: #282435;
    font-size: .4rem;
    text-align: center;
  }
}

.un-user {
  margin-bottom: 30px;
  color: #939393;
  text-align: center;
  font-size: 24px;
  margin-top: 40px;
  // margin-bottom: 63px;
}

// 审核中，审核失败start
.openCare_audit {
  padding-top: 0.666667rem;
  h3 {
    font-size: 0.426667rem;
    color: #333;
    line-height: 0.6rem;
    font-weight: 600;
    font-family: PingFangSC;
    text-align: center;
  }
  > p {
    font-size: 0.346667rem;
    color: #939393;
    line-height: 0.493333rem;
    font-family: PingFangSC;
    padding: 0.213333rem 1.266667rem 0;
  }
  .againOpenCard {
    width: 9.2rem;
    height: 1.173333rem;
    background: url("../../assets/img/facecard/yanzhi_img_button@3x.png") no-repeat;
    background-size: 100%;
    border-radius: 0.106667rem;
    margin: 0 auto;
    color: #fff;
    line-height: 1.173333rem;
    text-align: center;
    margin-top: 1.466667rem;
    font-family: PingFangSC-Regular;
    font-size: 0.4rem;
  }
}

//  审核中，审核失败end

// 已开通状态start
.bars {
  width: 0.48rem;
  height: 0.066667rem;
  margin: 0 auto;
  background: #000;
}
.greyLine {
  content: "";
  display: block;
  height: 0.266667rem;
  width: 100%;
  background: #f2f2f2;
}
.already_openCard_center {
  width: 100%;
  padding-top: .4rem;
  .greyLine {
    margin-top: .533333rem;
  }
  h4 {
    padding: 0.386666rem 0 0.653333rem;
    font-family: PingFangSC-Medium;
    font-size: 0.373333rem;
    color: #333;
    font-weight: 500;
    span:first-child {
      margin-right: 6px;
    }
    span:nth-child(2) {
      font-size: 0.48rem;
      color: #e7a031;
    }
  }
  // 去提额
  .goAmount {
    width: 9.2rem;
    height: 84px;
    background: #fff;
    background-size: 100%;
    margin: 0 auto;
    text-align: center;
    line-height: 84px;
    color: #333;
    font-size: .4rem;
    font-family: PingFangSC-Regular;
    box-sizing: border-box;
    border: 1PX solid #333;
    border-radius: 4px;
  }
}
.about_money_entry {
  width: 9.44rem;
  margin: .8rem auto 0;
  div {
    width: 9.2rem;
    height: 84px;
    line-height: 84px;
    background: url("../../assets/img/facecard/yanzhi_img_button@3x.png") no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    text-align: center;
    color: #fff;
    font-size: 0.4rem;
    font-family: PingFangSC-Regular;
    box-sizing: border-box;
    border-radius: 4px;
  }
  li {
    float: left;
    width: 3.146667rem;
    height: 100%;
  }
}
// 已开通下半部分
.already_openCard_bottom {
  .title {
    height: 0.426667rem;
    width: 3.626667rem;
    margin: 0 auto;
  }
  .mywelfare {
    width: 8.946667rem;
    margin: 0 auto;
    overflow: hidden;
    padding-bottom: 0.8rem;
    padding-top: 0.6rem;
    li {
      width: 4.266667rem;
      height: 2.266667rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    li:nth-child(2n-1) {
      float: left;
    }
    li:nth-child(2n) {
      float: right;
    }
    // 福利图片start
    .mywelfare_img {
      width: 2.08rem;
      height: 2.08rem;
      border-radius: 50%;
      img {
        height: 100%;
        width: 100%;
      }
    }

    // 福利图片end
  }

  // 邀请好友赚不停start
  .Invitation_friends {
    position: relative;
    h3 {
      font-size: 0.4rem;
      font-family: PingFangSC-Medium;
      color: #333;
      font-weight: 600;
      padding: 0.613333rem 0 0.106667rem;
    }
    &_info {
      padding: 0.48rem 0.4rem 0;
      box-sizing: border-box;
      width: 9.2rem;
      height: 4.506667rem;
      background: url("~@/assets/img/facecard/bg_img3@3x.png") no-repeat;
      background-size: 100%;
      margin: 0 auto;
      margin-top: 0.56rem;
      .forExample {
        font-size: 0.32rem;
        line-height: 0.44rem;
        color: #636363;
        font-family: PingFangSC-Regular;
        text-align: left;
        margin-top: 0.32rem;
      }
      .putForward {
        font-size: 0.346667rem;
        color: #ed145b;
        margin-top: 0.346667rem;
      }
      .title {
        width: 8.4rem;
        position: relative;
        p {
          font-family: PingFangSC;
          font-size: 0.373333rem;
          line-height: 0.533333rem;
          color: #333;
          font-weight: 600;
          text-align: left;
          margin-left: 0.226667rem;
          span {
            color: #ed145b;
          }
        }
      }
      .redBar {
        width: 0.066667rem;
        height: 0.293333rem;
        background: #f54b78;
        position: absolute;
        left: 0;
        top: 0.133333rem;
      }
    }
    .bgcMask {
      background: url("~@/assets/img/facecard/bg_img4@3x.png") no-repeat;
      background-size: 100%;
      width: 100%;
      height: 0.373333rem;
      position: absolute;
      bottom: 0;
    }
  }
  // 邀请好友赚不停end

  // 可提现金额，与累计获得金额start
  .userMoney {
    position: relative;
    padding: 0 1.466667rem;
    box-sizing: border-box;
    height: 3.28rem;
    position: relative;
    p:first-child {
      margin-top: 0.266667rem;
      font-size: 0.333333rem;
      color: #333;
      font-family: PingFangSC;
      line-height: 0.48rem;
    }
    p:nth-child(2) {
      font-size: 0.48rem;
      color: #ed145b;
      font-family: PingFangSC-Medium;
      margin-top: 0.133333rem;
    }
    .Can_Put_Forward {
      position: absolute;
      left: 1.866667rem;
    }
    .add_up_money {
      position: absolute;
      right: 1.866667rem;
    }
    .bar {
      width: 0.013333rem;
      height: 0.986667rem;
      background: #e5e5e5;
      position: absolute;
      left: 50%;
    }
  }
  //  可提现金额，与累计获得金额end
  .Invitation_btn {
    width: 9.2rem;
    height: 1.173333rem;
    background: url("../../assets/img/facecard/yanzhi_img_button@3x.png");
    background-size: 100%;
    border-radius: 0.106667rem;
    line-height: 1.173333rem;
    color: #fff;
    font-size: 0.4rem;
    font-family: PingFangSC;
    margin: 0 auto;
  }
  .my_Invitation_record {
    font-size: 0.4rem;
    font-family: PingFangSC-Regular;
    color: #ed145b;
    line-height: 0.56rem;
    margin-top: 0.48rem;
  }
}
// 已开通状态end

// 提额规则start
.ruleMask {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  .rule {
    width: 7.866667rem;
    height: 13.226667rem;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -3.933333rem;
    margin-top: -6.613333rem;
    border-radius: 0.266667rem;
    .rule_data {
      height: 12.133333rem;
      overflow: scroll;
    }
  }
  h3 {
    font-size: 0.426667rem;
    color: #333;
    font-family: PingFangSC;
    padding: 0.746667rem 0 0.466667rem;
    box-sizing: border-box;
    color: #333;
    font-weight: 600;
  }
  h4,
  p {
    color: #333;
    font-size: 0.373333rem;
    font-family: PingFangSC;
    text-align: left;
    line-height: 0.533333rem;
    position: relative;
    padding: 0 0.666667rem;
    box-sizing: border-box;
    i {
      width: 0.106667rem;
      height: 0.106667rem;
      border-radius: 50%;
      background: #7784ff;
      position: absolute;
      left: 0.666667rem;
      top: 0.24rem;
    }
  }
  h4 {
    padding-bottom: 0.293333rem;
    box-sizing: border-box;
  }
  p {
    text-indent: 1em;
    padding-bottom: 0.266667rem;
    box-sizing: border-box;
  }
  p:nth-child(7) {
    padding-bottom: 0px;
    box-sizing: border-box;
  }
  .btn {
    width: 100%;
    color: #232aee;
    font-size: 0.4rem;
    text-align: center;
    box-sizing: border-box;
    height: 1.2rem;
    line-height: 1.2rem;
  }
  // 提额规则end
}
//引导弹窗
.openMask {
  width: 100%;
  .mask {
    background: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
    background-size: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
  }
  .firstGuide {
    padding-top: 6.88rem;
    box-sizing: border-box;
    .goForehead {
      width: 9.64rem;
      height: 1.586667rem;
      margin: 0 auto;
      img {
        width: 100%;
      }
    }
    > img {
      width: 100%;
      height: 4.173333rem;
    }
    .bottom_btn {
      img:first-child {
        left: 0.96rem;
        top: 0.4rem;
      }
      img:nth-child(2) {
        right: 0.973333rem;
        top: 0.4rem;
      }
    }
  }

  .twoGuide {
    padding-top: 1.586667rem;
    box-sizing: border-box;
    .userimg {
      width: 0.88rem;
      height: 0.88rem;
      border: 0.03rem solid #fff;
      border-radius: 50%;
      box-sizing: border-box;
      overflow: hidden;
      margin-left: 1.333333rem;
      img {
        width: 100%;
      }
    }
    > img {
      width: 8.133333rem;
      height: 4.546667rem;
      margin-top: 0.386667rem;
    }
    .bottom_btn {
      img:first-child {
        left: 0.986667rem;
        top: 1.08rem;
      }
      img:nth-child(2) {
        right: 0.96rem;
        top: 1.08rem;
      }
    }
  }
  .bottom_btn {
    position: relative;
    img {
      width: 2.933333rem;
      height: 1.333333rem;
    }
    img:first-child {
      position: absolute;
    }
    img:nth-child(2) {
      position: absolute;
    }
  }

  .threeGuide {
    padding-top: 4.8rem;
    box-sizing: border-box;
    .amountImg {
      width: 3.333333rem;
      height: 2.133333rem;
      background: url("~@/assets/img/facecard/maskbg@3x.png") no-repeat;
      background-size: 100%;
      position: absolute;
      right: 1.68rem;
      top: 2.666667rem;
      .amountImg_msg {
        position: relative;
        img {
          width: 0.373333rem;
          height: 0.373333rem;
          position: absolute;
          left: 0.573333rem;
          top: 50%;
          margin-top: -0.186667rem;
        }
        span {
          font-size: 0.32rem;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: #fff;
          line-height: 0.533333rem;
          opacity: 0.7;
          display: inline-block;
          padding-left: 1.066667rem;
          box-sizing: border-box;
          width: 100%;
          text-align: left;
        }
      }
      > p {
        padding-top: 0.266667rem;
        box-sizing: border-box;
        span {
          position: relative;
          color: #ffd799;
          font-size: 1.066667rem;
          font-weight: 500;
        }
        span:before {
          content: attr(data-text);
          color: #fff3d5;
          position: absolute;
          left: 0;
          z-index: 100;
          -o-mask-image: linear-gradient(to bottom, #ffd799, transparent);
          -moz-mask-image: linear-gradient(to bottom, #ffd799, transparent);
          -ms-mask-image: -linear-gradient(to bottom, #ffd799, transparent);
          mask-image: linear-gradient(to bottom, #ffd799, transparent);
        }
      }
    }
    > img {
      width: 8.08rem;
      height: 3.92rem;
    }
    .bottom_btn {
      img:first-child {
        left: 0.96rem;
        top: 1.32rem;
      }
      img:nth-child(2) {
        right: 1rem;
        top: 1.32rem;
      }
    }
  }
}

// 进度轴start
.progressAxis {
  padding: 0.666667rem 0 0.4rem;
  .title {
    width: 3.066667rem;
    height: 0.426667rem;
    margin: 0 auto;
  }
  .progressAxis_Exhibition {
    padding: 0.8rem 0 0.373333rem;
    width: 7.44rem;
    margin: 0 auto;
    text-align: left;
    font-size: 0;
    height: 0.293333rem;
    text-align: center;
    .Exhibition_img {
      width: 0.293333rem;
      height: 0.293333rem;
      position: relative;
      img {
        position: absolute;
        top: 50%;
        left: 50%;
      }
    }
    .iconDefault {
      width: 0.293333rem;
      height: 0.293333rem;
      margin-top: -0.146667rem;
      margin-left: -0.146667rem;
    }
    .iconFail {
      width: 0.293333rem;
      height: 0.293333rem;
      margin-top: -0.146667rem;
      margin-left: -0.146667rem;
    }
    .iconSucces {
      width: 0.506667rem;
      height: 0.506667rem;
      margin-top: -0.253333rem;
      margin-left: -0.253333rem;
      z-index: 999;
    }
    > div {
      display: inline-block;
    }
    .Exhibition_line {
      height: 100%;
      width: 3.066667rem;
      position: relative;
    }
    .lineDefault {
      width: 100%;
      border-top: 0.03rem dashed rgba(204, 204, 204, 1);
      box-sizing: border-box;
      position: absolute;
      top: 50%;
      margin-top: -0.013333rem;
    }
    .lineSucces {
      position: absolute;
      top: 50%;
      margin-top: -0.013333rem;
      width: 100%;
      box-sizing: border-box;
      height: 0.03rem;
      background: -webkit-linear-gradient(
        left,
        #8782fe,
        #d67efc
      ); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(
        right,
        #8782fe,
        #d67efc
      ); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(
        right,
        #8782fe,
        #d67efc
      ); /* Firefox 3.6 - 15 */
      background: linear-gradient(to right, #8782fe, #d67efc); /* 标准的语法 */
    }
  }

  .progressAxis_title {
    line-height: 0.493333rem;
    font-family: PingFangSC-Regular;
    color: #333;
    ul {
      font-size: 0;
    }
    li:nth-child(1) {
      font-size: .373333rem;
      display: inline-block;
    }
    li:nth-child(2) {
      font-size: .373333rem;
      display: inline-block;
      margin: 0 1.7rem;
    }
    li:nth-child(3) {
      font-size: .373333rem;
      display: inline-block;
    }
  }

  > p {
    font-size: 0.32rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(137, 117, 249, 1);
    line-height: 0.44rem;
    padding: .533333rem 0 .666667rem;
    width: 8.666667rem;
    margin: 0 auto;
  }
  .btn {
    background: url("~@/assets/img/facecard/yanzhi_img_button@3x.png") no-repeat;
    background-size: 100%;
    height: 1.186667rem;
    line-height: 1.186667rem;
    width: 9.2rem;
    margin: 0 auto;
    font-size: 0.4rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #fff;
  }
  .btnAudit {
    background: rgba(205, 205, 205, .5);
    height: 1.12rem;
    line-height: 1.12rem;
    width: 9.2rem;
    margin: 0 auto;
    font-size: .4rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(99, 99, 99, .5);
    border-radius: .053333rem;
  }
}
// 进度轴end
.line {
  width: 100%;
  background: #f2f2f2;
  height: 0.266667rem;
}
.inviteFriends .notic-user, .already-card-notic {
  color: #939393;
  font-size: 24px;
}
.already-card-notic {
  margin-top: .4rem;
}
</style>
