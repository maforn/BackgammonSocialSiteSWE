<template>
    <router-view class="p-4"></router-view>
</template>

<script lang="ts">
export default {
    name: 'App',

    mounted() {
        console.log('App mounted');
    }
};
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  background-color: #e6e6e6; /* Set your desired background color */
}
</style>