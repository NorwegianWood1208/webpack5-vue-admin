<template>
    <div>
        You will never walk alone.
    </div>
</template>

<script>
    export default {
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
