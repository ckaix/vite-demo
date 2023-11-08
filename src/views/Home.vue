<template>
  <div class="container">
    <div class="header">
      <button @click="show">show</button>
    </div>
    <div v-show="state === 1" class="picker" @touchmove.prevent @click="cancel">
      <div v-show="state === 1" class="picker-panel" @click.stop>
        <div class="picker-choose border-bottom-1px">
          <span class="cancel" @click="cancel">Cancel</span>
          <span class="confirm" @click="confirm">Confirm</span>
          <h1 class="picker-title">Title</h1>
        </div>
        <div class="picker-content">
          <div class="mask-top border-bottom-1px"></div>
          <div class="mask-bottom border-top-1px"></div>
          <div ref="wheelWrapper" class="wheel-wrapper">
            <div v-for="(data, index) in pickerData" :key="index" class="wheel">
              <ul class="wheel-scroll">
                <li
                  v-for="item in data"
                  :key="item.value"
                  :class="{ 'wheel-disabled-item': item.disabled }"
                  class="wheel-item"
                >
                  {{ item.text }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="picker-footer"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, nextTick } from 'vue'
import BScroll, { BScrollInstance } from '@better-scroll/core'

const DATA = [
  {
    text: '北京市',
    value: '110000',
    children: [
      {
        text: '北京市',
        value: '110100'
      }
    ]
  },
  {
    text: '天津市',
    value: '120000',
    children: [
      {
        text: '天津市',
        value: '120000'
      }
    ]
  },
  {
    text: '河北省',
    value: '130000',
    children: [
      {
        text: '石家庄市',
        value: '130100'
      },
      {
        text: '唐山市',
        value: '130200'
      },
      {
        text: '秦皇岛市',
        value: '130300'
      },
      {
        text: '邯郸市',
        value: '130400'
      },
      {
        text: '邢台市',
        value: '130500'
      },
      {
        text: '保定市',
        value: '130600'
      },
      {
        text: '张家口市',
        value: '130700'
      },
      {
        text: '承德市',
        value: '130800'
      }
    ]
  },
  {
    text: '山西省',
    value: '140000',
    children: [
      {
        text: '太原市',
        value: '140100'
      },
      {
        text: '大同市',
        value: '140200'
      },
      {
        text: '阳泉市',
        value: '140300'
      },
      {
        text: '长治市',
        value: '140400'
      },
      {
        text: '晋城市',
        value: '140500'
      },
      {
        text: '朔州市',
        value: '140600'
      },
      {
        text: '晋中市',
        value: '140700'
      }
    ]
  }
]

const STATE_HIDE = 0
const STATE_SHOW = 1

const state = ref(STATE_HIDE)
const selectedIndexPair = ref([0, 0])
const pickerData = ref([])
const wheels = ref<BScrollInstance[]>([])
const wheelWrapper = ref<HTMLDivElement | null>()

function loadPickerData(newIndexPair, oldIndexPair) {
  let provinces
  let cities
  if (!oldIndexPair) {
    provinces = DATA.map(({ value, text }) => ({ value, text }))
    cities = DATA[newIndexPair[0]].children
    pickerData.value = [provinces, cities]
  } else if (newIndexPair[0] !== oldIndexPair[0]) {
    // provinces'index changed, refresh cities data
    cities = DATA[newIndexPair[0]].children
    pickerData.value.splice(1, 1, cities)
    // Since cities data changed
    // refresh better-scroll to recaculate scrollHeight
    nextTick(() => {
      wheels.value[1].refresh()
    })
  }
}

function createWheel(wrapper: HTMLDivElement, i: number) {
  if (!wheels.value[i]) {
    wheels.value[i] = new BScroll(wrapper.children[i] as HTMLElement, {
      wheel: {
        selectedIndex: selectedIndexPair.value[i],
        wheelWrapperClass: 'wheel-scroll',
        wheelItemClass: 'wheel-item'
      },
      probeType: 3
    })
    let prevSelectedIndexPair = selectedIndexPair.value
    wheels.value[i].on('scrollEnd', () => {
      const currentSelectedIndexPair = wheels.value.map((wheel) => wheel.getSelectedIndex())
      loadPickerData(currentSelectedIndexPair, prevSelectedIndexPair)
      prevSelectedIndexPair = currentSelectedIndexPair
      // this.$emit(EVENT_CHANGE, i, this.wheels[i].getSelectedIndex())
    })
  } else {
    wheels.value[i].refresh()
  }
  return wheels.value[i]
}
function show() {
  if (state.value === STATE_SHOW) {
    return
  }
  state.value = STATE_SHOW
  if (!wheels.value.length) {
    nextTick(() => {
      wheels.value = []
      for (let i = 0; i < pickerData.value.length; i++) {
        createWheel(wheelWrapper.value!, i)
      }
    })
  }
}

function hide() {
  state.value = STATE_HIDE
}

function confirm() {
  wheels.value.forEach((wheel) => {
    /*
     * if bs is scrolling, force it stop at the nearest wheel-item
     * or you can use 'restorePosition' method as the below
     */
    // wheel.stop()
    /*
     * if bs is scrolling, restore it to the start position
     * it is same with iOS picker and web Select element implementation
     * supported at v2.1.0
     */
    wheel.restorePosition()
  })
  hide()
  selectedIndexPair.value = wheels.value.map((wheel) => {
    return wheel.getSelectedIndex()
  })

  // this.$emit(EVENT_SELECT, currentSelectedIndexPair)
}

function cancel() {
  wheels.value.forEach((wheel) => {
    wheel.restorePosition()
  })
  hide()
  // this.$emit(EVENT_CANCEL)
}

onBeforeMount(() => {
  loadPickerData(selectedIndexPair.value, undefined)
})
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
}
ul {
  padding: 0;
  list-style: none;
}
.border-bottom-1px,
.border-top-1px {
  position: relative;
}
.border-bottom-1px:before,
.border-top-1px:before,
.border-bottom-1px:after,
.border-top-1px:after {
  content: '';
  display: block;
  position: absolute;
  transform-origin: 0 0;
}
.border-bottom-1px:after {
  bottom: 0;
  left: 0;
  width: 100%;
  transform-origin: 0 bottom;
  border-bottom: 1px solid #ebebeb;
}
.border-top-1px:before {
  top: 0;
  left: 0;
  width: 100%;
  transform-origin: 0 top;
  border-top: 1px solid #ebebeb;
}
// @media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
//   .border-top-1px:before {
//     width: 200%;
//     transform: scale(0.5) translateZ(0);
//   }
//   .border-bottom-1px:after {
//     width: 200%;
//     transform: scale(0.5) translateZ(0);
//   }
// }
// @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
//   .border-top-1px:before {
//     width: 300%;
//     transform: scale(0.333) translateZ(0);
//   }
//   .border-bottom-1px:after {
//     width: 300%;
//     transform: scale(0.333) translateZ(0);
//   }
// }
.example-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 2rem;
}
.example-list .example-item {
  flex: 1;
  margin-bottom: 1rem;
  padding: 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
}
.example-list .example-item.placeholder {
  visibility: hidden;
  height: 0;
  margin: 0;
  padding: 0;
}
.picker {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(37, 38, 45, 0.4);
  font-size: 14px;
  text-align: center;
}
.picker.picker-fade-enter,
.picker.picker-fade-leave-active {
  opacity: 0;
}
.picker.picker-fade-enter-active,
.picker.picker-fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.picker .picker-panel {
  position: absolute;
  z-index: 600;
  bottom: 0;
  width: 100%;
  height: 273px;
  background: #fff;
}
.picker .picker-panel.picker-move-enter,
.picker .picker-panel.picker-move-leave-active {
  transform: translate3d(0, 273px, 0);
}
.picker .picker-panel.picker-move-enter-active,
.picker .picker-panel.picker-move-leave-active {
  transition: all 0.3s ease-in-out;
}
.picker .picker-panel .picker-choose {
  position: relative;
  height: 60px;
  color: #999;
}
.picker .picker-panel .picker-choose .picker-title {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: normal;
  line-height: 60px;
  text-align: center;
}
.picker .picker-panel .picker-choose .confirm,
.picker .picker-panel .picker-choose .cancel {
  position: absolute;
  top: 6px;
  padding: 16px;
  font-size: 14px;
}
.picker .picker-panel .picker-choose .confirm {
  right: 0;
  color: #007bff;
}
.picker .picker-panel .picker-choose .confirm:active {
  color: #5aaaff;
}
.picker .picker-panel .picker-choose .cancel {
  left: 0;
}
.picker .picker-panel .picker-choose .cancel:active {
  color: #c2c2c2;
}
.picker .picker-panel .picker-content {
  position: relative;
  top: 20px;
}
.picker .picker-panel .picker-content .mask-top,
.picker .picker-panel .picker-content .mask-bottom {
  z-index: 10;
  width: 100%;
  height: 68px;
  transform: translateZ(0);
  pointer-events: none;
}
.picker .picker-panel .picker-content .mask-top {
  position: absolute;
  top: 0;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
}
.picker .picker-panel .picker-content .mask-bottom {
  position: absolute;
  bottom: 1px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
}
.picker .picker-panel .wheel-wrapper {
  display: flex;
  padding: 0 16px;
}
.picker .picker-panel .wheel-wrapper .wheel {
  flex: 1;
  width: 1%;
  height: 173px;
  overflow: hidden;
  font-size: 18px;
}
.picker .picker-panel .wheel-wrapper .wheel .wheel-scroll {
  margin-top: 68px;
  padding: 0;
  line-height: 36px;
  list-style: none;
}
.picker .picker-panel .wheel-wrapper .wheel .wheel-scroll .wheel-item {
  height: 36px;
  overflow: hidden;
  color: #333;
  list-style: none;
  white-space: nowrap;
}
.picker .picker-panel .wheel-wrapper .wheel .wheel-scroll .wheel-item.wheel-disabled-item {
  opacity: 0.2;
}
.picker .picker-footer {
  height: 20px;
}
</style>
