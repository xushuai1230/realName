import Vue from 'vue'
import Vuex from 'vuex'
import { VUEX_DEFAULT_CONFIG } from '@/config'
import commonStore from '@/service/store'
// vuex缓存方案
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  ...commonStore,
  ...VUEX_DEFAULT_CONFIG,
  plugins: [createPersistedState({
    paths: ['userIdentity', 'userMark', 'loginChannel'],
    storage: window.sessionStorage
  })]
})
