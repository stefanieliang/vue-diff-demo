<!-- diff1 -->
<template>
  <div>
    <h2>
      diff：
      <a
        href="https://github.com/kpdecker/jsdiff"
        target="_blank"
      >https://github.com/kpdecker/jsdiff</a>
    </h2>
    <el-row height="100%">
      <el-col :span="12" class="over-scroll">
        <pre id="origin"></pre>
      </el-col>
      <el-col :span="12" class="over-scroll">
        <pre id="display"></pre>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const Diff = require("diff");
import { a, b } from "./data";
export default {
  components: {},

  data() {
    return {};
  },

  computed: {},

  mounted() {
    var color = "",
      span = null;

    var diff = Diff.diffChars(a, b),
      // var diff = Diff.diffWords(a, b),
      fragment = document.createDocumentFragment();

    diff.forEach(function(part) {
      // green for additions, red for deletions
      // grey for common parts
      color = part.added ? "green" : part.removed ? "red" : "grey";
      span = document.createElement("span");
      span.style.color = color;
      span.appendChild(document.createTextNode(part.value));
      fragment.appendChild(span);
    });
    document.getElementById("origin").append(a);
    document.getElementById("display").appendChild(fragment);
  },

  methods: {}
};
</script>
<style  scoped>
#result {
  word-wrap: break-word;
}
.over-scroll {
  width: 50%;
  overflow: scroll;
}
</style>