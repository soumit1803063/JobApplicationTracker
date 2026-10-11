# অধ্যায় ১৫: Interview প্রশ্নব্যাংক

Interview-এর আগে এই অধ্যায়টা পড়ো। প্রতিটা উত্তর ছোট রাখা হয়েছে, যাতে মুখে বলা যায়। বন্ধনীতে লেখা আছে কোন অধ্যায়ে বিস্তারিত পাবে। যে বিষয় বইয়ে গভীরভাবে শেখানো হয়নি, সেখানে লেখা আছে **(বইয়ে বিস্তারিত নেই, শুধু পরিচিতি)**, আর সাথে একটা ছোট উদাহরণ, যাতে follow-up প্রশ্নেও কিছু বলতে পারো।

**কৌশল:** প্রতিটা উত্তরের শেষে নিজের project থেকে একটা উদাহরণ দাও। "আমার Job Tracker project-এ আমি..." বললে interviewer বোঝে তুমি শুধু মুখস্থ করোনি, নিজে কাজ করেছ।

---

## ক. JavaScript (অধ্যায় ২–৩)

**১. `let`, `const`, `var`-এর পার্থক্য কী?** (অধ্যায় ২)
`const`-কে নতুন value দেওয়া যায় না, `let`-কে যায়। দুটোই **block scoped**, মানে `{ }`-এর বাইরে দেখা যায় না। `var` function scoped (পুরো function জুড়ে দেখা যায়), আর hoisting-এর কারণে অদ্ভুত আচরণ করে (নিচে #১২ক)। তাই `var` ব্যবহার করি না।

**২. `==` বনাম `===`?** (অধ্যায় ২)
`==` তুলনার আগে type বদলে নেয়, তাই `0 == ''` হয় `true`। `===` type-সহ তুলনা করে, তাই `0 === ''` হয় `false`। সবসময় `===` ব্যবহার করি।

**৩. Truthy আর falsy কী?** (অধ্যায় ২)
`if`-এর ভেতরে যে value `false`-এর মতো আচরণ করে, সেটা **falsy**: `false`, `0`, `''`, `null`, `undefined`, `NaN`। বাকি সব **truthy**, এমনকি `'0'`, `[]` আর `{}`-ও।

**৪. Arrow function আর সাধারণ function-এর পার্থক্য কী?** (অধ্যায় ২)
Arrow function ছোট করে লেখা যায়, আর body এক expression হলে `return` লাগে না। বড় পার্থক্য হলো arrow function-এর নিজের `this` নেই, চারপাশের `this` ব্যবহার করে (নিচে #১২খ)।

**৫. `map`, `filter`, `find`, `forEach`-এর পার্থক্য কী?** (অধ্যায় ২)
- `map`: প্রতিটা item থেকে একটা করে নতুন item বানিয়ে নতুন array দেয়। `[1, 2].map((n) => n * 2)` দেয় `[2, 4]`।
- `filter`: শর্ত মেলে এমন item নিয়ে নতুন array দেয়।
- `find`: শর্ত মেলে এমন প্রথম item দেয়, না পেলে `undefined`।
- `forEach`: প্রতিটার উপর কিছু চালায়, কিছু return করে না।

**৬. Destructuring আর spread কী?** (অধ্যায় ২)
Destructuring দিয়ে object বা array থেকে value বের করে variable-এ রাখা হয়: `const { a } = obj`। Spread (`...`) দিয়ে ভেতরের জিনিস ছড়িয়ে দিয়ে copy বা merge করা হয়: `{ ...obj, a: 1 }`। Spread **shallow copy** করে, মানে শুধু বাইরের দিকের field copy হয়, ভেতরের object আগের reference-ই থেকে যায়।

**৭. `?.` আর `??` কী?** (অধ্যায় ২)
`user?.name`: `user` null বা undefined হলে error না দিয়ে `undefined` দেয়। `a ?? b`: শুধু `a` null বা undefined হলে `b` দেয়। `0 ?? 5` হয় `0`, কিন্তু `0 || 5` হয় `5`। আমার project-এ `user?.name ?? user?.email` দিয়ে navbar-এ নাম, না থাকলে email দেখাই।

**৮. Closure কী?** (অধ্যায় ২)
একটা function যেখানে তৈরি হয়, সেখানকার variable মনে রাখে, এমনকি বাইরের function শেষ হয়ে গেলেও। উদাহরণ:
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
next();
next();
```
`makeCounter` শেষ হয়ে গেলেও ভেতরের function `count` মনে রাখে। প্রথম `next()` দেয় `1`, দ্বিতীয়টা `2`। React-এর event handler-ও closure: আমার ApplicationsPage-এর `handleDelete` render-এর সময়কার `items` মনে রাখে (অধ্যায় ১৩)।

**৯. Promise কী? এর তিনটা state কী?** (অধ্যায় ৩)
Promise এমন একটা value-কে represent করে, যেটা এখনো আসেনি কিন্তু ভবিষ্যতে আসবে, যেমন server-এর উত্তর। তিনটা state: **pending** (অপেক্ষা চলছে), **fulfilled** (সফল, value এসেছে), **rejected** (ব্যর্থ, error এসেছে)। একবার fulfilled বা rejected হলে আর বদলায় না।

**১০. async/await কী?** (অধ্যায় ৩)
Promise-কে সাধারণ, উপর থেকে নিচে চলা code-এর মতো লেখার উপায়। `await` শুধু ওই `async` function-টাকে থামায়, পুরো app-কে না। error ধরা হয় try/catch দিয়ে। আমার project-এর সব thunk এভাবে লেখা।

**১১. fetch কি 404-এ throw করে?** (অধ্যায় ৩)
না। fetch শুধু network ব্যর্থ হলে (server-এ পৌঁছাতেই না পারলে) throw করে। 404 বা 500 এলেও fetch সফল ধরে নেয়, তাই `response.ok` বা `response.status` নিজে check করতে হয়। আমার `shared/api.ts`-এর `request` function এটা করে আর ভুল হলে `ApiError` throw করে।

**১২. Event loop কী?** (অধ্যায় ৩; call stack বইয়ে বিস্তারিত নেই, শুধু পরিচিতি)
JavaScript single threaded, মানে একসাথে একটাই কাজ চালায়। **Call stack** হলো এখন যে function-গুলো চলছে তাদের তালিকা: function call হলে উপরে যোগ হয়, শেষ হলে সরে যায়। অপেক্ষার কাজ (timer, network) browser আলাদাভাবে সামলায়, শেষ হলে তাদের callback একটা queue-তে বসে। **Event loop** বারবার দেখে call stack খালি হলো কিনা, খালি হলে queue থেকে পরের callback নিয়ে চালায়। তাই `setTimeout(fn, 0)` দিলেও `fn` চলে বর্তমান সব code শেষ হওয়ার পরে।

**১২ক. Hoisting কী?** (অধ্যায় ২)
JavaScript code চালানোর আগে declaration-গুলো scope-এর উপরে তুলে নেয়, একে বলে **hoisting**। `var` উপরে ওঠে `undefined` value নিয়ে, তাই declaration-এর আগে পড়লে error হয় না, `undefined` আসে:
```js
console.log(a);
var a = 5;
```
এটা print করে `undefined`। কিন্তু `let` বা `const` declaration-এর আগে পড়লে `ReferenceError` আসে:
```js
console.log(b);
let b = 5;
```
এটাই নিরাপদ আচরণ, কারণ ভুলটা সাথে সাথে ধরা পড়ে।

**১২খ. `this` কী?** (অধ্যায় ২.১৪-এ শুধু class-এর `this`; বাকিটা বইয়ে বিস্তারিত নেই, শুধু পরিচিতি)
সাধারণ function বা method-এর ভেতরে `this` হলো যে object-এর উপর function-টা call হয়েছে। arrow function-এর নিজের `this` নেই, যেখানে লেখা হয়েছে তার চারপাশের `this` ব্যবহার করে:
```js
const user = {
    name: 'Rahim',
    greet()
    {
        return this.name;
    },
    greetArrow: () => this?.name,
};
```
`user.greet()` দেয় `'Rahim'`, কারণ `this` হলো `user`। `user.greetArrow()` দেয় `undefined`, কারণ arrow function `user`-কে `this` হিসেবে পায় না, বাইরের `this` নেয় (module-এর top-level-এ সেটা `undefined`)। তাই object-এর method arrow দিয়ে লিখি না। React-এর function component-এ `this` লাগেই না।

---

## খ. TypeScript (অধ্যায় ৪)

**১৩. TypeScript কেন?**
type-এর ভুল code চালানোর আগেই ধরা পড়ে, editor-এ autocomplete পাওয়া যায়, আর বড় code নিরাপদে বদলানো যায়, কারণ কোথায় কী ভাঙল TypeScript দেখিয়ে দেয়। browser TypeScript বোঝে না, তাই চালানোর আগে এটা JavaScript-এ compile/transform হয়।

**১৪. interface বনাম type?**
দুটোই একটা type-কে নাম দেয়। `interface` শুধু object-এর আকারের জন্য, `extends` দিয়ে বাড়ানো যায়, আর **declaration merging** হয়: একই নামে দুটো interface লিখলে TypeScript দুটো জোড়া লাগিয়ে একটা বানায় (বইয়ে বিস্তারিত নেই, শুধু পরিচিতি)। `type` দিয়ে union (`'a' | 'b'`) বা যেকোনো type-এর alias-ও বানানো যায়। আমার project-এ object-এর জন্য interface, union-এর জন্য type ব্যবহার করেছি, যেমন `type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse`।

**১৫. any বনাম unknown?**
`any` দিলে TypeScript কোনো check-ই করে না, যা খুশি করা যায়, তাই bug লুকিয়ে থাকে। `unknown` মানে "type জানা নেই", ব্যবহারের আগে narrowing করে type নিশ্চিত করতে হয়। আমার `getErrorMessage(error: unknown)` আগে check করে `error` string নাকি `Error`, তারপর message বের করে।

**১৬. Generic কী?**
type-কে parameter বানানো, যাতে একই function বিভিন্ন type-এর সাথে কাজ করে। যেমন `api.get<User>(...)` দেয় `Promise<User>`, আর `api.get<JobApplication>(...)` দেয় `Promise<JobApplication>`। function একটাই, ফলাফলের type আলাদা।

**১৭. Union আর discriminated union কী?**
Union হলো "এটা অথবা ওটা": `A | B`। Discriminated union-এ সব type-এ থাকা একটা common field থাকে (যেমন `success`), যার value প্রতিটা type-এ আলাদা (`true` বা `false`)। সেই field check করলেই TypeScript বুঝে যায় কোন type। আমার `ApiResponse`-এ `json.success === true` হলে TypeScript জানে `data` আছে, `false` হলে জানে `error` আছে।

**১৮. Partial, Omit, Record কী?**
- `Partial<T>`: T-এর সব field optional করে দেয়। আমার update API নেয় `Partial<ApplicationPayload>`, কারণ শুধু বদলানো field পাঠাই।
- `Omit<T, K>`: T থেকে কিছু field বাদ দেয়। `ApplicationPayload = Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>`।
- `Record<K, V>`: যার key-গুলো K type-এর আর value V type-এর, এমন object। যেমন `Record<string, string>`।

**১৯. Type narrowing কী?**
`typeof`, `instanceof`, `in`, null check বা discriminant field দিয়ে check করার পরে TypeScript নিজে থেকেই type ছোট করে নেয়। যেমন `if (error instanceof Error)`-এর ভেতরে TypeScript জানে `error.message` আছে।

---

## গ. React মূল ধারণা (অধ্যায় ৬)

**২০. React কী? declarative মানে কী?**
UI বানানোর একটা library। **Declarative** মানে "কী দেখাতে চাই" বলা, আর DOM কীভাবে বদলাবে সেটা React ঠিক করে। আমি state অনুযায়ী JSX লিখি, state বদলালে React screen মিলিয়ে দেয়: UI = f(state)।

**২১. Virtual DOM আর reconciliation কী?**
Virtual DOM হলো আসল DOM-এর একটা lightweight copy, সাধারণ JavaScript object দিয়ে বানানো। state বদলালে React নতুন copy বানিয়ে পুরনোটার সাথে তুলনা করে (এই তুলনাকে বলে **reconciliation**), তারপর আসল DOM-এ শুধু পার্থক্যটুকু বসায়। আসল DOM বদলানো ধীর, তাই এতে কাজ কম হয়।

**২২. JSX কী?**
JavaScript-এর ভেতরে HTML-এর মতো করে লেখা। build tool (Vite) এটাকে সাধারণ function call-এ compile/transform করে। নিয়ম: `class`-এর বদলে `className`, `for`-এর বদলে `htmlFor`, সব tag বন্ধ করতে হয়, একটা root element লাগে, আর `{ }`-এর ভেতরে JavaScript expression।

**২৩. Component কী? নাম বড় হাতের কেন?**
JSX return করে এমন function হলো component। নাম ছোট হাতের হলে React সেটাকে HTML tag ভাবে (`<button>`), তাই নিজের component বড় হাতের (`<Button>`)।

**২৪. Props বনাম state?**
Props আসে parent থেকে, আর component-এর কাছে read-only। State component-এর নিজের, আর set function দিয়ে বদলায়। দুটোর যেকোনোটা বদলালেই re-render হয়।

**২৫. children prop কী?**
component-এর opening আর closing tag-এর মাঝে যা লেখা হয়, সেটা `children` prop হিসেবে আসে। এভাবে component জোড়া লাগানো যায় (composition)। যেমন আমার `<Field label="Email">`-এর ভেতরে `<Input>`, Field শুধু label আর error দেখায়, input যেকোনোটা হতে পারে।

**২৬. key কেন দরকার? index কেন খারাপ?**
list-এর কোন element কোন data-র, React সেটা key দিয়ে চেনে। index দিলে মাঝখানে কিছু যোগ বা মুছলে পরের সবার key বদলে যায়, তখন এক item-এর state ভুল করে অন্য item-এ জুড়ে যেতে পারে। তাই data-র **stable** id দিই, যেমন `key={application.id}`।

**২৭. Conditional rendering-এর উপায় কী কী?**
`&&`, ternary (`a ? b : c`), আর early return (`if (...) return ...`)। সতর্কতা: `&&`-এর বাম দিকে সংখ্যা থাকলে `{count && <List />}`-এ count `0` হলে screen-এ `0` print হয়। তাই `count > 0 &&` লিখি।

**২৮. One-way data flow কী?**
data যায় উপর থেকে নিচে (parent থেকে child-এ props), আর event আসে নিচ থেকে উপরে (child callback call করে parent-কে জানায়)। আমার ApplicationsTable `applications` prop পায়, আর Delete click হলে `onDelete` callback দিয়ে ApplicationsPage-কে জানায়।

**২৯. Fragment কী?**
`<>...</>`: বাড়তি কোনো DOM element না বানিয়েই কয়েকটা element একসাথে return করা।

**৩০. StrictMode কী করে?**
শুধু development-এ বাড়তি check করে। component দুইবার render করে (এটা development-এ ভুল ধরার জন্য; effect-এর দুইবার চলা অধ্যায় ৮.৬-এ), আর effect mount → cleanup → আবার mount চালায়। production-এ এর কোনো প্রভাব নেই।

---

## ঘ. State, Event, Form (অধ্যায় ৭)

**৩১. useState কীভাবে কাজ করে?**
`const [value, setValue] = useState(initial)` দেয়। `setValue` call করলে React নতুন value মনে রাখে আর component আবার render করে। পরের render-এ `value` নতুনটা।

**৩২. setState কি সাথে সাথে বদলায়?**
না। update schedule হয়, আর একই event-এর কয়েকটা update একসাথে করা হয় (batching)। নতুন value আসে পরের render-এ। তাই `setCount(count + 1)`-এর ঠিক পরের লাইনে `count` এখনো পুরনো।

**৩৩. Functional update কখন?**
নতুন value পুরনো value-র উপর নির্ভর করলে: `setX((previous) => ...)`। আমার ApplicationForm-এ `setValues((previous) => ({ ...previous, [field]: value }))`, যাতে সবসময় সর্বশেষ value থেকে শুরু হয়।

**৩৪. State কেন immutable?**
React reference তুলনা করে বোঝে state বদলেছে কিনা। আসল object-এর ভেতরে বদলালে reference একই থাকে, তাই React ভাবে কিছু বদলায়নি, re-render হয় না। তাই সবসময় নতুন object বা array বানাই, যেমন spread দিয়ে।

**৩৫. Controlled বনাম uncontrolled input?**
Controlled-এ value থাকে state-এ: `value={email}` আর `onChange`-এ `setEmail`। React state-ই source of truth। Uncontrolled-এ value থাকে DOM-এর নিজের কাছে, দরকারে পড়া হয় ref দিয়ে (useRef দিয়ে, নিচে #৪৮ দেখো)। আমার project-এর সব input controlled।

**৩৬. `event.preventDefault()` কেন?**
form submit হলে browser নিজে থেকে পুরো page reload করে। SPA-তে সেটা চাই না, তাই submit handler-এর শুরুতে থামাই।

**৩৭. Lifting state up কী?**
দুই বা বেশি component একই state ব্যবহার করলে state-টা তাদের common parent-এ রাখা, আর props দিয়ে নিচে পাঠানো।

**৩৮. Derived state কেন রাখবে না?**
যা অন্য state থেকে হিসাব করে বের করা যায়, সেটা আলাদা state-এ রাখলে দুটো value অমিল হয়ে যাওয়ার bug হয়। render-এর সময়েই হিসাব করে নিই। যেমন আমার table-এ deadline পেরিয়েছে কিনা `isDeadlinePassed(application)` দিয়ে প্রতি render-এ হিসাব হয়, আলাদা state নেই।

**৩৯. Re-render কখন হয়?**
নিজের state বদলালে, parent re-render হলে, আর component যে context বা Redux selector-এর value পড়ে সেটা বদলালে।

---

## ঙ. Effect আর Hook (অধ্যায় ৮)

**৪০. useEffect কী? কখন চলে?**
render শেষ হয়ে screen-এ দেখানোর পরে side effect চালায়, যেমন data আনা বা timer চালানো। dependency array ঠিক করে কখন আবার চলবে।

**৪১. `[]`, `[a]`, আর কিছু না দেওয়ার পার্থক্য?**
`[]` দিলে শুধু mount-এ একবার চলে। `[a]` দিলে mount-এ আর যখনই `a` বদলায়। কিছু না দিলে প্রতি render-এ চলে।

**৪২. Cleanup কখন চলে?**
পরের বার effect চলার আগে, আর unmount-এর সময়। timer, event listener বা subscription বন্ধ করতে লাগে।

**৪৩. Debounce কীভাবে বানাবে?**
effect-এ `setTimeout`, আর cleanup-এ `clearTimeout`। value বদলালে আগের timer বাতিল হয়ে নতুন timer শুরু হয়, তাই টাইপ থামার পরেই কাজ হয়। আমার search box ৪০০ms পরে filter বদলায়।

**৪৪. Rules of Hooks কী?**
Hook শুধু component বা custom hook-এর একদম উপরের অংশে call করা যায়, কোনো `if` বা loop-এর ভেতরে না। কারণ React hook-গুলো চেনে তাদের call order দিয়ে। কোনো render-এ একটা hook বাদ পড়লে পরের সবগুলোর মিল ভেঙে যায়।

**৪৫. Stale closure কী?**
callback বা effect তৈরি হওয়ার সময়ের পুরনো value দেখে, কারণ closure সেই value মনে রেখেছে (#৮)। সমাধান: dependency array ঠিক রাখা, অথবা functional update।

**৪৬. Custom hook কী?**
`use` দিয়ে শুরু হওয়া একটা function, যেটা ভেতরে অন্য hook ব্যবহার করে, যাতে state-সহ logic reuse করা যায়। `useAppSelector` আসলে typed `useSelector` (`withTypes` দিয়ে বানানো); custom hook-এর ভালো উদাহরণ Tiptap-এর `useEditor`।

**৪৭. useMemo, useCallback, React.memo কী?** (বইয়ে বিস্তারিত নেই, শুধু পরিচিতি; আমার project-এ ব্যবহার হয়নি)
- `useMemo(() => calc(a), [a])`: expensive হিসাবের ফল মনে রাখে, `a` না বদলালে আবার হিসাব করে না। হাজার item sort বা filter করার মতো ভারী কাজে।
- `useCallback(fn, [deps])`: function-এর reference একই রাখে, deps না বদলালে নতুন function বানায় না। সাধারণত `React.memo` করা child-কে function prop দেওয়ার সময়।
- `React.memo(Component)`: props না বদলালে component-কে আবার render হতে দেয় না। ভারী component, যেটার parent ঘনঘন re-render হয়।

এগুলো performance-এর জন্য। আগে মেপে দেখি সত্যিই ধীর কিনা, তারপর ব্যবহার করি, শুরুতেই না।

**৪৮. useRef কী?** (অধ্যায় ৭-এ এক লাইন; বইয়ে বিস্তারিত নেই, শুধু পরিচিতি; আমার project-এ ব্যবহার হয়নি)
`const ref = useRef(initial)` একটা object দেয়, যার `ref.current`-এ value রাখা যায়। render-এর মাঝে value থেকে যায়, কিন্তু বদলালে re-render হয় না। দুটো ব্যবহার: DOM element ধরা (`<input ref={inputRef} />`, তারপর `inputRef.current.focus()`), আর এমন value রাখা যেটা screen-এ দেখাতে হয় না, যেমন timer-এর id।

---

## চ. Routing (অধ্যায় ৯)

**৪৯. Client-side routing কী?**
server থেকে নতুন HTML page না এনে, JavaScript দিয়েই URL আর দেখানো component বদলানো। page reload হয় না, তাই দ্রুত, আর state থেকে যায়।

**৫০. Link বনাম a?**
`<Link>` reload ছাড়াই page বদলায়, তাই Redux state থেকে যায়। `<a>` পুরো page reload করে। app-এর ভেতরে `<Link>`, বাইরের website-এ `<a>`।

**৫১. Nested route আর Outlet কী?**
route-এর ভেতরে route। parent route-এর component-এ `<Outlet />` থাকে, আর সেই জায়গায় child route-এর page বসে। এতে layout reuse হয়: আমার AppLayout-এর navbar একবারই লেখা, সব page তার Outlet-এ বসে।

**৫২. useParams, useNavigate, useLocation কী করে?**
- `useParams`: URL-এর `:id`-এর মতো অংশ পড়ে।
- `useNavigate`: code থেকে অন্য page-এ পাঠায়, যেমন save-এর পরে details page-এ।
- `useLocation`: বর্তমান path, আর navigation state পড়ে। navigation state হলো এমন data, যেটা navigate করার সময় সাথে পাঠানো হয় কিন্তু URL-এ দেখা যায় না।

**৫৩. Protected route কীভাবে বানাবে?**
একটা component বানাই, যেটা auth state দেখে:
- session check শেষ না হলে spinner।
- login না থাকলে `<Navigate to={AppRoutes.Login} replace state={{ from: location.pathname }} />`, যাতে login-এর পরে আগের page-এ ফেরা যায়।
- login থাকলে `<Outlet />`।

URL হাতে না লিখে `AppRoutes` enum ব্যবহার করি, এটা আমার project-এর নিয়ম।

**৫৪. `replace` কেন?**
redirect-এর entry history-তে জমা হয় না, পুরনোটার জায়গায় বসে। না দিলে Back চাপলে আবার redirect হওয়া page-এ ফিরে যায়, আর আবার redirect হয়, user আটকে যায়।

**৫৫. Deploy-এর পরে refresh করলে 404 কেন?**
`/applications/123`-এ refresh করলে browser server-এর কাছে সেই path চায়, কিন্তু server-এ ওই নামে কোনো file নেই, আছে শুধু `index.html`। তাই server-এ নিয়ম দিতে হয়: অচেনা সব path-এ `index.html` দাও (fallback), তারপর React Router path দেখে সঠিক page দেখায়।

---

## ছ. Redux Toolkit (অধ্যায় ১০–১১)

**৫৬. Redux কেন? কখন দরকার নেই?**
অনেক দূরের component-এ একই state লাগলে, prop drilling (অনেক component-এর মধ্য দিয়ে props হাতে হাতে পাঠানো) এড়াতে, আর predictable one-way data flow-এর জন্য: state বদলায় শুধু action dispatch করে, তাই কোথায় কী বদলাল DevTools-এ দেখা যায়। ছোট app-এ `useState` বা Context যথেষ্ট।

**৫৭. Store, action, reducer, dispatch, selector কী?**
- Store: পুরো app-এর central (global) state যেখানে থাকে।
- Action: কী ঘটেছে তার বর্ণনা, একটা object: `{ type, payload }`।
- Reducer: (পুরনো state, action) নিয়ে নতুন state return করে এমন pure function।
- Dispatch: store-এ action পাঠানো।
- Selector: state থেকে দরকারি অংশ বেছে নেওয়ার function, যেমন `(state) => state.auth.user`।

**৫৮. Reducer কেন pure?**
একই input দিলে সবসময় একই output, আর বাইরের কিছু বদলায় না। ফলে আচরণ predictable, test করা সহজ, আর DevTools-এ পুরনো action আবার চালিয়ে দেখা (time-travel) যায়। side effect থাকলে এগুলো ভেঙে যায়। তাই আমার logout-এ token মোছা reducer-এ না, thunk-এ।

**৫৯. createSlice কী দেয়?**
একসাথে reducer আর action creator। action type নিজে থেকে তৈরি হয় slice-এর নাম আর reducer-এর নাম জুড়ে, যেমন `'applications/filtersChanged'`।

**৬০. RTK-তে state সরাসরি বদলানোর মতো লেখা যায় কেন?**
Immer-এর কারণে। reducer-এ আসল state না, একটা draft আসে। draft বদলালে Immer সেই বদল দেখে নতুন immutable state বানায়। এটা শুধু RTK-এর `createSlice` reducer-এর ভেতরে কাজ করে।

**৬১. useSelector কখন re-render করে?**
selector-এর return value আগেরটা থেকে আলাদা হলে (reference দিয়ে তুলনা)। selector প্রতিবার নতুন object বানালে, যেমন `(state) => ({ a: state.a })`, প্রতিবার আলাদা reference, তাই প্রতিটা store বদলেই re-render হয়।

**৬২. Async কাজ কোথায়?**
thunk-এ, কখনো reducer-এ না, কারণ reducer pure হতে হয়।

**৬৩. createAsyncThunk কী করে?**
একটা async function চালায়, আর তার শুরুতে `pending`, সফল হলে `fulfilled`, ব্যর্থ হলে `rejected` action পাঠায়। function যা return করে সেটা fulfilled-এর payload, আর `rejectWithValue(x)`-এর `x` হয় rejected-এর payload।

**৬৪. reducers বনাম extraReducers?**
`reducers` slice-এর নিজের action বানায়, যেমন `filtersChanged`। `extraReducers` বাইরে তৈরি action শোনে, যেমন thunk-এর action বা অন্য slice-এর action। আমার applications slice `extraReducers`-এ auth-এর `logoutUser.fulfilled` শোনে।

**৬৫. unwrap কী?**
dispatch করা thunk-এর ফল থেকে সরাসরি payload দেয়, আর ব্যর্থ হলে throw করে। তাই component-এ try/catch দিয়ে "সফল হলে navigate" লেখা সহজ। আমার form page save-এর পরে এভাবেই details page-এ যায়।

**৬৬. Loading আর error কীভাবে দেখাও?**
slice-এ `status` (idle, loading, succeeded, failed) আর `error` রাখি। thunk-এর তিনটা action-এ এগুলো update হয়। UI status দেখে spinner, error message, "কিছু নেই" message, অথবা data দেখায়।

**৬৭. Context বনাম Redux?**
Context হলো component tree-তে props ছাড়া data পাঠানোর একটা ব্যবস্থা। value বদলালে সব consumer re-render হয়, আর এর নিজের কোনো structure বা tooling নেই। Redux-এ selector দিয়ে fine-grained re-render হয় (শুধু যে অংশ পড়ছে সেটা বদলালেই), আর middleware আর DevTools আছে। Context ভালো কম বদলানো জিনিসে (theme, ভাষা), Redux জটিল আর ঘনঘন বদলানো state-এ।

**৬৮. Race condition কীভাবে এড়াবে?** (অধ্যায় ১১)
Race condition মানে দুটো request গেছে, কিন্তু পুরনোটার উত্তর পরে এসে নতুনটার data মুছে দিল। উপায়: debounce দিয়ে request কমানো, শুধু সর্বশেষ request-এর id-র উত্তর গ্রহণ করা, অথবা AbortController দিয়ে পুরনো request বাতিল করা।

---

## জ. Authentication আর security (অধ্যায় ১২–১৩)

**৬৯. Authentication বনাম Authorization?**
Authentication: তুমি কে, সেটা প্রমাণ করা। Authorization: তুমি কী করতে পারবে, সেটা ঠিক করা। আমার project-এ email আর password দিয়ে login করা হলো authentication। login করার পরে শুধু নিজের application দেখতে পারা, অন্যের id দিলে 404 পাওয়া, এটা authorization।

**৭০. JWT কীভাবে কাজ করে?**
server একটা secret key দিয়ে sign করা token দেয়। payload-এ user-এর তথ্য থাকে, আমার project-এ `sub` (user-এর UUID), `email` আর `exp` (expiry, ১ দিন)। প্রতিটা request-এ `Authorization: Bearer <token>` header যায়, আর server signature verify করে user চেনে। payload base64-এ লেখা, encrypt করা না, তাই যে কেউ পড়তে পারে, কিন্তু বদলালে signature মেলে না। তাই JWT-তে গোপন কিছু রাখি না।

**৭১. localStorage বনাম httpOnly cookie?**
localStorage সহজ, কিন্তু XSS হলে (অন্য কারো JavaScript page-এ চললে) সেই script token পড়ে চুরি করতে পারে। httpOnly cookie এমন cookie, যেটা JavaScript পড়তে পারে না, browser শুধু request-এর সাথে নিজে থেকে পাঠায়, তাই XSS থেকে নিরাপদ। কিন্তু নিজে থেকে যায় বলে CSRF-এর ঝুঁকি আসে: অন্য website আমার browser দিয়ে গোপনে request পাঠাতে পারে, আর cookie সাথে চলে যায়। ঠেকাতে cookie-তে `SameSite=Lax` বা `Strict` দিই (অন্য site থেকে আসা request-এ cookie যায় না), অথবা আলাদা CSRF token ব্যবহার করি।

**৭২. Refresh-এ login কীভাবে থাকে?**
token persistent storage-এ (localStorage) রাখি। app শুরুতে `restoreSession` thunk `/auth/me` call করে user আনে। dispatch শুধু কাজ শুরু করে, render অপেক্ষা করে না, তাই check শেষ না হওয়া পর্যন্ত `isSessionChecked` false থাকে আর protected page-এ spinner দেখাই।

**৭৩. 401 এলে কী করো?**
request-এ token থাকা অবস্থায় 401 এলে token মুছে login page-এ reload করি। ভালো সমাধান হলো refresh token: অল্প মেয়াদের access token-এর সাথে একটা দীর্ঘ মেয়াদের refresh token, যেটা সাধারণত httpOnly cookie-তে থাকে। access token expired হলে refresh token দিয়ে চুপচাপ নতুন access token এনে request আবার পাঠাই, user-কে আবার login করতে হয় না। আমার project-এ refresh token নেই।

**৭৪. XSS কী? React কীভাবে বাঁচায়?**
অন্য কারো ঢোকানো script তোমার page-এ চলে যাওয়া হলো XSS। React `{ }`-এর ভেতরের string escape করে, তাই `{'<b>Hi</b>'}` screen-এ লেখা হিসেবে `<b>Hi</b>` দেখায়, HTML হিসেবে চলে না। ঝুঁকি শুধু `dangerouslySetInnerHTML`-এ, তাই সেখানে sanitize করা HTML দিতে হয় (বিপজ্জনক tag মুছে শুধু নিরাপদ tag রাখা)। আমার server mail save করার আগে `sanitize-html` দিয়ে sanitize করে।

**৭৫. Frontend validation কি যথেষ্ট?**
না। frontend validation শুধু user experience (UX)-এর জন্য, ভুল সাথে সাথে দেখাতে। যে কেউ সরাসরি API-তে request পাঠিয়ে এটা এড়াতে পারে। server-এ আবার validation করতেই হবে। আমার server LINK medium-এ `applyLink` না পেলে 400 দেয়।

---

## ঝ. Tools আর project (অধ্যায় ৫, ১৪)

**৭৬. Vite কী করে?**
development-এ dev server চালায়: দ্রুত চালু হয়, HMR (code save করলে page reload ছাড়াই বদল দেখা যায়), আর proxy (`/api` request backend-এ পাঠানো)। production-এর জন্য ছোট, optimize করা build বানায়।

**৭৭. CORS কী? development-এ কীভাবে সামলাও?**
এক origin-এর (যেমন `localhost:5173`) page অন্য origin-এ (`localhost:3000`) request পাঠালে request ঠিকই যায়, কিন্তু server অনুমতি না দিলে browser সেই response JavaScript-কে পড়তে দেয় না। এই নিয়মই CORS। development-এ Vite proxy দিয়ে সামলাই: browser ভাবে request একই origin-এ যাচ্ছে, Vite পিছনে backend-এ পাঠায়। production-এ server CORS header দিয়ে অনুমতি দেয়।

**৭৮. dependencies বনাম devDependencies?**
`dependencies` app চালাতে লাগে (React, Redux)। `devDependencies` শুধু development, build আর check-এর সময় লাগে (TypeScript, ESLint, Vite)।

**৭৯. ESLint আর TypeScript-এর পার্থক্য কী?**
TypeScript type-এর ভুল ধরে, যেমন string-এর জায়গায় number। ESLint খারাপ অভ্যাস আর সম্ভাব্য bug ধরে, যেমন hook-এর নিয়ম ভাঙা বা Promise-এর error কেউ না ধরা (`no-misused-promises`)।

**৮০. তোমার project-এর architecture বলো।** (অধ্যায় ১৪-এর নমুনা উত্তর দেখো)

**৮১. Project-এ সবচেয়ে কঠিন কী ছিল, আর কীভাবে সমাধান করেছ?** (নিজের ভাষায় তৈরি রাখো)

উদাহরণ উত্তর: "Search-এ প্রতিটা অক্ষরে request যাচ্ছিল। useEffect-এ setTimeout আর cleanup-এ clearTimeout দিয়ে debounce করেছি। এখন টাইপ থামার ৪০০ms পরে একবার request যায়।" অথবা: "Page refresh-এ login হারিয়ে যাচ্ছিল। app শুরুতে restoreSession thunk দিয়ে token দিয়ে user আনি, আর ProtectedRoute-এ isSessionChecked না হওয়া পর্যন্ত spinner দেখাই, যাতে check শেষের আগেই login page-এ পাঠিয়ে না দেয়।"

---

## শেষ কথা

তুমি এখন জানো:
- web কীভাবে কাজ করে, JavaScript, আর TypeScript
- React-এর component, props, state, effect
- React Router দিয়ে page আর protected route
- Redux Toolkit দিয়ে global state আর server-এর data
- একটা আসল project কীভাবে সাজানো হয়

**পরের ধাপ:** project-এ নিজে একটা ছোট feature যোগ করো। নিচেরগুলো শুধু frontend-এর কাজ, backend-এ কিছু বদলাতে হবে না:
- **"৩ দিনের মধ্যে deadline" badge:** table-এ যেসব application-এর deadline আগামী ৩ দিনের মধ্যে আর এখনো apply করা হয়নি, সেগুলোর পাশে একটা হলুদ badge। `isDeadlinePassed`-এর পাশে `applications.utils.ts`-এ একটা নতুন function লিখে শুরু করো।
- **"Clear search" button:** search box-এ কিছু লেখা থাকলে পাশে একটা ছোট × button, যেটা click করলে শুধু search খালি হয়, বাকি filter থাকে।
- **Page size মনে রাখা:** "Per page" বদলালে value-টা `localStorage`-এ রাখো, আর app খুললে সেখান থেকে পড়ে `DEFAULT_FILTERS`-এর `limit` বসাও। key-টা `shared/constants.ts`-এ রাখতে ভুলো না।
- **Navbar-এ নাম অন্যভাবে:** নাম থাকলে "Hi, Rahim", না থাকলে email-এর `@`-এর আগের অংশ দেখাও।
- **Applied count:** list page-এর উপরে লেখা "এই page-এ ১০টার মধ্যে ৪টায় apply করেছ"। `items` থেকে render-এর সময় হিসাব করো, আলাদা state না (derived state, #৩৮)।

অধ্যায় ১৪-এর "Companies" checklist বা application-এ "notes" field-এর মতো কিছু করতে চাইলে মনে রেখো, সেগুলোর জন্য আগে backend-এ কাজ লাগবে (NestJS module, Prisma model), যেটা এই বই শেখায় না।

নিজে হাতে বানালে যা শিখেছ তা পাকা হবে, আর interview-তে আত্মবিশ্বাসের সাথে বলতে পারবে। শুভকামনা!
