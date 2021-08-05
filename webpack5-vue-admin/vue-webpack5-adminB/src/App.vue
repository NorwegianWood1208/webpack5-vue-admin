<template>
  <div>B项目：距离2021年欧洲杯还有？</div>
  <countDown/>
</template>

<script>
import { defineAsyncComponent } from 'vue'

const countDown = defineAsyncComponent(() =>
        import('A/countDown')
)
export default {
  components: { countDown },
  setup() {
    const testFunction = () => {
      console.log('滚')
    }
    return {
      testFunction
    }
  }
}
</script>

<style>
  div {
    color: yellowgreen;
  }
</style>
