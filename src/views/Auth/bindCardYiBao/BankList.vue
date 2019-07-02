
<template>
    <transition name="fadeInRight">
    <div id="asd">
        <div class="bankItem" v-for="(item,index) in bankInfo" :key="index" @click.stop.prevent="backYiBaoBindCard(item)">
            <img v-bind:src="item.url">
            <span>{{item.value}}</span>
        </div>
    </div>
    </transition>
</template>

<script>
export default {
  data () {
    return {
      bankItem: '',
      bankInfo: [
        {
          title: 'ICBC',
          value: '中国工商银行',
          url: 'https://cdn.xiaoxiangyoupin.com/image/bank_img/01020000.png'
        },
        {
          title: 'BOC',
          value: '中国银行',
          url: 'https://cdn.xiaoxiangyoupin.com/image/bank_img/01040000.png'
        },
        {
          title: 'CCB',
          value: '建设银行',
          url: 'https://cdn.xiaoxiangyoupin.com/image/bank_img/01050000.png'
        },
        {
          title: 'PSBC',
          value: '邮政储蓄',
          url: 'https://cdn.xiaoxiangyoupin.com/image/bank_img/61000000.png'
        },
        {
          title: 'ABC',
          value: '农业银行',
          url: 'https://cdn.xiaoxiangyoupin.com/image/bank_img/01030000.png'
        },
        {
          title: 'CMB',
          value: '招商银行',
          url: 'https://cdn.xiaoxiangyoupin.com/image/bank_img/03080000.png'
        },
        {
          title: 'ECITIC',
          value: '中信银行',
          url: 'https://cdn.xiaoxiangyoupin.com/image/bank_img/zx.png'
        },
        {
          title: 'CEB',
          value: '光大银行',
          url: 'https://cdn.xiaoxiangyoupin.com/image/bank_img/03030000.png'
        },
        {
          title: 'HX',
          value: '华夏银行',
          url: 'https://cdn.xiaoxiangyoupin.com/image/bank_img/hx.png'
        },
        {
          title: 'CIB',
          value: '兴业银行',
          url: 'https://cdn.xiaoxiangyoupin.com/image/bank_img/03090010.png'
        },
        {
          title: 'SPDB',
          value: '浦发银行',
          url: 'https://cdn.xiaoxiangyoupin.com/image/bank_img/03100000.png'
        },
        {
          title: 'SZPA',
          value: '平安银行',
          url: 'https://cdn.xiaoxiangyoupin.com/image/bank_img/05105840.png'
        },
        {
          title: 'CMBC',
          value: '民生银行',
          url: 'https://cdn.xiaoxiangyoupin.com/image/bank_img/03050000.png'
        },
        {
          title: 'GDB',
          value: '广发银行',
          url: 'https://cdn.xiaoxiangyoupin.com/image/bank_img/03060000.png'

        },
        {
          title: 'BCCB',
          value: '北京银行',
          url: 'https://cdn.xiaoxiangyoupin.com/image/bank_img/bj.png'
        },
        {
          title: 'BCM',
          value: '交通银行',
          url: 'https://cdn.xiaoxiangyoupin.com/image/bank_img/jiaotongyinhang.png'
        }
      ]
    }
  },
  methods: {
    backYiBaoBindCard (item) {
      this.$store.commit('backYiBaoBindCard', item)
      this.$router.go(-1)
    }
  }
}
</script>

<style>
    .active{
        right:0;
        display: block;
    }
    .bankItem{
        width:100%;
        height:1.173rem;
        background: #FFFFFF;
        line-height: 1.173rem;
        border-bottom: solid 1px #e6e6e6;
        font-size: 28px;
        color: #333333;
    }
    .bankItem img{
        float: left;
        width:0.58rem;
        height:0.58rem;
        display: inline;
        margin-top: .3rem;
        margin-left: .3rem;
    }
    .bankItem span{
        margin-left: .3rem;
    }
    .fadeInRight-enter-active {
        animation: fadeInRight .3s;
    }
    @keyframes fadeInRight {
        from {
            opacity: 0;
            -webkit-transform: translate3d(100%, 0, 0);
            transform: translate3d(100%, 0, 0);
        }
        to {
            opacity: 1;
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }
    }
</style>
