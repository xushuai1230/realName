<template>
	<div class="CashierDesk">
		<div class="CashierDesk__container" @touch.prevent.stop>
			<div class="CashierDesk__wrap" v-if="reqReady">
				<!-- 分期详细信息展示 -->
				<div class="CashierDesk__info">
					<div class="title clearfix">

            <div class="fl left" v-if="freePeriods > periods">前{{periods}}期期月供低至</div>
            <div class="fl left" v-else-if="freePeriods === 0">月供</div>
						<div class="fl left" v-else>前{{freePeriods}}期月供低至</div>
						<div class="fr">
							订单金额: <span>&yen;{{dealWithAmount | priceFilter}}</span>
						</div>
					</div>
					<div class="price">
						&yen;{{instalmentAmount | priceFilter}}
					</div>
					<div class="tips" :class="{active: freePeriods !== 0 }" @click="jumpToInfoList">
						<span v-if="freePeriods === 0">已含手续费>></span>
						<span v-else-if="freePeriods > periods">已免前{{periods}}期手续费>></span>
						<span v-else>已免前{{freePeriods}}期手续费>></span>
					</div>
				</div>
				<!-- 分期选项 -->
				<div class="CashierDesk__Stage">
					<div class="tip">选择期数</div>
					<div class="stages clearfix">
						<div class="stage fl" :class="{active: item.active}" @click="selectStage(index)" v-for="(item,index) in stagesData" :key="index">{{item.repaymentPeriods}}期</div>
					</div>
				</div>
				<!-- 免息券 -->
				<div class="CashierDesk__interestFree van-hairline--top-bottom" @click="jumpToFreeList">
					<div class="wrap clearfix">
						<div class="left fl">
							免息券
						</div>
						<div class="right fr">
							<span class="active" v-if="freeCoupon">已免{{freeCoupon.unit / 30}}期手续费</span>
							<span class="active" v-else-if="!isCouponAllSelect">未使用免息券</span>
							<span v-else-if="isCouponAllSelect">无可用免息券</span>
							<img src="~@/assets/img/list_icon_enter_nol@3x.png" alt="" srcset="">
						</div>
					</div>
				</div>
				<!-- 支付首付 -->
				<div class="CashierDesk__firstPay clearfix" v-if="downpayShow">
					<div class="left fl">
						需支付首付
					</div>
					<div class="right fr">
						&yen;{{downPayment | priceFilter}}
					</div>
				</div>
				<!-- 支付方式 -->
				<div class="CashierDesk__payment">
					<div class="tip">选择支付方式</div>
					<div class="payments">
						<div class="payment" @click="chosePayMethod">
							<div class="left clearfix">
								<div class="icon fl">
									<img :src="facecardInfoData && facecardInfoData.iconUrl" alt="">
								</div>
								<div class="name fl">
									<div class="top">
										<span>{{facecardInfoData && facecardInfoData.instalmentName}}</span>
										<img :src="facecardInfoData && facecardInfoData.noAuditImgUrl" alt="" v-if="facecardInfoData && facecardInfoData.noAudit">
									</div>
									<div class="bottom" v-if="facecardInfoData && facecardInfoData.status">{{facecardInfoData.status ? facecardInfoData.statusDesc : facecardInfoData.remainAmount}}</div>
									<div class="bottom" v-else>
                    余额:
                    <span v-if="facecardInfoData && facecardInfoData.remainAmount >= 0">
                      &yen;{{ facecardInfoData && facecardInfoData.remainAmount | priceFilter}}
                    </span>
                    <span v-else>&yen;0</span>
                  </div>
								</div>
							</div>
							<div class="right clearfix">
								<div class="status fr">
									<img src="~@/assets/img/pay/list_shoufuzhifu_selected@3x.png" alt="" v-if="facecardInfoData && facecardInfoData.isSelect">
									<img src="~@/assets/img/pay/list_shoufuzhifu_unsel copy@3x.png" alt="" v-else>
								</div>
								<div class="discountAmount fr" v-if="facecardInfoData && facecardInfoData.discountAmount">
									立减{{facecardInfoData.discountAmount | priceFilter}}元
								</div>
							</div>
						</div>
						<div class="direct clearfix" @click="jumpToDirectPay" v-if="directShow">
							<div class="fl clearfix">
								<div class="icon fl">
									<img src="~@/assets/img/pay/list_icon_pay_other@3x.png" alt="">
								</div>
								<div class="name fl">
									<div class="directpay">支付宝支付</div>
								</div>
							</div>
							<div class="fr clearfix">
								<div class="arrow fr">
									<img src="~@/assets/img/pay/list_icon_enter_nol@3x.png" alt="" srcset="">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="CashierDesk__loading" v-else ref="loading">
				<img src="~@/assets/img/loadding.gif" alt="">
			</div>
			<!-- 固定定位的底部浮窗 -->
			<div class="CashierDesk__fixedFooter van-hairline--top">
				<div class="wrap">
          <div class="protocol" @click.stop.prevent="readSelectBol = !readSelectBol">
            <img src="~@/assets/img/pay/list_rd_select_nol@3x.png" alt="" v-if="!readSelectBol">
            <img src="~@/assets/img/pay/list_rd_select_sel@3x.png" alt="" v-else>
            <span>同意</span>
            <span class="active" @click.stop.prevent="jumpToContarctServe">《小象优品赊购服务协议》</span>
          </div>
          <div class="btn" :class="{disable: (remainAmount <= 0 && isFacecardOpen) || !readSelectBol}">
            <span v-if="isFacecardOpen" @click="judgeIfCanPay">
              颜值卡支付
              <i v-if="!needPayDown">{{orderPrice | priceFilter}}</i>
              <i v-else-if="remainAmount>=0">{{remainAmount | priceFilter}}</i>
              <i v-else>0</i>元
            </span>
            <span v-else @click="jumpToFaceCard">立即开通颜值卡</span>
          </div>
        </div>
			</div>
		</div>
		<!-- 密码输入框 -->
		<order-pay-input :payPassWordStatus="payPassWordStatus" @payApply="ApplicationInstallment" @changeOrderPayInputShow="changeOrderPayInputShow" v-if="orderPayInputShow" @changePassWord="changePassWord" :passWordError="showErrorText" :passwordErrCount='passwordErrCount'>
       <span class="errorText" v-show="showErrorText">{{errorText}}</span>
    </order-pay-input>
		<!-- 子路由 -->
		<router-view class="child-view"></router-view>
    <resetpay v-if="resetStatus" @close="closeResetFn"></resetpay>
	</div>
</template>

<script>
import orderPayInput from './OrderPassWordInput'
import resetpay from './OrderResetPay'
export default {
  name: 'OrderPay',
  data () {
    return {
      payMethod: 2, // 支付方式
      periods: 12,
      orderCode: '', // 订单code
      payPwd: '',
      deskData: null,
      realNameData: {},
      realNameAddData: {},
      instalmentCode: 0, // 0 额度支付 1 情侣卡 2 颜值卡
      cardStatus: 1,
      readSelectBol: true, // 引导实名模块显示隐藏
      downPayment: 0, // 首付金额
      facecardInfoData: null,
      downpayShow: false,
      isFacecardOpen: false,
      reqReady: false,
      isPayPassword: false,
      orderPayInputShow: false,
      payPassWordStatus: 1, // 支付状态 1 待输入 2 验证中 3 成功
      orderPrice: 0,
      instalmentAmount: 0,
      stagesData: null,
      needPayDown: false,
      discountAmount: 0,
      remainAmount: 0,
      isLeave: false,
      isFirstEnter: false,
      freeCoupon: {},
      currentStageData: {},
      isCouponAllSelect: false,
      coupons: [],
      payBtnStatus: true,
      showErrorText: false, // 密码框展示错误文案
      errorText: '', // 错误文案
      resetStatus: false, // 显示密码锁定弹框
      passwordErrCount: 0, // 组件密码错误
      noPayConut: false // 无支付次数
    }
  },
  computed: {
    // 最小分期金额
    minInstalmentAmount () {
      return this.deskData && this.deskData.minInstalmentAmount
    },
    // 订单免息天数
    freePeriods () {
      let goodPeriods = (this.goodsFreeDays && this.goodsFreeDays / 30) || 0
      let couponPeriods = (this.freeCouponUnit && this.freeCouponUnit / 30) || 0
      return goodPeriods + couponPeriods
    },
    // 商品免息天数
    goodsFreeDays () {
      return this.deskData && this.deskData.goodsFreeDays
    },
    // 实际购买商品列表
    realOrders () {
      return []
    },
    // 支付首付金额
    dealWithAmount () {
      return this.deskData && this.deskData.dealWithAmount
    },
    // 支付方式
    payment () {
      return this.deskData && this.deskData.payment && this.deskData.payment.split(',')
    },
    // 直付方式是否显示
    directShow () {
      // if (Array.isArray(this.payment)) return this.payment.indexOf('1') > -1 || this.payment.indexOf('4') > -1
      // else return false
      return false
    },
    // 支付成功跳转页
    paySuccessGotoUrl () {
      return this.deskData && this.deskData.paySuccessGotoUrl
    },
    // 优惠券金额
    couponAmount () {
      return this.deskData && this.deskData.couponAmount
    },
    // 用户是否实名
    orderUserIsRealName () {
      return this.realNameData && this.realNameData.isRealnameApprove
    },
    // 用户是否实名补偿
    orderUserIsAddRealName () {
      return this.realNameData && this.realNameData.isAddRealnameApprove
    },
    // 紧急联系人
    needUpdateEmergency () {
      return this.realNameData && this.realNameData.needUpdateEmergency
    },
    // 身份证
    needIdCardOcr () {
      return this.realNameData && this.realNameData.needIdCardOcr
    },
    // 是否为实名且不需实名补偿用户
    isReal () {
      return this.realNameAddData && !this.orderUserIsAddRealName
    },
    // 芝麻分授权
    markUp () {
      return this.realNameAddData && this.realNameAddData.markUp
    },
    // 支付宝授权
    alipayMarkup () {
      return this.realNameAddData && this.realNameAddData.alipayMarkup
    },
    // 电商授权
    dianshangMarkup () {
      return this.realNameAddData && this.realNameAddData.dianshangMarkup
    },
    // 公信宝授权
    gxbZhimaAuthNeed () {
      return this.realNameAddData && this.realNameAddData.gxbZhimaAuthNeed
    },
    needXuexinAuth () {
      return this.realNameAddData && this.realNameAddData.needXuexinAuth
    },
    // 芝麻信息补全地址
    zhimaAuthUrl () {
      return this.realNameAddData && this.realNameAddData.zhimaAuthUrl
    },
    // 判断订单是否可支付
    ifCanPay () {
      let amountBol = this.remainAmount < this.minInstalmentAmount
      let downPayBol = (this.remainAmount < this.dealWithAmount) && !this.downPayFlag
      return amountBol || downPayBol
    },
    // 免息券是否使用
    isfreeCouponUse () {
      return this.freeCoupon && this.freeCoupon.isSelect
    },
    // 免息券使用期数
    freeCouponUnit () {
      return (this.freeCoupon && this.freeCoupon.unit) || 0
    },
    // 免息券code
    freeCouponCode () {
      return (this.freeCoupon && this.freeCoupon.couponCode) || ''
    }
  },
  created () {
    this.isFirstEnter = true
  },
  mounted () {
    this.$refs.loading.style.height = document.documentElement.clientHeight + 'px'
    this.payPwdCountServe()
  },
  async activated () {
    if (!this.$route.meta.isBack || this.isFirstEnter) {
      window.sessionStorage.setItem('payFreeCoupons', '')
      await this.initData()
    }
    this.$route.meta.isBack = false
    this.isFirstEnter = false
    this.isLeave = false
    let payFreeCoupons = window.sessionStorage.getItem('payFreeCoupons')
    if (payFreeCoupons) {
      this.coupons = JSON.parse(payFreeCoupons)
    }
  },
  methods: {
    async initData () {
      let taskId = this.getQueryString('task_id')
      if (taskId) {
        await this.$api['auth/submitDianshangTaskId']({
          token: this.userToken,
          taskId
        })
        this.$router.replace({
          name: 'OrderPay',
          params: {
            orderCode: this.orderCode
          },
          query: {
            noCache: Date.now()
          }
        })
      }
      this.orderCode = this.$route.params.orderCode
      // 获取收银台信息,用户信息,身份信息,优惠券
      Promise.all([this.getCashierData(), this.getUserInfo(), this.creditCheckV4(), this.getAvailableCoupons()]).then(async (result) => {
        if (this.orderUserIsAddRealName) await this.isMarkUpMobileAuthV2()
        this.reqReady = true
      }).catch((error) => {
        this.reqReady = true
        console.log(error)
      })
    },
    // 跳转到相关服务协议页面
    jumpToContarctServe () {
      // let routerData = JSON.stringify({
      //   name: this.$route.name,
      //   path: this.$route.path,
      //   query: this.$route.query,
      //   params: this.$route.params
      // })
      // this.$router.push({
      //   name: 'protocolList',
      //   query: {
      //     type: 'router',
      //     method: 'push',
      //     routerData: routerData
      //   }
      // })
      // location.href = `https://cdn.basestonedata.com/app/service/sinafenqi.html`
      location.href = `https://cdn.basestonedata.com/app/service/contractServe.html`
    },
    // 跳转到实心提醒页面
    jumpTocritedEdg () {
      location.href = 'https://cdn.basestonedata.com/app/service/critedEdg.html'
    },
    // 跳转直付收银台
    jumpToDirectPay () {
      this.$router.push({
        name: 'OrderDirectPay',
        params: {
          orderCode: this.orderCode
        }
      })
    },
    // 跳转分期计划页面
    jumpToInfoList () {
      this.$router.push({
        name: 'OrderPayInfoList',
        query: {
          orderCode: this.orderCode,
          amount: this.orderPrice,
          freeDay: this.freeCouponUnit,
          periods: this.periods,
          noCache: Date.now()
        }
      })
    },
    // 跳转至颜值卡页面
    jumpToFaceCard () {
      if (!this.reqReady) return false
      this.$router.replace({
        name: 'Facescard'
      })
    },
    // 跳转至免息券列表
    jumpToFreeList () {
      this.$tj('couponsytclick')
      window.sessionStorage.setItem('payFreeCoupons', JSON.stringify(this.coupons))
      this.$router.push({
        name: 'OrderPayFreeList',
        query: {
          orderCode: this.orderCode,
          goodsCode: this.goodsCode,
          couponCode: this.freeCouponCode
        }
      })
    },
    // 控制支付密码输入弹窗显示
    changeOrderPayInputShow (val) {
      this.orderPayInputShow = val
      if (!val) {
        this.passwordErrCount = 0
        this.showErrorText = false
      }
    },
    // 选择支付方式
    chosePayMethod () {
      if (!this.handlerStatusIsOk()) return false
      this.$set(this.facecardInfoData, 'isSelect', !this.facecardInfoData['isSelect'])
    },
    // 选择分期期数
    selectStage (index) {
      this.stagesData.forEach((item, ins) => {
        if (index === ins) {
          this.currentStageData = item
          this.$set(this.stagesData[ins], 'active', true)
          this.periods = item.repaymentPeriods
          let instalmentAmount = 0
          // if (this.freePeriods >= this.periods) {
          //   instalmentAmount = item.principal
          //   console.log('免息', instalmentAmount)
          // } else {
          //   instalmentAmount = item.totalAmount
          //   console.log('非免息', instalmentAmount)
          // }
          if (this.freePeriods > 0) {
            instalmentAmount = item.principal
          } else {
            instalmentAmount = item.totalAmount
          }
          this.instalmentAmount = instalmentAmount
        } else {
          this.$set(this.stagesData[ins], 'active', false)
        }
      })
    },
    // 判断订单是否可以支付
    judgeIfCanPay () {
      if (!this.reqReady) return false
      if (!this.readSelectBol) return false
      // 判断是否为额度不足状态
      if (this.isFacecardOpen && this.remainAmount <= 0) {
        this.$dialog.alert({
          message: `您的颜值卡额度不足,可还款或提额后再次尝试`
        })
        return false
      }
      // 判断用户是否选择了支付方式
      if (!this.facecardInfoData['isSelect']) {
        this.$toast('请选择一种支付方式')
        return false
      }
      // 判断用户是否实名补偿通过
      if (this.orderUserIsAddRealName) {
        if (!this.handlerIfNeedAddRealNameApprove()) return false
      }
      // 判断用户是否设置了支付密码
      if (!this.isPayPassword) {
        // 弹窗提示用户去设置支付密码
        this.$dialog.confirm({
          title: '提示',
          message: '您尚未设置支付密码,是否前往设置?'
        }).then(() => {
          let routerData = JSON.stringify({
            name: this.$route.name,
            query: this.$route.query,
            params: this.$route.params
          })
          // 跳转设置支付密码页面
          this.$router.push({
            name: 'GetCode',
            query: {
              type: 'router',
              routerData: routerData,
              noCache: Date.now()
            }
          })
        })
        return false
      }
      // 支付次数为0
      if (this.noPayConut) {
        this.resetStatus = true
        return false
      }
      // 开启密码输入弹窗
      this.orderPayInputShow = true
    },
    // 判断支付状态
    handlerStatusIsOk () {
      if (this.cardStatus === 1) {
        this.handlerCardIfNotActive()
        return false
      } else if (this.cardStatus === 2) {
        this.$dialog.alert({
          message: `颜值卡开卡正在审核中,请您耐心等待审核结果哦!`
        })
        return false
      }
      if (!this.downpayShow && this.remainAmount < this.orderPrice) {
        this.$dialog.alert({
          message: `您的颜值卡额度不足,可还款或提额后再次尝试`
        })
        return false
      }
      return true
    },
    // 判断是否开卡
    handlerCardIfNotActive () {
      this.$dialog.confirm({
        message: `您还未开通颜值卡,开通成功即享12999免审额度以及每月3次购物97折优惠`,
        confirmButtonText: '去开通',
        cancelButtonText: '我再想想',
        beforeClose: (action, done) => {
          if (action === 'confirm') {
            // 跳转去补偿页面
            this.jumpToFaceCard()
          }
          done()
        }
      })
    },
    // 实名补偿流程
    handlerIfNeedAddRealNameApprove () {
      let routerData = JSON.stringify({
        name: this.$route.name,
        path: this.$route.path,
        query: this.$route.query,
        params: this.$route.params
      })
      // 芝麻信用分
      if (this.gxbZhimaAuthNeed) {
        this.$dialog.confirm({
          message: `您需要进行"芝麻信用授权"补充,补充该信息可以帮您提升额度,并且还为您加速审核分期订单哦!`,
          confirmButtonText: '立即授权',
          cancelButtonText: '取消',
          beforeClose: (action, done) => {
            if (action === 'confirm') {
              this.$router.push({
                name: 'ZhiMaAuth',
                query: {
                  type: 'router',
                  routerData: routerData
                }
              })
              // location.href = this.zhimaAuthUrl
            }
            done()
          }
        })
        return false
      }
      // 电商
      if (this.dianshangMarkup) {
        this.$dialog.confirm({
          message: `您需要进行"电商信息补偿",补偿该信息,可以帮您提升额度,并且还为您加速审核分期订单哦!`,
          confirmButtonText: '立即加速',
          cancelButtonText: '取消',
          beforeClose: (action, done) => {
            if (action === 'confirm') {
              // 跳转去补偿页面
              const env = (process.env.VUE_APP_SERVEN).toLowerCase()
              location.href = 'https://open.shujumohe.com/box/ds/000103?box_token=061D17B5FE9447348C98A2247961BDF0&cb=' + 'https://' + env + '..xiaoxiangyoupin.com/purse/pay/' + this.orderCode
            }
            done()
          }
        })
        return false
      }
      // 紧急联系人
      // if (this.needUpdateEmergency) {
      //   this.$dialog.confirm({
      //     message: `您的紧急联系人信息已过期,请及时更新。更新可帮您提高订单审核通过率哦`,
      //     confirmButtonText: '立即更新',
      //     cancelButtonText: '取消',
      //     beforeClose: (action, done) => {
      //       if (action === 'confirm') {
      //         // 跳转去补偿页面
      //         this.$router.push({
      //           name: 'EmergencyContact',
      //           query: {
      //             type: 'router',
      //             routerData: routerData
      //           }
      //         })
      //       }
      //       done()
      //     }
      //   })
      //   return false
      // }
      // 运营商 弹窗
      if (this.markUp) {
        this.$dialog.confirm({
          message: '是否前往运营商授权页面',
          beforeClose: (action, done) => {
            if (action === 'confirm') {
              // 跳转去补偿页面
              this.$router.push({
                name: 'OperatorAccredit',
                query: {
                  type: 'router',
                  routerData: routerData,
                  noCache: Date.now()
                }
              })
            }
            done()
          }
        })
        return false
      }
      // 身份证
      if (this.needIdCardOcr) {
        this.$dialog.confirm({
          message: `您的实名认证信息还未补充完全,请补充完全后下单购买`,
          confirmButtonText: '立即补充',
          cancelButtonText: '取消',
          beforeClose: (action, done) => {
            if (action === 'confirm') {
              // 跳转去补偿页面
              this.$router.push({
                name: 'IdCardAuth',
                query: {
                  type: 'router',
                  routerData: routerData
                }
              })
            }
            done()
          }
        })
        return false
      }
      // 支付宝 弹窗
      // if (this.alipayMarkup) {
      //   this.$dialog.confirm({
      //     message: '是否前往支付宝授权页面',
      //     beforeClose: (action, done) => {
      //       if (action === 'confirm') {
      //         // 跳转去补偿页面
      //         location.href = `bsd://xxyp/auth/alipay`
      //       }
      //       done()
      //     }
      //   })
      // return false
      // }
      if (this.needXuexinAuth) {
        this.$dialog.confirm({
          message: `您的学信网信息还未授权,授权后才可下单购买`,
          confirmButtonText: '立即授权',
          cancelButtonText: '取消',
          beforeClose: (action, done) => {
            if (action === 'confirm') {
              // 跳转去补偿页面
              this.$router.push({
                name: 'StudentAuth',
                query: {
                  type: 'router',
                  routerData: routerData
                }
              })
            }
            done()
          }
        })
        return false
      }
      return true
    },
    // 卡类分期申请接口
    ApplicationInstallment (payPwd) {
      this.payPassWordStatus = 2
      return this.$api['cashierdesk/submit_periods_noreview']({
        token: this.userToken,
        orderCode: this.orderCode,
        payPwd: payPwd,
        couponCode: this.freeCouponCode, // 优惠券code
        periods: this.periods, // 分期数
        downPayment: this.downPayment, // 首付
        payMethod: this.payMethod // 支付方式
      }, {
        noShowLoading: true,
        noShowDefaultError: true,
        headers: {
          appVersion: '3.7.8'
        }
      }).then(res => {
        if (res.payError) {
          if (res.payError.errorCode === '16019') {
            console.log(res)
            // let message = res.payError.errorMsg
            this.payPassWordStatus = 1
            this.showErrorText = true
            if (res.payError.lastCount === 0) {
              this.changeOrderPayInputShow(false)
              this.errorText = ''
              this.resetStatus = true
              this.noPayConut = true
            } else {
              this.errorText = '密码错误！还可尝试' + res.payError.lastCount + '次'
              this.changeOrderPayInputShow(true)
              // this.$toast(message)
            }
            this.passwordErrCount += 1
          } else if (res.payError.errorCode === '5003') {
            console.log(res)
            // let message = res.payError.errorMsg
            this.payPassWordStatus = 1
            this.changeOrderPayInputShow(false)
            // this.$toast(message)
            this.changeOrderPayInputShow(false)
            this.errorText = ''
            this.resetStatus = true
            this.noPayConut = true
          }
        } else {
          console.log('ApplicationInstallment', res)
          this.payPassWordStatus = 3
          this.showErrorText = false
          this.errorText = ''
          this.$router.replace({
            name: 'OrderPaySuccess'
          })
        }
      }).catch(err => {
        console.log('ApplicationInstallment', err)
        let message = err && err.heads && err.heads.message
        this.payPassWordStatus = 1
        this.changeOrderPayInputShow(false)
        this.$toast(message)
      })
    },
    // 获取收银台信息
    getCashierData () {
      return this.$api['cashierdesk/queryOrderAmountInfo']({
        orderCode: this.orderCode,
        token: this.userToken
      }, {
        noShowLoading: true
      }).then(async res => {
        this.deskData = res.data
        this.facecardInfoData = this.deskData && this.deskData.instalmentMethodList.filter(item => {
          return item.instalmentCode === 2
        })[0]
        this.supportDownPay = this.facecardInfoData && this.facecardInfoData.downPayFlag
        this.cardStatus = this.facecardInfoData && this.facecardInfoData.status
        this.discountAmount = this.facecardInfoData && this.facecardInfoData.discountAmount
        this.remainAmount = this.facecardInfoData && this.facecardInfoData.remainAmount
        this.isFacecardOpen = !!this.facecardInfoData['cardCode']

        this.$set(this.facecardInfoData, 'isSelect', this.isFacecardOpen)
        let dealWithAmount = this.deskData && this.deskData.dealWithAmount
        if (this.isFacecardOpen) {
          let discountAmount = this.facecardInfoData && this.facecardInfoData.discountAmount
          this.orderPrice = dealWithAmount - discountAmount
        } else {
          this.orderPrice = dealWithAmount
        }
        if (this.remainAmount < this.orderPrice && this.supportDownPay) {
          this.needPayDown = true
          this.calDownpayAmount(this.facecardInfoData['cardCode'])
        }
        await this.scheme()
      })
    },
    // 获取用户额外补偿信息
    isMarkUpMobileAuthV2 () {
      return this.$api['user/isMarkUpMobileAuthV2']({
        token: this.userToken,
        orderCode: this.orderCode
      }, {
        noShowLoading: true
      }).then(res => {
        this.realNameAddData = res
      })
    },
    // 获取是否需要请求实名信息补偿接口
    creditCheckV4 () {
      return this.$api['user/creditCheckV4']({
        token: this.userToken
      }, {
        noShowLoading: true
      }).then(res => {
        this.realNameData = res.data
      })
    },
    // 获取首付金额
    calDownpayAmount (cardCode) {
      this.$api['pay/calDownpayAmount']({
        token: this.userToken,
        amount: this.orderPrice,
        cardCode: cardCode
      }, {
        noShowDefaultError: true,
        noShowLoading: true
      }).then(res => {
        this.downPayment = res.downpayAmount
        if (this.downPayment) this.downpayShow = true
      }).catch(err => {
        console.log(err)
        this.downpayShow = false
      })
    },
    // 获取用户信息
    getUserInfo () {
      return this.$api['user/getUserInfo']({
        token: this.userToken
      }, {
        noShowLoading: true
      }).then(res => {
        this.isPayPassword = res.data.isPayPassword
      })
    },
    // 获取账单信息
    scheme () {
      return this.$api['cashierdesk/scheme']({
        'orderCode': this.orderCode, // 订单号
        'amount': this.orderPrice, // 分期金额
        'token': this.userToken
      }, {
        noShowLoading: true
      }).then(res => {
        this.stagesData = res.data
        this.stagesData.forEach((item, index) => {
          if (item.repaymentPeriods === 12) {
            this.currentStageData = item
            this.$set(this.stagesData[index], 'active', true)
            this.instalmentAmount = item.totalAmount
          } else {
            this.$set(this.stagesData[index], 'active', false)
          }
        })
      })
    },
    // 获取可用免息券
    getAvailableCoupons () {
      return this.$api['cashierdesk/getAvailableCoupons']({
        token: this.userToken,
        type: 3
      }).then(res => {
        let coupons = res.data
        this.coupons = coupons.map(item => {
          item.show = true
          item.isSelect = false
          return item
        })
      })
    },
    changePassWord () {
      // this.showErrorText = false
    },
    closeResetFn () {
      this.resetStatus = false
    },
    payPwdCountServe () {
      this.$api['user/payPwdCount']({
        token: this.userToken
      }).then(res => {
        if (res.data > 0) {
          this.noPayConut = false
        } else {
          this.noPayConut = true
        }
      })
    }
  },
  watch: {
    coupons: {
      handler (arr) {
        console.log('coupons', arr)
        this.freeCoupon = null
        arr.forEach(item => {
          if (item.isSelect) {
            this.freeCoupon = item
          }
        })
        let instalmentAmount = 0
        // if (this.freePeriods >= this.periods) {
        //   instalmentAmount = this.currentStageData.principal
        // } else {
        //   instalmentAmount = this.currentStageData.totalAmount
        // }
        if (this.freePeriods > 0) {
          instalmentAmount = this.currentStageData.principal
        } else {
          instalmentAmount = this.currentStageData.totalAmount
        }
        this.instalmentAmount = instalmentAmount
        let noSelectCoupon = arr.filter(item => !item.isSelect).length
        this.isCouponAllSelect = !noSelectCoupon
      },
      immediate: true
    }
  },
  components: {
    orderPayInput,
    resetpay
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'OrderPayInfoList' || from.name === 'OrderDirectPay' || from.name === 'OrderPayFreeList') {
      to.meta.isBack = true
    }
    to.meta.keepAlive = true
    next()
  },
  beforeRouteLeave (to, from, next) {
    if (this.isLeave) {
      global.appIns.alive = false
      from.meta.keepAlive = false
      this.$nextTick(() => {
        global.appIns.alive = true
      })
      next()
    } else if (to.name === 'OrderFill' || to.name === 'GoodsDetail' || to.name === 'OrderList' || to.name === 'OrderDetail') {
      this.$dialog.confirm({
        title: '提示',
        message: '确定要放弃付款?',
        beforeClose: (action, done) => {
          if (action === 'confirm') {
            // 跳转我的订单列表页面
            this.isLeave = true
            this.$router.replace({
              name: 'OrderList',
              params: {
                type: 1
              }
            })
          } else {
            next(false)
          }
          done()
        }
      })
    } else {
      // 除去分期计划及直付收银台外,跳转至其他页面都需将本页面缓存去除
      let arr = ['OrderPayInfoList', 'OrderDirectPay', 'OrderPayFreeList']
      if (arr.indexOf(to.name) === -1) {
        global.appIns.alive = false
        from.meta.keepAlive = false
        this.$nextTick(() => {
          global.appIns.alive = true
        })
      }
      next()
    }
  }
}
</script>
<style lang="scss" scoped>
.CashierDesk {
  background-color: #f2f2f2;
  .child-view {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 300;
    background-color: #f2f2f2;
  }
  &__info {
    // height: 280px;
    background: #fff;
    margin-bottom: 20px;
    .title {
      margin-bottom: 40px;
      padding: 30px 30px 0;
      font-family: PingFangSC-Regular;
      font-size: 28px;
      color: #333;
      line-height: 40px;
      height: 40px;
      box-sizing: border-box;
      .fr {
        span {
          color: #ed145b;
        }
      }
    }
    .price {
      font-family: PingFangSC-Regular;
      font-size: 60px;
      color: #333;
      text-align: center;
      margin-bottom: 6px;
      margin-top: 90px;
      height: 84px;
      line-height: 84px;
    }
    .tips {
      font-family: PingFangSC-Regular;
      font-size: 28px;
      color: #939393;
      text-align: center;
      padding-bottom: 60px;
      &.active {
        color: #ed145b;
      }
    }
  }
  &__Stage {
    padding: 24px 0 30px;
    background-color: #fff;
    .tip {
      padding: 0 30px;
      text-align: left;
      font-family: PingFangSC-Regular;
      font-size: 28px;
      color: #333;
      line-height: 40px;
      margin-bottom: 30px;
    }
    .stages {
      margin: 0 40px;
      .stage:last-of-type {
        margin-right: 0;
      }
      .stage {
        width: 126px;
        height: 56px;
        border: 2px solid rgba(147, 147, 147, 0.6);
        box-sizing: border-box;
        border-radius: 4px;
        margin-right: 55px;
        line-height: 56px;
        font-size: 28px;
        color: #636363;
        text-align: center;
        &.active {
          background: #f54b78;
          color: #fff;
          border: none;
        }
      }
    }
  }
  &__interestFree {
    padding: 30px 30px 22px;
    font-size: 28px;
    line-height: 44px;
    height: 44px;
    background-color: #fff;
    .left {
      line-height: 44px;
      height: 44px;
      color: #000;
    }
    .right {
      line-height: 44px;
      height: 44px;
      color: #999;
      font-size: 0;
      span {
        display: inline-block;
        font-size: 28px;
        color: #333;
        &.active {
          color: #ed145b;
        }
      }
      img {
        width: 44px;
        height: 44px;
      }
    }
  }
  &__firstPay {
    padding: 24px 30px;
    height: 88px;
    background-color: #fff;
    box-sizing: border-box;
    .left {
      height: 40px;
      font-size: 28px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 40px;
    }
    .right {
      height: 40px;
      font-size: 28px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(237, 20, 91, 1);
      line-height: 40px;
    }
  }
  &__payment {
    .tip {
      box-sizing: border-box;
      padding: 0 30px;
      height: 80px;
      line-height: 80px;
      font-family: PingFangSC-Regular;
      font-size: 28px;
      color: #636363;
      text-align: left;
    }
    .payments {
      padding-left: 24px;
      box-sizing: border-box;
      text-align: left;
      background-color: #fff;
    }
  }
  &__fixedFooter {
    background: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 180px;
    padding-bottom: env(safe-area-inset-bottom);
    .wrap {
      padding: 0 20px;
    }
    .protocol {
      padding: 25px 0 14px;
      font-size: 0;
      height: 33px;
      color: #939393;
      text-align: left;
      img {
        width: 26px;
        height: 26px;
        vertical-align: middle;
        margin-right: 20px;
      }
      span {
        font-size: 24px;
        display: inline-block;
        vertical-align: middle;
      }
      .active {
        color: #507daf;
      }
    }
    .btn {
      background: #f54b78;
      border-radius: 4px;
      height: 84px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.disable {
        background-color: #ffabc1;
      }
      span {
        display: flex;
        font-family: PingFangSC-Regular;
        font-size: 32px;
        color: #ffffff;
        text-align: left;
      }
    }
  }
  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 300px;
      height: 300px;
    }
  }
}
.payment {
  padding: 22px 0 20px;
  display: flex;
  justify-content: space-between;
  .icon {
    margin: 9px 20px 0 0;
    width: 58px;
    height: 58px;
    img {
      display: block;
    }
  }
  .name {
    .top {
      color: #333;
      margin-bottom: 5px;
      line-height: 40px;
      font-size: 0;
      span {
        font-size: 28px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
      }
      img {
        width: 70px;
        height: 30px;
        vertical-align: middle;
      }
    }
    .bottom {
      font-size: 24px;
      color: #999;
      line-height: 33px;
      span {
        color: #ed145b;
      }
    }
  }
  .right {
    margin: 9px 30px 0 0;
  }
  .discountAmount {
    height: 44px;
    padding: 0 12px;
    line-height: 40px;
    border: 2px solid #ed145b;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 24px;
    color: #ed145b;
    text-align: center;
    margin: 7px 12px 0 0;
  }
  .status {
    img {
      width: 58px;
      height: 58px;
    }
  }
  .arrow {
    margin-top: 7px;
    img {
      width: 44px;
      height: 44px;
    }
  }
}
.direct {
  padding: 15px 30px 16px 0;
  .icon {
    margin-right: 19px;
    width: 58px;
    height: 58px;
    img {
      display: block;
    }
  }
  .directpay {
    margin-top: 9px;
    height: 40px;
    font-size: 28px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 40px;
  }
  .arrow {
    margin-top: 7px;
    img {
      width: 44px;
      height: 44px;
    }
  }
}
</style>
