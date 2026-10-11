# অধ্যায় ৮: Side Effect আর `useEffect`

Component-এর মূল কাজ হলো JSX return করা। কিন্তু মাঝে মাঝে **render-এর বাইরের** কাজ করতে হয়: server থেকে data আনা, timer চালানো। এগুলোকে বলে **side effect**।

> **আগে একটু heads-up:** এই অধ্যায়ের উদাহরণগুলো আমাদের আসল project থেকে নেওয়া, তাই সেখানে Redux-এর কিছু জিনিস আছে, যেগুলো বিস্তারিতভাবে আসবে অধ্যায় ১০–১১-এ। আপাতত শুধু এটুকু জানলেই চলবে:
>
> | কোড | এখনকার জন্য মানে |
> |---|---|
> | **store** | পুরো app-এর shared data রাখার একটা জায়গা |
> | `useAppSelector((state) => ...)` | store থেকে একটা value পড়া; value বদলালে component re-render হয় |
> | `dispatch(...)` | store-কে "এই কাজটা করো" বলা |
> | `dispatch(loadApplications(filters))` | এই `filters` দিয়ে server থেকে application-এর list আনো |
> | `dispatch(filtersChanged({ search }))` | store-এর filter-এ নতুন search লেখা বসাও |
>
> বিস্তারিত অধ্যায় ১০–১১-এ।

---

## ৮.১ Side effect কী, আর render-এর ভেতরে কেন নয়?

Render (অর্থাৎ component function চলা) হওয়া উচিত **pure**: একই props আর state দিলে সবসময় একই JSX আসবে, আর function-এর বাইরের কিছু বদলাবে না।

ধরো ভুল করে render-এর ভেতরেই server call করলাম (এটা ভুল উদাহরণ):
```tsx
function ApplicationsPage()
{
    dispatch(loadApplications(filters));
    return ...;
}
```
তাহলে এই চক্র তৈরি হতো:

1. Component render হলো, আর render-এর ভেতরে server call গেল।
2. Data এসে store-এ বসল, তাই component আবার re-render হলো।
3. Re-render মানে function আবার চলা, তাই আবার server call গেল।
4. আবার data এল, আবার re-render... এভাবে চলতেই থাকবে।

এটাই **infinite loop**: যে loop কখনো থামে না।

তাই side effect রাখতে হয় `useEffect`-এর ভেতরে। `useEffect` একটা hook (অধ্যায় ৭), যেটা তোমার দেওয়া function চালায় **render শেষ হয়ে screen-এ দেখানোর পরে**, আর শুধু তখনই, যখন তুমি বলবে।

---

## ৮.২ `useEffect`-এর structure

মনে করিয়ে দিই (অধ্যায় ৬): component প্রথমবার screen-এ আসাকে বলে **mount**, আর screen থেকে সরে যাওয়াকে বলে **unmount**।

```tsx
useEffect(() =>
{
    ...
    return () => { ... };
}, [dependency1, dependency2]);
```

- প্রথম argument একটা function: এর ভেতরে side effect-এর কাজ লেখা হয়।
- সেই function চাইলে আরেকটা function return করতে পারে, যাকে বলে **cleanup function**। এটা optional, ৮.৫-এ বিস্তারিত।
- দ্বিতীয় argument হলো **dependency array**: কোন কোন value বদলালে effect আবার চলবে, তার list।

| Dependency array | Effect কখন চলে |
|---|---|
| `[]` (খালি) | শুধু mount-এর পরে, একবার |
| `[a, b]` | mount-এর পরে, তারপর যখনই `a` বা `b` বদলায় |
| একদমই না দিলে | **প্রতিটা** render-এর পরে (সাধারণত ভুল) |

"বদলায়" মানে React আগের render-এর value আর এখনকার value `Object.is` দিয়ে তুলনা করে, যেটা প্রায় `===`-এর মতো। Object বা array হলে তুলনা হয় **reference** দিয়ে: একই object হলে "বদলায়নি", নতুন object হলে "বদলেছে", ভেতরের লেখা এক হলেও।

---

## ৮.৩ উদাহরণ ১: data আনা, আর filter বদলালে আবার আনা

`frontend/src/features/applications/ApplicationsPage.tsx` (সংক্ষেপে):
```tsx
const dispatch = useAppDispatch();
const { filters, items, meta, listStatus, listError } = useAppSelector((state) => state.applications);

useEffect((): void =>
{
    void dispatch(loadApplications(filters));
}, [dispatch, filters]);
```

`useAppDispatch()` হলো `dispatch` function পাওয়ার hook (অধ্যায় ১০)। `void` লেখা হয়েছে কারণ `dispatch(loadApplications(...))` একটা Promise return করে, আর আমরা সেটার জন্য অপেক্ষা করছি না (অধ্যায় ৩)।

কী ঘটে:

1. Page mount হলো। Effect চলে, আর list load হয়।
2. User filter বদলাল। Store-এ নতুন `filters` object এল। `filters` বদলেছে, তাই effect আবার চলে, আর নতুন filter দিয়ে list আসে।
3. List load হয়ে `items` বদলাল। Component re-render হয়, কিন্তু effect চলে **না**, কারণ `filters` বদলায়নি। তাই infinite loop হয় না।

তৃতীয় ধাপটা কেন কাজ করে? Store update হলে **শুধু store-এর যে অংশ বদলায়, সেটাই নতুন object হয়**; বাকি অংশ আগের object-ই থাকে। তাই `items` বদলালেও `filters`-এর reference একই থাকে, আর React দেখে "`filters` বদলায়নি" (বিস্তারিত অধ্যায় ১০)।

### `dispatch` কেন dependency-তে?

ESLint-এর `react-hooks/exhaustive-deps` rule বলে: effect-এর ভেতরে component-এর যে value ব্যবহার করবে, সব dependency array-তে দিতে হবে। `dispatch` কখনো বদলায় না (প্রতিটা render-এ একই function), তাই এটা দিলে effect বাড়তি চলে না, শুধু rule মানা হয়।

---

## ৮.৪ উদাহরণ ২: URL-এর id বদলালে নতুন data

Heads-up: `useParams` হলো React Router-এর একটা hook, যেটা URL থেকে `:id`-এর মতো অংশ পড়ে দেয় (অধ্যায় ৯)। `/applications/42` URL-এ `id` হবে `'42'`।

`ApplicationDetailsPage.tsx` (সংক্ষেপে):
```tsx
const { id = '' } = useParams<{ id: string; }>();

useEffect((): void =>
{
    void dispatch(loadApplication(id));
}, [dispatch, id]);
```

`loadApplication(id)` মানে server থেকে একটা application আনো। ফলাফল:

- Page mount হলে effect চলে, আর ওই `id`-এর application load হয়।
- `/applications/1` থেকে `/applications/2`-তে গেলে component unmount হয় না, একই component থেকে যায়, শুধু `id` বদলায়।
- Dependency-তে `id` থাকায় effect আবার চলে, আর নতুন application load হয়।

`id` dependency-তে না থাকলে দ্বিতীয় ক্ষেত্রে নতুন application কখনো load হতো না। আমাদের page-এ `selected.id !== id` হলে Spinner দেখায় (অধ্যায় ৬.৮-এর early return), তাই screen-এ চিরকাল Spinner ঘুরত।

### শুধু একবার চালানোর কাজ

`LoginPage.tsx`:
```tsx
useEffect((): void =>
{
    dispatch(authErrorCleared());
}, [dispatch]);
```

`dispatch` কখনো বদলায় না, তাই এই effect কার্যত শুধু mount-এর পরে একবার চলে। কাজটা হলো: login page-এ আসার সময় আগের কোনো পুরনো error message মুছে ফেলা।

---

## ৮.৫ Cleanup: পরিষ্কার করে যাওয়া

Effect থেকে একটা function return করলে React সেটাকে cleanup function হিসেবে রাখে, আর চালায়:

- effect **আবার চলার ঠিক আগে**, আর
- component **unmount হওয়ার সময়**।

### উদাহরণ ৩: Debounce — প্রতিটা অক্ষরে নয়, থামার পরে খোঁজো

Search box-এ "engineer" type করলে প্রতিটা অক্ষরে (৮ বার) server-এ request গেলে অপচয় হতো। তাই user **type করা থামানোর ৪০০ms পরে** একবারই খোঁজা হয়। এই কৌশলকে বলে **debounce**।

এখানে দুটো browser function লাগবে:

- `window.setTimeout(fn, 400)`: ৪০০ms পরে `fn` চালাবে, আর একটা timer id (number) return করে।
- `window.clearTimeout(timerId)`: ওই timer বাতিল করে, `fn` আর চলবে না।

`frontend/src/features/applications/ApplicationFilters.tsx` (সংক্ষেপে):
```tsx
const filters = useAppSelector((state) => state.applications.filters);
const [search, setSearch] = useState(filters.search);

useEffect((): (() => void) | undefined =>
{
    if (search === filters.search)
    {
        return undefined;
    }
    const timer = window.setTimeout((): void =>
    {
        dispatch(filtersChanged({ search }));
    }, 400);
    return (): void => window.clearTimeout(timer);
}, [dispatch, search, filters.search]);

<Input value={search} onChange={(event): void => setSearch(event.target.value)} />
```

### Return type `(() => void) | undefined` কেন?

Effect function দুই রকম জিনিস return করতে পারে:

- `() => void` type-এর একটা function, অর্থাৎ **cleanup function**, অথবা
- `undefined`, অর্থাৎ **কিছুই না**।

এই effect-এ দুটোই ঘটে: `search === filters.search` হলে `undefined` return করে (কোনো timer নেই, তাই পরিষ্কার করারও কিছু নেই), আর না হলে `clearTimeout` চালানোর cleanup function return করে। তাই type হলো এই দুইয়ের union।

### সময় ধরে কী ঘটে

ধরো store-এ `filters.search` এখন `""`, আর user "eng" type করছে:

| সময় | Event | Effect কী করে |
|---|---|---|
| 0ms | "e" type → `search = "e"` | `"e" !== ""`, তাই ৪০০ms-এর timer ① বসায় |
| 100ms | "en" type → `search = "en"` | আগে cleanup: timer ① বাতিল। তারপর নতুন timer ② |
| 200ms | "eng" type → `search = "eng"` | cleanup: timer ② বাতিল। নতুন timer ③ |
| 200–600ms | user থামল | কিছু ঘটে না, timer ③ অপেক্ষা করছে |
| 600ms | timer ③ চলে | `dispatch(filtersChanged({ search: "eng" }))` |
| তারপর | store-এ `filters.search = "eng"` | `filters.search` বদলেছে, তাই effect আবার চলে। এবার `search === filters.search` (দুটোই `"eng"`), তাই কোনো timer বসায় না |

শেষ ধাপটাই `if (search === filters.search)` guard-এর কাজ। Guard না থাকলে store update হওয়ার পরে আবার timer বসত, আবার একই search dispatch হতো, যদিও কিছুই বদলায়নি।

আর store-এর `filters` বদলানোয় `ApplicationsPage`-এর effect (৮.৩) চলে, আর server-এ মাত্র **একবার** request যায়।

মূল কথা:

- **Local state (`search`)** সাথে সাথে বদলায়, তাই input-এ type করা smooth থাকে।
- **Store-এর `filters.search`** বদলায় শুধু user থামার পরে।
- **Cleanup** (`clearTimeout`) না থাকলে প্রতিটা অক্ষরের timer চলে যেত, আর ৩টা বা তার বেশি request যেত; debounce কাজই করত না।

### Cleanup-এর আরো কিছু উদাহরণ

| Effect-এ যা শুরু করেছ | Cleanup-এ যা করবে |
|---|---|
| `setInterval` | `clearInterval` |
| `window.addEventListener(...)` | `window.removeEventListener(...)` |
| WebSocket connection খোলা | connection বন্ধ করা |

---

## ৮.৬ StrictMode-এ effect দুইবার চলে কেন?

আমাদের `main.tsx`-এ পুরো app `<StrictMode>`-এর ভেতরে আছে। Development-এ StrictMode প্রতিটা component mount হওয়ার সময় ইচ্ছা করে এই কাজ করে:

1. effect চালায়,
2. cleanup চালায় (যেন component unmount হলো),
3. **আবার effect চালায়** (যেন আবার mount হলো)।

উদ্দেশ্য হলো দেখা যে তোমার cleanup ঠিকমতো লেখা আছে কিনা। Cleanup ঠিক থাকলে দুইবার চললেও ফলাফল একই হয়। তাই development-এ browser-এর Network tab-এ একই request দুইবার দেখা স্বাভাবিক। Production build-এ effect একবারই চলে।

---

## ৮.৭ Hook-এর নিয়ম (Rules of Hooks)

`use` দিয়ে শুরু হওয়া function-গুলোই hook: `useState`, `useEffect`, `useParams`, `useAppSelector`... এদের দুটো কঠোর নিয়ম:

1. **Hook শুধু component function-এর top level-এ call করবে।** অর্থাৎ সরাসরি function body-তে, `if`, loop বা nested function-এর ভেতরে না।
2. **Hook শুধু React component বা অন্য hook-এর ভেতরে call করবে।** সাধারণ JavaScript function-এ না।

**কেন?** React কোন `useState` কোনটা, তা নাম দিয়ে চেনে না, চেনে **call order** দিয়ে: "এই component-এর প্রথম hook, দ্বিতীয় hook..."। প্রতিটা render-এ hook একই order-এ call হতে হবে। `if`-এর ভেতরে hook থাকলে কোনো render-এ সেটা বাদ পড়তে পারে, তখন পরের সব hook-এর order এক ঘর সরে যায়, আর React ভুল state ভুল hook-কে দিয়ে দেয়।

```tsx
if (user)
{
    const [x, setX] = useState(0);
}
```
এটা ভুল: `user` থাকলে hook call হয়, না থাকলে হয় না, তাই call order বদলে যায়।

**Early return** মানে function-এর শেষে পৌঁছানোর আগেই মাঝপথে `return` করা। Early return-এর পরে hook থাকলে সেটাও "কখনো call হয়, কখনো হয় না"। তাই নিয়ম হলো: সব hook আগে, early return পরে।

`LoginPage`-এ ঠিক এটাই করা হয়েছে। এখানে `Navigate`, `useLocation` আর `redirectPathFrom` হলো routing-এর জিনিস (অধ্যায় ৯); এখন শুধু hook-গুলোর জায়গা খেয়াল করো:

`LoginPage.tsx` (সংক্ষেপে):
```tsx
export function LoginPage(): JSX.Element
{
    const dispatch = useAppDispatch();
    const location = useLocation();
    const { user, status, error } = useAppSelector((state) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(...);

    if (user)
    {
        return <Navigate to={redirectPathFrom(location.state)} replace />;
    }
    ...
}
```
ফলাফল: `user` থাকুক বা না থাকুক, প্রতিটা render-এ ছয়টা hook একই order-এ call হয়; তারপরে `if (user)` early return।

---

## ৮.৮ সাধারণ ভুল

| ভুল | ফলাফল | সমাধান |
|---|---|---|
| Dependency array না দেওয়া | প্রতি render-এ effect চলে, effect-এ state বদলালে infinite loop | সঠিক dependency দাও |
| ব্যবহৃত variable dependency-তে না দেওয়া | Effect পুরনো value নিয়ে কাজ করে (stale closure, নিচে interview-তে) | ESLint যা বলে তা মানো |
| Effect-এর ভেতরে সাথে সাথে `setState` | একটা বাড়তি render, আর কোড জটিল | যা হিসাব করে বের করা যায়, তা render-এই হিসাব করো (নিচে উদাহরণ) |
| Cleanup ভুলে যাওয়া | Timer বা listener জমতে থাকে (memory leak) | Cleanup function return করো |
| `useEffect(async () => ...)` | Async function সবসময় Promise return করে, অথচ React চায় cleanup function অথবা কিছুই না | ভেতরে আলাদা async function বানিয়ে call করো, অথবা `void dispatch(...)` |

### Effect-এ `setState` না করে derived value

ভুল পদ্ধতি:
```tsx
const [first, setFirst] = useState('Rahim');
const [last, setLast] = useState('Uddin');
const [fullName, setFullName] = useState('');

useEffect((): void =>
{
    setFullName(`${first} ${last}`);
}, [first, last]);
```
এখানে প্রথম render-এ `fullName` খালি `''` দেখায়, তারপর effect চলে `setFullName` করে, আর দ্বিতীয় render-এ `'Rahim Uddin'` দেখায়। অর্থাৎ একটা বাড়তি render, আর এক মুহূর্তের ভুল লেখা।

সঠিক পদ্ধতি (derived value, অধ্যায় ৭):
```tsx
const [first, setFirst] = useState('Rahim');
const [last, setLast] = useState('Uddin');
const fullName = `${first} ${last}`;
```
এখানে প্রথম render থেকেই `fullName` হলো `'Rahim Uddin'`, কোনো বাড়তি state বা effect নেই।

---

## সারসংক্ষেপ

- Render-এর বাইরের কাজ (server call, timer) হলো **side effect**, যা `useEffect`-এর ভেতরে রাখতে হয়। Render-এ রাখলে infinite loop হতে পারে।
- Dependency array ঠিক করে effect কখন চলবে: `[]` মানে শুধু mount-এর পরে, `[x]` মানে mount-এর পরে আর `x` বদলালে।
- **Cleanup function** চলে effect আবার চলার আগে আর component unmount হওয়ার সময়।
- **Debounce** তৈরি হয় `setTimeout` আর cleanup-এর `clearTimeout` দিয়ে; guard থাকলে অপ্রয়োজনীয় timer বসে না।
- Development-এ StrictMode effect → cleanup → effect চালিয়ে cleanup test করে।
- Hook শুধু component বা অন্য hook-এর top level-এ call করবে, কারণ React hook চেনে call order দিয়ে।

## ইন্টারভিউ প্রশ্ন

**প্রশ্ন: useEffect-এর dependency array খালি দিলে, একদম না দিলে, আর value দিলে কী হয়?**
উত্তর: খালি array দিলে effect শুধু mount-এর পরে একবার চলে; mount মানে component প্রথমবার screen-এ আসা। Array একদম না দিলে প্রতিটা render-এর পরে চলে। Value দিলে mount-এর পরে চলে, আর তারপর যখনই ওই value-গুলোর কোনোটা আগের render থেকে বদলায়, তখন আবার চলে। Object বা array-এর ক্ষেত্রে "বদলানো" মানে reference বদলানো।

**প্রশ্ন: Cleanup function কখন চলে?**
উত্তর: Cleanup function হলো effect-এর return করা function। এটা দুই সময় চলে: effect পরের বার চলার ঠিক আগে, আর component unmount হওয়ার সময়, অর্থাৎ screen থেকে সরে যাওয়ার সময়। Timer বাতিল, event listener সরানো, connection বন্ধ করার মতো কাজ এখানে করা হয়।

**প্রশ্ন: Debounce আর Throttle-এর পার্থক্য কী?**
উত্তর: Debounce event থামার নির্দিষ্ট সময় পরে কাজটা একবার চালায়; থামার আগে নতুন event এলে timer আবার শুরু হয়। যেমন search box-এ type থামার ৪০০ms পরে খোঁজা। Throttle নির্দিষ্ট সময়ে সর্বোচ্চ একবার চালায়, event চলতে থাকলেও। যেমন scroll চলার সময় প্রতি ২০০ms-এ একবার position হিসাব করা।

**প্রশ্ন: Rules of Hooks কী? কেন?**
উত্তর: দুটো নিয়ম। এক, hook শুধু component বা custom hook-এর top level-এ call করা যায়, `if`, loop বা nested function-এর ভেতরে না। দুই, hook শুধু React component বা অন্য hook-এর ভেতরে call করা যায়। কারণ React প্রতিটা hook-কে চেনে call order দিয়ে। কোনো render-এ একটা hook বাদ পড়লে order বদলে যায়, আর React এক hook-এর state অন্য hook-কে দিয়ে দেয়।

**প্রশ্ন: Stale closure কী?**
উত্তর: Closure মানে একটা function তার তৈরির সময়ের আশেপাশের variable মনে রাখে। Stale closure হলো যখন একটা function তৈরির সময়কার পুরনো state বা props মনে রাখে, আর পরে value বদলালেও পুরনোটাই দেখে। useEffect-এ ব্যবহৃত value dependency array-তে না দিলে value বদলালেও effect আবার চলে না, তাই আগের render-এর পুরনো value নিয়েই কাজ করে। সমাধান হলো সঠিক dependency দেওয়া, অথবা state update-এর জন্য functional update ব্যবহার করা।

**প্রশ্ন: StrictMode-এ useEffect দুইবার চলে কেন?**
উত্তর: শুধু development-এ, cleanup ঠিকমতো লেখা হয়েছে কিনা test করার জন্য। React mount-এর পরে ইচ্ছা করে একবার unmount আর আবার mount simulate করে, তাই effect চলে, cleanup চলে, আবার effect চলে। Cleanup ঠিক থাকলে ফলাফলে কোনো পার্থক্য হয় না। Production-এ effect একবারই চলে।

**প্রশ্ন: Custom hook কী?**
উত্তর: `use` দিয়ে নাম শুরু হওয়া একটা সাধারণ function, যেটা ভেতরে অন্য hook ব্যবহার করে। এতে state আর effect-সহ একটা logic একাধিক component-এ reuse করা যায়, আর component-এর কোড ছোট থাকে। যেমন আমাদের project-এ Tiptap (rich text editor-এর একটা library, `shared/components/RichTextEditor.tsx`-এ ব্যবহার হয়েছে; অধ্যায় ১৩-এ দেখবে)-এর `useEditor` hook একটা rich text editor বানিয়ে return করে, আর component শুধু সেটা ব্যবহার করে। আমাদের `useAppSelector` আর `useAppDispatch`-ও hook, তবে এগুলো কীভাবে বানানো হয়েছে, তা অধ্যায় ১০-এ দেখব।
