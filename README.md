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

### 一、diff简介

diff是Unix系统的一个很重要的工具程序。

它用来比较两个文本文件的差异，是代码版本管理的基石之一。你在命令行下，输入：

> $ diff <变动前的文件> <变动后的文件>

diff就会告诉你，这两个文件有何差异。它的显示结果不太好懂，下面我就来说明，如何读懂diff。

![img](http://www.ruanyifeng.com/blogimg/asset/201208/bg2012082901.png)

#### 1. diff的三种格式

由于历史原因，diff有三种格式：

>   * 正常格式（normal diff）
>
>   * 上下文格式（context diff）
>
>   * 合并格式（unified diff）

#### 2. 示例文件

为了便于讲解，先新建两个示例文件。

第一个文件叫做f1，内容是每行一个a，一共7行。

```
　　a
　　a
　　a
　　a
　　a
　　a
　　a
```

第二个文件叫做f2，修改f1而成，第4行变成b，其他不变。

```
　　a
　　a
　　a
　　b
　　a
　　a
　　a
```



#### 3. 正常格式的diff

现在对f1和f2进行比较：

> $ diff f1 f2

这时，diff就会显示正常格式的结果：

```
　	4c4
     < a
     ---
     > b
```

#### 4. 上下文格式的diff

上个世纪80年代初，加州大学伯克利分校推出BSD版本的Unix时，觉得diff的显示结果太简单，最好加入上下文，便于了解发生的变动。因此，推出了上下文格式的diff。

它的使用方法是加入c参数（代表context）。

> $ diff -c f1 f2

显示结果如下：

```
　　*** f1 2012-08-29 16:45:41.000000000 +0800
　　--- f2 2012-08-29 16:45:51.000000000 +0800
　　***************
　　*** 1,7 ****
　　 a
　　 a
　　 a
　　!a
　　 a
　　 a
　　 a
　　--- 1,7 ----
　　 a
　　 a
　　 a
　　!b
　　 a
　　 a
　　 a
```

这个结果分成四个部分。

#### 5. 合并格式的diff

如果两个文件相似度很高，那么上下文格式的diff，将显示大量重复的内容，很浪费空间。1990年，GNU diff率先推出了"合并格式"的diff，将f1和f2的上下文合并在一起显示。

它的使用方法是加入u参数（代表unified）。

> $ diff -u f1 f2

显示结果如下：

```
　　--- f1 2012-08-29 16:45:41.000000000 +0800
　　+++ f2 2012-08-29 16:45:51.000000000 +0800
　　@@ -1,7 +1,7 @@
　　 a
　　 a
　　 a
　　-a
　　+b
　　 a
　　 a
　　 a
```



#### 6. git格式的diff

版本管理系统git，使用的是合并格式diff的变体。

> $ git diff

显示结果如下：

```
　　diff --git a/f1 b/f1
　　index 6f8a38c..449b072 100644
　　--- a/f1
　　+++ b/f1
　　@@ -1,7 +1,7 @@
　　 a
　　 a
　　 a
　　-a
　　+b
　　 a
　　 a
　　 a
```

参考：[读懂diff](http://www.ruanyifeng.com/blog/2012/08/how_to_read_diff.html)

### 二、一个很牛的库

#### [diff2html](https://github.com/rtfpessoa/diff2html)

##### 安装

```
npm install --save diff2html
```

##### Diff2Html Browser Example

Import the stylesheet and the library code

```html
<!-- CSS -->
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css" />

<!-- Javascripts -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/diff2html/bundles/js/diff2html.min.js"></script>
```

It will now be available as a global variable named `Diff2Html`.

```javascript
document.addEventListener('DOMContentLoaded', () => {
  var diffHtml = global.Diff2Html.html('<Unified Diff String>', {
    drawFileList: true,
    matching: 'lines',
    outputFormat: 'side-by-side',
  });
  document.getElementById('destination-elem-id').innerHTML = diffHtml;
});
```

##### Diff2Html Vue.js Example

```vue
<template>
  <div v-html="prettyHtml" />
</template>

<script>
import * as Diff2Html from 'diff2html';
import 'diff2html/bundles/css/diff2html.min.css';

export default {
  data() {
    return {
      diffs:
        '--- a/server/vendor/golang.org/x/sys/unix/zsyscall_linux_mipsle.go\n+++ b/server/vendor/golang.org/x/sys/unix/zsyscall_linux_mipsle.go\n@@ -1035,6 +1035,17 @@ func Prctl(option int, arg2 uintptr, arg3 uintptr, arg4 uintptr, arg5 uintptr) (\n \n // THIS FILE IS GENERATED BY THE COMMAND AT THE TOP; DO NOT EDIT\n \n+func Pselect(nfd int, r *FdSet, w *FdSet, e *FdSet, timeout *Timespec, sigmask *Sigset_t) (n int, err error) {\n+\tr0, _, e1 := Syscall6(SYS_PSELECT6, uintptr(nfd), uintptr(unsafe.Pointer(r)), uintptr(unsafe.Pointer(w)), uintptr(unsafe.Pointer(e)), uintptr(unsafe.Pointer(timeout)), uintptr(unsafe.Pointer(sigmask)))\n+\tn = int(r0)\n+\tif e1 != 0 {\n+\t\terr = errnoErr(e1)\n+\t}\n+\treturn\n+}\n+\n+// THIS FILE IS GENERATED BY THE COMMAND AT THE TOP; DO NOT EDIT\n+\n func read(fd int, p []byte) (n int, err error) {\n \tvar _p0 unsafe.Pointer\n \tif len(p) > 0 {\n',
    };
  },
  computed: {
    prettyHtml() {
      return Diff2Html.html(this.diffs, {
        drawFileList: true,
        matching: 'lines',
        outputFormat: 'side-by-side',
      });
    },
  },
};
</script>
```

##### Diff2HtmlUI Browser

Mandatory HTML resource imports

```html
<!-- CSS -->
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css" />

<!-- Javascripts -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/diff2html/bundles/js/diff2html-ui.min.js"></script>
```

Init

```javascript
const targetElement = document.getElementById('destination-elem-id');
const configuration = { drawFileList: true, matching: 'lines' };

const diff2htmlUi = new Diff2HtmlUI(targetElement, diffString, configuration);
// or
const diff2htmlUi = new Diff2HtmlUI(targetElement, diffJson, configuration);
```

Draw

```javascript
diff2htmlUi.draw();
```

Syntax Highlight

```html
<!-- Stylesheet -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/styles/github.min.css" />
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css" />

<!-- Javascripts -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/diff2html/bundles/js/diff2html-ui.min.js"></script>
```

> Pass the option `highlight` with value true or invoke `diff2htmlUi.highlightCode()` after `diff2htmlUi.draw()`.

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const diffString = `diff --git a/sample.js b/sample.js
index 0000001..0ddf2ba
--- a/sample.js
+++ b/sample.js
@@ -1 +1 @@
-console.log("Hello World!")
+console.log("Hello from Diff2Html!")`;
  const targetElement = document.getElementById('myDiffElement');
  const configuration = { inputFormat: 'json', drawFileList: true, matching: 'lines', highlight: true };
  const diff2htmlUi = new Diff2HtmlUI(targetElement, diffString, configuration);
  diff2htmlUi.draw();
  diff2htmlUi.highlightCode();
});
```

### 三、其他

- 在线diff工具：[diffchecker](https://www.diffchecker.com/)

强大的在线对比工具，可对比的格式有：Text，Images，Pdf，Folders等。

- 代码高亮：[highlight.js](https://github.com/highlightjs/highlight.js)
