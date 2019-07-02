<template>
  <div class="safeTitle">
    <i class="icon-cfca"></i>
    <p class="safe top-safe">【小象优品】已通过“CFCA中国金融认证中心”安全认证</p>
    <p class="safe bottom-safe">将为您的信息提供银行级安全保护</p>
  </div>
</template>

<script>
export default {
  name: 'safeTitle'
}
</script>

<style scoped>
.safeTitle {
  position: absolute;
  bottom: 1.066667rem;
  left: 0.5rem;
  right: 0.5rem;
  width: auto;
  text-align: center;
}
.icon-cfca {
  display: inline-block;
  width: 1.106667rem;
  height: .586667rem;
  background-image: url("~@/assets/img/authentification_icon_cfca@2x.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.safe {
  font-size: .293333rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(170,170,170,1);
}
.bottom-safe {
  margin-top: .053333rem;
}
.top-safe {
  margin-top: .186667rem;
}
</style>
