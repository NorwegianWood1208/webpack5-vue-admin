<template>
    <div>{{ sum }}天开幕</div>
</template>
<script>
import { defineComponent, onMounted, ref, computed } from 'vue'
export default {
    setup() {
        let sum = computed(() => parseInt((new Date('2021-06-13'.replace(/-/g, '/')).getTime() - new Date()) / (1000*3600*24)));
        return {
            sum
        }
    }
}
</script>