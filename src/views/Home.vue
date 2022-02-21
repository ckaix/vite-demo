<template>
  <div>
    <HelloWorld>
      <template #header> Header 1</template>
    </HelloWorld>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'

export default defineComponent({
  components: {
    HelloWorld
  },
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.test {
  margin: 0;
  padding: 0;
  color: red;
}

::v-deep {
  color: red;
}
</style>
