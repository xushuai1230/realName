<template>
    <div class="myHome">
        <div class="banner">
          <div class="img fl">
            <img :src="weiboInfo && weiboInfo.profileImgUrl || (weiboInfo && weiboInfo.hasData && insIcon)" alt="">
          </div>
          <p class="name">
            <!-- {{weiboInfo.nickName || (weiboInfo.hasData && insNickName)}} -->
            {{ userName }}
            <!-- <span v-if="appBate">版本: {{appBate}}</span> -->
          </p>
          <div v-if="sinaFenqiH5Url" class="oldEntry" @click="oldVersionEntry">
            老版本还款
            <img src="~@/assets/img/list_disclosure_indicator_nol_black@2x.png" alt="">
          </div>
          <ul>
            <li v-for="(item,index) in list" :key="index" @click="goToUrl(index)">
              <p class="icons">
                <img :src="item.img" alt="">
                <span v-if="item.num" :class="{'lineHeight': item.num === '...', 'shortWidth': Number(item.num) < 10}">{{item.num}}</span>
              </p>
              <p> {{item.title}}</p>
            </li>
          </ul>
        </div>
        <div class="MyinfoList MyinfoList1">
          <ul>
            <li class="redpackets" @click="goRedpackets()" v-if="redpacketsdata.show">
                <p> {{redpacketsdata.title}}</p>
                <span v-if="redpacketsdata.name">{{redpacketsdata.name}}</span>
                <div class="arrow"><img :src="redpacketsdata.img" alt=""></div>
            </li>
            <li :class="{border: index < MyinfoList1.length - 1}" v-for="(item,index) in MyinfoList1" :key="index" @click="goToUrl(4 + index)">
              <p> {{item.title}}</p>
              <span v-if="item.name">{{item.name}}</span>
              <span v-if="item.bill">{{item.bill}}</span>
              <span v-if="setpassword && item.set">修改支付密码</span>
              <span v-if="!setpassword && item.set">设置支付密码</span>
              <span v-if="item.type === 'auth'">{{item.auth ? '已授权' : ''}}</span>
              <div class="arrow"><img :src="item.img" alt=""></div>
            </li>
          </ul>
        </div>
        <div class="MyinfoList MyinfoList2">
          <ul>
            <li class="border" v-for="(item,index) in MyinfoList2" :key="index" @click="goToHref(index)">
                <p> {{item.title}}</p>
                <div class="arrow"><img :src="item.img" alt=""></div>
            </li>
            <!-- <li @click="goToHref(2)"> -->
                <!-- <a href="https://lkme.cc/NGD/Egg4RdbdL"> -->
                  <!-- <p>下载小象优品APP</p>
                  <div class="arrow"><img src="~@/assets/img/nav_icon_back_nor@3x.png"></div> -->
                <!-- </a> -->
            <!-- </li> -->
          </ul>
        </div>
    </div>
</template>

<script>
import { api, post, fromUrlcode } from '@/module/request'
import { mapMutations, mapGetters } from 'vuex'

import loginMixin from '@/mixins/login'

export default {
  name: 'Myhome',
  mixins: [loginMixin],
  data () {
    return {
      setpassword: true,
      phone: '',
      redpacketsdata: { title: '红包提现', show: false, name: '', img: require('@/assets/img/nav_icon_back_nor@3x.png') },
      list: [
        { title: '待付款', img: require('@/assets/img/mine_img1@3x.png'), num: 0 },
        { title: '待发货', img: require('@/assets/img/mine_img2@3x.png'), num: 0 },
        { title: '待收货', img: require('@/assets/img/mine_img3@3x.png'), num: 0 },
        { title: '全部订单', img: require('@/assets/img/mine_img4@3x.png') }
      ],
      MyinfoList1: [
        { title: '我的优惠券', show: false, name: '', img: require('@/assets/img/nav_icon_back_nor@3x.png') },
        { title: '我的账单', show: false, bill: '', img: require('@/assets/img/nav_icon_back_nor@3x.png') },
        { title: '借款记录', show: false, img: require('@/assets/img/nav_icon_back_nor@3x.png') },
        { title: '收货地址', show: false, img: require('@/assets/img/nav_icon_back_nor@3x.png') },
        { title: '支付密码', show: false, set: true, img: require('@/assets/img/nav_icon_back_nor@3x.png') },
        { title: '淘宝授权', show: false, img: require('@/assets/img/nav_icon_back_nor@3x.png'), auth: false, type: 'auth' },
        { title: '运营商授权', show: false, img: require('@/assets/img/nav_icon_back_nor@3x.png'), auth: false, type: 'auth' }
      ],
      MyinfoList2: [
        { title: '常见问题', img: require('@/assets/img/nav_icon_back_nor@3x.png') },
        { title: '联系客服', img: require('@/assets/img/nav_icon_back_nor@3x.png') }
      ],
      showLoginOutDialog: false,
      markUpObj: {},
      weiboInfo: null,
      insNickName: null, // 小象的昵称
      insIcon: null, // 小象的头像
      sinaFenqiH5Url: null // 微博老用户还款地址
    }
  },
  mounted () {
    this.taskCallBack()
    if (this.userToken) {
      this.getFaceCardState() // 颜值卡状态
      this.getUserInfo() // 用户信息
      this.getOrderInfo() // 红点点显示
      this.isMarkUpMobileAuthV2Serve() // 授权信息
      this.hongbaofeiPrizeNumServe()
    }
    this.getWeiboOldBill()
    this.getWeiboUserInfo() // 微博链接
  },
  created () {
    this.$tj('enterme')
    console.log(process.env.VUE_APP_BATE)
  },
  methods: {
    goRedpackets () {
      this.$tj('txofmeclick')
      if (this.redpacketsdata.show) {
        this.$router.push({
          name: 'RedPackets',
          params: {
          },
          query: {
            noCache: Date.now()
          }
        })
      }
    },
    hongbaofeiPrizeNumServe () {
      this.$api['shopHome/hongbaofeiPrizeNum']({
        token: this.userToken,
        prizeCode: '353'
      }).then(res => {
        console.log(res, 'hongbaofeiPrizeNumServe')
        this.redpacketsdata.show = res.data.hasRecivePrize || false
      })
    },
    oldVersionEntry () {
      this.$tj('clickoldreturn')
      setTimeout(() => {
        if (this.sinaFenqiH5Url) {
          location.href = this.sinaFenqiH5Url
        }
      }, 200)
    },
    getFaceCardState () {
      // 查询颜值卡是否开通
      if (!this.userToken) return false
      global.vbus.$emit('loading_show', true)
      return post(api.lookingCardState + '?token=' + this.userToken)
        .then(({ data }) => {
          if (data === 'noopencard') {
            // 未开卡
            this.MyinfoList1[1].show = true
            this.MyinfoList1[2].show = false
            this.MyinfoList1[0].show = false
          } else {
            const status = Number(data.status)
            if (status === 2) { // 已开卡
              this.MyinfoList1[0].show = true
              this.MyinfoList1[1].show = true
              this.MyinfoList1[2].show = true
            }
          }
          global.vbus.$emit('loading_show', false)
        })
        .catch(err => {
          global.vbus.$emit('loading_show', false)
          this.$toast(String(err))
        })
    },
    getUserInfo () {
      // debugger
      return this.$api['user/getUserInfo']({
        token: this.userToken
      }, {
        noShowLoading: true
      }).then(res => {
        this.setpassword = res.data.isPayPassword
        this.insNickName = res.data.nickName
        this.insIcon = res.data.faceImgUrl || require('../../assets/img/personal_center_bg_head@3x.png')
      })
    },
    getOrderInfo () {
      this.$api['mine/getOrderInfo']({
        token: this.userToken
      }).then(res => {
        this.list[0].num = this.filterNum(res.data.unpaidOrderCount)
        this.list[1].num = this.filterNum(res.data.preparedOrderCount)
        this.list[2].num = this.filterNum(res.data.deliveredOrderCount)
        this.MyinfoList1[0].name = res.data.couponPreview
        if (res.data.billType === 1) {
          this.MyinfoList1[1].bill = res.data.billCount + '笔账单待还款'
        } else if (res.data.billType === 2) {
          this.MyinfoList1[1].bill = res.data.billCount + '笔账单已逾期'
        }
      })
    },
    filterNum (num) {
      if (num > 99) {
        return '...'
      } else {
        return num
      }
    },
    goToHref (i) {
      if (i === 0) { // 分期还款
        location.href = 'http://cdn.xiaoxiangyoupin.com/app/service/qa/qa6.html'
      } else if (i === 1) { // 客服
        let env = process.env.VUE_APP_SERVEN === 'PROD' ? 'prod' : 'dev'
        location.href = `https://cdn.basestonedata.com/${env}/services/cs2.html`
      } else { // 下载
        location.href = 'https://lkme.cc/NGD/Egg4RdbdL'
      }
    },
    goToUrl (i) {
      if (!this.userToken) {
        this.handlerLogin()
        return false
      }
      console.log(i)
      switch (i) {
        case 0: // 待付款
          this.$tj('dfkclick')
          this.$router.push({
            name: 'OrderList',
            params: {
              type: 2
            },
            query: {
              noCache: Date.now()
            }
          })
          break
        case 1: // 待发货
          this.$tj('dfhclick')
          this.$router.push({
            name: 'OrderList',
            params: {
              type: 3
            },
            query: {
              noCache: Date.now()
            }
          })
          break
        case 2: // 待收货
          this.$tj('dshclick')
          this.$router.push({
            name: 'OrderList',
            params: {
              type: 4
            },
            query: {
              noCache: Date.now()
            }
          })
          break
        case 3:
          this.$tj('allordersclick')
          return this.$router.push({
            name: 'OrderList',
            params: {
              type: 1
            },
            query: {
              noCache: Date.now()
            }
          })
          // 全部订单
        case 4:
          this.$tj('couponmeclick')
          return this.$router.push({
            name: 'MyCoupon',
            query: {
              noCache: Date.now()
            }
          }) // 我的优惠券
        case 5:
          this.$tj('zdmeclick')
          return this.$router.push({
            name: 'myBill',
            query: {
              noCache: Date.now()
            }
          }) // 我的账单
        case 6:
          return this.$router.push({
             name: 'HistoryPage',
             query: {
                noCache: Date.now()
              }
          })
        case 7:
          return this.$router.push({
            name: 'Address',
            query: {
              noCache: Date.now()
            }
          }) // 收货地址
        case 8:
          return this.$router.push({ // 修改支付密码
            name: 'GetCode',
            query: {
              type: 'router',
              method: 'replace',
              routerData: JSON.stringify({
                name: 'userCenter'
              }),
              noCache: Date.now()
            }
          })
        case 9:
          this.dianshanMatch()
          break
        case 10:
          this.markUpMatch()
          break
      }
    },
    openLoginOutDialog () {
      this.$dialog.confirm({
        message: '确认退出账户',
        confirmButtonText: '退出登录',
        cancelButtonText: '再去逛逛',
        className: 'loginOutDialog'
      }).then(() => {
        this.loginOutServe()
      }).catch(() => {})
    },
    loginOutServe () {
      post(api.logout, fromUrlcode({
        token: this.userToken
      })).then(() => {
        this.tokenLoginOut()
        this.nickName = '昵称'
        this.$toast('已退出登录')
      }).catch(err => {
        let error = err
        if (err.message) {
          error = err.message
        }
        this.$toast(error)
      })
    },
    isMarkUpMobileAuthV2Serve () {
      post(api.isMarkUpMobileAuthV2 + '?token=' + this.userToken).then(res => {
        this.markUpObj = {
          markUp: res.markUp, // 运营商是否需要授权
          dianshangMarkup: res.dianshangMarkup, // 是否需要电商授权
          gxbZhimaAuthNeed: res.gxbZhimaAuthNeed // 是否需要自研芝麻授权
        }
        this.MyinfoList1[3].show = res.dianshangMarkup || res.gxbZhimaAuthNeed
        this.MyinfoList1[4].show = res.markUp
        this.MyinfoList1[3].auth = !res.dianshangMarkup && !res.gxbZhimaAuthNeed
        this.MyinfoList1[4].auth = !res.markUp
      })
    },
    dianshanMatch () {
      const envs1 = {
        'DEV': 'h5-dev',
        'PROD': 'h5'
      }
      const envPath1 = envs1[process.env.VUE_APP_SERVEN]
      if (this.markUpObj.dianshangMarkup) {
        location.href = `https://open.shujumohe.com/box/tb?box_token=061D17B5FE9447348C98A2247961BDF0&cb=https://${envPath1}.xiaoxiangyoupin.com/purse/home/userCenter`
      } else if (this.markUpObj.gxbZhimaAuthNeed) {
        this.$router.push({
          name: 'ZhiMaAuth',
          query: {
            type: 'router',
            method: 'replace',
            routerData: JSON.stringify({
              name: 'userCenter'
            }),
            noCache: Date.now()
          }
        })
      } else {
        this.$toast('已授权')
      }
    },
    markUpMatch () {
      if (this.markUpObj.markUp) {
        this.$router.push({
          name: 'OperatorAccredit',
          query: {
            type: 'router',
            method: 'replace',
            routerData: JSON.stringify({
              name: 'userCenter'
            }),
            noCache: Date.now()
          }
        })
      } else {
        this.$toast('已授权')
      }
    },
    async taskCallBack () {
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
            name: 'Facescard',
            query: {
              noCache: Date.now()
            }
          })
        } catch (error) {
          global.vbus.$emit('loading_show', false)
          this.$toast(error)
        }
      }
    },
    async getWeiboUserInfo () {
      let token = this.userToken || this.userWeiboMark
      if (token) {
        try {
          this.weiboInfo = await this.$api['user/weiboBaseInfo']({ token }, { noShowDefaultError: true })
          this.weiboInfo.hasData = true
        } catch (error) {
          this.weiboInfo = {
            hasData: true
          }
        }
      }
    },
    /**
     * 获取微博老用户还款
     *
     */
    async getWeiboOldBill () {
      let token = this.userToken || this.userWeiboMark
      if (token) {
        let res = await this.$api['myBill/checkOldZaidai']({ token })
        this.sinaFenqiH5Url = res.sinaFenqiH5Url
      }
    },
    ...mapMutations(['tokenLoginOut', 'setLoginStatus'])
  },
  watch: {
    userToken (val) {
      if (val) {
        this.hongbaofeiPrizeNumServe()
        this.getFaceCardState()
        this.getUserInfo()
        this.getOrderInfo()
        this.isMarkUpMobileAuthV2Serve()
        this.getWeiboUserInfo()
      }
    }
  },
  computed: {
    ...mapGetters(['userToken', 'userId', 'userWeiboMark']),
    appBate () {
      return process.env.VUE_APP_BATE
    },
    userName () {
      if (!this.weiboInfo) {
        return
      }
      let hasData = this.weiboInfo.hasData
      let weiboNickName = this.weiboInfo.nickName
      if (weiboNickName) {
        return weiboNickName
      } else if (hasData) {
        return this.insNickName
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.myHome {
  padding-bottom: 0.8rem;
}
.border {
  position: relative;
}

.border::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  border-bottom: 1px solid #e6e6e6;
  -webkit-transform: scale(.5);
  transform: scale(.5);
  pointer-events: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

// banner start
.banner {
  width: 100%;
  height: 4.533333rem;
  background: url('~@/assets/img/mine_bg@3x.png') no-repeat;
  background-size: 100%;
  position: relative;
  box-sizing: border-box;
  padding-top: .773333rem;
  margin-bottom: 70px;
  .img {
    width: 114px;
    height: 114px;
    border: 3px solid #fff;
    border-radius: 50%;
    overflow: hidden;
    background: #fff;
    margin: 0 .343333rem 0 .493333rem;
    margin-bottom: 20px
  }
  .name {
    font-size: 30px;
    font-weight: 600;
    color: #fff;
    line-height: 1.746667rem;
  }
  .oldEntry {
    position: absolute;
    width: 2.893333rem;
    height: .826667rem;
    top: .4rem;
    right: 0;
    background: #FFF3BF linear-gradient(#FFF3BF, #FFC87E);
    border-radius: .4rem 0 0 .4rem;
    color: #924B24;
    line-height: .885667rem;
    font-size: .373333rem;
    text-indent: .346667rem;
    img {
      width: .266667rem;
      height: .346667rem;
      margin-top: .266rem;
    }
  }
  ul {
    position: absolute;
    width: 9.173333rem;
    height: 2rem;
    left: 0;
    right: 0;
    bottom: -0.666667rem;
    background: #fff;
    border-radius: .133333rem;
    margin: 0 auto;
    li {
      width: 2.293333rem;
      height: 100%;
      box-sizing: border-box;
      padding-top: .093333rem;
      text-align: center;
      color: #636363;
      font-size: .32rem;
      float: left;
      .icons {
        width: 1.066667rem;
        height: 1.066667rem;
        margin: 0 auto .053333rem;
        position: relative;
        span {
          position: absolute;
          font-size: 18px;
          color: #fff;
          background:#FF0000;
          border-radius: 12px;
          width: 30px;
          height: 24px;
          line-height: 24px;
          top: 7px;
          right: 7px;
          text-align: center;
        }
        .shortWidth {
          width: 24px;
        }
        .lineHeight {
          line-height: 10px;
          letter-spacing: 1px;
        }
      }
    }
  }
}
.user_info {
  padding-left: 0.693333rem;
  -moz-box-sizing: border-box;
  position: relative;
  &__image {
    width: 1.853333rem;
    height: 1.853333rem;
    border-radius: 50%;
    border: 0.04rem solid #fff;
    display: inline-block;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  &__name {
    display: inline-block;
    font-size: 0.533333rem;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #fff;
    position: absolute;
    margin-left: 0.506667rem;
    top: 50%;
    margin-top: -0.373333rem;
  }
}
// banenr end

// 我的订单start
.myOrder {
  background: #fff;
  > p {
    text-align: center;
    font-size: 0.4rem;
  }
}
.myOrder__list {
  font-size: 0;
  li {
    width: 25%;
    display: inline-block;
    img {
      text-align: center;
      display: block;
      width: 0.586667rem;
      height: 0.586667rem;
      margin: 0 auto;
    }
    p {
      font-size: 0.266667rem;
      text-align: center;
    }
  }
}
// 我的订单end

// 信息列表start
.MyinfoList {
  width: 9.2rem;
  background: #fff;
  margin: 0 auto .266667rem;
  border-radius: .133333rem;
  box-sizing: border-box;
  padding-left: .4rem;
  li {
    height: 1.28rem;
    position: relative;
    line-height: 1.28rem;
    p {
      display: inline-block;
      color: #333;
      font-size: .373333rem;
    }
    span {
      position: absolute;
      right: 1rem;
      top: 0;
      display: inline-block;
      color: #939393;
      font-size: .373333rem;
      line-height: 1.386667rem;
      margin-left: 4.066667rem;
      text-align: right;
    }
    .arrow{
      height: .586667rem;
      width: .586667rem;
      position:absolute;
      right: .4rem;
      top: .346667rem;
    }
  }
  .redpackets {
    border-bottom: 1px solid #E6E6E6;
  }
}
.MyinfoList2 {
  margin-bottom: 2rem;
}
.login-out {
  font-size: .32rem;
  margin-left: 0.5rem;
  color: #fff;
}
</style>
<style>
.loginOutDialog {
  font-family:PingFangSC-Medium;
}
.loginOutDialog .van-dialog__message {
  text-align: center;
  font-size: .426667rem;
  font-weight:500;
  color: #333;
}
</style>
