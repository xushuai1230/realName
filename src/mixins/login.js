import { mapMutations } from 'vuex'
export default {
  methods: {
    handlerLogin () {
      this.setLoginStatus(true)
    },
    ...mapMutations(['setLoginStatus', 'muUserMetaInfo'])
  }
}
