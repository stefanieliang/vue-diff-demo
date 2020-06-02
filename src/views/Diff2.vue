<!-- diff2 -->
<template>
  <div>
    <h2>diff2</h2>
    <code-diff-viewer :new-content="newStr" :old-content="oldStr" title="修改" />
  </div>
</template>

<script>
import CodeDiffViewer from "../components/CodeDiffViewer";

import { a, b } from "./data";
export default {
  components: {
    CodeDiffViewer
  },
  data() {
    return { oldStr: a, newStr: b };
  }
};
</script>
<style lang='less' scoped>
</style>