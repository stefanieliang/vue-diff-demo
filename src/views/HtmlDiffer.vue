<!-- html-diff -->
<template>
  <div>
    html-diff
    <div id="target"></div>
  </div>
</template>

<script>
import htmldiff from "./htmldiff";
import { a, b } from "./data";
export default {
  components: {},

  data() {
    return {};
  },

  computed: {},

  mounted() {
    // var txt1 = a.replace(/[\r\n]/g, "<br>");
    // var txt2 = b.replace(/[\r\n]/g, "<br>");
    document.getElementById("target").innerHTML = htmldiff.compare(a, b);
  }
};
</script>
<style>
.diffins {
  background-color: #cfc;
  text-decoration: none;
}
.diffdel {
  color: #999;
  background-color: #fec8c8;
}
</style>