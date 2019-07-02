import { getQueryString } from 'insfns'
import { mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters(['userToken', 'userId'])
  },
  methods: {
    getQueryString (name, defaultVal = null) {
      return this.$route.query[name] || getQueryString(name) || defaultVal
    },
    ...mapMutations(['muUserMetaInfo'])
  }
}
