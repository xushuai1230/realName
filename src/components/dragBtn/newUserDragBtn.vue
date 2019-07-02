<template>
	<div class="drag" ref="newUserdrag" :style="dragStyle">
		<img src="~@/assets/img/newUserBtn.png" alt="" @load="getElRect">
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'newUserdrag',
  data () {
    return {
      dragStyle: null,
      tap_time: null,
      startClientX: null,
      startClientY: null,
      elWidth: 70,
      elHeight: 70
    }
  },
  created () {
    if (this.newUserDragPos.right !== 0 || this.newUserDragPos.bottom !== 0) {
      this.dragStyle = {
        right: this.newUserDragPos.right + 'px',
        bottom: this.newUserDragPos.bottom + 'px'
      }
    }
  },
  props: ['parentH'],
  computed: {
    ...mapState(['newUserDragPos'])
  },
  mounted () {
    this.dragHandler(this.$refs.newUserdrag)
  },
  methods: {
    getElRect () {
      let styler = window.getComputedStyle(this.$refs.newUserdrag, null)
      let widthMatch = styler.width.match(/[0-9].*[0-9]/)
      let heightMatch = styler.height.match(/[0-9].*[0-9]/)
      this.elWidth = widthMatch && widthMatch[0]
      this.elHeight = heightMatch && heightMatch[0]
    },
    dragHandler (bashou) {
      let viewportWidth = document.documentElement.clientWidth
      let viewportHeight = document.documentElement.clientHeight
      let disWidth, disHeight, gouguDis, tempTouch
      bashou.addEventListener('touchstart', (evt) => {
        evt.preventDefault()
        viewportWidth = document.documentElement.clientWidth
        viewportHeight = document.documentElement.clientHeight
        let rect = bashou.getBoundingClientRect()
        let targetTouch = evt.targetTouches[0]
        this.startClientX = targetTouch.clientX
        this.startClientY = targetTouch.clientY
        disWidth = rect.right - this.startClientX
        disHeight = rect.bottom - this.startClientY
        this.tap_time = Date.now()
      })
      bashou.addEventListener('touchmove', (evt) => {
        let right = viewportWidth - (evt.targetTouches[0].clientX + disWidth)
        let bottom = viewportHeight - (evt.targetTouches[0].clientY + disHeight)
        console.log('right', right, viewportWidth)
        if (right <= 0) {
          right = 0
        } else if (right >= viewportWidth - this.elWidth) {
          right = viewportWidth - this.elWidth
        }
        if (bottom <= this.parentH) {
          bottom = this.parentH
        } else if (bottom >= viewportHeight - this.elHeight) {
          bottom = viewportHeight - this.elHeight
        }
        this.dragStyle = {
          right: right + 'px',
          bottom: bottom + 'px'
        }
      })
      bashou.addEventListener('touchend', (evt) => {
        if (this.dragStyle) {
          this.setNewUserDragPos(this.dragStyle)
        }
        this.tap_time = Date.now() - this.tap_time
        tempTouch = evt.changedTouches[0]
        gouguDis = Math.sqrt(Math.pow(Math.abs(tempTouch.clientX - this.startClientX), 2) + Math.pow(Math.abs(tempTouch.clientY - this.startClientY), 2))
        if (this.tap_time < 700 && gouguDis < 12) {
          this.$tj('welfaresuspendclick')
          this.setShowNewUserDialogStatus(true)
          this.setNewUserDragStatus(false)
        }
      })
    },
    ...mapMutations(['setShowNewUserDialogStatus', 'setNewUserDragPos', 'setNewUserDragStatus'])
  },
  watch: {
    newUserDragPos (newVal) {
      if (this.newUserDragPos.right !== 0 || this.newUserDragPos.bottom !== 0) {
        this.dragStyle = {
          right: this.newUserDragPos.right + 'px',
          bottom: this.newUserDragPos.bottom + 'px'
        }
      }
    }
  }
}

</script>

<style scoped lang="scss">
body {
  .drag {
    position: fixed;
    right: 0;
    bottom: 1.2rem;
    z-index: 100;
    img {
      display: block;
      width: 2.2rem;
      height: auto;
    }
  }
}
</style>
