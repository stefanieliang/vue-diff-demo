<!-- diff3 -->
<template>
  <div>
    <h2>diff3</h2>
    <el-form>
      <el-row>
        <el-col :span="8">
          <el-form-item label="展示效果：">
            <el-switch v-model="fotmat" active-text="line-by-line" inactive-text="side-by-side"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="差异化范围：">
            <el-input-number v-model="context" placeholder></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <vue-code-diff
      :old-string="oldStr"
      :new-string="newStr"
      :context="context"
      :outputFormat="outputFormat"
    />
  </div>
</template>
 
<script>
import vueCodeDiff from "vue-code-diff";
import { a, b } from "./data";
export default {
  components: { vueCodeDiff },
  data() {
    return {
      fotmat: "line-by-line",
      context: 10,
      oldStr: a,
      newStr: b
    };
  },
  computed: {
    outputFormat() {
      return this.fotmat ? "line-by-line" : "side-by-side";
    }
  }
};
</script>
<style lang='less' scoped>
</style>