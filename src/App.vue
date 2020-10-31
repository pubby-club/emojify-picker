<template>
  <div id="app">
    <h3>My Awesome Emoji Picker</h3>

    <emojify-picker
      :sheet="sheet"
      :emoji-size="22"
      style="width: 348px;height: 500px;"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import emojis from "./emojis.json";

@Component
export default class App extends Vue {
  sheet = emojis;
}
</script>

<style lang="scss">
html,
body {
  font-family: "Arial", sans-serif;
}
</style>
