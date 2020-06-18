 var htmldiff = {
     MODE_CHARACTER: 1,
     MODE_TAG: 2,
     MODE_WHITESPACE: 3,
     ACTION_EQUAL: 1,
     ACTION_DELETE: 2,
     ACTION_INSERT: 3,
     ACTION_NONE: 4,
     ACTION_REPLACE: 5,
     specialCaseOpeningTags: new Array('<strong[\\>\\s]+', '<b[\\>\\s]+', '<i[\\>\\s]+', '<big[\\>\\s]+', '<small[\\>\\s]+', '<u[\\>\\s]+', '<sub[\\>\\s]+', '<sup[\\>\\s]+', '<strike[\\>\\s]+', '<s[\\>\\s]+'),
     specialCaseClosingTags: new Array('</strong>', '</b>', '</i>', '</big>', '</small>', '</u>', '</sub>', '</sup>', '</strike>', '</s>'),
     content: '',
     wordIndices: '',
     oldWords: '',
     newWords: '',
     compare: function (str1, str2) {
         this.content = new Array();
         this.wordIndices = new Array();
         this.oldWords = this.ConvertHtmlToListOfWords(str1);
         this.newWords = this.ConvertHtmlToListOfWords(str2);
         this.wordIndices = this.IndexNewWords(this.newWords);
         var b = this.Operations();
         for (var c = 0; c < b.length; c++) {
             var d = b[c];
             this.PerformOperation(d);
         }
         return this.content.join('');
     },
     Operations: function () {
         var d = 0;
         var j = 0;
         var a = new Array();
         var f = this.MatchingBlocks();
         f.push(this.Match(this.oldWords.length, this.newWords.length, 0));
         for (var i = 0; i < f.length; i++) {
             var g = f[i];
             var b = (d == g.StartInOld);
             var h = (j == g.StartInNew);
             var c = this.ACTION_NONE;
             if (b == false && h == false)
                 c = this.ACTION_REPLACE;
             else {
                 if (b == true && h == false)
                     c = this.ACTION_INSERT;
                 else {
                     if (b == false && h == true)
                         c = this.ACTION_DELETE;
                     else
                         c = this.ACTION_NONE;
                 }
             }
             if (c != this.ACTION_NONE)
                 a.push(this.Operation(c, d, g.StartInOld, j, g.StartInNew));
             if (g.length != 0)
                 a.push(this.Operation(this.ACTION_EQUAL, g.StartInOld, g.EndInOld(), g.StartInNew, g.EndInNew()));
             d = g.EndInOld();
             j = g.EndInNew();
         }
         return a;
     },
     MatchingBlocks: function () {
         var a = new Array();
         this.FindMatchingBlocks(0, this.oldWords.length, 0, this.newWords.length, a);
         return a;
     },
     FindMatchingBlocks: function (c, b, f, e, d) {
         var a = this.FindMatch(c, b, f, e);
         if (a != null) {
             if (c < a.StartInOld && f < a.StartInNew)
                 this.FindMatchingBlocks(c, a.StartInOld, f, a.StartInNew, d);
             d.push(a);
             if (a.EndInOld() < b && a.EndInNew() < e)
                 this.FindMatchingBlocks(a.EndInOld(), b, a.EndInNew(), e, d);
         }
     },
     FindMatch: function (l, e, b, k) {
         var f = l;
         var m = b;
         var n = 0;
         var c = new Array();
         for (var i = l; i < e; i++) {
             var d = new Array();
             var h = this.oldWords[i];
             if (!this.wordIndices[h]) {
                 c = d;
                 continue;
             }
             for (var g = 0; g < this.wordIndices[h].length; g++) {
                 var a = this.wordIndices[h][g];
                 if (a < b) continue;
                 if (a >= k) break;

                 var newMatchLength = (c[a - 1] ? c[a - 1] : 0) + 1;
                 d[a] = newMatchLength;
                 if (newMatchLength > n) {
                     f = i - newMatchLength + 1;
                     m = a - newMatchLength + 1;
                     n = newMatchLength;
                 }
             }
             c = d;
         }
         return n != 0 ? this.Match(f, m, n) : null;
     },
     IndexNewWords: function (d) {
         var b = new Array();
         for (var i = 0; i < d.length; i++) {
             var c = d[i];
             if (b[c])
                 b[c].push(i);
             else
                 b[c] = [i];
         }
         return b;
     },
     ConvertHtmlToListOfWords: function (b) {
         var f = this.MODE_CHARACTER;
         var e = '';
         var d = new Array();
         for (var i = 0; i < b.length; i++) {
             var c = b[i];
             switch (f) {
                 case this.MODE_CHARACTER:
                     if (this.IsStartOfTag(c)) {
                         if (e)
                             d.push(e);
                         e = '<';
                         f = this.MODE_TAG;
                     } else {
                         if (this.IsWhiteSpace(c)) {
                             if (e)
                                 d.push(e);
                             e = c;
                             f = this.MODE_WHITESPACE;
                         } else {
                             console.log(e);
                             if (this.isNaW(e + c)) {
                                 if (e)
                                     d.push(e);
                                 e = c;
                             } else
                                 e = e + c;
                         }
                     }
                     break;
                 case this.MODE_TAG:
                     if (this.IsEndOfTag(c)) {
                         e = e + '>';
                         d.push(e);
                         e = '';
                         if (this.IsWhiteSpace(c))
                             f = this.MODE_WHITESPACE;
                         else
                             f = this.MODE_CHARACTER;
                     } else
                         e = e + c;
                     break;
                 case this.MODE_WHITESPACE:
                     if (this.IsStartOfTag(c)) {
                         if (e)
                             d.push(e);
                         e = '<';
                         f = this.MODE_TAG;
                     } else {
                         if (this.IsWhiteSpace(c))
                             e = e + c;
                         else {
                             if (e)
                                 d.push(e);
                             e = c;
                             f = this.MODE_CHARACTER;
                         }
                     }
                     break;
                 default:
                     break;
             }
         }
         if (e)
             d.push(e);
         return d;
     },
     PerformOperation: function (a) {
         switch (a.Action) {
             case this.ACTION_EQUAL:
                 this.ProcessEqualOperation(a);
                 break;
             case this.ACTION_DELETE:
                 this.ProcessDeleteOperation(a, 'diffdel');
                 break;
             case this.ACTION_INSERT:
                 this.ProcessInsertOperation(a, 'diffins');
                 break;
             case this.ACTION_NONE:
                 break;
             case this.ACTION_REPLACE:
                 this.ProcessReplaceOperation(a);
                 break;
             default:
                 break;
         }
     },
     ProcessReplaceOperation: function (a) {
         this.ProcessDeleteOperation(a, 'diffmod');
         this.ProcessInsertOperation(a, 'diffmod');
     },
     ProcessInsertOperation: function (b, a) {
         var c = this.array_slice(this.newWords, b.StartInNew, b.EndInNew);
         this.InsertTag('ins', a, c);
     },
     ProcessDeleteOperation: function (b, a) {
         var c = this.array_slice(this.oldWords, b.StartInOld, b.EndInOld);
         this.InsertTag('del', a, c);
     },
     ProcessEqualOperation: function (b) {
         var a = this.array_slice(this.newWords, b.StartInNew, b.EndInNew);
         this.content.push(a.join(''));
     },
     preg_match_array: function (b, e) {
         var a = 0;
         for (var i = 0; i < b.length; i++)
             a |= (new RegExp(b[i])).test(e);
         return a;
     },
     InsertTag: function (j, h, f) {
         while (true) {
             if (f.length == 0) break;

             var b = this.ExtractConsecutiveWords(f, false);
             var c = b.items;
             f = b.words;
             var a = '';
             var e = false;
             if (c.length != 0) {
                 var g = this.WrapText(c.join(''), j, h);
                 this.content.push(g);
             } else {
                 if (!!this.preg_match_array(this.specialCaseOpeningTags, f[0])) {
                     a = '<ins class="mod">';
                     if (j == 'del')
                         f.shift();
                 } else {
                     if (this.in_array(f[0], this.specialCaseClosingTags)) {
                         a = '</ins>';
                         e = true;
                         if (j == 'del')
                             f.shift();
                     }
                 }
             }
             if (f.length == 0 && a.length == 0) break;
             if (e) {
                 var d = this.ExtractConsecutiveWords(f, true);
                 f = d.words;
                 this.content.push(a + d.items.join(''));
             } else {
                 var d = this.ExtractConsecutiveWords(f, true);
                 f = d.words;
                 this.content.push(d.items.join('') + a);
             }
         }
     },
     in_array: function (b, c) {
         for (var i = 0; i < c.length; i++) {
             if (c[i] == b)
                 return true;
         }
         return false;
     },
     WrapText: function (c, b, a) {
         return '<' + b + ' class="' + a + '">' + c + '</' + b + '>';
     },
     ExtractConsecutiveWords: function (d, f) {
         var e = false;
         for (var b = 0; b < d.length; b++) {
             var c = d[b];
             if (f ? !this.IsTag(c) : !!this.IsTag(c)) {
                 e = b;
                 break;
             }
         }
         if (e !== false) {
             var a = this.array_slice(d, 0, e);
             if (e > 0)
                 d.splice(0, e);
             return {
                 items: a,
                 words: d
             };
         } else {
             a = d;
             d = new Array();
             return {
                 items: a,
                 words: d
             };
         }
     },
     IsTag: function (b) {
         var a = this.IsOpeningTag(b) || this.IsClosingTag(b);
         return a;
     },
     IsOpeningTag: function (a) {
         return /^\s*<[^>]+>\s*$/.test(a);
     },
     IsClosingTag: function (a) {
         return /^\s*<\/[^>]+>\s*$/.test(a);
     },
     IsStartOfTag: function (a) {
         return a == "<";
     },
     IsEndOfTag: function (a) {
         return a == ">";
     },
     IsWhiteSpace: function (a) {
         return /\s/.test(a);
     },
     isNaW: function (b) {
         return /[^\x00-\x80]/.test(b);
     },
     array_slice: function (a, b, c, d) {
         return a.slice(b, c);
     },
     Match: function (b, d, a) {
         var c = {
             StartInOld: b,
             StartInNew: d,
             Size: a
         };
         c.EndInOld = function () {
             return b + a;
         };
         c.EndInNew = function () {
             return d + a;
         };
         return c;
     },
     Operation: function (c, b, a, f, d) {
         var e = {
             Action: c,
             StartInOld: b,
             EndInOld: a,
             StartInNew: f,
             EndInNew: d
         };
         return e;
     }
 };
 export default htmldiff