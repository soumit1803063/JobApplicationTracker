# অধ্যায় ২: React-এর জন্য দরকারি JavaScript

React আসলে JavaScript-ই। তাই React code পড়তে JavaScript-এর কিছু জিনিস খুব ভালো করে জানতে হবে। এই অধ্যায়ে শুধু সেগুলোই আছে যেগুলো আমাদের project-এ ব্যবহার হয়েছে।

> **পড়ার আগে একটা সতর্কবার্তা।** এই অধ্যায়ের কিছু উদাহরণ project-এর আসল code থেকে নেওয়া, তাই সেখানে এমন কিছু জিনিস চোখে পড়বে যেগুলো এখনো শেখোনি:
>
> - **JSX**: JavaScript-এর ভেতরে HTML-এর মতো লেখা, যেমন `<p>{error}</p>`। এটা অধ্যায় ৬-এ শিখব। এখন শুধু এটুকু জানো: JSX-এর ভেতরে `{ }` মানে "এখানে একটা JavaScript value বসাও"।
> - **TypeScript type**: যেমন `: number`, `: string`, `readonly`, `<T>`। এগুলো অধ্যায় ৪-এ শিখব। এখন এগুলো চোখ বুলিয়ে পার হয়ে যাও।
> - **React/Redux-এর নাম**: যেমন `useAppSelector`, `dispatch`, `state`, `useState`। এগুলো পরের অধ্যায়গুলোতে আসবে।
>
> এখন প্রতিটা উদাহরণের শুধু **JavaScript অংশটা** পড়ো, বাকিটা নিয়ে চিন্তা কোরো না।

---

## ২.১ Code কোথায় চালাবে: `console.log`

এই অধ্যায়ের ছোট উদাহরণগুলো তুমি নিজে চালিয়ে দেখতে পারো, কিছু install না করেই:

1. Chrome খোলো।
2. Keyboard-এ **F12** চাপো (Mac-এ Cmd + Option + J)। পাশে বা নিচে একটা panel খুলবে, এর নাম **DevTools**।
3. উপরের tab থেকে **Console** বেছে নাও।
4. সেখানে code লিখে Enter চাপো।

কোন উদাহরণ Console-এ চালানো যাবে, সেটা বোঝার সহজ নিয়ম: যে ছোট উদাহরণ নিজেই সম্পূর্ণ, মানে যেখানে ব্যবহার হওয়া সব variable ওই উদাহরণের ভেতরেই বানানো (যেমন `const nums = [1, 2, 3];` তারপর `nums.map((n) => n * 2)`), সেটা Console-এ চালিয়ে দেখো। আর যেখানে project-এর নাম আছে (`values`, `application`, `state`...), সেগুলো শুধু পড়ার জন্য: Console-এ চালালে error আসবে, কারণ ওই variable-গুলো সেখানে নেই। একইভাবে যেখানে TypeScript type (`: string`) বা `export` আছে, সেগুলোও Console-এ চলবে না, কারণ browser-এর Console type বা `export` বোঝে না।

**`console.log(...)`** দিয়ে কোনো কিছু Console-এ print করা হয়, মানে দেখানো হয়:

```js
console.log('Hello');
console.log(2 + 3);
```

Console-এ প্রথমে দেখাবে `Hello`, তারপর `5`। কোনো কিছুর value কী হলো দেখতে চাইলে সেটাকে `console.log`-এর ভেতরে দিয়ে দাও।

---

## ২.২ Variable: `const` আর `let`

**Variable** হলো একটা নাম দেওয়া বাক্স, যেখানে একটা **value** রাখা হয়। Value মানে যেকোনো data, যেমন একটা লেখা বা একটা number।

```js
const appName = 'Job Tracker';
let count = 0;
count = count + 1;
console.log(count);
```

- প্রথম লাইনে `appName` নামের variable-এ `'Job Tracker'` লেখাটা রাখা হলো।
- এখানে `=` মানে "সমান" না। `=` মানে **assign**: ডান পাশের value-টা বাম পাশের variable-এ রাখো।
- তৃতীয় লাইন `count = count + 1` পড়তে হয় ডান থেকে: "`count`-এর এখনকার value (`0`) নাও, তার সাথে 1 যোগ করো, result আবার `count`-এ রাখো"। এরপর `count`-এর value `1`।
- তাই Console-এ দেখাবে `1`।

| Keyword | পরে নতুন value assign করা যায়? | কখন ব্যবহার করবে |
|---|---|---|
| `const` | না | **প্রায় সবসময়** |
| `let` | হ্যাঁ | যখন সত্যিই পরে value বদলাতে হবে |
| `var` | হ্যাঁ | **কখনো না** (পুরনো, এর scope-এর নিয়ম গোলমেলে; ২.৬-এ দেখবে) |

আমাদের project-এ প্রায় সব জায়গায় `const` আছে। `let` আছে শুধু `frontend/src/shared/api.ts`-এ। নিচের snippet-এ `: Response` হলো TypeScript type (অধ্যায় ৪), আর `try`, `await`, `fetch` শিখব ২.১৩ আর অধ্যায় ৩-এ। এখন শুধু খেয়াল করো `response` variable-টা কীভাবে তৈরি হলো (সংক্ষেপে দেখানো হলো):

```ts
let response: Response;
try
{
    response = await fetch(API_BASE_URL + url, { method, headers, body });
}
```

(এখানে `catch` অংশ বাদ রাখা হয়েছে)

প্রথম লাইনে `response` শুধু **declare** করা হয়েছে, মানে বাক্সটা বানানো হয়েছে কিন্তু ভেতরে কিছু রাখা হয়নি। পরে `try`-এর ভেতরে তাতে value **assign** করা হয়েছে। Declare করে পরে value assign করতে হলে `let` লাগে, কারণ `const`-এ তৈরির সময়ই value দিতে হয়।

**মনে রাখো:** `const` object-এর **ভেতরের জিনিস** বদলাতে বাধা দেয় না (object কী, সেটা ২.৭-এ দেখবে; এখন শুধু জানো `{ }`-এর ভেতরে কিছু তথ্য রাখা থাকে)। `const` বাধা দেয় শুধু variable-টাতে নতুন value assign করতে:

```js
const user = { name: 'Rahim' };
user.name = 'Karim';
user = {};
```

দ্বিতীয় লাইন ঠিকঠাক চলবে, আর `user.name` হয়ে যাবে `'Karim'`, কারণ object-এর ভেতরটা বদলানো যায়। তৃতীয় লাইনে error হবে (`TypeError: Assignment to constant variable.`), কারণ `const` variable-এ নতুন value assign করা যায় না।

---

## ২.৩ Data-র Type

| Type | উদাহরণ | মানে |
|---|---|---|
| `string` | `'hello'`, `"hello"` | Text। Single বা double quote-এর ভেতরে লেখা হয় |
| `number` | `42`, `3.14` | সংখ্যা |
| `boolean` | `true`, `false` | হ্যাঁ/না |
| `null` | `null` | ইচ্ছা করে "কিছু নেই" |
| `undefined` | `undefined` | এখনো কোনো value assign করা হয়নি |
| `object` | `{ name: 'Rahim', age: 25 }` | অনেক তথ্য একসাথে (২.৭) |
| `array` | `[10, 20, 50]` | List (২.৮) |

`''` (দুটো quote, মাঝে কিছু নেই) হলো **empty string**, মানে এমন string যার ভেতরে কোনো অক্ষর নেই।

কোনো value কোন ধরনের, সেটা জানতে **`typeof`** লেখা হয়। যেমন `typeof 'hello'` দেয় `'string'`, আর `typeof 42` দেয় `'number'`। একটা অদ্ভুত ব্যাপার আছে: `typeof [10, 20]` দেয় `'object'`, `'array'` না। কারণ JavaScript-এ array আসলে এক বিশেষ ধরনের object। আরেকটা পুরনো ভুল হলো `typeof null`-ও দেয় `'object'`।

---

## ২.৪ Operator আর `if`/`else`

**Operator** হলো এমন চিহ্ন যেটা এক বা একাধিক value নিয়ে নতুন একটা value বানায়। যেমন `+`।

### Arithmetic আর comparison

| Operator | কাজ | উদাহরণ | Result |
|---|---|---|---|
| `+` `-` `*` `/` | যোগ, বিয়োগ, গুণ, ভাগ | `10 / 2` | `5` |
| `===` | দুটো value কি একই? | `5 === 5` | `true` |
| `!==` | দুটো value কি আলাদা? | `5 !== 3` | `true` |
| `>` `<` | বড়, ছোট | `15 > 10` | `true` |
| `>=` `<=` | বড় বা সমান, ছোট বা সমান | `10 <= 10` | `true` |

খেয়াল করো: একটা `=` মানে assign (২.২), আর তিনটা `===` মানে তুলনা। দুটো গুলিয়ে ফেলা খুব সাধারণ ভুল।

### `==` বনাম `===`

JavaScript-এ দুই রকম তুলনা আছে:

- **`==`** তুলনার আগে দুই পাশের value-কে একই type-এ convert করে নেয়। তাই `'5' == 5` হয় `true`, যদিও একটা string আর একটা number।
- **`===`** type-ও মেলায়, কিছু convert করে না। তাই `'5' === 5` হয় `false`।

`==`-এর এই নিজে নিজে convert করা অনেক অপ্রত্যাশিত bug তৈরি করে। আমাদের project-এ সবসময় `===` আর `!==` ব্যবহার করা হয়েছে, তুমিও তাই করবে।

### Logical operator: `!`, `&&`, `||`

| Operator | মানে | উদাহরণ | Result |
|---|---|---|---|
| `!` | উল্টে দাও | `!true` | `false` |
| `&&` | দুটোই সত্য? (AND) | `true && false` | `false` |
| `\|\|` | যেকোনো একটা সত্য? (OR) | `true \|\| false` | `true` |

### `if` / `else`

**`if`** দিয়ে বলা হয় "condition সত্য হলে এই কাজটা করো, না হলে (`else`) ওই কাজটা করো":

```js
const age = 20;
if (age >= 18)
{
    console.log('Adult');
}
else
{
    console.log('Child');
}
```

`age >= 18` সত্য, তাই Console-এ দেখাবে `Adult`। `age`-এর value `10` হলে দেখাত `Child`। `( )`-এর ভেতরে condition, আর `{ }`-এর ভেতরে কাজ।

### `NaN`

**`NaN`** মানে "Not a Number"। কোনো হিসাব থেকে অর্থবহ number না এলে এটা আসে। যেমন `Number('hello')` দেয় `NaN`, কারণ 'hello' লেখাটাকে number-এ convert করা যায় না।

### Truthy আর Falsy

`if`-এর `( )`-এ শুধু `true`/`false` না, যেকোনো value দেওয়া যায়। JavaScript তখন value-টাকে true বা false হিসেবে ধরে নেয়:

- **Falsy** (false-এর মতো আচরণ করে): `false`, `0`, `''` (empty string), `null`, `undefined`, `NaN`
- **বাকি সব truthy**, যেমন `'hello'`, `42`, `[]`, `{}`।

Project থেকে একটা উদাহরণ, `frontend/src/features/applications/applications.utils.ts`-এর `validateForm` function-এর ভেতর থেকে:

```js
if (!values.jobPost.trim())
{
    errors.jobPost = 'Job post is required';
}
```

`errors` হলো form-এর error message রাখার একটা object। `values.jobPost` হলো form-এ user-এর লেখা job post-এর নাম। `.trim()` লেখার আগে-পিছের ফাঁকা জায়গা কেটে দেয়, যেমন `'  abc  '.trim()` দেয় `'abc'`। User কিছু না লিখলে বা শুধু space দিলে `trim()` দেয় `''`, যেটা falsy। `!''` হয় `true`, তাই `if`-এর ভেতরের লাইন চলে আর error message সেট হয়। User `'Backend Engineer'` লিখলে `!'Backend Engineer'` হয় `false`, তাই কোনো error সেট হয় না।

---

## ২.৫ Function

**Function** হলো নাম দেওয়া একটা কাজ, যেটা বারবার ব্যবহার করা যায়। একটা সহজ উদাহরণ দিয়ে শুরু করি:

```js
function add(a, b)
{
    return a + b;
}

console.log(add(2, 3));
console.log(add(10, 20));
```

Console-এ দেখাবে `5`, তারপর `30`।

- `function add(a, b)` দিয়ে `add` নামের function বানানো হলো।
- **Parameter** (`a`, `b`) হলো function-এর input। `add(2, 3)` লিখলে `a` হয় `2`, `b` হয় `3`। এভাবে function চালানোকে বলে function **call** করা।
- **`return`** দিয়ে function result ফেরত দেয়। `return`-এর পরে function-এর বাকি কাজ আর চলে না।

এবার project-এর একটা আসল function, `frontend/src/shared/utils.ts` থেকে (type বাদ দিয়ে দেখানো হলো)। এখানে দুটো নতুন জিনিস দেখবে: `new URL(...)` আর `try`/`catch`। `try`/`catch` ২.১৩-এ বিস্তারিত শিখব। এখন শুধু এটুকু জানো: `new URL(value)` লেখাটাকে একটা web address হিসেবে পড়ার চেষ্টা করে, আর লেখাটা address না হলে error দেয়। `try`-এর ভেতরে error হলে code সোজা `catch`-এ চলে যায়।

```js
function isValidUrl(value)
{
    try
    {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    }
    catch
    {
        return false;
    }
}

console.log(isValidUrl('https://google.com'));
console.log(isValidUrl('hello'));
console.log(isValidUrl('ftp://files.com'));
```

Result:

- `isValidUrl('https://google.com')` দেয় `true`। Address পড়া গেল, আর তার protocol (শুরুর অংশ) হলো `'https:'`।
- `isValidUrl('hello')` দেয় `false`। 'hello' কোনো address না, তাই `new URL` error দিল আর `catch` থেকে `false` ফেরত এলো।
- `isValidUrl('ftp://files.com')` দেয় `false`। Address পড়া গেল, কিন্তু protocol `'ftp:'`, যেটা `'http:'` বা `'https:'` কোনোটাই না।

### Arrow function

Function লেখার আরেকটা ছোট উপায় হলো **arrow function**, `=>` চিহ্ন দিয়ে। `frontend/src/shared/utils.ts`-এর `toDateTimeInputValue` function-এর ভেতরে এমন একটা আছে (type বাদ দিয়ে দেখানো হলো):

```js
const pad = (part) => String(part).padStart(2, '0');
```

এটা হুবহু এর সমান:

```js
function pad(part)
{
    return String(part).padStart(2, '0');
}
```

`String(part)` number-কে string-এ convert করে। `.padStart(2, '0')` string-টা অন্তত 2 অক্ষরের না হলে সামনে `'0'` বসিয়ে 2 অক্ষরের বানায়। তাই:

- `pad(5)` দেয় `'05'`
- `pad(12)` দেয় `'12'` (আগেই 2 অক্ষর, তাই কিছু বসে না)

তারিখ দেখানোর সময় মাস বা ঘণ্টা `05`-এর মতো দুই অঙ্কে দেখাতে এটা লাগে।

**Expression** হলো code-এর এমন একটা টুকরো যেটা হিসাব করলে একটা value পাওয়া যায়। যেমন `2 + 3`, `count > 10`, বা `String(part).padStart(2, '0')`।

- `=>`-এর পরে যদি **একটাই expression** থাকে, তাহলে `return` লিখতে হয় না, expression-এর value নিজে থেকেই ফেরত যায়।
- একাধিক লাইন লাগলে `{ }` দিতে হয়, আর তখন `return` লিখতে হয়।

React-এ arrow function সব জায়গায় আছে। যেমন `frontend/src/features/auth/LoginPage.tsx`-এ (type বাদ দিয়ে দেখানো হলো):

```tsx
onChange={(event) => setEmail(event.target.value)}
```

এখানে একটা arrow function বানানো হয়েছে, যেটা `event` নামের একটা parameter নেয় আর `setEmail(...)` call করে। এর মানে কী, সেটা অধ্যায় ৭-এ দেখবে।

### Function-কে value হিসেবে পাঠানো: callback

JavaScript-এ function-ও একটা value। তাই একটা function-কে অন্য function-এর **parameter হিসেবে দেওয়া** যায়। এভাবে দেওয়া function-কে বলে **callback**, কারণ পরে সেটাকে "ফিরে ডাকা" (call back) হয়।

```js
setTimeout(() => console.log('৩ সেকেন্ড পর'), 3000);
```

`setTimeout` browser-এর নিজের একটা function। এর প্রথম parameter একটা function (এখানে arrow function), আর দ্বিতীয় parameter সময়, **millisecond**-এ (1000 millisecond = 1 সেকেন্ড)। Result: ৩ সেকেন্ড পরে Console-এ দেখাবে `৩ সেকেন্ড পর`।

---

## ২.৬ Scope আর closure

### Scope

**Scope** মানে একটা variable code-এর কোন অংশ থেকে দেখা যায়। `const` আর `let` **block scoped**: যে `{ }`-এর ভেতরে তৈরি, শুধু তার ভেতরেই দেখা যায়।

```js
if (true)
{
    const message = 'ভেতরে';
    console.log(message);
}
console.log(message);
```

প্রথম `console.log` দেখাবে `ভেতরে`। দ্বিতীয়টা error দেবে (`ReferenceError: message is not defined`), কারণ `message` তৈরি হয়েছিল `{ }`-এর ভেতরে, বাইরে থেকে সেটা দেখা যায় না।

পুরনো `var` এই নিয়ম মানে না। `var` **function scoped**: পুরো function-এর যেকোনো জায়গা থেকে দেখা যায়, `{ }`-এর বাইরে থেকেও। উপরের উদাহরণে `const`-এর জায়গায় `var` লিখলে দ্বিতীয় `console.log`-ও `ভেতরে` দেখাত। এই কারণেই `var` থেকে bug হয়।

### Closure

একটা function-এর ভেতরে আরেকটা function বানালে, ভেতরের function বাইরের function-এর variable মনে রাখে, এমনকি বাইরের function শেষ হয়ে যাওয়ার পরেও। একে বলে **closure**।

```js
function makeCounter()
{
    let count = 0;
    return () =>
    {
        count = count + 1;
        return count;
    };
}

const next = makeCounter();
console.log(next());
console.log(next());
```

Console-এ দেখাবে `1`, তারপর `2`।

- `makeCounter()` call করলে `count` তৈরি হয়, আর একটা arrow function ফেরত আসে। সেটা রাখা হলো `next`-এ।
- `makeCounter` শেষ হয়ে গেছে, তবুও `next` তার `count`-কে মনে রেখেছে। প্রতিবার `next()` call করলে সেই একই `count` এক করে বাড়ে।

React-এ closure সব জায়গায় আছে। যেমন একটা component-এর ভেতরে বানানো event handler function সেই component-এর variable ব্যবহার করতে পারে closure-এর কারণেই (অধ্যায় ৭ আর ৮-এ এর উদাহরণ দেখবে)।

---

## ২.৭ Object

**Object** হলো **key-value pair**-এর একটা collection। প্রতিটা pair-এ একটা নাম (**key**) আর তার **value** থাকে:

```js
const application = {
    id: '42',
    jobPost: 'Backend Engineer',
    isApplied: false,
    salaryMin: 50000,
};

console.log(application.jobPost);
console.log(application['jobPost']);
console.log(application.salaryMin);
```

প্রথম দুটো `console.log` দুটোই দেখাবে `Backend Engineer`, আর তৃতীয়টা `50000`। Object-এর ভেতরের value পাওয়ার দুটো উপায়: dot দিয়ে (`application.jobPost`) অথবা `[ ]`-এর ভেতরে key-কে string হিসেবে দিয়ে (`application['jobPost']`)।

Object-এর প্রতিটা key-value pair-কে বলে একটা **property**। যেমন `jobPost` হলো `application`-এর একটা property।

কোনো property-র value যদি একটা function হয়, তাহলে তাকে বলে **method**। Method call করা হয় `( )` দিয়ে। আগে দেখা `'  abc  '.trim()`-এ `trim` হলো string-এর একটা method, আর `console.log`-এ `log` হলো `console` object-এর একটা method।

### Shorthand

Variable-এর নাম আর key একই হলে একবার লিখলেই হয়:

```js
const email = 'a@b.com';
const password = '12345678';

const credentials = { email, password };
```

`credentials` হবে `{ email: 'a@b.com', password: '12345678' }`। অর্থাৎ `{ email, password }` হলো `{ email: email, password: password }`-এর ছোট রূপ। Project-এ এটা আছে `frontend/src/features/auth/LoginPage.tsx`-এর `loginUser({ email, password })`-এ।

---

## ২.৮ Array আর তার method

**Array** হলো একটা list:

```js
const pageSizes = [10, 20, 50];
console.log(pageSizes[0]);
console.log(pageSizes[2]);
console.log(pageSizes.length);
```

Result:

- `pageSizes[0]` দেয় `10`। List-এর প্রতিটা জিনিসের একটা নম্বর থাকে, যাকে বলে **index**, আর গোনা শুরু হয় **0** থেকে।
- `pageSizes[2]` দেয় `50`।
- `pageSizes.length` দেয় `3`। `length` হলো array-এর একটা property (তাই `( )` লাগে না), যেটা বলে list-এ কয়টা জিনিস আছে।

এর বিপরীতে নিচের `map`, `filter`, `find`, `forEach` হলো array-এর **method**, তাই `( )` দিয়ে call করতে হয়। প্রতিটাই একটা callback নেয় (২.৫), আর সেটা list-এর প্রতিটা জিনিসের উপর একবার করে চালায়।

React-এ সবচেয়ে বেশি লাগে `map`, `filter` আর `find`। তিনটাই **নতুন array বা value বানায়, আসল array বদলায় না।**

### `map`: প্রতিটা জিনিসকে অন্য কিছুতে transform করা

```js
const doubled = [1, 2, 3].map((n) => n * 2);
```

`doubled` হবে `[2, 4, 6]`। Callback প্রতিটা number (`n`) নিয়ে তার দ্বিগুণ ফেরত দিল, আর `map` সেগুলো দিয়ে নতুন array বানাল। আসল `[1, 2, 3]` যেমন ছিল তেমনই থাকল।

React-এ list দেখাতে `map` লাগে। `frontend/src/features/applications/ApplicationFilters.tsx` থেকে (এখানে JSX আছে, অধ্যায় ৬):

```tsx
{PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
```

`PAGE_SIZES` হলো `[10, 20, 50]`। `map` প্রতিটা number থেকে একটা `<option>` বানায়। Result: dropdown-এ তিনটা option দেখায়: 10, 20, 50।

### `filter`: condition মিললে রাখো, না মিললে বাদ দাও

```js
const big = [5, 15, 25].filter((n) => n > 10);
```

`big` হবে `[15, 25]`। Callback যার জন্য `true` দিল, শুধু সেগুলো রাখা হলো। `5 > 10` হলো `false`, তাই `5` বাদ গেল।

Project-এ একটা আবেদন delete করার পর list থেকে সেটা বাদ দিতে `frontend/src/features/applications/applications.slice.ts`-এ এই লাইন আছে:

```ts
state.items = state.items.filter((item) => item.id !== action.payload);
```

`action.payload` হলো delete করা আবেদনের id। `item.id !== action.payload` মানে "এই item-এর id কি delete করা id থেকে আলাদা?" আলাদা হলে `true`, তাই item-টা থাকে। মিলে গেলে `false`, তাই সেটা বাদ যায়। Result: delete করা আবেদনটা ছাড়া বাকি সব নিয়ে নতুন array, আর সেটা `state.items`-এ assign করা হয়।

এখানে `state.items`-এ নতুন value assign করা দেখে মনে হতে পারে আসল data বদলানো হচ্ছে। Redux Toolkit-এর ভেতরে এভাবে লেখা নিরাপদ, কারণ সে পেছনে নিজেই নতুন copy বানিয়ে নেয়। এটা অধ্যায় ১০-এ বুঝবে। এখন শুধু `filter`-এর কাজটা খেয়াল করো।

### `find`: condition মেলে এমন প্রথম জিনিস

```js
const first = [5, 15, 25].find((n) => n > 10);
const none = [5, 15, 25].find((n) => n > 100);
```

`first` হবে `15` (condition মেলা প্রথম জিনিস; `25`-ও মেলে, কিন্তু `find` প্রথমটা পেয়েই থেমে যায়)। `none` হবে `undefined`, কারণ কোনোটাই 100-এর বেশি না।

### `forEach`: প্রতিটার উপর শুধু একটা কাজ চালাও

```js
[10, 20, 50].forEach((size) => console.log(size));
```

Console-এ পরপর দেখাবে `10`, `20`, `50`। `forEach` কোনো নতুন array ফেরত দেয় না (ফেরত দেয় `undefined`)। শুধু প্রতিটা জিনিসের উপর কাজ চালাতে চাইলে এটা ব্যবহার হয়। নতুন array দরকার হলে `map`।

---

## ২.৯ Destructuring: object বা array থেকে value বের করা

### Object destructuring

```js
const user = { name: 'Rahim', email: 'r@x.com' };

const { name, email } = user;
```

এরপর `name`-এর value `'Rahim'`, আর `email`-এর value `'r@x.com'`। এটা এই দুই লাইনের সমান:

```js
const name = user.name;
const email = user.email;
```

`{ }`-এর ভেতরে যে নাম লেখা, object থেকে ঠিক সেই key-র value বের করে একই নামের variable-এ রাখা হয়।

React-এ এটা সব জায়গায় আছে। `frontend/src/features/applications/ApplicationsPage.tsx` থেকে (`useAppSelector` অধ্যায় ১০-এ শিখব; এখন শুধু জানো এটা একটা object ফেরত দেয়):

```ts
const { filters, items, meta, listStatus, listError } = useAppSelector((state) => state.applications);
```

এক লাইনেই object থেকে পাঁচটা value বের করে পাঁচটা variable-এ রাখা হলো।

### Array destructuring

Array থেকেও একইভাবে value বের করা যায়, তবে `[ ]` দিয়ে। এখানে নাম না, **অবস্থান** (index) দেখে value বসে:

```js
const [first, second] = [10, 20];
```

`first` হবে `10`, `second` হবে `20`। প্রথম নাম পায় প্রথম value, দ্বিতীয় নাম পায় দ্বিতীয় value। নামগুলো তুমি যা খুশি দিতে পারো।

React-এর `useState` ঠিক এটাই ব্যবহার করে। `frontend/src/features/auth/LoginPage.tsx` থেকে:

```ts
const [email, setEmail] = useState('');
```

`useState` দুটো জিনিসের একটা array ফেরত দেয়, আর array destructuring দিয়ে সেগুলো `email` আর `setEmail` নামে রাখা হয়েছে (অধ্যায় ৭)।

### Default value

```ts
const { id = '' } = useParams();
```

এটা `frontend/src/features/applications/ApplicationDetailsPage.tsx` থেকে (type বাদ দিয়ে দেখানো হলো)। `useParams()` URL থেকে value-গুলো একটা object-এ দেয় (অধ্যায় ৯)। Object-এ `id` থাকলে সেটাই আসে, যেমন `'42'`। না থাকলে (`undefined` হলে) `id`-এর value হবে `''`। `= ''` অংশটাকে বলে **default value**।

### Function parameter-এ destructuring

`frontend/src/features/applications/StatusBadge.tsx` থেকে (type বাদ দিয়ে, আর ভেতরের JSX-এর বদলে সাধারণ string দিয়ে সহজ করে দেখানো হলো):

```tsx
function StatusBadge({ isApplied })
{
    return isApplied ? 'Applied' : 'Not applied';
}

StatusBadge({ isApplied: true });
```

Function-টা একটা object পায়, আর parameter-এর জায়গাতেই সেটার ভেতর থেকে `isApplied` বের করে নেয়। শেষ লাইনের call `'Applied'` ফেরত দেবে (`? :` চিহ্নের মানে ২.১১-এ দেখবে)। আসল file-এ লেখার জায়গায় JSX দিয়ে রঙিন badge ফেরত দেওয়া হয়। React component-এ props এভাবেই নেওয়া হয় (অধ্যায় ৬)।

---

## ২.১০ Template literal: string-এর ভেতর value বসানো

Backtick (`` ` ``) দিয়ে string লিখলে তার ভেতরে `${ }` দিয়ে যেকোনো JavaScript value বসানো যায়। এমন string-কে বলে **template literal**:

```js
const page = 3;
const text = `Page ${page}`;
const next = `Next: ${page + 1}`;
```

`text` হবে `'Page 3'`, আর `next` হবে `'Next: 4'`। `${ }`-এর ভেতরের expression হিসাব হয়ে তার value লেখায় বসে যায়।

Project-এ `frontend/src/shared/api.ts`-এ:

```ts
headers.Authorization = `Bearer ${token}`;
```

`token`-এর value `'abc123'` হলে `headers.Authorization` হবে `'Bearer abc123'` (অধ্যায় ১-এর request header মনে করো)।

---

## ২.১১ Condition লেখার ছোট উপায়

### Ternary: `condition ? সত্য হলে : মিথ্যা হলে`

```js
const isApplied = true;
const label = isApplied ? 'Applied' : 'Not applied';
```

`label` হবে `'Applied'`। `isApplied` `false` হলে হতো `'Not applied'`। এটা ছোট একটা `if`/`else`, তবে এটা একটা expression, তাই এর result সরাসরি variable-এ রাখা যায়।

### `&&`: condition truthy হলেই পরেরটা

২.৪-এ `&&` দেখেছ `true`/`false`-এর সাথে। আসলে `&&` বাম পাশের value falsy হলে সেটাই দেয়, আর truthy হলে ডান পাশের value দেয়। যেমন `'x' && 'y'` দেয় `'y'`, আর `'' && 'y'` দেয় `''`।

React-এ এটা খুব বেশি ব্যবহার হয়। `frontend/src/shared/components/Field.tsx` থেকে (JSX):

```tsx
{error && <p className="text-sm text-red-600">{error}</p>}
```

`error`-এ কোনো message থাকলে (truthy) লাল রঙের `<p>`-এ message-টা দেখায়। `error` না থাকলে কিছুই দেখায় না।

### `?.`: optional chaining, null হলে থেমে যাও

```js
const user = null;
const email = user?.email;
```

`email` হবে `undefined`, কোনো error হবে না। `?.` মানে "বাম পাশের জিনিস `null` বা `undefined` হলে আর ভেতরে ঢুকো না, শুধু `undefined` দাও"। `user` যদি `{ email: 'a@b.com' }` হতো, তাহলে `email` হতো `'a@b.com'`। `?.` ছাড়া `user.email` লিখলে error হতো (`TypeError: Cannot read properties of null`), আর তার পরের code আর চলত না।

### `??`: nullish coalescing, null/undefined হলে fallback value

`frontend/src/features/applications/applications.utils.ts` থেকে (সংক্ষেপে):

```js
application.applyLink ?? ''
```

`applyLink` যদি `null` বা `undefined` হয়, result `''`। না হলে আসল value, যেমন `'https://jobs.com/apply'`। ডান পাশের value-টাকে বলে **fallback value**, মানে আসলটা না থাকলে যেটা দিয়ে কাজ চালানো হবে।

`??` আর `||`-এর পার্থক্য: `||` বাম পাশের **যেকোনো falsy** value-তে (`0`, `''` সহ) ডান পাশেরটা নেয়, আর `??` শুধু `null` আর `undefined`-এ। যেমন `0 || 10` দেয় `10`, কিন্তু `0 ?? 10` দেয় `0`।

---

## ২.১২ Spread আর rest (`...`)

### প্রথমে একটা নিয়ম

এই বইয়ে কোনো code block-এর মাঝে যদি শুধু `...` লেখা একটা লাইন দেখো, তার মানে সেখানে কিছু অংশ বাদ রাখা হয়েছে, যাতে code ছোট থাকে। আর নিচে যে spread `...` শিখব, সেটা JavaScript-এর আসল একটা চিহ্ন, যেটা সবসময় কোনো value বা নামের ঠিক আগে বসে (মাঝে কোনো space নেই), যেমন `...filters` বা `...[1, 2]`। কোনটা কোন অর্থে, সেটা context থেকে বোঝা যায়।

### Spread: ছড়িয়ে দেওয়া

**Spread** (`...`) একটা object বা array-এর সব ভেতরের জিনিস "ছড়িয়ে" অন্য জায়গায় বসিয়ে দেয়।

```js
const filters = { search: '', page: 3, limit: 10 };
const next = { ...filters, page: 1 };
```

`next` হবে `{ search: '', page: 1, limit: 10 }`, আর `filters` আগের মতোই `{ search: '', page: 3, limit: 10 }` থাকবে।

`...filters` মানে "filters-এর সব key-value এখানে বসাও"। তারপর `page: 1` আগের `page`-এর উপর লিখে দেয়। **একই key দুবার থাকলে পরে যেটা লেখা, সেটাই থাকে।**

Array-তেও একই কাজ করে: `[...[1, 2], 3]` দেয় `[1, 2, 3]`।

React আর Redux-এ এটা খুব গুরুত্বপূর্ণ, কারণ সেখানে আসল object সরাসরি বদলানো হয় না, বদলাতে হলে নতুন copy বানানো হয় (অধ্যায় ৭)।

### Shallow copy: একটা সাবধানতা

Spread দিয়ে বানানো copy হলো **shallow copy**: শুধু উপরের স্তরের key-গুলো নতুন object-এ copy হয়। কোনো key-র value যদি নিজেই একটা array বা object হয়, তাহলে নতুন copy-তে সেই **একই** array-টা থাকে, তার copy না।

```js
const a = { tags: ['x'] };
const b = { ...a };
b.tags.push('y');
console.log(a.tags);
```

Console-এ দেখাবে `['x', 'y']`! (`push` হলো array-এর শেষে নতুন জিনিস যোগ করার method।) আমরা `b.tags` বদলালাম, কিন্তু `a.tags`-ও বদলে গেল। কারণ `a.tags` আর `b.tags` দুটো আলাদা array না, দুটোই memory-র একই array-কে দেখাচ্ছে। একে বলে দুটো variable-এর **reference** একই। ভেতরের array-ও আলাদা করতে চাইলে সেটাকেও spread করতে হয়: `const b = { ...a, tags: [...a.tags] };`।

### Project থেকে: computed key আর object ফেরত দেওয়া arrow function

`frontend/src/features/applications/ApplicationForm.tsx`-এ form-এর একটা field বদলানোর লাইনটা এমন:

```ts
setValues((previous) => ({ ...previous, [field]: value }));
```

`setValues` অধ্যায় ৭-এ শিখব। এখন শুধু ভেতরের arrow function-টা দেখো। এখানে দুটো নতুন জিনিস আছে।

**১. Computed key `[field]`।** Object-এ key-কে `[ ]`-এর ভেতরে লিখলে key-র নাম হিসেবে variable-টার **value** বসে, variable-এর নাম না।

```js
const field = 'jobPost';
const value = 'Frontend Developer';
const result = { [field]: value };
```

`result` হবে `{ jobPost: 'Frontend Developer' }`। `[ ]` ছাড়া `{ field: value }` লিখলে key-র নাম হতো সত্যি সত্যি `field`। এই কৌশলে একটাই function দিয়ে form-এর যেকোনো field বদলানো যায়: `field`-এ যে নাম আসবে, সেই key-টাই বদলাবে।

**২. `({ ... })`: arrow function থেকে object ফেরত দেওয়া।** Arrow function-এ `=>`-এর পরে সরাসরি `{` লিখলে JavaScript সেটাকে function-এর body-র `{ }` মনে করে, object না। তাই object ফেরত দিতে চাইলে সেটাকে `( )`-এর ভেতরে রাখতে হয়:

```js
const makeUser = (name) => ({ name, isActive: true });
```

`makeUser('Rahim')` দেয় `{ name: 'Rahim', isActive: true }`। `( )` না দিলে function কিছুই ফেরত দিত না (`undefined`)।

সব মিলিয়ে: `previous` হলো form-এর আগের সব value। নতুন object-এ আগের সব value ছড়িয়ে দেওয়া হলো, তারপর শুধু `field` নামের key-টা নতুন `value` দিয়ে বদলানো হলো। যেমন `previous` যদি `{ jobPost: '', cvLink: '' }` হয়, `field` হয় `'jobPost'` আর `value` হয় `'Frontend Developer'`, তাহলে result `{ jobPost: 'Frontend Developer', cvLink: '' }`।

### Rest: বাকিগুলো জড়ো করা

একই `...` চিহ্ন অন্য জায়গায় উল্টো কাজ করে। একে বলে **rest**:

| `...` কোথায় বসেছে | নাম | কাজ |
|---|---|---|
| Function parameter-এ, বা destructuring-এর বাম পাশে | **Rest** | বাকি সব জিনিস **জড়ো** করে একটা object বা array-এ রাখে |
| অন্য যেকোনো জায়গায় (নতুন object/array বানানোর সময়, JSX-এ) | **Spread** | ভেতরের জিনিসগুলো **ছড়িয়ে** দেয় |

একটা ছোট উদাহরণ:

```js
const { page, ...others } = { search: '', page: 3, limit: 10 };
```

`page` হবে `3`, আর `others` হবে `{ search: '', limit: 10 }`। `page` বের করে নেওয়ার পর বাকি সব key `others`-এ জড়ো হলো।

এবার project-এর আসল code, `frontend/src/shared/components/Field.tsx` থেকে (type বাদ দিয়ে দেখানো হলো; এখানে JSX আছে):

```tsx
export function Input({ className = '', ...props })
{
    return <input {...props} className={`${CONTROL_CLASSES} ${className}`} />;
}
```

একই function-এ rest আর spread দুটোই আছে:

- **Parameter-এ `...props` (rest):** "যা আসবে তার থেকে `className` আলাদা করে নাও (না এলে `''`), আর বাকি সব কিছু `props` নামের একটা object-এ জড়ো করো"।
- **`<input {...props} />` (spread):** "`props`-এর সব key-value input-এর attribute হিসেবে বসিয়ে দাও"। যেমন `props` যদি `{ type: 'email', id: 'email' }` হয়, তাহলে input পাবে `type="email"` আর `id="email"`।
- **`className={...}`:** এখানে template literal (২.১০) দিয়ে দুটো string জোড়া হয়েছে। `CONTROL_CLASSES` হলো একই file-এ রাখা Tailwind class-এর একটা লম্বা string (`'w-full rounded-md border ...'`; string-এর ভেতরের `...` মানে বাকি class-গুলো বাদ রাখা হয়েছে), যেটা সব input-কে একই রকম দেখায়। তার পরে একটা space, তারপর বাইরে থেকে আসা `className`। যেমন কেউ `className="mt-2"` দিলে শেষে হবে `'w-full rounded-md border ... mt-2'`। মানে সাধারণ style-ও থাকল, বাড়তি style-ও যোগ হলো।

---

## ২.১৩ Error সামলানো: `try`/`catch`/`throw`

Code চলার সময় কোনো সমস্যা হলে তাকে বলে **error**। নিজে থেকেও error তৈরি করা যায়:

```js
function divide(a, b)
{
    if (b === 0)
    {
        throw new Error('Cannot divide by zero');
    }
    return a / b;
}

try
{
    console.log(divide(10, 2));
    console.log(divide(10, 0));
    console.log('এই লাইন চলবে না');
}
catch (error)
{
    console.log('সমস্যা হয়েছে:', error.message);
}
```

Console-এ দেখাবে `5`, তারপর `সমস্যা হয়েছে: Cannot divide by zero`। তৃতীয় `console.log` কখনো চলবে না।

- **`throw`** দিয়ে error "ছুঁড়ে দেওয়া" হয়। `throw`-এর পরে function-এর বাকি code আর চলে না।
- **`new Error('...')`** একটা error object বানায়, যার `message` property-তে লেখাটা থাকে।
- **`try`**-এর ভেতরে কোথাও error হলে code সাথে সাথে **`catch`**-এ লাফ দেয়। `catch (error)`-এ `error` হলো ছুঁড়ে দেওয়া জিনিসটা।
- `error`-টা ব্যবহার না করলে শুধু `catch` লেখা যায়, `(error)` ছাড়া। ২.৫-এর `isValidUrl`-এ ঠিক এটাই আছে।
- কোনো `catch` না থাকলে error উপরের দিকে, মানে যে function call করেছিল তার দিকে যেতে থাকে। কোথাও ধরা না পড়লে browser সেটা Console-এ লাল রঙে দেখায়, আর ওই কাজের বাকি অংশ থেমে যায়।

---

## ২.১৪ Class

**Class** হলো একই রকম object বানানোর **blueprint** বা template। একবার blueprint বানিয়ে `new` দিয়ে তার থেকে যত খুশি object বানানো যায়। ২.১৩-এর `new Error(...)`-এ `Error` আসলে JavaScript-এর নিজের একটা class।

আমাদের project-এ নিজেদের বানানো class একটাই, `frontend/src/shared/api.ts`-এ (type বাদ দিয়ে দেখানো হলো; আসল file-এ `readonly status: number;` লাইনও আছে, অধ্যায় ৪):

```js
export class ApiError extends Error
{
    constructor(status, message)
    {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

const error = new ApiError(404, 'Application not found');
console.log(error.message);
console.log(error.status);
```

এই code চালালে Console-এ দেখাবে `Application not found`, তারপর `404`। তবে Console-এ চালাতে চাইলে শুরুর `export` শব্দটা বাদ দিয়ে paste করো, কারণ Console `export` বোঝে না। (`export` কী, সেটা ২.১৫-এ।)

- **`extends Error`** মানে `ApiError` হলো `Error`-এর একটা **subclass** (child class)। Child class parent class-এর সব কিছু পায়। তাই `ApiError`-এর `message` আছে, আর আমরা বাড়তি যোগ করেছি `status`।
- **`constructor`** হলো একটা বিশেষ function, যেটা `new ApiError(...)` লেখার সময় নিজে থেকে চলে। `new ApiError(404, '...')`-এর `404` যায় `status`-এ আর লেখাটা যায় `message`-এ।
- **`this`** মানে "যে object-টা এখন বানানো হচ্ছে"। `this.status = status` মানে "নতুন object-এর `status` property-তে parameter-এর value রাখো"।
- **`super(message)`** দিয়ে parent class `Error`-এর constructor call করা হয়, যাতে `message` ঠিকমতো সেট হয়।
- **`this.name = 'ApiError';`** error-এর নাম সেট করে। ফলে Console-এ error দেখালে `ApiError` লেখা আসে।

যেহেতু `ApiError` আসলে একটা `Error`, তাই এটা দিয়েও `throw` করা যায়: `throw new ApiError(404, 'Application not found')`। Server-এর error-কে status code সহ ছুঁড়ে দিতে project-এ ঠিক এটাই করা হয় (অধ্যায় ৩)।

---

## ২.১৫ Module: `import` আর `export`

বড় program অনেক file-এ ভাগ করা থাকে। প্রতিটা file-কে বলে একটা **module**। একটা file-এর জিনিস অন্য file-এ ব্যবহার করতে হলে প্রথম file সেটা **export** করে, আর দ্বিতীয় file **import** করে।

`frontend/src/shared/utils.ts` জিনিসটা **দেয়** (export)। নিচে function-এর ভেতরের অংশ আর type বাদ দিয়ে শুধু প্রথম লাইন দেখানো হলো:

```ts
export function formatDate(value)
```

`frontend/src/features/applications/ApplicationsTable.tsx` জিনিসটা **নেয়** (import):

```ts
import { buildPath, formatDate } from '@/shared/utils';
```

- `{ }`-এর ভেতরে লেখা হয় ঠিক কোন কোন নামের জিনিস নিতে চাও। এখানে দুটো: `buildPath` আর `formatDate`। এভাবে নাম ধরে export আর import করাকে বলে **named export/import**। এই `{ }` object না, শুধু নামের list।
- `from`-এর পরে file-এর path। খেয়াল করো, শেষে `.ts` লেখা নেই। Tool নিজেই `.ts` বা `.tsx` খুঁজে নেয়।
- `@/` মানে `frontend/src/` folder। তাই `'@/shared/utils'` মানে `frontend/src/shared/utils.ts`। এই shortcut কোথায় সেট করা, সেটা অধ্যায় ৫-এ দেখবে।

আরেক রকম import আছে, `frontend/src/features/auth/auth.thunks.ts` থেকে:

```ts
import * as authApi from '@/features/auth/auth.api';
```

এর মানে: "ওই file-এর **সব** export একটা `authApi` object-এ নাও"। তখন ব্যবহার করতে হয় `authApi.login(...)` লিখে, মানে object-এর method-এর মতো।

---

## সারসংক্ষেপ

- `console.log` দিয়ে value দেখা যায়, Chrome-এর F12 → Console-এ ছোট code চালানো যায়।
- `const` ব্যবহার করো, `let` কেবল দরকার হলে, আর `var` কখনো না। `const` আর `let` block scoped।
- `=` হলো assign, `===`/`!==` হলো তুলনা। `==` ব্যবহার কোরো না। `if`-এ falsy value: `false`, `0`, `''`, `null`, `undefined`, `NaN`।
- Function input নেয় (parameter) আর `return` দিয়ে result দেয়। Arrow function (`=>`) ছোট রূপ। অন্য function-কে দেওয়া function হলো callback। ভেতরের function বাইরের variable মনে রাখে, এটাই closure।
- Object হলো key-value pair-এর collection। Property-র value function হলে সেটা method।
- `map`, `filter`, `find` নতুন array বা value দেয়, আসলটা বদলায় না। `forEach` কিছু ফেরত দেয় না।
- Destructuring: object থেকে `const { a } = obj`, array থেকে `const [x, y] = arr`।
- `...` parameter-এ বা destructuring-এর বাম পাশে হলে rest (জড়ো করা), অন্যখানে spread (ছড়ানো)। Spread copy shallow। Computed key `[field]` আর `({ })` দিয়ে object ফেরত দেওয়া মনে রাখো।
- `?.` null থেকে বাঁচায়, `??` null/undefined-এ fallback value দেয়। `try`/`catch`/`throw` দিয়ে error সামলানো হয়। Class হলো object-এর blueprint।
- `import`/`export` দিয়ে code অনেক file-এ ভাগ করা হয়।

## ইন্টারভিউ প্রশ্ন

**প্রশ্ন: `let`, `const`, `var`-এর পার্থক্য কী?**
উত্তর:
- `const`-এ একবার value দেওয়ার পর নতুন value assign করা যায় না। তবে value যদি object হয়, তার ভেতরের property বদলানো যায়।
- `let`-এ পরে নতুন value assign করা যায়।
- `const` আর `let` দুটোই **block scoped**, মানে যে `{ }`-এর ভেতরে তৈরি, তার বাইরে থেকে দেখা যায় না। যেমন `if (true) { const x = 1; }` লেখার পর বাইরে `x` ব্যবহার করলে error হয়।
- `var` **function scoped**: পুরো function-এর ভেতরে যেকোনো জায়গা থেকে দেখা যায়, `{ }`-এর বাইরে থেকেও। উপরের উদাহরণে `var x = 1` লিখলে বাইরে থেকেও `x` পাওয়া যেত।
- `var`-এর আরেকটা অদ্ভুত আচরণ হলো **hoisting**: JavaScript `var` variable-কে function-এর শুরুতে তুলে নিয়ে যায়, তাই declare করার আগেই ব্যবহার করলে error না দিয়ে `undefined` দেয়। যেমন `console.log(y); var y = 5;` চালালে `undefined` দেখায়। একই কাজ `let` দিয়ে করলে error দেয়, যেটা আসলে ভালো, কারণ ভুলটা সাথে সাথে ধরা পড়ে।
- এই কারণে আধুনিক code-এ `var` ব্যবহার করা হয় না।

**প্রশ্ন: `==` আর `===`-এর পার্থক্য কী?**
উত্তর: `==` তুলনার আগে দুই পাশের value-কে একই type-এ convert করে নেয়, তাই `'5' == 5` হয় `true`। `===` type-ও মেলায় আর কিছু convert করে না, তাই `'5' === 5` হয় `false`। `==`-এর নিজে নিজে convert করা থেকে অপ্রত্যাশিত bug হয়, তাই সবসময় `===` (আর আলাদা কিনা দেখতে `!==`) ব্যবহার করা উচিত।

**প্রশ্ন: `map` আর `forEach`-এর পার্থক্য কী?**
উত্তর: দুটোই array-এর প্রতিটা জিনিসের উপর একটা callback চালায়। `map` প্রতিটা callback-এর return value দিয়ে একটা **নতুন array ফেরত দেয়**, যেমন `[1, 2, 3].map((n) => n * 2)` দেয় `[2, 4, 6]`। `forEach` কিছু ফেরত দেয় না (`undefined`), শুধু কাজ চালায়, যেমন প্রতিটা জিনিস print করা। React-এ data-র list থেকে screen-এ দেখানোর জিনিসের list বানাতে হয়, তাই সেখানে `map` লাগে।

**প্রশ্ন: Spread operator দিয়ে copy করলে কি deep copy হয়?**
উত্তর: না, **shallow copy** হয়। শুধু উপরের স্তরের key-গুলো নতুন object-এ যায়। কোনো key-র value যদি array বা object হয়, তাহলে নতুন আর পুরনো object দুটোই একই array বা object-এর reference রাখে। যেমন `const a = { tags: ['x'] }; const b = { ...a }; b.tags.push('y');` করলে `a.tags`-ও `['x', 'y']` হয়ে যায়। ভেতরের অংশও আলাদা করতে চাইলে সেটাকেও আলাদা করে spread করতে হয়।

**প্রশ্ন: `??` আর `||`-এর পার্থক্য কী?**
উত্তর: `||` বাম পাশের যেকোনো falsy value-তে (`0`, `''`, `false`, `null`, `undefined`, `NaN`) ডান পাশের fallback value নেয়। `??` শুধু `null` আর `undefined`-এ fallback নেয়। যেমন `0 || 10` দেয় `10`, কিন্তু `0 ?? 10` দেয় `0`। তাই যেখানে `0` বা `''` একটা বৈধ value, সেখানে `??` নিরাপদ।

**প্রশ্ন: Callback কী?**
উত্তর: যে function অন্য একটা function-কে parameter হিসেবে দেওয়া হয়, আর পরে সেই function তাকে call করে, সেটাই callback। JavaScript-এ function-ও একটা value, তাই এটা সম্ভব। যেমন `setTimeout(callback, 1000)` এক সেকেন্ড পরে callback চালায়, `array.map(callback)` প্রতিটা জিনিসের জন্য callback চালায়, আর React-এ `onClick={callback}` button click হলে callback চালায়।

**প্রশ্ন: Closure কী?**
উত্তর: একটা function-এর ভেতরে বানানো function বাইরের function-এর variable মনে রাখে আর ব্যবহার করতে পারে, এমনকি বাইরের function শেষ হয়ে যাওয়ার পরেও। একেই closure বলে। যেমন `makeCounter` function-এর ভেতরে `let count = 0` রেখে একটা arrow function ফেরত দিলে, সেই arrow function যতবার call করা হয়, একই `count` বাড়াতে থাকে। React-এ component-এর ভেতরে বানানো event handler component-এর variable ব্যবহার করতে পারে closure-এর কারণেই।

**প্রশ্ন: Rest আর spread-এর পার্থক্য কী?**
উত্তর: দুটোই `...` দিয়ে লেখা হয়, কিন্তু কাজ উল্টো। Function parameter-এ বা destructuring-এর বাম পাশে `...` হলো rest: বাকি সব জিনিস একটা object বা array-এ জড়ো করে, যেমন `function Input({ className, ...props })`। নতুন object বা array বানানোর সময় `...` হলো spread: ভেতরের জিনিসগুলো ছড়িয়ে দেয়, যেমন `{ ...filters, page: 1 }`।
