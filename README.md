# vue-diff-demo

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### 0.需求场景

​	基于web浏览器，实现一个html/代码/文章等两个版本间的对比工具。

### 1.基础js库

#### [jsdiff](https://github.com/kpdecker/jsdiff)

##### 安装

```
npm install diff --save
```

##### 使用

- Basic example in Node

```javascript
require('colors');
const Diff = require('diff');

const one = 'beep boop';
const other = 'beep boob blah';

const diff = Diff.diffChars(one, other);

diff.forEach((part) => {
  // green for additions, red for deletions
  // grey for common parts
  const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
  process.stderr.write(part.value[color]);
});

console.log();
```

- Basic example in a web page

```javascript
<pre id="display"></pre>
<script src="diff.js"></script>
<script>
const one = 'beep boop',
    other = 'beep boob blah',
    color = '',
    span = null;

const diff = Diff.diffChars(one, other),
    display = document.getElementById('display'),
    fragment = document.createDocumentFragment();

diff.forEach((part) => {
  // green for additions, red for deletions
  // grey for common parts
  const color = part.added ? 'green' :
    part.removed ? 'red' : 'grey';
  span = document.createElement('span');
  span.style.color = color;
  span.appendChild(document.createTextNode(part.value));
  fragment.appendChild(span);
});

display.appendChild(fragment);
</script>
```

##### **[Full online demo](http://kpdecker.github.com/jsdiff)**

### 2.基于vue封装一个组件

#### **[ vue-diff-view](https://github.com/codeDebugTest/vue-diff-view)**

##### 组件`CodeDiffChunk`

```html
<template>
    <div class="diff-chunk">
        <div v-if="chunk.collapse"
                class="collapse-tip"
                @click.once="$emit('expand', chunk.leftIndex, chunk.rightIndex)">
            ... 隐藏 {{chunk.lineCount}} 行，点击展开 ...
        </div>
        <div v-else class="line"
            v-for="(line, index) in chunk.lines"
            :key="index">
            <span v-if="chunk.type !== 'blank'"
                :class="chunk.type">{{chunk.startLineNumber + index}}</span>
            <span v-else></span>
            <pre :class="chunk.type">{{line}}</pre>
        </div>
    </div>
</template>

<script>
export default {
    name: 'code-diff-chunk',
    props: {
        chunk: {
            type: Object,
            default: () => {}
        }
    }
};
</script>
```



##### 组件`CodeDiffViewer`

```html
<template>
  <div class="diff-viewer">
    <h3>{{title}}</h3>
    <div class="container" v-if="newContent && oldContent">
      <div class="left">
        <code-chunk
          v-for="(chunk, index) in splitedLeft"
          :key="index"
          :chunk="chunk"
          @expand="expandChunk"
        />
      </div>
      <div class="right">
        <code-chunk
          v-for="(chunk, index) in splitedRight"
          :key="index"
          :chunk="chunk"
          @expand="expandChunk"
        />
      </div>
    </div>
    <div v-else v-for="(chunk, index) in unifiedResult" :key="index">
      <code-chunk :chunk="chunk" :index="index" />
    </div>
  </div>
</template>

```



##### 使用

```html
<template>
  <div>
    <h2>diff2</h2>
    <code-diff-viewer :new-content="newStr" :old-content="oldStr" title="修改" />
  </div>
</template>

<script>
import CodeDiffViewer from "./components/CodeDiffViewer";

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
```



### 3.基于vue实现一个Diff库

#### [vue-code-diff](https://www.npmjs.com/package/vue-code-diff)

##### 安装

```
yarn add vue-code-diff
```

##### 使用

```vue
<template>
  <div>
    <code-diff :old-string="oldStr" :new-string="newStr" :context="10" />
  </div>
</template>

import CodeDiff from 'vue-code-diff'
export default {
  components: {CodeDiff},
  data(){
    return {
      oldStr: 'old code',
      newStr: 'new code'
    }
  }
}
```

##### 参数说明

| 参数         | 说明                         | 类型   | 可选值                     | 默认值       |
| ------------ | ---------------------------- | ------ | -------------------------- | ------------ |
| old-string   | 陈旧的字符串                 | string | —                          | —            |
| new-string   | 新的字符串                   | string | —                          | —            |
| context      | 不同地方上下间隔多少行不隐藏 | number | —                          | —            |
| outputFormat | 展示的方式                   | string | line-by-line，side-by-side | line-by-line |

##### 源码实现

https://github.com/ddchef/vue-code-diff

### 4.项目地址

https://github.com/stefanieliang/vue-diff-demo

