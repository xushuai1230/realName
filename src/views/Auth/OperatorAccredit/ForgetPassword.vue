<template>
	<div class="ForgetPassword">
		<!-- <div class="container" v-if="type >= 0">
			<section class="meths">
				<div class="meths__title">方法一</div>
				<div class="meths__desc">拨打运营商电话，根据语音提示或转接人工服务进行重置服务密码，点击立即拨打运营商电话
					<a :href="`tel:${currentData.phone}`">{{currentData.phone}}</a>
				</div>
			</section>
			<section class="meths">
				<div class="meths__title">方法二</div>
				<div class="meths__desc">
					<p>登录网上营业厅或者手机网上营业厅进行重置密码</p>
					<p>步骤一：登录{{currentData.name}}网上营业厅</p>
					<img :src="currentData.img1" alt="">
					<p>步骤二：选择“业务-密码管理”</p>
					<img :src="currentData.img2" alt="">
				</div>
			</section>
		</div> -->
		<div class="container select">
			<div class="select__title">选择手机号码所属运营商</div>
			<ul>
				<li v-for="(item, index) in seclectData" :key="index" :class="{active: item.active}" @click="changeIndex(index)"><img :src="item.img" alt=""></li>
			</ul>
			<div class="select__btn" @click="confirmSelect">
				<span>确定</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'ForgetPassword',
  data () {
    return {
      type: -1,
      phone: '',
      seclectData: [
        {
          img: require('../../../assets/img/list_img_dianxin@3x.png'),
          active: true
        },
        {
          img: require('../../../assets/img/list_img_yidong@3x.png'),
          active: false
        },
        {
          img: require('../../../assets/img/list_img_liantong@3x.png'),
          active: false
        }
      ],
      serveData: [
        {
          phone: 10000,
          name: '电信',
          title: '选择“业务-密码管理”',
          img1: require('../../../assets/img/img_dianxin1@3x.png'),
          img2: require('../../../assets/img/img_dianxin2@3x.png')
        },
        {
          phone: 10086,
          name: '移动',
          title: '选择“忘记服务密码？”',
          img1: require('../../../assets/img/img_yidong1@3x.png'),
          img2: require('../../../assets/img/img_yidong2@3x.png')
        },
        {
          phone: 10010,
          name: '联通',
          title: '选择“办理-服务密码修改”',
          img1: require('../../../assets/img/img_liantong1@3x.png'),
          img2: require('../../../assets/img/img_liantong2@3x.png')
        }
      ],
      currentIndex: 0
    }
  },
  computed: {
    currentData () {
      return this.serveData[this.type]
    }
  },
  created () {
    this.phone = this.$route.params.phone
    this.getType()
  },
  methods: {
    confirmSelect () {
      if (this.currentIndex === 0) {
        location.href = 'http://wx.xmt.189.cn:8080/WX_CUST_WEBSERVICE/reset/resetAction.do?action=showReset&channel=uX2hh9JYuNo%3D&openid=EzUvPxWgNEAXFXsUVOHg3YaCs4baFiNICcZxj/TXxEg=&from=70'
      } else if (this.currentIndex === 1) {
        location.href = 'http://wap.js.10086.cn/MMFW_MMCZ.thtml'
      } else if (this.currentIndex === 2) {
        location.href = 'http://wap.10010.com/t/businessTransact/resetPwd/view.htm'
      }
    },
    changeIndex (index) {
      this.currentIndex = index
      console.log(this.seclectData)
      this.seclectData.forEach((item, inx) => {
        if (inx === index) {
          item.active = true
        } else {
          item.active = false
        }
      })
    },
    getType () {
      if (!this.phone) return
      this.$api['borrowHistory/getMobileOperator']({
        mobile: this.phone
      }).then(res => {
        let arr = ['电信', '移动', '联通']
        let index = arr.indexOf(res.operator)
        console.log(index)
        console.log(res.operator)
        this.seclectData.forEach((item, inx) => {
          if (inx === index) {
            item.active = true
          } else {
            item.active = false
          }
        })
        if (index === 0) {
          location.href = 'http://wx.xmt.189.cn:8080/WX_CUST_WEBSERVICE/reset/resetAction.do?action=showReset&channel=uX2hh9JYuNo%3D&openid=EzUvPxWgNEAXFXsUVOHg3YaCs4baFiNICcZxj/TXxEg=&from=70'
        } else if (index === 1) {
          location.href = 'http://wap.js.10086.cn/MMFW_MMCZ.thtml'
        } else if (index === 2) {
          location.href = 'http://wap.10010.com/t/businessTransact/resetPwd/view.htm'
        }
        // this.type = index
      })
    }
  }
}
</script>

<style>
.container {
  padding: 0.266667rem;
}
/* 说明页 */
.meths {
  margin-bottom: 0.266667rem;
  padding: 0.4rem 0.266667rem;
  border-radius: 0.16rem;
  background: rgba(255, 255, 255, 1);
  font-size: 0.373333rem;
  font-family: PingFangSC-Regular;
  line-height: 0.533333rem;
}
.meths__title {
  position: relative;
  margin-bottom: 0.266667rem;
  color: #f54b78;
}
.meths__title:after {
  position: absolute;
  top: 0.106667rem;
  left: -0.266667rem;
  width: 0.16rem;
  height: 0.32rem;
  background: url('~@/assets/img/list_icon_method@3x.png') no-repeat;
  background-size: 100% 100%;
  content: '';
}
.meths__desc {
  color: #636363;
  text-align: left;
  line-height: 0.533333rem;
}
.meths__desc > img {
  display: inline-block;
  margin-bottom: 0.426667rem;
  width: 8.933333rem;
  height: auto;
  vertical-align: top;
}
.meths__desc > p {
  margin-bottom: 0.266667rem;
}
.meths__desc > a {
  color: #0076ff;
}
.meths__desc > p:first-child {
  margin-bottom: 0.426667rem;
}
/* 选择页 */
.select {
  padding: 0.746667rem 0.266667rem 0.266667rem;
  color: rgba(102, 102, 102, 1);
  text-align: center;
  font-size: 0.373333rem;
  font-family: PingFangSC-Regular;
  line-height: 0.533333rem;
}
.select ul {
  margin-bottom: 1.466667rem;
}
.select li {
  position: relative;
  margin-top: 0.266667rem;
}
.select li.active:after {
  position: absolute;
  right: 0;
  bottom: 0.133333rem;
  width: 1.466667rem;
  height: 1.466667rem;
  background: url('~@/assets/img/list_icon_select_nol@3x.png');
  background-size: 100% 100%;
  content: '';
}
.select li img {
  height: 2.666667rem;
}
.select__btn {
  height: 1.173333rem;
  border-radius: 0.106667rem;
  background: #f54b78;
  font-size: 0;
}
.select__btn span {
  display: inline-block;
  margin-top: 0.266667rem;
  color: #fff;
  font-size: 0.426667rem;
  font-family: PingFangSC-Regular;
  line-height: 0.6rem;
}
</style>
