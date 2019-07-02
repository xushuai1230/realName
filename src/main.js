import Vue from 'vue'
import App from './App'
import router from './routes'
import './global'
import store from '@/plugins/store'
import MTAH5 from 'mta-h5-analysis'
import { initMta } from './plugins/statistics'

Vue.config.productionTip = process.env.VUE_APP_SERVEN === 'PROD'

initMta() // 开启统计

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 用户切换路由后关闭loading效果，登录框
  global.vbus.$emit('loading_show', false)
  store.commit('setLoginStatus', false)
  next()
})

router.afterEach((to, from) => {
  let dirFlag = to.params.flag
  if (dirFlag === 'dir' && !from.name) {
    router.push({
      name: 'shopHome'
    })
  } else if (dirFlag === 'dir' && from.name === 'shopHome') {
    location.href = 'https://pay.sc.weibo.com/pay/index?source=fenqi'
  }
  MTAH5.pgv()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
