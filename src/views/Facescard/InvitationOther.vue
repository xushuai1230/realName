<template>
	<div class="main" v-extend-height>
		<p><span v-if="currRealName===''">您的好友</span><span v-else>{{currRealName}}</span>邀您开通颜值卡啦</p>
		<div class="opencard" @click="addHeOpen">
			<img src="~@/assets/img/facecard/freeOpenCard3x.png" alt="">
		</div>
    <div v-if="guidBol" class="guid"><img src="~@/assets/img/weiboshare.png"></div>
	</div>
</template>

<script>
import { api, post } from '@/module/request'
import vuex from 'vuex'
export default {
  name: 'InvitationOther',
  data () {
    return {
      linkHref: 'javascript:;',
      tab: 0,
      privilege: [
        {
          img1: require('@/assets/img/facecard/layer11@3x.png'),
          img2: require('@/assets/img/facecard/Group 7@3x.png'),
          title: '购物97折起',
          title1: '一、购物97折起',
          text: '用户若在确认订单页面中选择颜值卡额度支付，立享全场商品97折起福利，每月3次，次数当月生效不累计。'
        },
        {
          img1: require('@/assets/img/facecard/layer12@3x.png'),
          img2: require('@/assets/img/facecard/Group 8@3x.png'),
          title: '免审可提现',
          title1: '二、额度可提现',
          text: '在颜值卡有可用额度的情况下可申请提现，您可前往小象钱包-颜值卡专区进行借款。'
        },
        {
          img1: require('@/assets/img/facecard/layer13@3x.png'),
          img2: require('@/assets/img/facecard/Group 9@3x.png'),
          title: '¥12999免审',
          title1: '三、最高¥12999免审',
          text: '用户享¥8999初始额度，您在“来电”中每获一次喜欢，额度也会增加，最高可获¥12999额度，额度可用于购物和借款。'
        }
      ],
      pagestate: null, // 1代表'未开卡'分享的页面,2代表'提醒他'分享的页面，3代表'已开卡'分享的页面
      inviterId: null, // 邀请人的id
      currRealName: '***', // 邀请人用户名
      guidBol: false
    }
  },
  async created () {
    this.inviterId = this.getQueryString('inviteId')
    if (this.inviterId) {
      this.queryInviterName()
    }
    if (localStorage.guideUserShare === 'share') {
      this.guidBol = true
      localStorage.guideUserShare = null
    }
    this.watchCommonEvent()
  },
  methods: {
    ...vuex.mapMutations([
      'setLoginStatus',
      'muUserMetaInfo'
    ]),
    changeTab (i) {
      this.tab = i
    },
    addHeOpen () {
      this.setLoginStatus(true)
    },
    godownload () {
      if (/WeiBo/i.test(navigator.userAgent)) {
        this.bindUserForInviting()
      } else {
        this.$router.push({ name: 'InvitationSuccess',
          query: {
            inviteId: this.inviterId
          }
        })
      }
    },
    queryInviterName () {
      // 查询姓名
      post(api.invitationName + '?inviterId=' + this.inviterId)
        .then(res => {
          this.currRealName = res.data.realName
          console.log(res.data)
        })
        .catch(err => {
          this.$toast(err)
        })
    },
    watchCommonEvent () {
      global.vbus.$on('setBindUser', (status) => {
        this.godownload()
      })
    },
    bindUserForInviting () {
      // 接受邀请
      global.vbus.$emit('loading_show', true)
      if (this.inviterId) {
        post(api.openStatus + '?token=' + this.userToken + '&shareUserId=' + this.inviterId)
          .then(res => {
            global.vbus.$emit('loading_show', false)
            this.$router.push({
              name: 'Facescard'
            })
          })
          .catch(err => {
            global.vbus.$emit('loading_show', false)
            this.$toast(err)
          })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.main {
  width: 100%;
  color: #333;
  font-size: 0.32rem;
  background: #3a354c url('~@/assets/img/facecard/bj@2x.png') no-repeat;
  background-size: 100%;
  padding-bottom: 2.666667rem;
  > p {
    font-size: .453333rem;
    color: #4a446a;
    text-align: center;
    padding: 1.8rem 0 6.12rem 0;
  }
  .opencard {
    width: 8.573333rem;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  }
  ul {
    width: 90%;
    padding-top: 3.333333rem;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
    padding-bottom: 3rem;
    li {
      display: inline-block;
      width: 25%;
      height: 2.4rem;
      vertical-align: top;
      > p {
        text-align: center;
      }
      .img {
        width: 1.146667rem;
        height: 1.146667rem;
        margin: 0 auto 0.4rem;
      }
      .triangle {
        width: 0.666667rem;
        height: 0.466667rem;
        margin: 0.12rem auto 0;
      }
    }
  }
  .content {
    height: 3.346667rem;
    line-height: 0.533333rem;
    width: 75%;
    margin: 0 auto;
    h3 {
      font-size: 0.346667rem;
    }
    p {
      color: #636363;
    }
  }
}
.colorred {
  color: #6a459e;
}
.guid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100;
  height: 100%;
  background: rgba(0, 0, 0, .5);
}
.guid > img {
  display: block;
  width: 100%;
  height: auto;
}
</style>
